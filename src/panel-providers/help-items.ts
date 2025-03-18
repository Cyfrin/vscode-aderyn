import * as vscode from 'vscode';

class HelpItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public cmd?: string,
        public ctaUrl?: string,
    ) {
        super(label, vscode.TreeItemCollapsibleState.None);
        if (cmd) {
            this.command = {
                title: 'Go',
                command: cmd,
            };
        }
    }
}

export { HelpItem };
