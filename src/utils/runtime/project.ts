import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';

import * as toml from '@iarna/toml';

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

// Called after hasRecognizedProjectStructureAtWorkspaceRoot fails
function someSolidityProjectExists1LevelDeepFromWorkspaceRoot(): boolean {
    const workspaceRoot = ensureWorkspacePreconditionsMetAndReturnProjectURI(false);
    if (!workspaceRoot) return false;

    const entries = fs.readdirSync(workspaceRoot, { withFileTypes: true });

    for (const entry of entries) {
        if (entry.isDirectory()) {
            const subdirPath = path.join(workspaceRoot, entry.name);
            if (
                fs.existsSync(path.join(subdirPath, 'foundry.toml')) ||
                fs.existsSync(path.join(subdirPath, 'hardhat.config.ts')) ||
                fs.existsSync(path.join(subdirPath, 'hardhat.config.js'))
            ) {
                return true;
            }
        }
    }
    return false;
}

async function aderynTomlAtWorkspaceRootHasNonDefaultRootValue(): Promise<boolean> {
    const workspaceRoot = ensureWorkspacePreconditionsMetAndReturnProjectURI(false);
    if (!workspaceRoot) return false;

    const aderynToml = path.join(workspaceRoot, 'aderyn.toml');
    if (!fs.existsSync(aderynToml)) {
        return false;
    }
    const configAsString = fs.readFileSync(aderynToml).toString();
    try {
        const config = await parseAderynConfig(configAsString);
        return config.root != '.';
    } catch (err) {
        return false;
    }
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

interface AderynConfig {
    version: number;
    root: string;
    src?: string;
    include?: string[];
    exclude?: string[];
    remappings?: string[];
}

async function parseAderynConfig(configString: string): Promise<AderynConfig> {
    try {
        const parsed = toml.parse(configString) as any;

        if (parsed.version !== 1) {
            throw new Error('Unsupported config version');
        }

        return {
            version: parsed.version,
            root: parsed.root || '.',
            src: parsed.src,
            include: parsed.include || [],
            exclude: parsed.exclude || [],
            remappings: parsed.remappings || [],
        };
    } catch (error) {
        throw new Error(`Failed to parse Aderyn config: ${JSON.stringify(error)}`);
    }
}

export {
    findProjectRoot,
    parseAderynConfig,
    hasRecognizedProjectStructureAtWorkspaceRoot,
    ensureWorkspacePreconditionsMetAndReturnProjectURI,
    aderynTomlAtWorkspaceRootHasNonDefaultRootValue,
    someSolidityProjectExists1LevelDeepFromWorkspaceRoot,
    AderynConfig,
};
