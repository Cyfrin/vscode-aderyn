import * as vscode from 'vscode';
import { restartServer, showOnboardPanel } from './actions';
import { EditorCmd } from './variants';

function registerEditorCommands(context: vscode.ExtensionContext) {
    const restartCommand = vscode.commands.registerCommand(
        EditorCmd.RestartServer,
        restartServer,
    );
    const showOnboardCommand = vscode.commands.registerCommand(
        EditorCmd.ShowOnboardPanel,
        () => showOnboardPanel(context.extensionUri),
    );

    context.subscriptions.push(restartCommand);
    context.subscriptions.push(showOnboardCommand);
}

export { registerEditorCommands };
