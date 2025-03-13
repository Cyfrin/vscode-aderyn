import * as vscode from 'vscode';
import {
    restartServer,
    showOnboardPanel,
    stopServer,
    startServer,
    initConfigFile,
    openSettings,
    refreshActiveFilePanel,
    refreshProjectPanel,
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

    const openSettingsCommand = vscode.commands.registerCommand(
        EditorCmd.OpenSettings,
        openSettings,
    );

    const refreshProjectPanelCommand = vscode.commands.registerCommand(
        EditorCmd.RefreshProjectPanel,
        refreshProjectPanel,
    );

    const refreshActivePanelCommand = vscode.commands.registerCommand(
        EditorCmd.RefreshActiveFilePanel,
        refreshActiveFilePanel,
    );

    context.subscriptions.push(startCommand);
    context.subscriptions.push(stopCommand);
    context.subscriptions.push(restartCommand);
    context.subscriptions.push(showOnboardCommand);
    context.subscriptions.push(initConfigFileCommand);
    context.subscriptions.push(openSettingsCommand);
    context.subscriptions.push(refreshProjectPanelCommand);
    context.subscriptions.push(refreshActivePanelCommand);
}

export { registerEditorCommands };
