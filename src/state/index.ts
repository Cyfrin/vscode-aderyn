import { LanguageClient } from 'vscode-languageclient/node';
import { createLanguageClient } from './create-language-client';
import { startServing, stopServingIfOn, stopServing } from './mechanics';

let client: LanguageClient | undefined;

async function createOrInitClient() {
    if (!client)
        client = await createLanguageClient();
}

export {
    client,
    createOrInitClient,
    startServing,
    stopServingIfOn,
    stopServing,
}
