import * as vscode from 'vscode';

import { PanelProviders } from './variants';
import { AderynDiagnosticsProvider as D } from './diagnostics-panel';

function registerDataProviders() {
    vscode.window.registerTreeDataProvider(PanelProviders.Diagnostics, new D());
}

export { registerDataProviders };
