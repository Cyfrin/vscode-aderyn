import * as vscode from 'vscode';
import { workspace } from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
} from 'vscode-languageclient/node';
import { findProjectRoot } from '../utils/';

async function createLanguageClient(): Promise<LanguageClient> {
    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: '*' }],
        synchronize: {
            fileEvents: [workspace.createFileSystemWatcher('**/*')],
        },
    };

    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders || workspaceFolders.length == 0) {
        const message = `No workspace is open yet. Please do that and then \`Restart Aderyn Server\``;
        vscode.window.showErrorMessage(message);
        throw new Error(message);
    }

    const projectRootName = workspaceFolders[0].name;
    let projectRootUri = workspaceFolders[0].uri
        .toString()
        .substring('file://'.length);

    if (workspaceFolders.length > 1) {
        const message = `More than 1 open workspace detected. Aderyn will only run on ${projectRootName}`;
        vscode.window.showErrorMessage(message);
        throw new Error(message);
    }

    const getServerOptions = (projectRootUri: string) => {
        let actualProjectRootUri = findProjectRoot(projectRootUri);
        // NOTE: NODE_ENV
        if (process.env.NODE_ENV === 'development') {
            return developmentServerOptions(actualProjectRootUri);
        } else {
            return productionServerOptions(actualProjectRootUri);
        }
    };

    return new LanguageClient(
        'aderyn_language_server',
        'Aderyn Language Server',
        getServerOptions(projectRootUri) as ServerOptions,
        clientOptions,
    );
}

function productionServerOptions(solidityProjectRoot: string): ServerOptions {
    return {
        command: 'aderyn',
        args: [solidityProjectRoot, '--lsp', '--stdout'],
        options: {
            env: process.env,
        },
    };
}

function developmentServerOptions(
    solidityProjectRoot: string,
): ServerOptions | null {
    // Path to cargo manifest file of locally running Aderyn
    let URL: Buffer;
    try {
        URL = fs.readFileSync(path.join(__dirname, '../manifest'));
    } catch (ex) {
        vscode.window.showErrorMessage(
            'File manifest not found. Read manifest.sample please!',
        );
        throw new Error('DEV: Aderyn Local Mannifest Not found');
    }
    return {
        command: 'cargo',
        args: [
            'run',
            '--quiet',
            '--manifest-path',
            URL.toString(),
            '--',
            solidityProjectRoot,
            '--lsp',
            '--stdout',
        ],
        options: {
            env: process.env,
        },
    };
}

export { createLanguageClient };
