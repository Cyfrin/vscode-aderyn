import { Logger } from '../logger';
import { readPackageJson } from '../metadata';
import { hasReliableInternet } from '../runtime';
import { isAderynAvailableOnPath, createAderynReportAndDeserialize } from './aderyn';
import {
    whichAderyn,
    installAderynWithAppropriateCmd,
    reinstallAderynWithAppropriateCmd,
    removeAderynFromLegacyLocationIfPresent,
    findMostAppropriateInstallationChannel,
} from './avm';
import {
    getLocalAderynVersion,
    latestAderynVersionOnGithub,
    areAderynVersionsEqual,
    isAderynVersionCompatibleWithSupportedAderynVersions as extensionIsCompatible,
} from './versions';

/*
 *
 * NOTE: These messages will be displayed in the UI
 *
 */
enum AderynInstallationErrorType {
    NoReliableInternet = 'No reliable internet connection',
    FailedToFetchLatestAderynVersion = 'Failed to connect to Github to fetch latest aderyn version. Restart your router.',
    FailedToDetectLocalAderynVersion = 'Failed to detect local aderyn version',
    FailedToCrossCheckAderynVersion = 'Failed to cross check aderyn installation',
    UnableToFetchExtensionMetadata = 'Unable to fetch extension metadata',
    FailedToClearCorruptedInstallation = 'Failed to clear corrupted legacy installation',
    ExtensionIsTooOld = 'Extension is too old, must be upgraded to support latest aderyn',
    FailedToDetectAderynSource = 'Failed to detect installation source for the exisitng aderyn',
    NoInstallationChannel = 'Failed to find tools for installation - no npm, brew or curl!',
    UknownReason = 'Failed due to uknown reason',
    FailedToRemoveLegacyBinary = 'Failed to remove legacy binary',

    // NOTE: These are not used, it's just for documentation. Instead a dynamic error message is displayed
    ReinstallationError = 'REINSTALLATION_ERROR',
    InstallationError = 'INSTALLATION_ERROR',
}

// STEP 1
async function ensureHealthyInternet() {
    const logger = new Logger();

    const isOnline = await hasReliableInternet(logger);

    if (!isOnline) {
        throw new Error(AderynInstallationErrorType.NoReliableInternet);
    }
}

// STEP 2
async function clearCorruptedInstallation() {
    const logger = new Logger();

    const isOnPath = await isAderynAvailableOnPath(logger);

    if (isOnPath) {
        // In case of corrupted aderyn (or) old version that threw GLIBC incomaptible errors,
        // the --version option will fail. In that case, we're better off deleting that to
        // do a fresh install.
        //
        // Also, this error is only expected in the legacy versions of the releases.
        // So we're conservative in choosing when to delete the binary
        await getLocalAderynVersion(logger).catch(async () => {
            await removeAderynFromLegacyLocationIfPresent(logger).catch(() => {
                throw new Error(
                    AderynInstallationErrorType.FailedToClearCorruptedInstallation,
                );
            });
        });
    }
}

// STEP 3
async function ensureAderynIsInstalled(): Promise<void> {
    const logger = new Logger();

    const isOnPath = await isAderynAvailableOnPath(logger);

    const latestAderynVersion = await latestAderynVersionOnGithub(logger).catch(() => {
        throw new Error(AderynInstallationErrorType.FailedToFetchLatestAderynVersion);
    });

    if (isOnPath) {
        const existingAderynVersion = await getLocalAderynVersion(logger).catch(() => {
            throw new Error(AderynInstallationErrorType.FailedToDetectLocalAderynVersion);
        });

        if (areAderynVersionsEqual(latestAderynVersion, existingAderynVersion)) {
            logger.info('Resolving promise for ensuring aderyn installation');
            // NOTE: OK - no need to do anything more
            return Promise.resolve();
        }

        const { supportedAderynVersions } = await readPackageJson(logger).catch(() => {
            throw new Error(AderynInstallationErrorType.UnableToFetchExtensionMetadata);
        });

        if (extensionIsCompatible(latestAderynVersion, supportedAderynVersions)) {
            const source = await whichAderyn(logger).catch(() => {
                throw new Error(AderynInstallationErrorType.FailedToDetectAderynSource);
            });

            await reinstallAderynWithAppropriateCmd(logger, source).catch((command) => {
                throw new Error(`Failed to upgrade Aderyn - ${command}`);
            });

            // Cross check after installation
            const existingAderynVersion = await getLocalAderynVersion(logger).catch(
                () => {
                    throw new Error(
                        AderynInstallationErrorType.FailedToCrossCheckAderynVersion,
                    );
                },
            );

            if (areAderynVersionsEqual(latestAderynVersion, existingAderynVersion)) {
                logger.info('Resolving promise for ensuring aderyn installation');
                // NOTE: OK - no need to do anything more
                return Promise.resolve();
            } else {
                await removeAderynFromLegacyLocationIfPresent(logger).catch(() => {
                    throw new Error(
                        AderynInstallationErrorType.FailedToRemoveLegacyBinary,
                    );
                });

                const existingAderynVersion = await getLocalAderynVersion(logger).catch(
                    () => {
                        throw new Error(
                            AderynInstallationErrorType.FailedToCrossCheckAderynVersion,
                        );
                    },
                );

                if (areAderynVersionsEqual(latestAderynVersion, existingAderynVersion)) {
                    logger.info('Resolving promise for ensuring aderyn installation');
                    // NOTE: OK - no need to do anything more
                    return Promise.resolve();
                }

                throw new Error(AderynInstallationErrorType.UknownReason);
            }
        } else {
            throw new Error(AderynInstallationErrorType.ExtensionIsTooOld);
        }
    } else {
        logger.info('Newly installing aderyn');

        const { supportedAderynVersions } = await readPackageJson(logger).catch(() => {
            throw new Error(AderynInstallationErrorType.UnableToFetchExtensionMetadata);
        });

        if (extensionIsCompatible(latestAderynVersion, supportedAderynVersions)) {
            // First time installation
            const installationChannel = await findMostAppropriateInstallationChannel(
                logger,
            ).catch(() => {
                throw new Error(AderynInstallationErrorType.NoInstallationChannel);
            });

            await installAderynWithAppropriateCmd(logger, installationChannel).catch(
                (command) => {
                    throw new Error(`Failed to install Aderyn - ${command}`);
                },
            );
            // Cross check after installation
            const existingAderynVersion = await getLocalAderynVersion(logger).catch(
                () => {
                    throw new Error(
                        AderynInstallationErrorType.FailedToCrossCheckAderynVersion,
                    );
                },
            );

            if (areAderynVersionsEqual(latestAderynVersion, existingAderynVersion)) {
                logger.info('Resolving promise for ensuring aderyn installation');
                // NOTE: OK - no need to do anything more
                return Promise.resolve();
            }

            throw new Error(AderynInstallationErrorType.UknownReason);
        } else {
            throw new Error(AderynInstallationErrorType.ExtensionIsTooOld);
        }
    }
}

export {
    ensureHealthyInternet,
    ensureAderynIsInstalled,
    createAderynReportAndDeserialize,
    clearCorruptedInstallation,
};
