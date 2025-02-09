import * as vscode from 'vscode';
import { OnboardPanel } from './onboard-panel';
import { WebviewProviders } from './variants';

function registerWebviewPanels(context: vscode.ExtensionContext) {
    if (vscode.window.registerWebviewPanelSerializer) {
        vscode.window.registerWebviewPanelSerializer(WebviewProviders.Onboard, {
            async deserializeWebviewPanel(
                webviewPanel: vscode.WebviewPanel,
                _state: unknown,
            ) {
                webviewPanel.webview.options = {
                    enableScripts: true,
                    localResourceRoots: [
                        vscode.Uri.joinPath(context.extensionUri, 'media'),
                    ],
                };
                OnboardPanel.revive(webviewPanel, context.extensionUri, 'Welcome!');
            },
        });
    }
}

export { registerWebviewPanels };
