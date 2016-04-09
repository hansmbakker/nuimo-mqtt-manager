import { NuimoApp } from "./nuimoApp";

export class AppManager {
    constructor() {
        this.currentAppIndex = -1;
    }

    private apps: Array<NuimoApp> = [];

    addApp(app: NuimoApp): void {
        if (!this.appIsRegistered(app.id)) {
            let newLength = this.apps.push(app);
            this.currentAppIndex = newLength - 1;
        }
    }

    removeApp(id: string): void {
        if (this.appIsRegistered(id)) {
            let index = this.apps.findIndex(app => app.id == id);
            this.apps.splice(index, 1);
        }
    }

    private appIsRegistered(id: string): boolean {
        let index = this.apps.findIndex(app => app.id == id);
        return index !== -1;
    }

    currentApp(): NuimoApp {
        if (this.currentAppIndex >= 0 && this.currentAppIndex < this.apps.length) {
            return this.apps[this.currentAppIndex];
        }
        return null;
    }

    nextApp(): NuimoApp {
        if (this.apps.length <= 0) {
            this.currentAppIndex = -1;
            return null;
        }

        this.currentAppIndex += 1;

        if (this.currentAppIndex >= this.apps.length) {
            this.currentAppIndex = -1;
            return null;
        }

        return this.currentApp();
    }

    private currentAppIndex: number;
}