import alt from "alt-client";
import {withLogging} from "../shared/decorator";

export default class webView {

    private view: alt.WebView | undefined;
    private readonly url: string;
    private readonly name: string;
    private readonly cursor: boolean;
    private readonly control: boolean;
    private active_state: boolean;
    private focus_state: boolean;
    constructor(name: string, url: string, cursor: boolean, control: boolean) {
        this.url = url;
        this.name = name;
        this.cursor = cursor;
        this.control = control;
        this.active_state = false;
        this.focus_state = false;
    }
    get page () {
        return this.view
    }

    get active (){
        return this.active_state;
    }

    @withLogging
    async on(event: string, func: any) {
        if (!this.view) return;
        this.view.on(event, func);
    }

    @withLogging
    async emitSync(event: string, ...args: any){
        if (!this.view) return;
        await this.view.emit(event, args);
    }

    @withLogging
    emit(event: string, ...args: any){
        if (!this.view) return;
        this.view.emit(event, args);
    }

    @withLogging
    async show(): Promise<boolean> {
        this.view = new alt.WebView(this.url);
        await this.focus();
        await this.gameCursor(this.cursor);
        await this.gameControl(this.control);

        console.log(`页面: ${this.name} - 光标: ${this.cursor} - 控制: ${this.control}`)
        this.active_state = true;
        return true;
    }

    @withLogging
    async focus(): Promise<boolean> {
        if (!this.view) return false;
        this.focus_state = true;
        this.view.focus();
        return true;
    }
    @withLogging
    async unfocus(): Promise<boolean> {
        if (!this.view) return false;
        this.focus_state = false;
        this.view.unfocus();
        return true;
    }
    @withLogging
    async destroy(isPageDestroy: boolean): Promise<boolean> {
        if (!this.view) return false;
        if (!isPageDestroy) return false;
        this.view.unfocus();
        this.view.destroy();
        this.active_state = false;
        return true;
    }

    @withLogging
    async gameCursor(state: boolean): Promise<boolean> {
        if (!this.view) return false;
        alt.showCursor(state);
        return true;
    }

    @withLogging
    async gameControl(state: boolean): Promise<boolean> {
        if (!this.view) return false;
        alt.toggleGameControls(state);
        return true;
    }
}


