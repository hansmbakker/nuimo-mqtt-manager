export class NuimoApp {
    constructor(id: string, name: string, icon: string | Array<string> | Array<number>) {
        this.id = id;
        this.name = name;
        this.icon = icon;
    }
    
    id: string;
    name: string;
    icon: string | Array<string> | Array<number>
}