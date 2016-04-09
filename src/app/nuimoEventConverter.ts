import { NuimoEventMessage, NuimoGesture, NuimoGestureEvent } from "./nuimoMqttMessages";
import { Update, ClickUpdate, FlyUpdate, SwipeUpdate, TurnUpdate } from "nuimo-client-ts";

export default function createNuimoEventMessage(update: Update): NuimoEventMessage {
    let message: NuimoEventMessage = null;
    
    if(update instanceof ClickUpdate) {
        message = handleClickUpdate(<ClickUpdate>update);
    }
    else if(update instanceof FlyUpdate) {
        message = handleFlyUpdate(<FlyUpdate>update);
    }
    else if(update instanceof SwipeUpdate) {
        message = handleSwipeUpdate(<SwipeUpdate>update);
    }
    else if(update instanceof TurnUpdate) {
        message = handleTurnUpdate(<TurnUpdate>update);
    }
    
    return message;
};

function handleClickUpdate(update: ClickUpdate): NuimoEventMessage {
    let gesture: NuimoGesture = update.down ? NuimoGesture.ButtonPress : NuimoGesture.ButtonRelease;
    let message = new NuimoEventMessage(gesture);
    return message;
}

function handleFlyUpdate(update: FlyUpdate): NuimoEventMessage {
    let gesture: NuimoGesture;
    switch(update.direction) {
        case "l": gesture = NuimoGesture.FlyLeft; break;
        case "r": gesture = NuimoGesture.FlyRight; break;
        case "b": gesture = NuimoGesture.FlyBackwards; break;
        case "t": gesture = NuimoGesture.FlyTowards; break;
        case "u": gesture = NuimoGesture.FlyUp; break;
        case "d": gesture = NuimoGesture.FlyDown; break;
    }
    let speed = update.speed;
    let message = new NuimoEventMessage(gesture, speed);
    return message;
}

function handleSwipeUpdate(update: SwipeUpdate): NuimoEventMessage {
    let gesture: NuimoGesture;
    switch(update.direction) {
        case "l": gesture = NuimoGesture.SwipeLeft; break;
        case "r": gesture = NuimoGesture.SwipeRight; break;
        case "u": gesture = NuimoGesture.SwipeUp; break;
        case "d": gesture = NuimoGesture.SwipeDown; break;
    }
    let message = new NuimoEventMessage(gesture);
    return message;
}

function handleTurnUpdate(update: TurnUpdate): NuimoEventMessage {
    let gesture: NuimoGesture = (update.offset < 0) ? NuimoGesture.RotateLeft : NuimoGesture.RotateRight;
    let offset = update.offset;
    let message = new NuimoEventMessage(gesture, offset);
    return message;
}