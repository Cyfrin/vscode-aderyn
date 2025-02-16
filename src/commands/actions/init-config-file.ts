import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import {
    ensureWorkspacePreconditionsMetAndReturnProjectURI,
    Logger,
    readAderynConfigTemplate,
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

    const templateContent = (await readAderynConfigTemplate(new Logger()).catch((err) => {
        vscode.window.showErrorMessage(`template not found :( ${err}`);
    })) as string;

    fs.writeFileSync(filePath, templateContent); // Initialize with an empty aderyn.toml
    vscode.window.showInformationMessage(`Created aderyn.toml at ${filePath}`);
}

export { action };
