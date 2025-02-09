//@ts-check

import * as vscode from 'vscode';

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();
    const oldState = vscode.getState() || { colors: [] };
})();
