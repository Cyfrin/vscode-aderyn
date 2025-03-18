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

        const highIssueItems = this.getIssueItems(
            new CategoryItem('High', highIssues),
        ).length;
        const lowIssueItems = this.getIssueItems(
            new CategoryItem('Low', lowIssues),
        ).length;

        return [
            new CategoryItem(`High (${highIssueItems})`, highIssues),
            new CategoryItem(`Low (${lowIssueItems})`, lowIssues),
        ];
    }

    getIssueItems(category: CategoryItem): DiagnosticItem[] {
        return category.issues.map((issue) => {
            const i = new IssueItem(issue, 0);
            const items = this.getInstances(i).length;
            return new IssueItem(issue, items);
        });
    }

    getInstances(issueItem: IssueItem): DiagnosticItem[] {
        return issueItem.issue.instances.map(
            (instance) => new InstanceItem(instance, this.projectRootUri ?? '.'),
        );
    }
}

export { AderynProjectDiagnosticsProvider };
