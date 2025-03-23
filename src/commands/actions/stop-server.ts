import * as vscode from 'vscode';
import { client, stopServing } from '../../state';

async function action() {
    if (!client) {
        vscode.window.showErrorMessage('aderyn client not found');
        return;
    }
    try {
        if (client.isRunning()) {
            await stopServing();
        } else {
            vscode.window.showWarningMessage('Aderyn diagnostics server is not running.');
        }
    } catch (err) {
        client.error('Stopping Aderyn failed', err, 'force');
    }
}

export { action };
