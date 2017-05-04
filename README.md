# Introduction
This application is meant as a proof of concept to let multiple Nuimos work with multiple apps running on multiple devices.
It removes the limitation of not being able to control the music on your phone while your computer is connected to it.

# Demonstration
A demo video can be seen at https://vimeo.com/162261040.

# Multiple Nuimos
This is not worked out in the application yet since I had no devices to test with, but the protocol is prepared for it.

# Use cases
*Note: these are ideas, but not all use cases are implemented*

- Peter has Photoshop on his computer and a music player on his phone. He would like to control both applications with Nuimo without disconnect Nuimo from one of the devices.
- Sandra has two Nuimos: one in her living room and one in her bedroom. She wants to control Photoshop, the light and music with her Nuimo in the living room, but the one in her bedroom should be simple: she wants to control only the light with that one.
- Kwint has Photoshop and After Effects on his computer. When he uses Alt-Tab to switch between applications, he wants to have the controls on his Nuimo for the application that he switched to.
- Tessa has two applications on her computer. When she selects another application on her Nuimo, she wants the selected application to get focus on her computer.
- Jeff has a programming language that does not work well with Bluetooth Low Energy. He still wants his application to work with Nuimo.

# Technical solution
- Aggregate list of available app controls (not worked out)
    - App controls built into the manager app 
    - Additional app controls dynamically added from other apps
- List of Nuimos (not worked out)
    - List is filled by discovering Nuimos
    - Disconnected Nuimos stay in the list unless the user deletes them
    - Nuimos can have different states
    - App controls can be assigned to Nuimos that are not connected
- Apps communicate over MQTT
    - Apps register and unregister themselves via MQTT on a general MQTT management channel (nuimo)
    - Apps receive their commands on their own MQTT channel (nuimo/\<nuimo-uuid\>/\<appId\>)
    - Apps can publish icons on their own MQTT channel (nuimo/\<nuimo-uuid\>/\<appId\>)
    - Apps can request their controls to be active on a certain Nuimo via MQTT

# User interface
A proposal for a user interface is shown below:

![User interface proposal](https://raw.githubusercontent.com/wind-rider/nuimo-mqtt-manager/master/doc/example.png)

* Aggregate list of all available app controls
    * Built-in app controls that are built into the manager app
    * Additional app controls dynamically added from other apps
    * App controls can be unregistered by clicking the minus button
* List of Nuimos
    * Nuimos enter the list automatically by discovery
    * Users can overwrite the Nuimo's default ID with a userfriendly name
    * Nuimos are not automatically removed when they disconnect or are out of sight
    * Nuimos can be forgotten by the user by clicking the minus button
* Assigning of app controls to Nuimos
    * Available app controls can be added to a Nuimo by selecting a Nuimo and dragging the app control to the list showing the app controls for that Nuimo

# System diagram
A system overview is shown below.
* The Nuimos connect over BLE to a device running the manager application
* The client applications connect via a MQTT broker (message bus) to the manager application. This MQTT broker can be hosted in your home or in the cloud.

![Nuimo-MQTT system overview](https://raw.githubusercontent.com/wind-rider/nuimo-mqtt-manager/master/doc/nuimo_mqtt.png)


# Protocol
There are three types of channels (MQTT topics):

* **nuimo** - this is a general channel where apps register and unregister themselves. Also the central app can show the current state here
* **nuimo/log** - this is a logging channel for debugging purposes
* **nuimo/\<nuimo-uuid\>/\<appId\>** - these are the channels where apps receive the messages from their nuimo if they are active, and where they post their icons

## MQTT topic: `nuimo`
### register
Command sent by an app to let the nuimo-mqtt daemon
* add the app to the available apps list
* switch to the registered app and show its icon.

```
{
    "command": "register",
    "id": "idOftheApp",
    "name": "Display name of the app",
    "icon": "string of 81 characters representing an icon"
}
```

### unregister
Command sent by an app to let the nuimo-mqtt daemon
* remove the app from the available apps list
* switch to the next app on the Nuimo(s) where the app was available.

Format:
```
{
    "command": "unregister",
    "id": "idOfTheAppThatWantsToBeUnregistered"
} 
```

## MQTT topic: `nuimo/<nuimo-uuid>/<appId>`

Nuimo events are only sent to the app that is currently 'active' on a Nuimo so that there will not be unintended input to other apps. Apps can still request to become active by publishing a `listenPlease` command on their channel.  

### listenPlease
The listenPlease message is to tell an app that the user selected it so that the app is expected to start listening. The app's icon will be shown shortly.

(Not implemented yet)

### showIcon
Command to shortly show an icon, for example to respond to user input or to show some notification.

* `icon` should consist of 81 elements in total (string of 81 characters, or a string[] or number[] of 81 elements in total). The allowed values are 0 or 1.
* `brightness` is a value between 0 and 1; optional
* `duration` is a number in seconds; optional

Format:
```
{
    "command": "showIcon",
    "icon": "string, array of strings or array of numbers representing an icon",
    "brightness": 0.3,
    "duration": 0.3
} 
```

### showNamedIcon
Command to shortly show an icon, for example to respond to user input or to show some notification.

* `iconName` should be a name of one of the predefined icons from ledMatrices.ts
* `brightness` is a value between 0 and 1; optional
* `duration` is a number in seconds; optional

Format:
```
{
    "command": "showNamedIcon",
    "iconName": "iconName",
    "brightness": 0.3,
    "duration": 0.3
} 
```

### showProgressBarIcon
Command to shortly show a progress bar icon, for example to respond to user input or to show some notification.

* `value` is a number between 0 and 1 
* `style` should be either "VerticalBar" or "VolumeBar"
* `brightness` is a value between 0 and 1; optional
* `duration` is a number in seconds; optional

Format:
```
{
    "command": "showProgressBarIcon",
    "value":0.77,
    "style": "VerticalBar",
    "brightness": 0.3,
    "duration": 0.3
} 
```

(Not implemented yet)


### nuimoEvent
Gesture event from Nuimo. The apps should listen to this event.

Nuimo events are only sent to the app that is currently 'active' on a Nuimo so that there will not be unintended input to other apps.

* `gesture` is an enum defined in `nuimoMqttMessages.ts`.
* `value` is a number used for the FlyUpdate (for its speed) and for TurnUpdate (for its offset)

Format:
```
{
    "command": "nuimoEvent",
    "gesture": "RotateRight", //one of the gesture types like ButtonPress etc
    "value": 24 //depends on gesture type
} 
```

# Installation

In order to run the application on a vanilla Raspbian you've to run the following commands:

```
# Install NodeJS and system libraries
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install nodejs
sudo apt-get install git, libusb-1.0-0-dev, libudev-dev

# Fetch app repository
mkdir /home/pi/node
cd /home/pi/node
git clone https://github.com/wind-rider/nuimo-mqtt-manager.git

# Install TypeScript and NodeJS dependencies
sudo npm install -g typescript
sudo npm install -g typings
typings install --ambient noble node
typings install dt~node --global --save
npm install

# Compile TypeScript
tsc --lib es2015 src/app/app.ts

# Run the compiled application
sudo node src/app/app.js

#Demonize the application with pm2
sudo npm install pm2 -g
sudo pm2 start src/app/app.js
sudo pm2 save
```
