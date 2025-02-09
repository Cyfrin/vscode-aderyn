import { Uri } from 'vscode';

import { LanguageClient } from 'vscode-languageclient/node';
import { OnboardViewProvider } from '../webview-providers';
import { createLanguageClient } from './create-language-client';
import { startServing, stopServingIfOn, stopServing } from './mechanics';

let client: LanguageClient | undefined;
let onboardProvider: OnboardViewProvider | undefined;

async function createOrInitClient() {
    if (!client) client = await createLanguageClient();
}

async function createOrInitOnboardProvider(uri: Uri) {
    if (!onboardProvider) onboardProvider = new OnboardViewProvider(uri);
}

export {
    // Language client
    client,
    createOrInitClient,
    startServing,
    stopServingIfOn,
    stopServing,

    // Onboard Provider
    onboardProvider,
    createOrInitOnboardProvider,
};
