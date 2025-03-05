// Aderyn Version Manager

import { Logger } from '../logger';
import { executeCommand } from '../runtime';

const enum AderynSource {
    LegacyCyfrinupAderyn,
    NodePackageManager,
    NewCyfrinupAtCargoHome,
    HomebrewPackageManager,
}

/**
 * @description Guesses which channel the user has installed aderyn from, based on *where* the binary is placed.
 * It's a very hackly solution
 *
 * @param {Logger} logger
 * @returns {Promise<AderynSource>} It makes a guess how the existing aderyn on $PATH was installed
 * @throws when command doesn't execute successfully or when the source could not be identified
 */
async function whichAderyn(logger: Logger): Promise<AderynSource> {
    const cmd = 'command -v aderyn';
    return executeCommand(cmd)
        .then((stdout) => {
            logger.info(`which aderyn - command output ! ${stdout}`);
            if (
                stdout.includes('nvm') ||
                stdout.includes('node') ||
                stdout.includes('npm')
            ) {
                return Promise.resolve(AderynSource.NodePackageManager);
            } else if (stdout.includes('homebrew') || stdout.includes('linuxbrew')) {
                return Promise.resolve(AderynSource.HomebrewPackageManager);
            } else if (stdout.includes('.cyfrin')) {
                return Promise.resolve(AderynSource.LegacyCyfrinupAderyn);
            } else if (stdout.includes('.cargo')) {
                return Promise.resolve(AderynSource.NewCyfrinupAtCargoHome);
            } else if (
                process.env.CARGO_HOME &&
                stdout.includes(process.env.CARGO_HOME)
            ) {
                return Promise.resolve(AderynSource.NewCyfrinupAtCargoHome);
            } else if (
                process.env.HOMEBREW_PREFIX &&
                stdout.includes(process.env.HOMEBREW_PREFIX)
            ) {
                // https://docs.brew.sh/FAQ#why-should-i-install-homebrew-in-the-default-location
                return Promise.resolve(AderynSource.HomebrewPackageManager);
            }
            return Promise.reject('aderyn installed from unknown source');
        })
        .then((res) => {
            let source = '';
            switch (res) {
                case AderynSource.LegacyCyfrinupAderyn:
                    source = 'legacy cyfrinup';
                    break;
                case AderynSource.NodePackageManager:
                    source = 'npm';
                    break;
                case AderynSource.NewCyfrinupAtCargoHome:
                    source = 'new cyfrinup';
                    break;
                case AderynSource.HomebrewPackageManager:
                    source = 'homebrew';
                    break;
            }
            logger.info(`detected as ${source}`);
            return res;
        })
        .catch((err) => {
            logger.err(`failed to locate which aderyn - ${JSON.stringify(err)}`);
            return Promise.reject(err);
        });
}

async function aderynUpdateIsRecognized(logger: Logger): Promise<boolean> {
    const cmd = 'command -v aderyn-update';
    return executeCommand(cmd)
        .then((stdout) => {
            logger.info(`which aderyn-update - command output ! ${stdout}`);
            return Promise.resolve(true);
        })
        .catch((err) => {
            logger.err(`failed to locate which aderyn - ${JSON.stringify(err)}`);
            return Promise.resolve(false);
        });
}

async function removeAderyn(logger: Logger): Promise<boolean> {
    const commands = [
        'rm $(command -v aderyn)',
        'rm `which aderyn`',
        'rm (command -v adeyrn)',
    ];
    for (const cmd of commands) {
        const worked = await executeCommand(cmd)
            .then((stdout) => {
                logger.info(`removed aderyn - command output ! ${stdout}`);
                return Promise.resolve(true);
            })
            .catch((err) => {
                logger.err(`failed to remove aderyn - ${JSON.stringify(err)}`);
                return Promise.resolve(false);
            });
        if (worked) {
            return Promise.resolve(true);
        }
    }
    return Promise.resolve(false);
}

async function removeAderynUpdate(logger: Logger): Promise<boolean> {
    const commands = [
        'rm $(command -v aderyn-update)',
        'rm `which aderyn-update`',
        'rm (command -v adeyrn-update)',
    ];
    for (const cmd of commands) {
        const worked = await executeCommand(cmd)
            .then((stdout) => {
                logger.info(`removed aderyn-update - command output ! ${stdout}`);
                return Promise.resolve(true);
            })
            .catch((err) => {
                logger.err(`failed to remove aderyn-update - ${JSON.stringify(err)}`);
                return Promise.resolve(false);
            });
        if (worked) {
            return Promise.resolve(true);
        }
    }
    return Promise.resolve(false);
}

/**
 * @description reinstalls aderyn for returning users. do not run this for first time users
 *
 * @param {Logger} logger
 * @param {AderynSource} source
 * @returns {Promise<void>} resolves when installation is succcessful
 * @throws rejects when command execution fails
 */
