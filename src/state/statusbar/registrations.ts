import * as vscode from 'vscode';
import { aderynStatusItem } from '..';

function registerStatusBarItems(context: vscode.ExtensionContext) {
    if (!aderynStatusItem) {
        throw new Error('Registering uninitialized status bar item');
    }
    context.subscriptions.push(aderynStatusItem);
}

export { registerStatusBarItems };
