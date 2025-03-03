import { executeCommand } from '../runtime';
import { Logger } from '../logger';
import { parseAderynReportFromJsonString, Report } from './issues';

/**
 * Checks if the command "aderyn" is available on path in the shell
 * @param {Logger} logger
 * @returns {Promise<boolean>}
 */
async function isAderynAvailableOnPath(logger: Logger): Promise<boolean> {
    const cmd = 'command -v aderyn';
    return executeCommand(cmd)
        .then(() => {
            logger.info('command "aderyn" is found on path!');
            return Promise.resolve(true);
        })
        .catch((err) => {
            logger.err(`command "aderyn" was not found on path - ${err}`);
            return Promise.resolve(false);
        });
}

async function createAderynReportAndDeserialize(projectRootUri: string): Promise<Report> {
    const cmd = `aderyn -o report.json --stdout --skip-cloc`;
    return executeCommand(cmd, undefined, undefined, projectRootUri)
        .then((text) => {
            const match = text.match(/STDOUT START([\s\S]*?)STDOUT END/);
            if (!match) {
                throw new Error('corrupted json');
            }
            return match[1].trim();
        })
        .then((reportJson) => parseAderynReportFromJsonString(reportJson));
}

export { isAderynAvailableOnPath, createAderynReportAndDeserialize };
