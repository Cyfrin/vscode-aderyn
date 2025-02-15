import { executeCommand } from '../runtime';
import { Logger } from '../logger';

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

export { isAderynAvailableOnPath };
