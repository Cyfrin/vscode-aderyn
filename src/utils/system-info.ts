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

//Function to execute a shell command and return it as a promise
function executeCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${stderr}`);
            } else {
                resolve(stdout.trim());
            }
        });
    });
}

export { getSystemInfo, executeCommand };
