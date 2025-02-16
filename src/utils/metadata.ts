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
    description: string;
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
            vscode.extensions.getExtension('cyfrinio.aderyn')?.extensionPath;
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

async function readAderynConfigTemplate(logger: Logger): Promise<string> {
    try {
        const extensionPath =
            vscode.extensions.getExtension('cyfrinio.aderyn')?.extensionPath;
        if (!extensionPath) {
            logger.err('Extension path not found');
            const E: ExtensionInfoError = {
                errorType: ExtensionInfoErrorType.ExtensionNotFound,
                payload: 'Extension cyfrin.aderyn not found',
            };
            return Promise.reject(E);
        }

        const aderynTomlTemplatePath = path.join(
            extensionPath,
            'templates',
            'aderyn.toml',
        );
        const content = fs.readFileSync(aderynTomlTemplatePath, 'utf-8');
        return Promise.resolve(content.toString());
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
    readAderynConfigTemplate,
    SupportedAderynVersions,
    ExtensionInfoErrorType,
    ExtensionInfoError,
    ExtensionInfo,
    Explorer,
    Command,
};
