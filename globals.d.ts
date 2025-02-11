import * as _vscode from 'vscode';

declare global {
    const clientVscode: {
        postMessage: ({ command: string, value: any }) => void;
    };
}
