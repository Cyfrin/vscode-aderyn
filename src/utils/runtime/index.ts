import * as system from './system';
import * as project from './project';

import { ExecuteCommandErrorType, ExecuteCommandError, SystemInfo } from './system';

const { getSystemInfo, executeCommand, hasReliableInternet, isWindowsNotWSL } = system;
const {
    findProjectRoot,
    hasRecognizedProjectStructureAtWorkspaceRoot,
    ensureWorkspacePreconditionsMetAndReturnProjectURI,
    someSolidityProjectExists1LevelDeepFromWorkspaceRoot,
    aderynTomlAtWorkspaceRootHasNonDefaultRootValue,
    parseAderynConfig,
} = project;

import { AderynConfig } from './project';

export {
    findProjectRoot,
    getSystemInfo,
    executeCommand,
    hasReliableInternet,
    isWindowsNotWSL,
    hasRecognizedProjectStructureAtWorkspaceRoot,
    ensureWorkspacePreconditionsMetAndReturnProjectURI,
    someSolidityProjectExists1LevelDeepFromWorkspaceRoot,
    aderynTomlAtWorkspaceRootHasNonDefaultRootValue,
    parseAderynConfig,
    AderynConfig,
    SystemInfo,
    ExecuteCommandError,
    ExecuteCommandErrorType,
};
