import * as vscode from 'vscode';

import { PanelProviders } from './variants';
import { AderynProjectDiagnosticsProvider as ProjectProvider } from './project-panel';
import { AderynFileDiagnosticsProvider as FileProvider } from './file-panel';
import {
    setActiveFileDiagnosticsProvider,
    setProjectDiagnosticsProvider,
} from '../state/index';
import { AderynHelpAndFeedbackProvider } from './help-and-feedback';

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

    // Help and feedback provider
    const helpAndFeedbackProvider = new AderynHelpAndFeedbackProvider();
    const helpAndFeedbackTreeView = vscode.window.createTreeView(
        PanelProviders.HelpAndFeedback,
        {
            treeDataProvider: helpAndFeedbackProvider,
        },
    );
    helpAndFeedbackTreeView.onDidChangeSelection((selection) => {
        if (selection.selection.length == 1) {
            const s = selection.selection[0];
            if (s.ctaUrl) {
                vscode.env.openExternal(vscode.Uri.parse(s.ctaUrl));
            }
        }
    });

    context.subscriptions.push(projectTreeView);
    context.subscriptions.push(activeFileTreeView);
    context.subscriptions.push(helpAndFeedbackTreeView);

    setProjectDiagnosticsProvider(projectDataProvider);
    setActiveFileDiagnosticsProvider(activeFileDataProvider);
}

export { registerDataProviders };
