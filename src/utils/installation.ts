import * as https from 'https';
import { Logger } from './logger';
import { executeCommand } from './system-info';
import { readPackageJson } from './extension-info';

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

async function getAderynVersion(logger: Logger): Promise<boolean> {
    const cmd = 'aderyn --version';
    return executeCommand(cmd)
        .then((stdout) => {
            logger.info(`checking version - ${stdout}`);
            readPackageJson(logger);
            return Promise.resolve(true);
        })
        .catch((err) => {
            logger.err(`checking version failed - ${err}`);
            return Promise.resolve(false);
        });
}

function hasReliableInternet(logger: Logger): Promise<boolean> {
    return new Promise((resolve) => {
        https
            .get('https://www.google.com', { timeout: 3000 }, (res) => {
                logger.info('has reliable internet connection');
                resolve(res.statusCode === 200);
            })
            .on('error', (err) => {
                logger.err(`no reliable internet connection - ${err}`);
                resolve(false);
            });
    });
}

// NOTE: These messages will be displayed in the UI
enum AderynInstallationErrorType {
    NoReliableInternet = 'No reliable internet connection',
}

async function ensureAderynIsInstalled() {
    const logger = new Logger();

    const isOnline = await hasReliableInternet(logger);

    if (!isOnline) {
        throw new Error(AderynInstallationErrorType.NoReliableInternet);
    }

    const isOnPath = await isAderynAvailableOnPath(logger);

    if (isOnPath) {
        const existingAderynVersion = await getAderynVersion(logger);
    }
}

export { ensureAderynIsInstalled };
