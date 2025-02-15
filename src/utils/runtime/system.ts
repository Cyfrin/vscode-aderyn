import { exec } from 'child_process';
import * as https from 'https';
import { Logger } from '../logger';

interface SystemInfo {
    systemName: string;
    machineName: string;
}

async function getSystemInfo(): Promise<SystemInfo> {
    const fullSystemName = (await executeCommand('uname -a')).trim();
    const machineName = (await executeCommand('uname -m')).trim();
    const systemName = fullSystemName.substring(0, fullSystemName.indexOf(' '));
    return { systemName, machineName };
}

const enum ExecuteCommandErrorType {
    BadCommandExitStatus,
    Timeout,
}

type ExecuteCommandError = {
    errorType: ExecuteCommandErrorType;
    payload?: string;
};

//Function to execute a shell command and return it as a promise
async function executeCommand(
    command: string,
    env?: Record<string, any>,
    timeoutMilli?: number,
): Promise<string> {
    return new Promise((resolve, reject) => {
        const controller = new AbortController();
        const { signal } = controller;
        exec(
            command,
            { signal, env: { ...process.env, ...env } },
            (error, stdout, stderr) => {
                if (error) {
                    const E: ExecuteCommandError = {
                        errorType: ExecuteCommandErrorType.BadCommandExitStatus,
                        payload: stderr,
                    };
                    reject(E);
                } else {
                    resolve(stdout.trim());
                }
            },
        );
        if (timeoutMilli) {
            const E: ExecuteCommandError = {
                errorType: ExecuteCommandErrorType.BadCommandExitStatus,
            };
            setTimeout(() => reject(E), timeoutMilli);
        }
    });
}

async function hasReliableInternet(logger: Logger): Promise<boolean> {
    return new Promise((resolve) => {
        https
            .get('https://www.google.com', { timeout: 3000 }, (res) => {
                logger.info('has reliable internet connection');
                resolve(res.statusCode === 200);
            })
            .on('error', (err) => {
                logger.err(`no reliable internet connection - ${err}`);
                resolve(false);
            });
    });
}

export {
    getSystemInfo,
    executeCommand,
    hasReliableInternet,
    SystemInfo,
    ExecuteCommandError,
    ExecuteCommandErrorType,
};
