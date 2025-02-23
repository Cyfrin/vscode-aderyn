import * as vscode from 'vscode';
import * as path from 'path';
import {
    ensureWorkspacePreconditionsMetAndReturnProjectURI,
    findProjectRoot,
} from '../utils/index';
import {
    createAderynReportAndDeserialize,
    isAderynAvailableOnPath,
} from '../utils/install/aderyn';
import { Report, IssueInstance, Issue } from '../utils/install/issues';
import { Logger } from '../utils/logger';

class AderynDiagnosticsProvider implements vscode.TreeDataProvider<DiagnosticItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<DiagnosticItem | undefined | void> =
        new vscode.EventEmitter<DiagnosticItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<DiagnosticItem | undefined | void> =
        this._onDidChangeTreeData.event;

    projectRootUri: string | null = null;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: DiagnosticItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: DiagnosticItem): Promise<DiagnosticItem[]> {
        if (!element) {
            return this.prepareResults().then(this.getTopLevelItems);
        }
        if (element.itemKind == ItemKind.Category) {
            return this.getIssueItems(element as CategoryItem);
        }
        if (element.itemKind == ItemKind.Issue) {
            return this.getInstances(element as IssueItem);
        }
        return Promise.resolve([]);
    }

    async prepareResults(): Promise<Report | null> {
        const logger = new Logger();
        const aderynIsOnPath = await isAderynAvailableOnPath(logger);
        if (aderynIsOnPath) {
            const workspaceRoot =
                ensureWorkspacePreconditionsMetAndReturnProjectURI(false);
            if (!workspaceRoot) {
                return Promise.reject('workspace pre-conditions unmet');
            }
            this.projectRootUri = findProjectRoot(workspaceRoot);
            return await createAderynReportAndDeserialize(this.projectRootUri).catch(
                (err) => {
                    logger.err(err);
                    vscode.window.showErrorMessage('Error fetching results from aderyn');
                    return null;
                },
            );
        }
        return null;
    }

    getTopLevelItems(report: Report | null): DiagnosticItem[] {
        if (!report) {
            return [];
        }
        const highIssues = report.highIssues.issues;
        const lowIssues = report.lowIssues.issues;
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
            `${instance.contractPath} Line: ${instance.lineNo} ${instance.srcChar}`,
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

export { AderynDiagnosticsProvider };
