import * as vscode from 'vscode';
import {
    createOrInitClient,
    startServing,
    stopServingIfOn,
    createOrInitOnboardProvider,
} from './state';
import { registerEditorCommands } from './commands/registrations';
import { registerWebviewProviders } from './webview-providers/registrations';

export function activate(context: vscode.ExtensionContext) {
    createOrInitClient()
        .then(() => createOrInitOnboardProvider(context.extensionUri))
        .then(() => registerEditorCommands(context))
        .then(() => registerWebviewProviders(context))
        .then(startServing);
}

export function deactivate(): Thenable<void> | undefined {
    return stopServingIfOn() ?? undefined;
}
