import * as vscode from 'vscode';

import { OnboardPanel } from '../../webview-providers/onboard-panel';
import { createNewOrShowOnboardProvider } from './create';

async function showPanel(uri: vscode.Uri) {
    createNewOrShowOnboardProvider(uri);
}

async function hidePanel() {
    OnboardPanel.destroy();
}

export { showPanel, hidePanel };
