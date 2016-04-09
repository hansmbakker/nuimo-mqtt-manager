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
        if (this.nuimo) {
            let fixedIcon = fixIcon(icon);
            let ledMatrixBuffer = this.nuimo.createLEDMatrixBuffer(fixedIcon);
            await this.nuimo.writeLEDS(ledMatrixBuffer, brightness, duration);
        }
        return;
    }

    processEvent = (update: Update): void => {
        if (this.nuimoDelegate !== null) {
            this.nuimoDelegate.receiveUpdate(update);
        }
    }

    setDelegate = (delegate: NuimoDelegate): void => {
        this.nuimoDelegate = delegate;
    }
}

function fixIcon(icon: NuimoIcon): string[] {
    let unfixedIconString = "";
    if (icon instanceof Array) {
        unfixedIconString = icon.join("");
    } else {
        unfixedIconString = icon;
    }

    let tempArr = unfixedIconString.split("");
    if (tempArr.length !== 81) {
        throw "data must be 81 bits";
    }

    let fixedArray = tempArr.map(x => {
        switch (x) {
            case " ": return "0";
            case "0": return "0";
            case "1": return "1";
            default: return "1";
        }
    })
    return fixedArray;
}

export type NuimoIcon = string | Array<string> | Array<number>

export interface NuimoDelegate {
    receiveUpdate(nuimoEvent: Update): void;
}