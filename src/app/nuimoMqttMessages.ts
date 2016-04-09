export class NuimoMqttMessage implements Serializable<NuimoMqttMessage> {
    constructor(command: string) {
        this.command = command;
    }

    command: string;

    deserialize(input: any): NuimoMqttMessage {
        this.command = input.command;
        return this;
    };
}

export class NuimoMqttRegisterCommand extends NuimoMqttMessage {
    constructor()
    constructor(id: string, name: string, icon: NuimoIcon)
    constructor(id?: any, name?: any, icon?: any) {
        super("register");

        if (id !== undefined) {
            this.id = id;
            this.name = name;
            this.icon = icon;
        }
    }

    id: string;
    name: string;
    icon: NuimoIcon;

    deserialize(input: any): NuimoMqttRegisterCommand {
        this.id = input.id;
        this.name = input.name;
        this.icon = input.icon;
        return this;
    }
}

export class NuimoMqttUnregisterCommand extends NuimoMqttMessage {
    constructor()
    constructor(id: string)
    constructor(id?: any) {
        super("unregister");

        if (id !== undefined) {
            this.id = id;
        }
    }

    id: string;

    deserialize(input: any): NuimoMqttUnregisterCommand {
        this.id = input.id;
        return this;
    }
}

export class NuimoListenPleaseCommand extends NuimoMqttMessage {
    constructor()
    constructor(id: string)
    constructor(id?: any) {
        super("listenPlease");

        if (id !== undefined) {
            this.id = id;
        }
    }

    id: string;

    deserialize(input: any): NuimoListenPleaseCommand {
        this.id = input.id;
        return this;
    }
}

export class NuimoShowIconCommand extends NuimoMqttMessage {
    constructor()
    constructor(icon: NuimoIcon, brightness: number, duration: number)
    constructor(icon?: any, brightness?: any, duration?: any) {
        super("showIcon");

        if (icon !== undefined) {
            this.icon = icon;
            this.brightness = brightness;
            this.duration = duration;
        }
    }
    icon: NuimoIcon;
    brightness: number;
    duration: number;

    deserialize(input: any): NuimoShowIconCommand {
        this.icon = input.icon;
        this.brightness = input.brightness;
        this.duration = input.duration;
        return this;
    }
}

export class NuimoShowNamedIconCommand extends NuimoMqttMessage {
    constructor()
    constructor(iconName: string, brightness: number, duration: number)
    constructor(iconName?: any, brightness?: any, duration?: any) {
        super("showNamedIcon");

        if (iconName !== undefined) {
            this.iconName = iconName;
            this.brightness = brightness;
            this.duration = duration;
        }
    }

    iconName: string;
    brightness: number;
    duration: number;

    deserialize(input: any): NuimoShowNamedIconCommand {
        this.iconName = input.iconName;
        this.brightness = input.brightness;
        this.duration = input.duration;
        return this;
    }
}

export class NuimoShowProgressBarIconCommand extends NuimoMqttMessage {
    constructor()
    constructor(value: number, style: NuimoProgressBarStyle, brightness: number, duration: number)
    constructor(value?: any, style?: any, brightness?: any, duration?: any) {
        super("showProgressBarIcon");
        if (value !== undefined) {
            this.value = value;
            this.style = style;
            this.brightness = brightness;
            this.duration = duration;
        }
    }

    value: number;
    style: NuimoProgressBarStyle;
    brightness: number;
    duration: number;

    deserialize(input: any): NuimoShowProgressBarIconCommand {
        this.value = input.value;
        this.style = <NuimoProgressBarStyle>input.style;
        this.brightness = input.brightness;
        this.duration = input.duration;
        return this;
    }
}

export class NuimoEventMessage extends NuimoMqttMessage implements NuimoGestureEvent {
    constructor()
    constructor(gesture: NuimoGesture, value?: number)
    constructor(gesture?: any, value?: any) {
        super("nuimoEvent");

        if (gesture !== undefined) {
            this.gesture = gesture;
            this.value = value;
        }
    }

    gesture: NuimoGesture;
    value: number;

    deserialize(input: any): NuimoEventMessage {
        this.gesture = <NuimoGesture>input.gesture;
        this.value = input.value;
        return this;
    }
}

export interface Serializable<T> {
    deserialize(input: any): T;
}

export type NuimoIcon = string | Array<string> | Array<number>

export interface NuimoGestureEvent {
    gesture: NuimoGesture;
    value: number;
}

export enum NuimoProgressBarStyle {
    VerticalBar = <any>"VerticalBar",
    VolumeBar = <any>"VolumeBar"
}

export enum NuimoGesture {
    Undefined = <any>"Undefined", // TODO: Do we really need this enum value? We don't need to handle an "undefined" gesture
    ButtonPress = <any>"ButtonPress",
    ButtonDoublePress = <any>"ButtonDoublePress",
    ButtonRelease = <any>"ButtonRelease",
    RotateLeft = <any>"RotateLeft",
    RotateRight = <any>"RotateRight",
    TouchLeftDown = <any>"TouchLeftDown",
    TouchLeftRelease = <any>"TouchLeftRelease",
    TouchRightDown = <any>"TouchRightDown",
    TouchRightRelease = <any>"TouchRightRelease",
    TouchTopDown = <any>"TouchTopDown",
    TouchTopRelease = <any>"TouchTopRelease",
    TouchBottomDown = <any>"TouchBottomDown",
    TouchBottomRelease = <any>"TouchBottomRelease",
    SwipeLeft = <any>"SwipeLeft",
    SwipeRight = <any>"SwipeRight",
    SwipeUp = <any>"SwipeUp",
    SwipeDown = <any>"SwipeDown",
    FlyLeft = <any>"FlyLeft",
    FlyRight = <any>"FlyRight",
    FlyBackwards = <any>"FlyBackwards",
    FlyTowards = <any>"FlyTowards",
    FlyUp = <any>"FlyUp",
    FlyDown = <any>"FlyDown"
}