import * as vscode from 'vscode';

function action() {
    vscode.commands.executeCommand('workbench.action.openSettings', '@ext:cyfrin.aderyn');
}

export { action };
