import { StatusBarItem, Uri } from 'vscode';

import { LanguageClient } from 'vscode-languageclient/node';
import { AderynFileDiagnosticsProvider } from '../panel-providers/file-panel';
import { AderynProjectDiagnosticsProvider } from '../panel-providers/project-panel';

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
    showAderynStatusUnintialized,
} from './statusbar/index';

/*
 *
 * State variables
 *
 */
let client: LanguageClient | undefined;
let aderynStatusItem: StatusBarItem | undefined;
let projectDiagnosticsProvider: AderynProjectDiagnosticsProvider | undefined;
let activeFileDiagnosticsProvider: AderynFileDiagnosticsProvider | undefined;

async function createAderynStatusItem() {
    aderynStatusItem = createStatusBarItem(StatusIcon.AderynServer);
    showAderynStatusUnintialized();
}

async function createOrInitLspClient() {
    if (!client) client = await createLanguageClient();
}

async function createOrInitOnboardProvider(uri: Uri) {
    createNewOrShowOnboardProvider(uri);
}

function setProjectDiagnosticsProvider(provider: AderynProjectDiagnosticsProvider) {
    projectDiagnosticsProvider = provider;
}

function setActiveFileDiagnosticsProvider(provider: AderynFileDiagnosticsProvider) {
    activeFileDiagnosticsProvider = provider;
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

    // Panels
    projectDiagnosticsProvider,
    activeFileDiagnosticsProvider,
    setProjectDiagnosticsProvider,
    setActiveFileDiagnosticsProvider,
};
