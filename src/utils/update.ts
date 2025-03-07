// Run periodic checks to see if there's an update to aderyn available. If yes, invite the user to visit
// the welcome page. [Update] or [Remind Me Later]

import * as vscode from 'vscode';
import { Logger } from './logger';
import { isAderynAvailableOnPath } from './install/aderyn';
import {
    latestAderynVersionOnGithub,
    areAderynVersionsEqual,
    getLocalAderynVersion,
} from './install/versions';
import { EditorCmd } from '../commands/variants';

async function updateIsAvailable(logger: Logger): Promise<boolean> {
    const isOnPath = await isAderynAvailableOnPath(logger);
    if (!isOnPath) {
        return false;
    }
    try {
        const latestAderynVersion = await latestAderynVersionOnGithub(logger);
        const existingAderynVersion = await getLocalAderynVersion(logger);
        return !areAderynVersionsEqual(latestAderynVersion, existingAderynVersion);
    } catch (_) {
        return false;
    }
}

const enum UserAction {
    YES = 'Yes',
    LATER = 'Remind me later',
    NO = 'Undefined', // When the user closes the notification
}

async function promptUserToUpdate(): Promise<UserAction> {
    return vscode.window
        .showInformationMessage(
            "Aderyn's core tool has an update used by the extension. Update now?",
            UserAction.YES,
            UserAction.LATER,
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

async function startPeriodicChecks() {
    const action = async () => {
        const can = await updateIsAvailable(new Logger());
        if (can) {
            const action = await promptUserToUpdate();
            if (action == UserAction.YES || action == UserAction.NO) {
                clearInterval(intervalId);
            }
        }
    };
    const TIME_PERIOD = 15 * 60 * 1000; // 15 minutes
    const intervalId = setInterval(action, TIME_PERIOD);
}

export { startPeriodicChecks };
