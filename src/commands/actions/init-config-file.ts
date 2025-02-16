import * as vscode from 'vscode';

async function action() {
    vscode.window.showInformationMessage('Created aderyn.toml in current workspace');
}

export { action };
