// Run a initial check to see if aderyn was never installed in the user's syem. If yes, invite the user to visit
// the welcome page. [Install] or [Disable check]

import * as vscode from 'vscode';
import { Logger } from './logger';
import { isAderynAvailableOnPath } from './install/aderyn';
import { getLocalAderynVersion } from './install/versions';
import { EditorCmd } from '../commands/variants';

async function needsAderynInstallation(logger: Logger): Promise<boolean> {
    // Check for non availability on path
    const isOnPath = await isAderynAvailableOnPath(logger);
    if (!isOnPath) {
        return true;
    }

    // Check for corrupted version
    try {
        await getLocalAderynVersion(logger);
    } catch (_) {
        return true;
    }

    // All good
    return false;
}

const enum UserAction {
    YES = 'Install',
    DISABLE = 'Disable Check',
    NO = 'Undefined', // When the user closes the notification
}

async function promptUserToInstall(): Promise<UserAction> {
    return vscode.window
        .showInformationMessage(
            'Aderyn was not installed successfully. Install now?',
            UserAction.YES,
            UserAction.DISABLE,
        )
        .then((selectedAction) => {
            if (!selectedAction) {
                return UserAction.NO;
            }
            if (selectedAction === UserAction.YES) {
                vscode.commands.executeCommand(EditorCmd.ShowOnboardPanel);
            }
            return selectedAction;
        });
}

async function startInstallationOneTimeCheck() {
    const config = vscode.workspace.getConfiguration('aderyn.config');
    const userPrefersAutoHealthCheck = config.get<boolean>('autoCheckHealth');

    const action = async () => {
        try {
            const needs = await needsAderynInstallation(new Logger());
            if (needs) {
                const action = await promptUserToInstall();
                if (action == UserAction.DISABLE) {
                    vscode.commands.executeCommand(EditorCmd.OpenSettings);
                }
            }
        } catch (_ex) {
            // no-op
        }
    };
    const TIME_PERIOD = 60 * 1000; // 1 minute
    if (userPrefersAutoHealthCheck) {
        setTimeout(action, TIME_PERIOD);
    }
}

export { startInstallationOneTimeCheck };
