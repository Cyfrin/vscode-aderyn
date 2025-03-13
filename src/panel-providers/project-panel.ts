import * as vscode from 'vscode';
import {
    ItemKind,
    DiagnosticItem,
    CategoryItem,
    IssueItem,
    InstanceItem,
} from './diagnostics-items';
import { Report } from '../utils/install/issues';
import { AderynReport, prepareResults } from './utils';

class AderynProjectDiagnosticsProvider
    implements vscode.TreeDataProvider<DiagnosticItem>
{
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
            vscode.window.showInformationMessage('Preparing results');
            const results: AderynReport = await prepareResults();
            if (results.type == 'Error') {
                return [];
            }
            const { projectRootUri, report } = results;
            this.projectRootUri = projectRootUri;
            vscode.window.showInformationMessage('Prepared results');
            return this.getTopLevelItems(report);
        }
        switch (element.itemKind) {
            case ItemKind.Category:
                return this.getIssueItems(element as CategoryItem);
            case ItemKind.Issue:
                return this.getInstances(element as IssueItem);
            case ItemKind.Instance:
                // Unexpected, since the state is non collapsible, this place shouldn't be reached
                return [];
        }
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

export { AderynProjectDiagnosticsProvider };
