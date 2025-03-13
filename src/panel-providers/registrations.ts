import * as vscode from 'vscode';

import { PanelProviders } from './variants';
import { AderynProjectDiagnosticsProvider as ProjectProvider } from './project-panel';
import { AderynFileDiagnosticsProvider as FileProvider } from './file-panel';

function registerDataProviders(context: vscode.ExtensionContext) {
    // Project Diagnostics
    const projectDataProvider = new ProjectProvider();
    const projectTreeView = vscode.window.createTreeView(PanelProviders.Project, {
        treeDataProvider: projectDataProvider,
    });
    projectTreeView.onDidChangeVisibility((e) => {
        if (e.visible) {
            projectDataProvider.refresh();
        }
    });

    // Active activeFile Diagnostics
    const activeFileDataProvider = new FileProvider();
    const activeFileTreeView = vscode.window.createTreeView(PanelProviders.ActiveFile, {
        treeDataProvider: activeFileDataProvider,
    });
    activeFileTreeView.onDidChangeVisibility((e) => {
        if (e.visible) {
            activeFileDataProvider.refresh();
        }
    });

    context.subscriptions.push(projectTreeView);
    context.subscriptions.push(activeFileTreeView);
}

export { registerDataProviders };
