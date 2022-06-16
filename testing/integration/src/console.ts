export class Console {
    element: HTMLTextAreaElement;
    //element: HTMLDivElement;
    
    constructor() {
        this.element = document.createElement('textarea');
       this.element.style.boxShadow = "0 4px 8px 0 rgba(0,0,0,0.2)";
       this.element.style.transition = "transition: 0.3s";
        this.element.style.width = "600px";
        this.element.style.height = "200px";

    }

    log(txt: string, type?: string) {
        if (type) this.element.value += type + " ";
        this.element.value += txt + "\n";
    }
    error = (txt: string) => {
        this.log(txt, "ERROR!");
    }
}