async function reinstallAderynWithAppropriateCmd(
    logger: Logger,
    source: AderynSource,
): Promise<void> {
    let command: string | undefined;
    let env: Record<string, any> = {};
    if (source == AderynSource.HomebrewPackageManager) {
        // In case of homebrew first, uninstall.
        const commands = [
            'brew uninstall cyfrin/tap/aderyn',
            'brew install cyfrin/tap/aderyn',
        ];
        logger.info(`running command for warming brew installation - ${command}`);
        // https://docs.brew.sh/Manpage#environment
        let env = {
            HOMEBREW_NO_AUTO_UPDATE: 1,
            HOMEBREW_NO_INSTALL_CLEANUP: 1,
        };
        await executeCommand('brew cleanup -s aderyn', env).catch((err) => {
            const error = `failed in brew cleanup aderyn (soft error) - ${JSON.stringify(err)}`;
            logger.err(error);
            return Promise.resolve();
        });
        for (const command of commands) {
            await executeCommand(command, env).catch((err) => {
                const error = `failed to re-install aderyn - ${JSON.stringify(err)}`;
                logger.err(error);
                return Promise.reject(command);
            });
        }
    } else {
        switch (source) {
            case AderynSource.LegacyCyfrinupAderyn:
                command = 'cyfrinup aderyn';
                break;
            case AderynSource.NodePackageManager:
                command = 'npm install -g @cyfrin/aderyn';
                break;
            case AderynSource.NewCyfrinupAtCargoHome:
                // A distinct binary whose job is to update aderyn. Only shipped with cURL installation
                command = 'aderyn-update';
                break;
        }
        logger.info(`running command for re-installation - ${command}`);
        return executeCommand(command, env)
            .then((/*stdout*/) => {
                // Usually, when installation is successful, warnings are emitted to stderr, NOT stdin
                // So there's no point in logging stdout which is most likely empty
                return Promise.resolve();
            })
            .catch((err) => {
                const error = `failed to re-install aderyn - ${JSON.stringify(err)}`;
                logger.err(error);
                return Promise.reject(command);
            });
    }
}

/**
 * @description Sechdules the deletion of ~/.cyfrin/bin/aderyn (old cyfrinup) this is so it doesn't shadow the newly installed aderyn
 * It only happens automatically when cyfrinup is used
 *
 * @param {Logger} logger
 * @returns {Promise<void>} resolves when fail-safe removal is succcessful (even if the file doesn't exist)
 */
async function removeAderynFromLegacyLocationIfPresent(logger: Logger): Promise<void> {
    // TODO: Check if ~/ is actually $HOME
    return executeCommand('rm -f ~/.cyfrin/bin/aderyn')
        .then(() => {
            return Promise.resolve();
        })
        .catch((err) => {
            const error = `failed to silently fail >o-o< when removing old aderyn - ${JSON.stringify(err)}`;
            logger.err(error);
            return Promise.reject(error);
        });
}

const enum InstallationChannel {
    NodePackageManager,
    HomebrewPackageManager,
    Curl,
}

/**
 * @description For new users, find an installation channel
 * @param {Logger} logger
 * @returns {Promise<InstallationChannel>} a channel that is ready to install aderyn in the given env.
 * @throws rejects when neither npm, brew nor curl is installed.
 */
async function findMostAppropriateInstallationChannel(
    logger: Logger,
): Promise<InstallationChannel> {
    const preferences = ['npm', 'brew', 'curl'] as const;
    return new Promise(async (resolve, reject) => {
        for (const channel of preferences) {
            const checkCmd = `command -v ${channel}`;
            // Check serially
            await executeCommand(checkCmd)
                .then(() => {
                    logger.info(`Installation channel found ${channel}`);
                    switch (channel) {
                        case 'npm':
                            resolve(InstallationChannel.NodePackageManager);
                            break;
                        case 'brew':
                            resolve(InstallationChannel.HomebrewPackageManager);
                            break;
                        case 'curl':
                            resolve(InstallationChannel.Curl);
                            break;
                    }
                })
                .catch(() => reject('No installation channel found'));
        }
    });
}

/**
 * @description install aderyn assuming there is no "aderyn" available already on $PATH
 * @param {Logger} logger
 * @param {InstallationChannel} channel
 * @returns {Promise<void>} resolves when installation is successful. After this developer must
 * make a check to cross-check that aderyn is installed
 */
async function installAderynWithAppropriateCmd(
    logger: Logger,
    channel: InstallationChannel,
): Promise<void> {
    let command: string | undefined;
    let env: Record<string, any> = {};
    switch (channel) {
        case InstallationChannel.NodePackageManager:
            command = 'npm install -g @cyfrin/aderyn';
            break;
        case InstallationChannel.HomebrewPackageManager:
            command = 'brew install cyfrin/tap/aderyn';
            // https://docs.brew.sh/Manpage#environment
            env['HOMEBREW_NO_AUTO_UPDATE'] = 1;
            env['HOMEBREW_NO_INSTALL_CLEANUP'] = 1;
            break;
        case InstallationChannel.Curl:
            // Call the same script that cyfrinup calls
            const HOST = 'https://raw.githubusercontent.com';
            const DYNAMIC_SCRIPT = `${HOST}/Cyfrin/aderyn/master/cyfrinup/dynamic_script`;
            command = `curl --proto '=https' --tlsv1.2 -LsSf ${DYNAMIC_SCRIPT} | sh`;
            break;
    }
    logger.info(`running command for installation - ${command}`);
    return executeCommand(command, env)
        .then((stdout) => {
            logger.info(`output of aderyn installation - ${JSON.stringify(stdout)}`);
            return Promise.resolve();
        })
        .catch((err) => {
            const error = `failed to re-install aderyn - ${JSON.stringify(err)}`;
            logger.err(error);
            return Promise.reject(command);
        });
}

export {
    whichAderyn,
    aderynUpdateIsRecognized,
    removeAderyn,
    removeAderynUpdate,
    installAderynWithAppropriateCmd,
    reinstallAderynWithAppropriateCmd,
    removeAderynFromLegacyLocationIfPresent,
    findMostAppropriateInstallationChannel,
    AderynSource,
    InstallationChannel,
};
