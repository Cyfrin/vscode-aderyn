import * as vscode from 'vscode';
import {
    createOrInitClient,
    // startServing,
    stopServingIfOn,
    createOrInitOnboardProvider,
} from './state';
import { registerEditorCommands } from './commands';
import { registerWebviewPanels } from './webview-providers';

export function activate(context: vscode.ExtensionContext) {
    createOrInitClient()
        .then(() => createOrInitOnboardProvider(context.extensionUri))
        .then(() => registerWebviewPanels(context))
        .then(() => registerEditorCommands(context));
}

export function deactivate(): Thenable<void> | undefined {
    return stopServingIfOn() ?? undefined;
}
