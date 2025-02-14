import * as vscode from 'vscode';

enum MessageType {
    Error = 'Error',
}

type PostMessage = {
    type: MessageType;
    msg: string;
};

async function postMessageTo(w: vscode.Webview, type: MessageType, msg: any) {
    let payload: PostMessage = {
        type,
        msg: `${msg}`,
    };
    w.postMessage(payload);
}

export { MessageType, postMessageTo, type PostMessage };
