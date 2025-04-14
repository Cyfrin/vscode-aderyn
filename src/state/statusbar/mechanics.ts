// Aderyn Server ---

import { EditorCmd } from '../../commands/variants';
import { aderynStatusItem, setAderynLSPLoading } from '../index';

function showAderynStatusOn() {
    if (!aderynStatusItem) {
        throw new Error('Uninitialized aderyn status item');
    }
    aderynStatusItem.text = '$(check) Aderyn LSP: On';
    aderynStatusItem.tooltip = 'Click to toggle Aderyn';
    aderynStatusItem.command = EditorCmd.StopServer;
    aderynStatusItem.show();
}

function showAderynStatusOff() {
    if (!aderynStatusItem) {
        throw new Error('Uninitialized aderyn status item');
    }
    aderynStatusItem.text = '$(circle-slash) Aderyn LSP: Off';
    aderynStatusItem.tooltip = 'Click to toggle Aderyn';
    aderynStatusItem.command = EditorCmd.StartServer;
    aderynStatusItem.show();
}

function showAderynStatusLoading() {
    if (!aderynStatusItem) {
        throw new Error('Uninitialized aderyn status item');
    }
    aderynStatusItem.tooltip = 'Loading please wait..';
    aderynStatusItem.command = EditorCmd.ShowOnboardPanel;
    aderynStatusItem.show();
    setAderynLSPLoading();
}

function showAderynStatusUnintialized() {
    if (!aderynStatusItem) {
        throw new Error('Uninitialized aderyn status item');
    }
    aderynStatusItem.text = '$(light-bulb) Aderyn: Get Started';
    aderynStatusItem.tooltip = 'Click to install Aderyn';
    aderynStatusItem.command = EditorCmd.ShowOnboardPanel;
    aderynStatusItem.show();
}

function hideAderynStatus() {
    if (!aderynStatusItem) {
        throw new Error('Uninitialized aderyn status item');
    }
    aderynStatusItem.hide();
}

export {
    showAderynStatusOn,
    showAderynStatusOff,
    hideAderynStatus,
    showAderynStatusUnintialized,
    showAderynStatusLoading,
};
