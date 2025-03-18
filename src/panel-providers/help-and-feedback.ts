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
                'Check for updates & Fix corrupt installation',
                EditorCmd.ShowOnboardPanel,
            ),
            new HelpItem(
                'Read Extension Documentation',
                undefined,
                'https://support.cyfrin.io/en/collections/11474626-tools',
            ),
            new HelpItem(
                'Report Issue',
                undefined,
                'https://github.com/Cyfrin/vscode-aderyn',
            ),
            new HelpItem(
                'Contribute',
                undefined,
                'https://github.com/Cyfrin/vscode-aderyn',
            ),
        ];
    }
}

export { AderynHelpAndFeedbackProvider };
