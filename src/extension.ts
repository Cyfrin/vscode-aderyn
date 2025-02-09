import * as vscode from 'vscode';
import { createOrInitClient, startServing, stopServingIfOn } from './state';
import { registerEditorCommands } from './commands/registrations';

export async function activate(context: vscode.ExtensionContext) {
    registerEditorCommands(context);
    createOrInitClient().then(startServing);
}

export function deactivate(): Thenable<void> | undefined {
    return stopServingIfOn() ?? undefined;
}
