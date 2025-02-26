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
            vscode.window.showInformationMessage('Starting Aderyn diagnostics server.');
            await client.start();
            showAderynStatusOn();
        }
    } catch (err) {
        client.error('Starting Aderyn failed', err, 'force');
    }
}

export { action };
