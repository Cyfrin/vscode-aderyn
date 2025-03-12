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

async function prepareResults(): Promise<[string, Report | null] | null> {
    const logger = new Logger();
    const aderynIsOnPath = await isAderynAvailableOnPath(logger);
    if (aderynIsOnPath) {
        const workspaceRoot = ensureWorkspacePreconditionsMetAndReturnProjectURI(false);
        if (!workspaceRoot) {
            return Promise.reject('workspace pre-conditions unmet');
        }
        const projectRootUri = await getProjectRootPrefixFromAderynToml(
            findProjectRoot(workspaceRoot),
        );
        return [
            projectRootUri,
            await createAderynReportAndDeserialize(projectRootUri).catch((err) => {
                logger.err(err);
                vscode.window.showErrorMessage('Error fetching results from aderyn');
                return null;
            }),
        ];
    }
    return null;
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

export { prepareResults, getProjectRootPrefixFromAderynToml };
