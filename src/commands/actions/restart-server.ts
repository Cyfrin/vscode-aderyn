import * as vscode from 'vscode';
import { client, startServing, stopServing } from '../../state';

async function action() {
    if (!client) {
        vscode.window.showErrorMessage('aderyn client not found');
        return;
    }
    try {
        vscode.window.showInformationMessage('Restarting Aderyn diagnostics server.');
        if (client.isRunning()) {
            await stopServing();
        }
        await startServing();
    } catch (err) {
        client.error('Restarting Aderyn failed', err, 'force');
    }
}

export { action };
