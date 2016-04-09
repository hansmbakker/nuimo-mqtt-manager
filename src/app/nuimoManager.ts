import "source-map-support/register";

import { NuimoClient, withNuimo, Update } from "nuimo-client-ts";

export class NuimoManager {
    nuimo: NuimoClient = null;
    
    nuimoDelegate: NuimoDelegate = null;
    
    connect = async (): Promise<void> => {
        console.log("awaiting nuimo");
        this.nuimo = await withNuimo();
        console.log("connected. starting to listen");
        this.nuimo.listen(this.processEvent);
        console.log("listening is set up");
        return;
    }
    
    showIcon = async (icon: NuimoIcon, brightness: number, duration: number): Promise<void> => {
        if(this.nuimo) {
            let ledMatrixBuffer = this.nuimo.createLEDMatrixBuffer(icon);
            await this.nuimo.writeLEDS(ledMatrixBuffer, brightness, duration);
        }
    }
    
    processEvent = (update: Update): void => {
        if(this.nuimoDelegate !== null) {
            this.nuimoDelegate.receiveUpdate(update);
        }
    }
    
    setDelegate = (delegate: NuimoDelegate): void => {
        this.nuimoDelegate = delegate;
    }
}

export type NuimoIcon = string | Array<string> | Array<number>

export interface NuimoDelegate {
    receiveUpdate(nuimoEvent: Update): void;
}