import * as vscode from 'vscode';
import { workspace } from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
// import { exec } from "child_process";

import { LanguageClient, LanguageClientOptions, ServerOptions } from 'vscode-languageclient/node';

const enum AderynCommands {
    RestartServer = 'aderyn.restartServer',
}

let client: LanguageClient | undefined;

export async function activate(context: vscode.ExtensionContext) {
    const restartCommand = vscode.commands.registerCommand(
        AderynCommands.RestartServer,
        async () => {
            if (!client) {
                vscode.window.showErrorMessage('aderyn client not found');
                return;
            }

            try {
                if (client.isRunning()) {
                    await client.restart();
                    vscode.window.showInformationMessage('aderyn server restarted.');
                } else {
                    await client.start();
                }
            } catch (err) {
                client.error('Restarting client failed', err, 'force');
            }
        },
    );

    context.subscriptions.push(restartCommand);
    client = await createLanguageClient();
    client?.start();
}

// this method is called when your extension is deactivated
export function deactivate(): Thenable<void> | undefined {
    return client?.stop();
}

async function createLanguageClient(): Promise<LanguageClient | undefined> {
    let commandNotFound = false;
    const command = (await getAderynCommand().catch(() => {
        const message = `Could not find aderyn on your system. Please ensure it is available
      on the PATH used by VS Code. Read installation guide https://github.com/cyfrin/aderyn`;
        vscode.window.showErrorMessage(message);
        commandNotFound = true;
    })) as string;

    vscode.window.showInformationMessage(command);

    if (commandNotFound) {
        return;
    }

    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: '*' }],
        synchronize: {
            fileEvents: [workspace.createFileSystemWatcher('**/*')],
        },
    };

    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders || workspaceFolders.length == 0) {
        const message = `No workspace is open yet. Please do that and then \`Restart Aderyn Server\``;
        vscode.window.showInformationMessage(message);
        return;
    }

    const projectRootName = workspaceFolders[0].name;
    let projectRootUri = workspaceFolders[0].uri.toString().substring('file://'.length);

    if (workspaceFolders.length > 1) {
        const message = `More than 1 open workspace detected. Aderyn will only run on ${projectRootName}`;
        vscode.window.showInformationMessage(message);
        return;
    }

    const getServerOptions = (projectRootUri: string) => {
        let actualProjectRootUri = findProjectRoot(projectRootUri);
        if (process.env.NODE_ENV === 'development') {
            let URL;
            try {
                URL = fs.readFileSync(path.join(__dirname, '../manifest'));
            } catch (ex) {
                vscode.window.showErrorMessage(
                    'File manifest not found. Read manifest.sample please!',
                );
            }
            vscode.window.showInformationMessage(`DEBUG MODE: ${actualProjectRootUri}`);
            return {
                command: 'cargo',
                args: [
                    'run',
                    '--quiet',
                    '--manifest-path',
                    URL,
                    '--',
                    actualProjectRootUri,
                    '--lsp',
                    '--stdout',
                ],
                options: {
                    env: process.env,
                },
            };
        }
        return {
            command,
            args: [actualProjectRootUri, '--lsp', '--stdout'],
            options: {
                env: process.env,
            },
        };
    };

    return new LanguageClient(
        'aderyn_language_server',
        'Aderyn Language Server',
        getServerOptions(projectRootUri) as ServerOptions,
        clientOptions,
    );
}

// This will make sure that even if the user opens a subfolder of the solidity project, the server will still be started
// succesfully because we use the nearest parent that is a git folder heuristic to know where the project root is.
function findProjectRoot(projectRootUri: string): string | null {
    let currentDir = projectRootUri;
    while (currentDir !== path.parse(currentDir).root) {
        if (
            fs.existsSync(path.join(currentDir, '.git')) ||
            fs.existsSync(path.join(currentDir, 'foundry.toml')) ||
            fs.existsSync(path.join(currentDir, 'aderyn.toml')) ||
            fs.existsSync(path.join(currentDir, 'hardhat.config.ts')) ||
            fs.existsSync(path.join(currentDir, 'hardhat.config.js'))
        ) {
            return currentDir;
        }
        currentDir = path.dirname(currentDir);
    }
    return projectRootUri;
}

async function getAderynCommand(): Promise<string> {
    return 'aderyn';
}

// interface SystemInfo {
//   systemName: string;
//   machineName: string;
// }

// async function getSystemInfo(): Promise<SystemInfo> {
//   const fullSystemName = (await executeCommand("uname -a")).trim();
//   const machineName = (await executeCommand("uname -m")).trim();
//   const systemName = fullSystemName.substring(0, fullSystemName.indexOf(" "));
//   return { systemName, machineName };
// }

// Function to execute a shell command and return it as a promise
// function executeCommand(command: string): Promise<string> {
//   return new Promise((resolve, reject) => {
//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         reject(`Error: ${stderr}`);
//       } else {
//         resolve(stdout.trim());
//       }
//     });
//   });
// }
