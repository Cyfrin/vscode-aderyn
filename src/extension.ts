import * as vscode from 'vscode';
import {
    hasRecognizedProjectStructureAtWorkspaceRoot,
    isKeyUsed,
    isWindowsNotWSL,
    Keys,
    Logger,
} from './utils';

import {
    createOrInitLspClient,
    startServing,
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

    createOrInitLspClient()
        .then(createAderynStatusItem)
        .then(() => showOnboardWebviewOnce(context))
        .then(() => registerWebviewPanels(context))
        .then(() => registerEditorCommands(context))
        .then(() => registerStatusBarItems(context))
        .then(() => registerDataProviders(context))
        .then(autoStartLspClientIfRequested);
}

async function autoStartLspClientIfRequested() {
    const config = vscode.workspace.getConfiguration('aderyn.config');
    const userPrefersAutoStart = config.get<boolean>('autoStart');
    if (userPrefersAutoStart && hasRecognizedProjectStructureAtWorkspaceRoot()) {
        try {
            startServing();
        } catch (_ex) {
            // no-op
            // In case of failure at auto start, do not throw an exception.
            // This is because, maybe the user is still onboarding, or aderyn.toml is not set,
            // or foundry project is not yet initialized, etc.
            // Of course, if on the other hand, user explicitly requests to start Aderyn and
            // then it fails, we must throw an exception.
        }
    }
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
