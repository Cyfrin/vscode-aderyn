import * as vscode from 'vscode';
import { OnboardPanel, WebviewProviders } from '../../webview-providers';

function createNewOrShowOnboardProvider(uri: vscode.Uri) {
    OnboardPanel.createOrShow(uri, WebviewProviders.Onboard, 'Welcome!');
}

export { createNewOrShowOnboardProvider };
