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
            vscode.window.showInformationMessage('Aderyn diagnostics server is stopped');
        } else {
            vscode.window.showWarningMessage('Aderyn diagnostics server is not running');
        }
    } catch (err) {
        client.error('Stopping language client failed', err, 'force');
    }
}

export { action };
