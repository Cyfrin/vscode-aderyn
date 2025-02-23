// Run aderyn and deserialize the issues for upstream consumption
// Ex - Used by Diagnostics Panel

interface FilesSummary {
    totalSourceUnits: number;
    totalSloc: number;
}

interface FileDetail {
    filePath: string;
    nSloc: number;
}

interface FilesDetails {
    filesDetails: FileDetail[];
}

interface IssueInstance {
    contractPath: string;
    lineNo: number;
    src: string;
    srcChar: string;
}

interface Issue {
    title: string;
    description: string;
    detectorName: string;
    instances: IssueInstance[];
}

interface Issues {
    issues: Issue[];
}

interface IssueCount {
    high: number;
    low: number;
}

interface Report {
    filesSummary: FilesSummary;
    filesDetails: FilesDetails;
    issueCount: IssueCount;
    highIssues: Issues;
    lowIssues: Issues;
    detectorsUsed: string[];
}

function parseAderynReportFromJsonString(json: string): Report {
    const obj = JSON.parse(json);

    return {
        filesSummary: {
            totalSourceUnits: obj.files_summary.total_source_units,
            totalSloc: obj.files_summary.total_sloc,
        },
        filesDetails: {
            filesDetails: obj.files_details.files_details.map((file: any) => ({
                filePath: file.file_path,
                nSloc: file.n_sloc,
            })),
        },
        issueCount: {
            high: obj.issue_count.high,
            low: obj.issue_count.low,
        },
        highIssues: {
            issues: obj.high_issues.issues.map((issue: any) => ({
                title: issue.title,
                description: issue.description,
                detectorName: issue.detector_name,
                instances: issue.instances.map((instance: any) => ({
                    contractPath: instance.contract_path,
                    lineNo: instance.line_no,
                    src: instance.src,
                    srcChar: instance.src_char,
                })),
            })),
        },
        lowIssues: {
            issues: obj.low_issues.issues.map((issue: any) => ({
                title: issue.title,
                description: issue.description,
                detectorName: issue.detector_name,
                instances: issue.instances.map((instance: any) => ({
                    contractPath: instance.contract_path,
                    lineNo: instance.line_no,
                    src: instance.src,
                    srcChar: instance.src_char,
                })),
            })),
        },
        detectorsUsed: obj.detectors_used,
    };
}

export { parseAderynReportFromJsonString, Report, Issue, IssueInstance };
