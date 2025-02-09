import * as vscode from 'vscode';
import { restartServer } from './actions';
import { EditorCmd } from './variants';

function registerEditorCommands(context: vscode.ExtensionContext) {
    const restartCommand = vscode.commands.registerCommand(
        EditorCmd.RestartServer,
        restartServer,
    );

    context.subscriptions.push(restartCommand);
}

export { registerEditorCommands };
