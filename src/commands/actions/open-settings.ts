import * as vscode from 'vscode';

function action() {
    vscode.commands.executeCommand(
        'workbench.action.openSettings',
        '@ext:cyfrinio.aderyn',
    );
}

export { action };
