import * as vscode from 'vscode';
import { client, showAderynStatusOn } from '../../state';

async function action() {
    if (!client) {
        vscode.window.showErrorMessage('aderyn client not found');
        return;
    }
    try {
        if (client.isRunning()) {
            vscode.window.showWarningMessage('Aderyn diagnostics server is running.');
        } else {
            await client.start();
            showAderynStatusOn();
            vscode.window.showInformationMessage('Starting Aderyn diagnostics server.');
        }
    } catch (err) {
        client.error('Starting Aderyn failed', err, 'force');
    }
}

export { action };
