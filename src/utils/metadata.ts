import * as vscode from 'vscode';
import path from 'path';
import fs from 'fs';
import { Logger } from './logger';

interface Explorer {
    type: 'webview' | string;
    id: string;
    name: string;
}

interface Command {
    command: string;
    title: string;
    category: string;
}

/*
 * The expectation is that the extension will handle all the new patched versions
 * without requiring an update.
 */
interface SupportedAderynVersions {
    major: number;
    minor: number;
}

interface ExtensionInfo {
    name: string;
    version: string;
    supportedAderynVersions: SupportedAderynVersions;
    contributes: {
        views: {
            explorer: Explorer[];
        };
        commands: Command[];
    };
}

const enum ExtensionInfoErrorType {
    ExtensionNotFound,
    ErrorReadingFile,
}

type ExtensionInfoError = {
    errorType: ExtensionInfoErrorType;
    payload?: string;
};

async function readPackageJson(logger: Logger): Promise<ExtensionInfo> {
    try {
        const extensionPath =
            vscode.extensions.getExtension('cyfrin.aderyn')?.extensionPath;
        if (!extensionPath) {
            logger.err('Extension path not found');
            const E: ExtensionInfoError = {
                errorType: ExtensionInfoErrorType.ExtensionNotFound,
                payload: 'Extension cyfrin.aderyn not found',
            };
            return Promise.reject(E);
        }

        const packageJsonPath = path.join(extensionPath, 'package.json');
        const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
        const packageJson: ExtensionInfo = JSON.parse(packageJsonContent);
        logger.info(`Package json ${JSON.stringify(packageJson)}`);
        return Promise.resolve(packageJson);
    } catch (error) {
        logger.err(`Error reading package.json: ${error}`);
        const E: ExtensionInfoError = {
            errorType: ExtensionInfoErrorType.ErrorReadingFile,
            payload: `cyfrin.aderyn package.json file could not be read - ${error}`,
        };
        return Promise.reject(E);
    }
}

export {
    readPackageJson,
    SupportedAderynVersions,
    ExtensionInfoErrorType,
    ExtensionInfoError,
    ExtensionInfo,
    Explorer,
    Command,
};
