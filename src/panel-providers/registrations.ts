import * as vscode from 'vscode';

import { PanelProviders } from './variants';
import { AderynDiagnosticsProvider as D } from './diagnostics-panel';

function registerDataProviders(context: vscode.ExtensionContext) {
    const diagnosticsDataProvider = new D();
    const diagnosticsTreeView = vscode.window.createTreeView(PanelProviders.Diagnostics, {
        treeDataProvider: diagnosticsDataProvider,
    });
    diagnosticsTreeView.onDidChangeVisibility((e) => {
        if (e.visible) {
            diagnosticsDataProvider.refresh();
        }
    });
    context.subscriptions.push(diagnosticsTreeView);
}

export { registerDataProviders };
