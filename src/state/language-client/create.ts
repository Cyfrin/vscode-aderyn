import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
} from 'vscode-languageclient/node';

import { findProjectRoot } from '../../utils';

function ensureWorkspacePreconditionsMetAndReturnProjectURI(): string | null {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders || workspaceFolders.length == 0) {
        const message = `No workspace is open yet. Please do that and then \`Restart Aderyn Server\``;
        vscode.window.showWarningMessage(message);
        return null;
    }

    const { name: projectRootName, uri: projectRootUri } = workspaceFolders[0];

    if (workspaceFolders.length > 1) {
        const message = `More than 1 open workspace detected. Aderyn will only run on ${projectRootName}`;
        vscode.window.showWarningMessage(message);
    }

    return projectRootUri.toString().substring('file://'.length);
}

async function createLanguageClient(): Promise<LanguageClient> {
    const projectRootUri = ensureWorkspacePreconditionsMetAndReturnProjectURI();

    if (!projectRootUri) {
        throw new Error('unable to decide project root uri');
    }

    const getClientOptions: () => LanguageClientOptions = () => ({
        documentSelector: [{ scheme: 'file', language: '*' }],
    });

    const getServerOptions: (projectRootUri: string) => ServerOptions = (
        projectRootUri: string,
    ) => {
        let actualProjectRootUri = findProjectRoot(projectRootUri);
        if (process.env.NODE_ENV === 'development') {
            return developmentServerOptions(actualProjectRootUri);
        } else {
            return productionServerOptions(actualProjectRootUri);
        }
    };

    return new LanguageClient(
        'Aderyn Diagnostics Server',
        getServerOptions(projectRootUri),
        getClientOptions(),
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

function developmentServerOptions(solidityProjectRoot: string): ServerOptions {
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
