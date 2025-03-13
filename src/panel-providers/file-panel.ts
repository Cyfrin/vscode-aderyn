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

class AderynFileDiagnosticsProvider extends AderynGenericIssueProvider {
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
        return (
            issueItem.issue.instances
                //.filter(instance => isRelevantInstance(instance, this.))
                .map((instance) => new InstanceItem(instance, this.projectRootUri ?? '.'))
        );
    }
}

const isRelevantInstance = (
    instance: IssueInstance,
    activeFileUri: Uri,
    projectRootUri: string,
): boolean => {
    const instancePath = vscode.Uri.file(
        path.join(projectRootUri, instance.contractPath),
    );
    return instancePath == activeFileUri;
};

export { AderynFileDiagnosticsProvider };
