import * as vscode from 'vscode';
import { ItemKind, DiagnosticItem, CategoryItem, IssueItem } from './diagnostics-items';
import { Report } from '../utils/install/issues';
import { AderynReport, prepareResults } from './utils';

abstract class AderynGenericIssueProvider
    implements vscode.TreeDataProvider<DiagnosticItem>
{
    public _onDidChangeTreeData: vscode.EventEmitter<DiagnosticItem | undefined | void> =
        new vscode.EventEmitter<DiagnosticItem | undefined | void>();
    public readonly onDidChangeTreeData: vscode.Event<DiagnosticItem | undefined | void> =
        this._onDidChangeTreeData.event;

    protected results: AderynReport | null = null;

    protected projectRootUri: string | null = null;
    protected report: Report | null = null;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: DiagnosticItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: DiagnosticItem): Promise<DiagnosticItem[]> {
        if (!element) {
            // Report
            this.results = await prepareResults();
            if (this.results.type == 'Success') {
                const { projectRootUri, report } = this.results;
                this.projectRootUri = projectRootUri;
                this.report = report;
            } else {
                return [];
            }

            // Populate UI
            return this.getTopLevelItems(this.report);
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

    abstract getTopLevelItems(report: Report | null): DiagnosticItem[];

    abstract getIssueItems(category: CategoryItem): DiagnosticItem[];

    abstract getInstances(issueItem: IssueItem): DiagnosticItem[];
}

export { AderynGenericIssueProvider };
