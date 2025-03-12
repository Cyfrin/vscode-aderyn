import * as vscode from 'vscode';

import { PanelProviders } from './variants';
import { AderynDiagnosticsProvider } from './diagnostics-panel';

function registerDataProviders(context: vscode.ExtensionContext) {
    // Project Diagnostics
    const projectDataProvider = new AderynDiagnosticsProvider();
    const projectTreeView = vscode.window.createTreeView(PanelProviders.Project, {
        treeDataProvider: projectDataProvider,
    });
    projectTreeView.onDidChangeVisibility((e) => {
        if (e.visible) {
            projectDataProvider.refresh();
        }
    });

    // Active activeFile Diagnostics
    const activeFileDataProvider = new AderynDiagnosticsProvider();
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
