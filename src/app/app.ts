import "source-map-support/register";

import MqttJs = require("mqtt");
import { Update, SwipeUpdate } from "nuimo-client-ts";

import { AppManager } from "./appManager";
import { NuimoApp } from "./nuimoApp";

import { NuimoManager, NuimoDelegate } from "./nuimoManager";
import { NuimoMqttMessage, NuimoMqttRegisterCommand, NuimoMqttUnregisterCommand, NuimoShowIconCommand, NuimoShowNamedIconCommand, NuimoShowProgressBarIconCommand, NuimoEventMessage, NuimoGesture } from "./nuimoMqttMessages";
import { default as LedMatrices, IconDictionary } from "./ledMatrices";
import { default as createNuimoEventMessage } from "./nuimoEventConverter";

class NuimoMqttManager implements NuimoDelegate {

    mqttClient: MqttJs.Client;
    nuimoManager: NuimoManager;
    appManager = new AppManager();

    appTopicRegex = (appId: string): RegExp => {
        var regex = new RegExp('^nuimo\/(.{8}-?.{4}-?.{4}-?.{4}-?.{12})\/' + appId + '$');
        return regex;
    };

    genericAppTopicRegex = /^nuimo\/(.{8}-?.{4}-?.{4}-?.{4}-?.{12})\/(.*)$/;
    mainTopic = "nuimo";
    logTopic = "nuimo/log";
    appTopic = (appId: string): string => {
        if(this.nuimoManager && this.nuimoManager.nuimo && appId) {
            return "nuimo/" + this.nuimoManager.nuimo.uuid + '/' + appId;
        }
        return null;
    };
    currentAppTopic = (): string => {
        if (this.appManager) {
            let currentApp = this.appManager.currentApp();
            if(currentApp) {
                return this.appTopic(currentApp.id);
            }
        }
        return null;
    };

    receiveUpdate = (update: Update) => {
        if (update instanceof SwipeUpdate) {
            let swipeUpdate = <SwipeUpdate>update;
            if (swipeUpdate.direction == "d") {
                let newApp = this.appManager.nextApp();
                this.switchToApp(newApp);
                return;
            }
        }

        let currentAppTopic = this.currentAppTopic();
        if (currentAppTopic) {

            let nuimoEventMessage = createNuimoEventMessage(update);

            this.mqttClient.publish(currentAppTopic, JSON.stringify(nuimoEventMessage));
        }
    }

    start = async () => {
        await this.setupMqtt();
        await this.setupNuimo();
    }

    setupMqtt = async () => {
        return new Promise<void>((resolve, reject) => {
            this.mqttClient = MqttJs.connect("ws://broker.hivemq.com:8000");

            this.mqttClient.on("connect", () => {
                this.mqttClient.subscribe(this.mainTopic);
                this.logMqtt("NuimoMqttManager online");
                resolve();
            });


            this.mqttClient.on("message", (topic: string, message: Buffer) => {

                try {
                    // message is Buffer
                    let jsonObject = JSON.parse(message.toString());
                    let mqttMessage: NuimoMqttMessage = <NuimoMqttMessage>jsonObject;

                    this.handleMqttMessage(topic, mqttMessage);
                }
                catch (ex) {
                    this.logMqtt("not supported: " + ex);
                }
            });
        });
    }

    setupNuimo = async () => {
        this.logMqtt("Connecting to Nuimo");

        this.nuimoManager = new NuimoManager();
        await this.nuimoManager.connect();
        this.logMqtt("Nuimo connected");
        this.nuimoManager.setDelegate(this);
        this.logMqtt("NuimoMqttManager will now receive Nuimo events");

        return;
    }

    private handleMqttMessage(topic: string, mqttMessage: NuimoMqttMessage) {
        let currentAppId = this.appManager.currentApp() && this.appManager.currentApp().id;

        if (topic === this.mainTopic) {
            switch (mqttMessage.command) {
                case "register":
                    this.registerApp(mqttMessage);
                    break;
                case "unregister":
                    this.unregisterApp(mqttMessage);
                    break;
            }
        }
        else if (this.appTopicRegex(currentAppId).test(topic)) {
            switch (mqttMessage.command) {
                case "showIcon":
                    this.showIcon(mqttMessage);
                    break;
                case "showNamedIcon":
                    this.showNamedIcon(mqttMessage);
                    break;
		case "showProgressBarIcon":
		    this.showProgressBarIcon(mqttMessage);
                    break;
                case "nuimoEvent":
                    // this event is meant to be handled by clients
                    // so don't handle it here
                    break;
                default:
                    this.notImplementedYet(mqttMessage);
                    break;

            }
        }
        else if (this.genericAppTopicRegex.test(topic)) {
            switch (mqttMessage.command) {
                case "listenPlease":
                    this.notImplementedYet(mqttMessage);
                    break;
            }
        }
        else {
            this.notImplementedYet(mqttMessage);
        }
    }

    private switchToApp(app: NuimoApp) {
        if(app) {
            this.nuimoManager.showIcon(app.icon, 1, 1);
        }
    }

    registerApp(messageFromMqtt: NuimoMqttMessage) {
        let registerMessage = <NuimoMqttRegisterCommand>messageFromMqtt;
        let app = new NuimoApp(registerMessage.id, registerMessage.name, registerMessage.icon)
        this.appManager.addApp(app);
        this.mqttClient.subscribe(this.appTopic(app.id));
        this.switchToApp(app);
    }

    unregisterApp(messageFromMqtt: NuimoMqttMessage) {
        let unregisterMessage = <NuimoMqttUnregisterCommand>messageFromMqtt;
        this.appManager.removeApp(unregisterMessage.id);
        this.mqttClient.subscribe(this.appTopic(unregisterMessage.id));
        let newApp = this.appManager.currentApp();
        this.switchToApp(newApp);
    }

    showIcon(messageFromMqtt: NuimoMqttMessage) {
        let iconMessage = <NuimoShowIconCommand>messageFromMqtt;
        this.nuimoManager.showIcon(iconMessage.icon, iconMessage.brightness, iconMessage.duration)
    }

    showNamedIcon(messageFromMqtt: NuimoMqttMessage) {
        let iconMessage = <NuimoShowNamedIconCommand>messageFromMqtt;
        let iconName = iconMessage.iconName;
        let icon = LedMatrices[iconName];
        if(icon) {
            this.nuimoManager.showIcon(icon, iconMessage.brightness, iconMessage.duration)
        }
        else {
            this.logMqtt("icon " + iconName + " not defined!");
        }
    }

    showProgressBarIcon(messageFromMqtt: NuimoMqttMessage) {
	let iconMessage = <NuimoShowProgressBarIconCommand>messageFromMqtt;
	let dots = Math.round(9*iconMessage.value);
	let progress = '1'.repeat(dots) + '0'.repeat(9 - dots);
	let icon = '0'.repeat(27) + progress + progress + progress + '0'.repeat(27);
	this.nuimoManager.showIcon(icon, iconMessage.brightness, iconMessage.duration)
	this.logMqtt("icon " + icon);
    }

    notImplementedYet(messageFromMqtt: NuimoMqttMessage) {
        this.logMqtt("not implemented yet: " + messageFromMqtt.toString());
    }

    logMqtt(message: any) {
        this.mqttClient.publish(this.logTopic, message.toString());
    }
}

var manager = new NuimoMqttManager();
manager.start();
