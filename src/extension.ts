import * as vscode from 'vscode';
import {
    isKeyUsed,
    isWindowsNotWSL,
    startPeriodicChecks,
    startInstallationOneTimeCheck,
    Keys,
    Logger,
    autoStartLspClientIfRequested,
    suggestAderynTomlIfProjectIsNested,
} from './utils';

import {
    stopServingIfOn,
    createOrInitOnboardProvider,
    createAderynStatusItem,
} from './state';

import { registerEditorCommands } from './commands';
import { registerWebviewPanels } from './webview-providers';
import { registerStatusBarItems } from './state/statusbar/index';
import { registerDataProviders } from './panel-providers';

export function activate(context: vscode.ExtensionContext) {
    if (isWindowsNotWSL()) {
        vscode.window.showErrorMessage(
            'Aderyn is only supported in WSL when using Windows!',
        );
        throw new Error('Unsupported platform!');
    }

    createAderynStatusItem()
        .then(() => showOnboardWebviewOnce(context))
        .then(() => registerWebviewPanels(context))
        .then(() => registerEditorCommands(context))
        .then(() => registerStatusBarItems(context))
        .then(() => registerDataProviders(context))
        .then(() => autoStartLspClientIfRequested(true))
        .then(suggestAderynTomlIfProjectIsNested)
        .then(startPeriodicChecks)
        .then(startInstallationOneTimeCheck);
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
