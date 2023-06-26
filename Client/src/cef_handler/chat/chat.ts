import * as alt from "alt-client";
import webView from "../model";

const chatPage = new webView('聊天框', 'http://resource/Client/webview/chat/index.html', false, false);

let chatBuffer: { name: string; text: string; }[] = [];
let chatLoaded: boolean = false;
let chatOpened: boolean = false;

alt.onServer('chat:client:init', init);

async function init(){
    const result = await chatPage.show();
    if (!result) return;
    if (!chatPage.page) return;
    await chatPage.on("chat:webview:loaded", handleLoaded);
    await chatPage.on("chat:webview:loaded", handleLoaded);
    await chatPage.on("chat:webview:submitMessage", handleSubmit);

    pushLine("<b>已连接alt:V项目</b>");
}

async function addMessage(name: string, text: string) {
    if (!chatPage.page) return;
    if (name) {
        await chatPage.emitSync("chat:webview:addMessage", name, text);
    } else {
        await chatPage.emitSync("chat:webview:addString", text);
    }
}

async function handleLoaded() {
    // 处理buffer的消息
    for (const msg of chatBuffer) {
        await addMessage(msg.name, msg.text);
    }

    chatLoaded = true;
}

async function handleSubmit(text: string) {
    if (!chatPage.page) return;
    alt.emitServer('chat:server:addMessage', text);

    chatOpened = false;
    const result1 = await chatPage.unfocus();
    const result2 = await chatPage.gameControl(true);
    if (!result1 || !result2) {
        // error
    }
}

alt.onServer("chat:client:addMessage", pushMessage);
// 主要推送消息函数
export function pushMessage(name: any, text: string) {
    if (!chatLoaded) {
        // 稍后处理
        let buffer = { name, text };
        chatBuffer.push(buffer);
    } else {
        addMessage(name, text);
    }
}

// 主要推送消息之单纯一行
export function pushLine(text: string) {
    pushMessage(null, text);
}

alt.on("keyup", async (key: alt.KeyCode) => {
    if (!chatPage.page) return;
    if (chatLoaded) {
        if (!chatOpened && key === 0x54 && alt.gameControlsEnabled()) {
            chatOpened = true;
            await chatPage.emitSync("chat:webview:open", false); // boolean 参数是 是否带斜杠开始
            await chatPage.gameControl(false);
            await chatPage.focus();
        } else if (!chatOpened && key === 0xbf && alt.gameControlsEnabled()) {
            chatOpened = true;
            await chatPage.emitSync("chat:webview:open", true);
            await chatPage.gameControl(false);
            await chatPage.focus();
        } else if (chatOpened && key == 0x1b) {
            chatOpened = false;
            await chatPage.emitSync("chat:webview:close");
            await chatPage.gameControl(true);
            await chatPage.unfocus();
        }
    }
});
