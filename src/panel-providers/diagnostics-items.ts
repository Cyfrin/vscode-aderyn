import * as vscode from 'vscode';
import * as path from 'path';
import { IssueInstance, Issue } from '../utils/install/issues';

const enum ItemKind {
    Category,
    Issue,
    Instance,
    ErrorMessage,
}

class DiagnosticItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly itemKind: ItemKind,
    ) {
        super(label, collapsibleState);
        this.tooltip = `${this.label}`;
    }
}

class ErrorItem extends DiagnosticItem {
    constructor(public readonly label: string) {
        super('Error', vscode.TreeItemCollapsibleState.None, ItemKind.ErrorMessage);
        this.tooltip = `${this.label}`;
    }
}

class CategoryItem extends DiagnosticItem {
    constructor(
        public readonly label: string,
        public readonly issues: Issue[],
    ) {
        super(
            label,
            issues.length > 0
                ? vscode.TreeItemCollapsibleState.Collapsed
                : vscode.TreeItemCollapsibleState.Expanded,
            ItemKind.Category,
        );
        this.tooltip = `${this.label} issues`;
    }
}

class IssueItem extends DiagnosticItem {
    constructor(public readonly issue: Issue) {
        super(issue.title, vscode.TreeItemCollapsibleState.Collapsed, ItemKind.Issue);
        this.tooltip = issue.description;
    }
}

class InstanceItem extends DiagnosticItem {
    constructor(
        public readonly instance: IssueInstance,
        projectRootUri: string,
    ) {
        super(
            `${instance.contractPath} Line: ${instance.lineNo}`,
            vscode.TreeItemCollapsibleState.None,
            ItemKind.Instance,
        );
        this.tooltip = instance.contractPath;
        this.command = {
            title: 'Go to file',
            command: 'vscode.open',
            arguments: [
                vscode.Uri.file(path.join(projectRootUri, instance.contractPath)),
                {
                    selection: new vscode.Range(
                        instance.lineNo - 1,
                        0,
                        instance.lineNo - 1,
                        1000,
                    ),
                },
            ],
        };
    }
}

export { ItemKind, DiagnosticItem, CategoryItem, IssueItem, InstanceItem, ErrorItem };
