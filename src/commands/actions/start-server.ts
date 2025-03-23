import * as vscode from 'vscode';
import { client, startServing } from '../../state';

async function action() {
    try {
        if (client && client.isRunning()) {
            vscode.window.showWarningMessage('Aderyn diagnostics server is running.');
        } else {
            await startServing();
        }
    } catch (err) {
        if (client) client.error('Starting Aderyn failed', err, 'force');
    }
}

export { action };
