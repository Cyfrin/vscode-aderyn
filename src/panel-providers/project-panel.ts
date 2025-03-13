import {
    DiagnosticItem,
    CategoryItem,
    IssueItem,
    InstanceItem,
} from './diagnostics-items';
import { Report } from '../utils/install/issues';
import { AderynGenericIssueProvider } from './generic-issue-panel';
import { prepareResults } from './utils';

class AderynProjectDiagnosticsProvider extends AderynGenericIssueProvider {
    initData(): Promise<void> {
        return (async () => {
            // Report
            this.results = await prepareResults();
            if (this.results.type == 'Success') {
                const { projectRootUri, report } = this.results;
                this.projectRootUri = projectRootUri;
                this.report = report;
            }
        })();
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
