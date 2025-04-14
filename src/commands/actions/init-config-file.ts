import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import {
    ensureWorkspacePreconditionsMetAndReturnProjectURI,
    executeCommand,
} from '../../utils';

async function action() {
    const workspaceUri = ensureWorkspacePreconditionsMetAndReturnProjectURI(true);
    if (!workspaceUri) {
        return;
    }

    const filePath = path.join(workspaceUri, 'aderyn.toml');

    if (fs.existsSync(filePath)) {
        vscode.window.showWarningMessage(`aderyn.toml already exists at ${filePath}`);
        return;
    }

    const cmd = `aderyn init ${workspaceUri}`;
    executeCommand(cmd)
        .then(() => {
            vscode.workspace.openTextDocument(filePath).then(
                (document) => {
                    vscode.window.showTextDocument(document);
                },
                (err) => {
                    vscode.window.showErrorMessage(`Error opening file: ${err}`);
                },
            );
        })
        .catch((err) => {
            vscode.window.showErrorMessage(`Error creating aderyn.toml file: ${err}`);
        });
}

export { action };
