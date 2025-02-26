import * as vscode from 'vscode';
import { client, showAderynStatusOff, showAderynStatusOn } from '../../state';

async function action() {
    if (!client) {
        vscode.window.showErrorMessage('aderyn client not found');
        return;
    }
    try {
        if (client.isRunning()) {
            showAderynStatusOff();
            vscode.window.showInformationMessage('Restarting Aderyn diagnostics server.');
            await client.restart();
        } else {
            vscode.window.showInformationMessage('Starting Aderyn diagnostics server.');
            await client.start();
        }

        showAderynStatusOn();
    } catch (err) {
        client.error('Restarting Aderyn failed', err, 'force');
    }
}

export { action };
