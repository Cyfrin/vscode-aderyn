import {
    DiagnosticItem,
    CategoryItem,
    IssueItem,
    InstanceItem,
} from './diagnostics-items';
import { IssueInstance, Report } from '../utils/install/issues';
import { AderynGenericIssueProvider } from './generic-issue-panel';
import * as vscode from 'vscode';
import { Uri } from 'vscode';
import path from 'path';
import { prepareResults } from './utils';

class AderynFileDiagnosticsProvider extends AderynGenericIssueProvider {
    initData(): Promise<void> {
        return (async () => {
            // Delay avoids race conditions that kills solc and enters perpetual lock
            // maybe due to timeouts
            const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
            await delay(3000);
            // Report
            this.results = await prepareResults(true);
            if (this.results.type == 'Success') {
                const { projectRootUri, report } = this.results;
                this.projectRootUri = projectRootUri;
                this.report = report;
            }
        })();
    }

    getTopLevelItems(report: Report | null): DiagnosticItem[] {
        if (!report || !this.activeFileUri || !this.projectRootUri) {
            return [];
        }
        const highIssues = report.highIssues.issues;
        const lowIssues = report.lowIssues.issues;
        return [new CategoryItem('High', highIssues), new CategoryItem('Low', lowIssues)];
    }

    getIssueItems(category: CategoryItem): DiagnosticItem[] {
        return category.issues
            .filter((issues) =>
                issues.instances.some((instance) =>
                    isRelevantInstance(instance, this.activeFileUri, this.projectRootUri),
                ),
            )
            .map((issue) => new IssueItem(issue));
    }

    getInstances(issueItem: IssueItem): DiagnosticItem[] {
        return issueItem.issue.instances
            .filter((instance) =>
                isRelevantInstance(instance, this.activeFileUri, this.projectRootUri),
            )
            .map((instance) => new InstanceItem(instance, this.projectRootUri ?? '.'));
    }
}

const isRelevantInstance = (
    instance: IssueInstance,
    activeFileUri: Uri | null,
    projectRootUri: string | null,
): boolean => {
    if (!projectRootUri || !activeFileUri) {
        return false;
    }
    const instancePath = vscode.Uri.file(
        path.join(projectRootUri, instance.contractPath),
    );
    return instancePath.toString() == activeFileUri.toString();
};

export { AderynFileDiagnosticsProvider };
