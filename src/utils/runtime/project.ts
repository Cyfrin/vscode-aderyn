import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';

// This will make sure that even if the user opens a subfolder of the solidity project, the server will still be started
// succesfully because we use the nearest parent that is a git folder heuristic to know where the project root is.
function findProjectRoot(projectRootUri: string): string {
    let currentDir = projectRootUri;
    while (currentDir !== path.parse(currentDir).root) {
        if (
            fs.existsSync(path.join(currentDir, 'aderyn.toml')) ||
            fs.existsSync(path.join(currentDir, 'foundry.toml')) ||
            fs.existsSync(path.join(currentDir, 'hardhat.config.ts')) ||
            fs.existsSync(path.join(currentDir, 'hardhat.config.js')) ||
            fs.existsSync(path.join(currentDir, '.git'))
        ) {
            return currentDir;
        }
        currentDir = path.dirname(currentDir);
    }
    return currentDir;
}

function hasRecognizedProjectStructureAtWorkspaceRoot(): boolean {
    const workspaceRoot = ensureWorkspacePreconditionsMetAndReturnProjectURI(false);
    if (!workspaceRoot) return false;
    const root = findProjectRoot(workspaceRoot);
    return (
        root != null &&
        (fs.existsSync(path.join(root, 'aderyn.toml')) ||
            fs.existsSync(path.join(root, 'foundry.toml')) ||
            fs.existsSync(path.join(root, 'hardhat.config.ts')) ||
            fs.existsSync(path.join(root, 'hardhat.config.js')))
    );
}

function ensureWorkspacePreconditionsMetAndReturnProjectURI(
    warn?: boolean,
): string | null {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders || workspaceFolders.length == 0) {
        return null;
    }

    const { name: projectRootName, uri: projectRootUri } = workspaceFolders[0];

    if (warn && workspaceFolders.length > 1) {
        const message = `More than 1 open workspace detected. Aderyn will only run on ${projectRootName}`;
        vscode.window.showWarningMessage(message);
    }

    return projectRootUri.toString().substring('file://'.length);
}

export {
    findProjectRoot,
    hasRecognizedProjectStructureAtWorkspaceRoot,
    ensureWorkspacePreconditionsMetAndReturnProjectURI,
};
