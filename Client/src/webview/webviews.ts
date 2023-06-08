/*
    所有 webview 集合
*/

import alt from "alt-client";

export const webViews = {
    authPage: new alt.WebView('http://resource/Client/webview/auth/index.html'),
    testPage: new alt.WebView('http://resource/Client/webview/test/index.html'),
}
export default webViews;