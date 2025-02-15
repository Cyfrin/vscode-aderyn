import * as vscode from 'vscode';
import {
    createOrInitLspClient,
    // startServing,
    stopServingIfOn,
    createOrInitOnboardProvider,
} from './state';
import { registerEditorCommands } from './commands';
import { registerWebviewPanels } from './webview-providers';
import { isKeyUsed, isWindowsNotWSL, Keys, Logger } from './utils';

export function activate(context: vscode.ExtensionContext) {
    if (isWindowsNotWSL()) {
        vscode.window.showErrorMessage(
            'Aderyn is only supported in WSL when using Windows!',
        );
        throw new Error('Unsupported platform!');
    }

    createOrInitLspClient()
        .then(() => showOnboardWebviewOnce(context))
        .then(() => registerWebviewPanels(context))
        .then(() => registerEditorCommands(context));
}

async function showOnboardWebviewOnce(context: vscode.ExtensionContext) {
    // Skip once-only check in dev [TESTED]
    if (process.env.NODE_ENV === 'development') {
        return createOrInitOnboardProvider(context.extensionUri);
    }
    const seen = await isKeyUsed(new Logger(), Keys.OnboardPanelSeen);
    if (!seen) {
        return createOrInitOnboardProvider(context.extensionUri);
    }
}

export function deactivate(): Thenable<void> | undefined {
    return stopServingIfOn() ?? undefined;
}
