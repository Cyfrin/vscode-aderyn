import { exec } from 'child_process';

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
async function executeCommand(command: string, timeoutMilli?: number): Promise<string> {
    return new Promise((resolve, reject) => {
        const controller = new AbortController();
        const { signal } = controller;
        exec(command, { signal }, (error, stdout, stderr) => {
            if (error) {
                const E: ExecuteCommandError = {
                    errorType: ExecuteCommandErrorType.BadCommandExitStatus,
                    payload: stderr,
                };
                reject(E);
            } else {
                resolve(stdout.trim());
            }
        });
        if (timeoutMilli) {
            const E: ExecuteCommandError = {
                errorType: ExecuteCommandErrorType.BadCommandExitStatus,
            };
            setTimeout(() => reject(E), timeoutMilli);
        }
    });
}

export { getSystemInfo, executeCommand, ExecuteCommandError, ExecuteCommandErrorType };
