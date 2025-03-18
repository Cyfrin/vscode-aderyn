import * as vscode from 'vscode';
import { EditorCmd } from '../commands/variants';
import { HelpItem } from './help-items';

class AderynHelpAndFeedbackProvider implements vscode.TreeDataProvider<HelpItem> {
    public _onDidChangeTreeData: vscode.EventEmitter<HelpItem | undefined | void> =
        new vscode.EventEmitter<HelpItem | undefined | void>();
    public readonly onDidChangeTreeData: vscode.Event<HelpItem | undefined | void> =
        this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: HelpItem): vscode.TreeItem {
        return element;
    }

    async getChildren(): Promise<HelpItem[]> {
        return [
            new HelpItem('Visit Welcome page', EditorCmd.ShowOnboardPanel),
            new HelpItem(
                'Updates & Fix corrupt installation',
                EditorCmd.ShowOnboardPanel,
            ),
            new HelpItem(
                'Documentation',
                undefined,
                'https://cyfrin.gitbook.io/cyfrin-docs/aderyn-vs-code/what-is-aderyn-vs-code-extension',
            ),
            new HelpItem(
                'Report Extension Issues',
                undefined,
                'https://github.com/Cyfrin/vscode-aderyn',
            ),
            new HelpItem(
                'Report Detector Logic Issues',
                undefined,
                'https://github.com/Cyfrin/aderyn',
            ),
            new HelpItem('Security Course', undefined, 'https://www.cyfrin.io/updraft'),
            new HelpItem('Support', undefined, 'https://discord.com/invite/cyfrin'),
        ];
    }
}

export { AderynHelpAndFeedbackProvider };
