import { startServing, stopServingIfOn } from '../state/index';
import * as vscode from 'vscode';
import { hasRecognizedProjectStructureAtWorkspaceRoot } from './runtime/project';
import { hasCompatibleAderynVersionLocally } from './install/index';
import { Logger } from './logger';

async function autoStartLspClientIfRequested() {
    const config = vscode.workspace.getConfiguration('aderyn.config');
    const userPrefersAutoStart = config.get<boolean>('autoStart');
    if (userPrefersAutoStart && hasRecognizedProjectStructureAtWorkspaceRoot()) {
        try {
            if (await hasCompatibleAderynVersionLocally(new Logger())) {
                await stopServingIfOn();
                await startServing();
            }
        } catch (_ex) {
            // NOTE: bails without error if aderyn is not installed
            // no-op
            // In case of failure at auto start, do not throw an exception.
            // This is because, maybe the user is still onboarding, or aderyn.toml is not set,
            // or foundry project is not yet initialized, etc.
            // Of course, if on the other hand, user explicitly requests to start Aderyn and
            // then it fails, we must throw an exception.
        }
    }
}

export { autoStartLspClientIfRequested };
