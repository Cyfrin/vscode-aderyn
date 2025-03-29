import * as vscode from 'vscode';
import {
    ItemKind,
    DiagnosticItem,
    CategoryItem,
    IssueItem,
    ErrorItem,
} from './diagnostics-items';
import { Report } from '../utils/install/issues';
import { AderynReport, getActiveFileURI } from './utils';
import { ExecuteCommandErrorType } from '../utils/runtime/system';

abstract class AderynGenericIssueProvider
    implements vscode.TreeDataProvider<DiagnosticItem>
{
    public _onDidChangeTreeData: vscode.EventEmitter<DiagnosticItem | undefined | void> =
        new vscode.EventEmitter<DiagnosticItem | undefined | void>();
    public readonly onDidChangeTreeData: vscode.Event<DiagnosticItem | undefined | void> =
        this._onDidChangeTreeData.event;

    protected results: AderynReport | null = null;

    protected projectRootUri: string | null = null;
    protected activeFileUri: vscode.Uri | null = null;
    protected report: Report | null = null;
    protected errorMessage: string | null = null;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: DiagnosticItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: DiagnosticItem): Promise<DiagnosticItem[]> {
        if (!element) {
            // Reset errors from previous runs
            this.errorMessage = null;

            // Init the results
            return this.initData().then(() => {
                this.activeFileUri = getActiveFileURI();

                if (this.results?.type == 'Error' && this.results.aderynIsOnPath) {
                    if (!this.results.workspaceConditionsUnmet) {
                        this.errorMessage =
                            'Exactly 1 open workspace is needed for running aderyn';
                    } else if (this.results.err) {
                        const { errorType, payload } = this.results.err;
                        if (errorType == ExecuteCommandErrorType.Timeout) {
                            this.errorMessage = 'Running aderyn timed out!';
                        } else if (
                            errorType == ExecuteCommandErrorType.BadCommandExitStatus &&
                            payload
                        ) {
                            this.errorMessage = payload.toString();
                        }
                    }
                }

                if (this.errorMessage) {
                    return [
                        ...this.errorMessage.split('\n').map((msg) => {
                            // https://stackoverflow.com/a/29497680/4546390
                            const escapedStr = msg.replace(
                                /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
                                '',
                            );
                            return new ErrorItem(escapedStr);
                        }),
                        new ErrorItem(''),
                        new ErrorItem(
                            'To generate the above message manually, run `aderyn` in the command line at root of the project',
                        ),
                        new ErrorItem(''),
                        new ErrorItem('Have you tried the following?'),
                        new ErrorItem(''),
                        new ErrorItem("Install the project's dependencies"),
                        new ErrorItem('Write the remappings in remappings.txt'),
                        new ErrorItem(
                            'Initializing a adreyn.toml config file with sensible values',
                        ),
                        new ErrorItem('Restarting VS Code'),
                        new ErrorItem('Consulting Help and Feedback below'),
                    ];
                }

                // Populate UI
                return this.getTopLevelItems(this.report);
            });
        }
        switch (element.itemKind) {
            case ItemKind.Category:
                return this.getIssueItems(element as CategoryItem);
            case ItemKind.Issue:
                return this.getInstances(element as IssueItem);
            case ItemKind.Instance:
            case ItemKind.ErrorMessage:
                // Unexpected, since the state is non collapsible, this place shouldn't be reached
                return [];
        }
    }

    abstract initData(): Promise<void>;

    abstract getTopLevelItems(report: Report | null): DiagnosticItem[];

    abstract getIssueItems(category: CategoryItem): DiagnosticItem[];

    abstract getInstances(issueItem: IssueItem): DiagnosticItem[];
}

export { AderynGenericIssueProvider };
