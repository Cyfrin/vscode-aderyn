import * as vscode from 'vscode';
import { EditorCmd } from '../commands/variants';
import { autoStartLspClientIfRequested } from './auto-start-lsp';
import { hasCompatibleAderynVersionLocally } from './install/index';
import { Logger } from './logger';
import {
    aderynTomlAtWorkspaceRootHasNonDefaultRootValue,
    hasRecognizedProjectStructureAtWorkspaceRoot,
    someSolidityProjectExists1LevelDeepFromWorkspaceRoot,
} from './runtime/project';

async function suggestAderynTomlIfProjectIsNested() {
    if (!hasRecognizedProjectStructureAtWorkspaceRoot()) {
        try {
            if (await hasCompatibleAderynVersionLocally(new Logger())) {
                if (someSolidityProjectExists1LevelDeepFromWorkspaceRoot()) {
                    vscode.window
                        .showInformationMessage(
                            'Aderyn needs to create a config file to work in this project. Create now?',
                            'Yes',
                            'No',
                        )
                        .then((selectedAction) => {
                            if (selectedAction == 'Yes') {
                                vscode.commands
                                    .executeCommand(EditorCmd.InitConfigFile)
                                    .then(async () => {
                                        // Try to restart the diagnostics server now if the `root` value is not `.`
                                        if (
                                            await aderynTomlAtWorkspaceRootHasNonDefaultRootValue()
                                        ) {
                                            // TODO: test this part
                                            await autoStartLspClientIfRequested(true);
                                        }
                                    });
                            }
                        });
                }
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

export { suggestAderynTomlIfProjectIsNested };
