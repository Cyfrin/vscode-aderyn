import { Logger } from './logger';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { readPackageJson } from './metadata';

/**
 * Collection of keys to use
 */
const enum Keys {
    OnboardPanelSeen = 'ONBOARD_PANEL_SEEN',
}

/**
 *
 * Whether or not `key` has been used. Once you call this function, if the key was unused,
 * it will now be used. All keys are reset to unused for each new version of the extension.
 *
 * @param {Logger} logger
 * @param {string} key - Identifier that can be used only once per version
 * @returns {Promise<boolean>} Whether or not the key was used
 *
 */
async function isKeyUsed(logger: Logger, key: string | Keys): Promise<boolean> {
    const { version } = await readPackageJson(logger);

    if (!version) {
        throw new Error('package.json for extension is corrupted!');
    }

    const homeDir = os.homedir();
    const filePath = path.join(homeDir, '.cyfrin', 'vscode', 'keys', `${version}.json`);

    // Ensure the file exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '{}'); // Initialize with an empty json object
    }

    const store = JSON.parse(fs.readFileSync(filePath).toString());
    logger.info(`${JSON.stringify(store)} read from ${filePath}`);

    if (key in store) {
        logger.info(`${key} not used for ${version}`);
        return true;
    }

    logger.info(`${key} used for ${version}`);
    store[key] = 'USED';
    fs.writeFileSync(filePath, JSON.stringify(store));
    return false;
}

/**
 *
 * Whether or not `key` has been used. Once you call this function, if the key was unused,
 * it will now be used. All keys are reset to unused for each new version of the extension.
 *
 * @param {Logger} logger
 * @param {string} key - Identifier that can be used once forever
 * @returns {Promise<boolean>} Whether or not the key was used
 *
 */
async function isKeyUsedGlobally(logger: Logger, key: string | Keys): Promise<boolean> {
    const { version } = await readPackageJson(logger);

    if (!version) {
        throw new Error('package.json for extension is corrupted!');
    }

    const homeDir = os.homedir();
    const filePath = path.join(homeDir, '.cyfrin', 'vscode', 'keys', `global.json`);

    // Ensure the file exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '{}'); // Initialize with an empty json object
    }

    const store = JSON.parse(fs.readFileSync(filePath).toString());
    logger.info(`${JSON.stringify(store)} read from ${filePath}`);

    if (key in store) {
        logger.info(`${key} not used for ${version}`);
        return true;
    }

    logger.info(`${key} used for ${version}`);
    store[key] = 'USED';
    fs.writeFileSync(filePath, JSON.stringify(store));
    return false;
}

export { isKeyUsed, isKeyUsedGlobally, Keys };
