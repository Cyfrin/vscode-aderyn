import * as vscode from 'vscode';
import * as path from 'path';
import { Report, IssueInstance, Issue } from '../utils/install/issues';
import { prepareResults, getActiveFileURI, AderynReport } from './utils';

class AderynFileDiagnosticsProvider implements vscode.TreeDataProvider<DiagnosticItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<DiagnosticItem | undefined | void> =
        new vscode.EventEmitter<DiagnosticItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<DiagnosticItem | undefined | void> =
        this._onDidChangeTreeData.event;

    projectRootUri: string | null = null;
    activeFileUri: vscode.Uri | null = null;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: DiagnosticItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: DiagnosticItem): Promise<DiagnosticItem[]> {
        if (!element) {
            const results: AderynReport = await prepareResults();
            if (results.type == 'Error') {
                return [];
            }
            const { projectRootUri, report } = results;
            this.projectRootUri = projectRootUri;
            return this.getTopLevelItems(report);
        }
        if (element.itemKind == ItemKind.Category) {
            return this.getIssueItems(element as CategoryItem);
        }
        if (element.itemKind == ItemKind.Issue) {
            return this.getInstances(element as IssueItem);
        }
        return Promise.resolve([]);
    }

    getTopLevelItems(report: Report | null): DiagnosticItem[] {
        if (!report) {
            return [];
        }
        const isRelevantInstance = (instance: IssueInstance): boolean => {
            if (!this.activeFileUri || !this.projectRootUri) {
                return false;
            }
            const instancePath = vscode.Uri.file(
                path.join(this.projectRootUri, instance.contractPath),
            );
            return instancePath == this.activeFileUri;
        };

        const highIssues = report.highIssues.issues.filter((issue) =>
            issue.instances.filter(isRelevantInstance),
        );
        const lowIssues = report.lowIssues.issues.filter((issue) =>
            issue.instances.filter(isRelevantInstance),
        );

        return [new CategoryItem('High', highIssues), new CategoryItem('Low', lowIssues)];
    }

    getIssueItems(category: CategoryItem): DiagnosticItem[] {
        return category.issues.map((issue) => new IssueItem(issue));
    }

    getInstances(issueItem: IssueItem): DiagnosticItem[] {
        return issueItem.issue.instances.map(
            (instance) => new InstanceItem(instance, this.projectRootUri ?? '.'),
        );
    }
}

const enum ItemKind {
    Category,
    Issue,
    Instance,
}

export class DiagnosticItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly itemKind: ItemKind,
    ) {
        super(label, collapsibleState);
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

export { AderynFileDiagnosticsProvider };
