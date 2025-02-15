import { Uri } from 'vscode';

import { LanguageClient } from 'vscode-languageclient/node';

import {
    createLanguageClient,
    startServing,
    stopServingIfOn,
    stopServing,
} from './language-client';

import { createNewOrShowOnboardProvider, showPanel, hidePanel } from './onboard-provider';

/*
 *
 * State variables
 *
 */
let client: LanguageClient | undefined;

async function createOrInitLspClient() {
    if (!client) client = await createLanguageClient();
}

async function createOrInitOnboardProvider(uri: Uri) {
    createNewOrShowOnboardProvider(uri);
}

export {
    // Language client
    client,
    createOrInitLspClient,
    startServing,
    stopServingIfOn,
    stopServing,

    // Onboard Provider
    createOrInitOnboardProvider,
    showPanel,
    hidePanel,
};
