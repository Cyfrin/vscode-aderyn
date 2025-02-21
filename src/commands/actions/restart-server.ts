import * as vscode from 'vscode';
import { client, showAderynStatusOff, showAderynStatusOn } from '../../state';

async function action() {
    if (!client) {
        vscode.window.showErrorMessage('aderyn client not found');
        return;
    }
    try {
        if (client.isRunning()) {
            await client.restart();
            showAderynStatusOff();
            vscode.window.showInformationMessage('Restarting Aderyn diagnostics server.');
        } else {
            await client.start();
            showAderynStatusOn();
            vscode.window.showInformationMessage('Starting Aderyn diagnostics server.');
        }
    } catch (err) {
        client.error('Restarting Aderyn failed', err, 'force');
    }
}

export { action };
