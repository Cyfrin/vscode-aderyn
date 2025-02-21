import { StatusBarItem, Uri } from 'vscode';

import { LanguageClient } from 'vscode-languageclient/node';

import {
    createLanguageClient,
    startServing,
    stopServingIfOn,
    stopServing,
} from './language-client';

import { createNewOrShowOnboardProvider, showPanel, hidePanel } from './onboard-provider';

import {
    createStatusBarItem,
    StatusIcon,
    registerStatusBarItems,
    showAderynStatusOn,
    showAderynStatusOff,
    hideAderynStatus,
} from './statusbar/index';

/*
 *
 * State variables
 *
 */
let client: LanguageClient | undefined;
let aderynStatusItem: StatusBarItem | undefined;

async function createAderynStatusItem() {
    aderynStatusItem = createStatusBarItem(StatusIcon.AderynServer);
}

async function createOrInitLspClient() {
    client = await createLanguageClient();
}

async function createOrInitOnboardProvider(uri: Uri) {
    createNewOrShowOnboardProvider(uri);
}

export {
    // Language client
    client,
    createOrInitLspClient,
    startServing,
    stopServingIfOn,
    stopServing,

    // Onboard Provider
    createOrInitOnboardProvider,
    showPanel,
    hidePanel,

    // Status Bar
    StatusIcon,
    aderynStatusItem,
    createAderynStatusItem,
    createStatusBarItem,
    registerStatusBarItems,
    showAderynStatusOn,
    showAderynStatusOff,
    hideAderynStatus,
};
