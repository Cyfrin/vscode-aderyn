import { Logger } from './logger';
import { executeCommand } from './system-info';

async function isAderynAvailableOnPath(logger: Logger): Promise<boolean> {
    const cmd = 'command -v aderyn';
    return executeCommand(cmd)
        .then(() => {
            logger.info('command "aderyn" is found on path!');
            return Promise.resolve(true);
        })
        .catch((err) => {
            logger.err(err);
            return Promise.resolve(false);
        });
}

async function ensureAderynIsInstalled() {
    const logger = new Logger();
    const is = await isAderynAvailableOnPath(logger);
}

export { ensureAderynIsInstalled };
