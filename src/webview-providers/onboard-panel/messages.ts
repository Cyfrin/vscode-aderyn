import * as vscode from 'vscode';

enum MessageType {
    // Aderyn
    InstallationError = 'INSTALLATION_ERROR',
    InstallationSuccess = 'INSTALLATION_SUCCESS',

    // Command Book
    CommandGuide = 'COMMAND_GUIDE',
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
