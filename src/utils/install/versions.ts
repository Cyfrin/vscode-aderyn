import { executeCommand } from '../runtime';
import { Logger } from '../logger';
import { SupportedAderynVersions } from '../metadata';

/**
 * Can be -
 * Representation of the stdout following `aderyn --version`
 * Representation of the latest aderun version available on Github
 */
type AderynVersion = {
    major: number;
    minor: number;
    patch: number;
};

/**
 * Returns true if the two versions are an exact match
 * @param {AderynVersion} u
 * @param {AderynVersion} v
 * @returns {boolean}
 */
function areAderynVersionsEqual(u: AderynVersion, v: AderynVersion): boolean {
    return u.major == v.major && u.minor == v.minor && u.patch == v.patch;
}

/**
 * Returns true if the extension's version can support the latest aderyn version
 * @param {AderynVersion} cliAderynVersion
 * @param {SupportedAderynVersions} extensionSupportedAderynVersions
 * @returns {boolean}
 */
function isAderynVersionCompatibleWithSupportedAderynVersions(
    cliAderynVersion: AderynVersion,
    extensionSupportedAderynVersions: SupportedAderynVersions,
): boolean {
    const { major, minor } = extensionSupportedAderynVersions;
    return cliAderynVersion.major == major && cliAderynVersion.minor == minor;
}

/**
 * Gets the version of aderyn that is currently available in the sysem
 * @param {Logger} logger
 * @returns {Promise<AderynVersion>}
 */
async function getLocalAderynVersion(logger: Logger): Promise<AderynVersion> {
    const cmd = 'aderyn --version';
    return executeCommand(cmd)
        .then(async (stdout) => {
            logger.info(`checking local aderyn version - ${stdout}`);
            // Sample stdout example -
            // aderyn 0.4.0
            const [_, version] = stdout.split(' ');
            const [_major, _minor, _patch] = version.split('.');
            const [major, minor, patch] = [_major, _minor, _patch].map(Number);
            const aderynCliVersion: AderynVersion = { major, minor, patch };
            return Promise.resolve(aderynCliVersion);
        })
        .catch((err) => {
            logger.err(`checking local aderyn version failed - ${JSON.stringify(err)}`);
            return Promise.reject(err);
        });
}

/**
 * Gets the latest version of aderyn that is currently available on Github
 * @param {Logger} logger
 * @returns {Promise<AderynVersion>}
 * @throws rejects when the response from Github API is not as we assumed or when
 * fetch is not successful
 */
async function latestAderynVersionOnGithub(logger: Logger): Promise<AderynVersion> {
    const URL = 'https://api.github.com/repos/Cyfrin/aderyn/releases/latest';
    interface PartialGithubResponse {
        tag_name: string;
    }
    return fetch(URL)
        .then((response) => response.json() as Promise<PartialGithubResponse>)
        .then((response) => {
            if (!('tag_name' in response)) {
                const err = 'response did not contain tag_name key';
                logger.err(err);
                return Promise.reject(err);
            }
            // Sample value for tag_name - aderyn-v0.4.0
            const [_, version] = response['tag_name'].split('v');
            const [_major, _minor, _patch] = version.split('.');
            const [major, minor, patch] = [_major, _minor, _patch].map(Number);
            const aderynCliVersion: AderynVersion = { major, minor, patch };
            logger.info(
                `checking latest aderyn version on Github - ${JSON.stringify(aderynCliVersion)}`,
            );
            return Promise.resolve(aderynCliVersion);
        })
        .catch((err) => {
            logger.err(`checking latest aderyn version on Github failed - ${err}`);
            return Promise.reject(err);
        });
}

export {
    getLocalAderynVersion,
    latestAderynVersionOnGithub,
    areAderynVersionsEqual,
    isAderynVersionCompatibleWithSupportedAderynVersions,
    AderynVersion,
};
