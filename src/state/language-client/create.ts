import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
} from 'vscode-languageclient/node';

import {
    findProjectRoot,
    ensureWorkspacePreconditionsMetAndReturnProjectURI,
} from '../../utils';

async function createLanguageClient(): Promise<LanguageClient | undefined> {
    const projectRootUri = ensureWorkspacePreconditionsMetAndReturnProjectURI(true);

    if (!projectRootUri) {
        return undefined;
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
