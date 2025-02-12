import * as vscode from 'vscode';
import { showPanel, hidePanel } from '../../state';

async function action(uri: vscode.Uri) {
    await hidePanel();
    await showPanel(uri);
}

export { action };
