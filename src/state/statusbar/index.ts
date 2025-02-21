import * as vscode from 'vscode';
import { StatusIcon } from './variants';
import { registerStatusBarItems } from './registrations';
import { showAderynStatusOff, showAderynStatusOn, hideAderynStatus } from './mechanics';

function createStatusBarItem(statusIcon: StatusIcon): vscode.StatusBarItem {
    switch (statusIcon) {
        case StatusIcon.AderynServer:
            return vscode.window.createStatusBarItem(
                vscode.StatusBarAlignment.Right,
                100,
            );
    }
}

export {
    StatusIcon,
    createStatusBarItem,
    registerStatusBarItems,
    showAderynStatusOn,
    showAderynStatusOff,
    hideAderynStatus,
};
