import * as vscode from 'vscode';
import {
    autoStartLspClientIfRequested,
    clearCorruptedInstallation,
    ensureAderynIsInstalled,
    Logger,
} from '../utils';
import { MessageType, postMessageTo } from './onboard-panel/messages';
import { readPackageJson } from '../utils/metadata';
import { ensureHealthyInternet } from '../utils/install/index';
import { setWelcomePageOpenState } from '../state/index';

class OnboardPanel {
    public static currentPanel: OnboardPanel | undefined;

    private _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;

    public static createOrShow(
        extensionUri: vscode.Uri,
        viewType: string,
        title: string,
    ) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // If we already have a panel, show it.
        if (OnboardPanel.currentPanel) {
            OnboardPanel.currentPanel._panel.reveal(column);
            return;
        }

        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(
            viewType,
            title,
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')],
                retainContextWhenHidden: true,
            },
        );

        OnboardPanel.currentPanel = new OnboardPanel(panel, extensionUri, title);
        setWelcomePageOpenState(true);
    }

    public static revive(
        panel: vscode.WebviewPanel,
        extensionUri: vscode.Uri,
        title: string,
    ) {
        OnboardPanel.currentPanel = new OnboardPanel(panel, extensionUri, title);
    }

    public static destroy() {
        if (OnboardPanel.currentPanel?._panel) {
            OnboardPanel.currentPanel._panel.dispose();
        }
        OnboardPanel.currentPanel = undefined;
        setWelcomePageOpenState(false);
    }

    protected constructor(
        panel: vscode.WebviewPanel,
        extensionUri: vscode.Uri,
        title: string,
    ) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._panel.title = title;
        this._panel.webview.html = this._getHtmlForWebview(this._panel.webview);
        this.setupMessageListener();
        this.attemptAderynCliSetup();
        this.sendCommandGuide();
    }

    attemptAderynCliSetup() {
        ensureHealthyInternet()
            .then(clearCorruptedInstallation)
            .then(ensureAderynIsInstalled)
            .then(() => {
                postMessageTo(
                    this._panel.webview,
                    MessageType.InstallationSuccess,
                    '🟢 Aderyn is now ready to start analyzing your code for vulnerabilities.',
                );
            })
            .catch((err) => {
                postMessageTo(this._panel.webview, MessageType.InstallationError, err);
            })
            .then(() => autoStartLspClientIfRequested(false));
    }

    sendCommandGuide() {
        readPackageJson(new Logger()).then((packageJson) => {
            let guide: Record<string, string> = {};
            for (const command of packageJson.contributes.commands) {
                guide[command.title] = command.description;
            }
            postMessageTo(
                this._panel.webview,
                MessageType.CommandGuide,
                JSON.stringify(guide),
            );
        });
    }

    setupMessageListener() {
        this._panel.webview.onDidReceiveMessage(async (data) => {
            switch (data.command) {
                case 'retry':
                    vscode.window.showInformationMessage(data.value);
                    this.attemptAderynCliSetup();
                    break;
            }
        });
    }

    getRolledUpAssetUri(assetName: string): vscode.Uri {
        return this._panel.webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media/rolled-up', assetName),
        );
    }

    getCommonAssetUri(assetName: string): vscode.Uri {
        return this._panel.webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media/common', assetName),
        );
    }

    protected _getHtmlForWebview(webview: vscode.Webview): string {
        const scriptUri = this.getRolledUpAssetUri('onboard-panel.js');
        const tailwindStyleUri = this.getRolledUpAssetUri('tailwind.css');
        const svelteStyleUri = this.getRolledUpAssetUri('onboard-panel.svelte.css');
        const commonStyleUri = this.getCommonAssetUri('vscode.css');

        const nonce = getNonce();

        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">

            <!--
                Use a content security policy to only allow loading images from https or from our extension directory,
                and only allow scripts that have a specific nonce.
            -->
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">

            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="${commonStyleUri}" rel="stylesheet">
            <link href="${tailwindStyleUri}" rel="stylesheet">
            <link href="${svelteStyleUri}" rel="stylesheet">

            <title>${this._panel.title}</title>
        </head>
        <body>
            <div id="app"></div>
            <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
        </html>`;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export { OnboardPanel };
