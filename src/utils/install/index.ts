import { Logger } from '../logger';
import { readPackageJson } from '../metadata';
import { hasReliableInternet } from '../runtime';
import { isAderynAvailableOnPath } from './aderyn';
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
    FailedToFetchLatestAderynVersion = 'Failed to connect to Github to fetch latest aderyn version',
    FailedToDetectLocalAderynVersion = 'Failed to detect local aderyn version',
    UnableToFetchExtensionMetadata = 'Unable to fetch extension metadata',
    ExtensionIsTooOld = 'Extension is too old, must be upgraded to support latest aderyn',
    FailedToDetectAderynSource = 'Failed to detect installation source for the exisitng aderyn',
    NoInstallationChannel = 'Failed to find tools for installation - no npm, brew or curl!',
    UknownReason = 'Failed due to uknown reason',
    FailedToRemoveLegacyBinary = 'Failed to remove legacy binary',

    // NOTE: These are not used, it's just for documentation. Instead a dynamic error message is displayed
    ReinstallationError = 'REINSTALLATION_ERROR',
    InstallationError = 'INSTALLATION_ERROR',
}

async function ensureAderynIsInstalled(): Promise<void> {
    const logger = new Logger();

    const isOnline = await hasReliableInternet(logger);

    if (!isOnline) {
        throw new Error(AderynInstallationErrorType.NoReliableInternet);
    }

    const isOnPath = await isAderynAvailableOnPath(logger);

    const latestAderynVersion = await latestAderynVersionOnGithub(logger).catch(() => {
        throw new Error(AderynInstallationErrorType.FailedToFetchLatestAderynVersion);
    });

    if (isOnPath) {
        const existingAderynVersion = await getLocalAderynVersion(logger).catch(() => {
            throw new Error(AderynInstallationErrorType.FailedToDetectLocalAderynVersion);
        });

        if (areAderynVersionsEqual(latestAderynVersion, existingAderynVersion)) {
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
                        AderynInstallationErrorType.FailedToDetectLocalAderynVersion,
                    );
                },
            );

            if (areAderynVersionsEqual(latestAderynVersion, existingAderynVersion)) {
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
                            AderynInstallationErrorType.FailedToDetectLocalAderynVersion,
                        );
                    },
                );

                if (areAderynVersionsEqual(latestAderynVersion, existingAderynVersion)) {
                    // NOTE: OK - no need to do anything more
                    return Promise.resolve();
                }

                throw new Error(AderynInstallationErrorType.UknownReason);
            }
        } else {
            throw new Error(AderynInstallationErrorType.ExtensionIsTooOld);
        }
    } else {
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
                        AderynInstallationErrorType.FailedToDetectLocalAderynVersion,
                    );
                },
            );

            if (areAderynVersionsEqual(latestAderynVersion, existingAderynVersion)) {
                // NOTE: OK - no need to do anything more
                return Promise.resolve();
            } else {
                throw new Error(AderynInstallationErrorType.UknownReason);
            }
        } else {
            throw new Error(AderynInstallationErrorType.ExtensionIsTooOld);
        }
    }
}

export { ensureAderynIsInstalled };
