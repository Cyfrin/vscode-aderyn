import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import {
    ensureWorkspacePreconditionsMetAndReturnProjectURI,
    findProjectRoot,
    parseAderynConfig,
} from '../utils/index';
import {
    createAderynReportAndDeserialize,
    isAderynAvailableOnPath,
} from '../utils/install/aderyn';
import { Report } from '../utils/install/issues';
import { Logger } from '../utils/logger';
import { ExecuteCommandError } from '../utils/runtime/system';

type AderynReport =
    | {
          type: 'Success';
          report: Report;
          projectRootUri: string;
      }
    | {
          type: 'Error';
          aderynIsOnPath: boolean;
          workspaceConditionsUnmet?: boolean;
          err?: ExecuteCommandError;
      };

let cachedReport: Report | null = null;

async function prepareResults(cached?: boolean): Promise<AderynReport> {
    if (cached && !cachedReport) {
        return prepareResults(false);
    }

    const logger = new Logger();

    // Pre-checks
    const aderynIsOnPath = await isAderynAvailableOnPath(logger);
    if (!aderynIsOnPath) {
        return {
            type: 'Error',
            aderynIsOnPath: false,
        };
    }

    const workspaceRoot = ensureWorkspacePreconditionsMetAndReturnProjectURI(false);
    if (!workspaceRoot) {
        return {
            type: 'Error',
            aderynIsOnPath: true,
            workspaceConditionsUnmet: false,
        };
    }

    const projectRootUri = await getProjectRootPrefixFromAderynToml(
        findProjectRoot(workspaceRoot),
    );

    // Generate report
    if (cached && cachedReport) {
        return {
            type: 'Success',
            report: cachedReport,
            projectRootUri,
        };
    } else {
        try {
            const report = await createAderynReportAndDeserialize(projectRootUri);
            cachedReport = report;
            return {
                type: 'Success',
                report,
                projectRootUri,
            };
        } catch (err) {
            logger.err(`${JSON.stringify(err)}`);
            return {
                type: 'Error',
                aderynIsOnPath: true,
                workspaceConditionsUnmet: true,
                err: err as ExecuteCommandError,
            };
        }
    }
}

async function getProjectRootPrefixFromAderynToml(
    workspaceRoot: string,
): Promise<string> {
    const aderynToml = path.join(workspaceRoot, 'aderyn.toml');
    if (!fs.existsSync(aderynToml)) {
        return workspaceRoot;
    }
    const configAsString = fs.readFileSync(aderynToml).toString();
    try {
        const config = await parseAderynConfig(configAsString);
        return path.join(workspaceRoot, config.root);
    } catch (err) {
        vscode.window.showErrorMessage('Error parsing aderyn.toml');
        return Promise.resolve(workspaceRoot);
    }
}

function getActiveFileURI(): vscode.Uri | null {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return null;
    }
    return editor.document.uri ?? null;
}

export {
    AderynReport,
    prepareResults,
    getProjectRootPrefixFromAderynToml,
    getActiveFileURI,
};
