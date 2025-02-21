// Aderyn Server ---

import { EditorCmd } from '../../commands/variants';
import { aderynStatusItem } from '../index';

function showAderynStatusOn() {
    if (!aderynStatusItem) {
        throw new Error('Uninitialized aderyn status item');
    }
    aderynStatusItem.text = '$(check) Aderyn: On';
    aderynStatusItem.tooltip = 'Click to toggle Aderyn';
    aderynStatusItem.command = EditorCmd.StopServer;
    aderynStatusItem.show();
}

function showAderynStatusOff() {
    if (!aderynStatusItem) {
        throw new Error('Uninitialized aderyn status item');
    }
    aderynStatusItem.text = '$(circle-slash) Aderyn: Off';
    aderynStatusItem.tooltip = 'Click to toggle Aderyn';
    aderynStatusItem.command = EditorCmd.StartServer;
    aderynStatusItem.show();
}

function hideAderynStatus() {
    if (!aderynStatusItem) {
        throw new Error('Uninitialized aderyn status item');
    }
    aderynStatusItem.hide();
}

export { showAderynStatusOn, showAderynStatusOff, hideAderynStatus };
