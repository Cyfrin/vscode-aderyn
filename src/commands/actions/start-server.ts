import * as vscode from 'vscode';
import { client } from '../../state';

async function action() {
    if (!client) {
        vscode.window.showErrorMessage('aderyn client not found');
        return;
    }
    try {
        if (client.isRunning()) {
            vscode.window.showWarningMessage('Aderyn diagnostics server is running');
        } else {
            await client.start();
            vscode.window.showInformationMessage('Aderyn diagnostics server started');
        }
    } catch (err) {
        client.error('Stopping language client failed', err, 'force');
    }
}

export { action };
