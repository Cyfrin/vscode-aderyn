import * as vscode from 'vscode';
import {
    restartServer,
    showOnboardPanel,
    stopServer,
    startServer,
    initConfigFile,
} from './actions';
import { EditorCmd } from './variants';

function registerEditorCommands(context: vscode.ExtensionContext) {
    const startCommand = vscode.commands.registerCommand(
        EditorCmd.StartServer,
        startServer,
    );

    const stopCommand = vscode.commands.registerCommand(EditorCmd.StopServer, stopServer);

    const restartCommand = vscode.commands.registerCommand(
        EditorCmd.RestartServer,
        restartServer,
    );

    const showOnboardCommand = vscode.commands.registerCommand(
        EditorCmd.ShowOnboardPanel,
        () => showOnboardPanel(context.extensionUri),
    );

    const initConfigFileCommand = vscode.commands.registerCommand(
        EditorCmd.InitConfigFile,
        initConfigFile,
    );

    context.subscriptions.push(startCommand);
    context.subscriptions.push(stopCommand);
    context.subscriptions.push(restartCommand);
    context.subscriptions.push(showOnboardCommand);
    context.subscriptions.push(initConfigFileCommand);
}

export { registerEditorCommands };
