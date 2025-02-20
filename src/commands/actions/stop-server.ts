import * as vscode from 'vscode';
import { client } from '../../state';

async function action() {
    if (!client) {
        vscode.window.showErrorMessage('aderyn client not found');
        return;
    }
    try {
        if (client.isRunning()) {
            await client.stop();
            vscode.window.showInformationMessage('Stopping Aderyn diagnostics server.');
        } else {
            vscode.window.showWarningMessage('Aderyn diagnostics server is not running.');
        }
    } catch (err) {
        client.error('Stopping Aderyn failed', err, 'force');
    }
}

export { action };
