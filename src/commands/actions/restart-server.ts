import * as vscode from 'vscode';

import { client } from '../../state';

async function action() {
    if (!client) {
        vscode.window.showErrorMessage('aderyn client not found');
        return;
    }
    try {
        if (client.isRunning()) {
            await client.restart();
            vscode.window.showInformationMessage('aderyn server restarted.');
        } else {
            await client.start();
        }
    } catch (err) {
        client.error('Restarting client failed', err, 'force');
    }
}

export { action };

