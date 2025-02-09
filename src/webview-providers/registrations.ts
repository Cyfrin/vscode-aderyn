import * as vscode from 'vscode';
import { onboardProvider } from '../state/index';
import { OnboardViewProvider } from './onboard';

function registerWebviewProviders(context: vscode.ExtensionContext) {
    if (!onboardProvider) {
        throw new Error('Registering uninitialized webview');
    }
    const onboardViewProvider = vscode.window.registerWebviewViewProvider(
        OnboardViewProvider.viewType,
        onboardProvider,
    );
    context.subscriptions.push(onboardViewProvider);
}

export { registerWebviewProviders };
