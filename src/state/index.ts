import { StatusBarItem, Uri } from 'vscode';

import { LanguageClient } from 'vscode-languageclient/node';
import { AderynFileDiagnosticsProvider } from '../panel-providers/file-panel';
import { AderynProjectDiagnosticsProvider } from '../panel-providers/project-panel';
import { Mutex } from 'async-mutex';

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
let welcomePageIsOpen: boolean;

let lspLoadingMutex = new Mutex();
let lspLoading: NodeJS.Timeout | undefined;

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

function setWelcomePageOpenState(state: boolean) {
    welcomePageIsOpen = state;
}

function setAderynLSPLoading() {
    lspLoadingMutex.runExclusive(() => {
        const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        // Don't set if it's already loading
        if (aderynStatusItem && !lspLoading) {
            let i = 0;
            lspLoading = setInterval(() => {
                const frame = spinnerFrames[(i = (i + 1) % spinnerFrames.length)];
                if (aderynStatusItem) {
                    aderynStatusItem.text = `Aderyn LSP ${frame}`;
                }
            }, 150);
        }
    });
}

function unsetAderynLSPLoading() {
    lspLoadingMutex.runExclusive(() => {
        if (lspLoading) {
            clearInterval(lspLoading);
            lspLoading = undefined;
        } else {
            console.log('failed to unset');
        }
    });
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
    setAderynLSPLoading,
    unsetAderynLSPLoading,

    // Panels
    projectDiagnosticsProvider,
    activeFileDiagnosticsProvider,
    setProjectDiagnosticsProvider,
    setActiveFileDiagnosticsProvider,
    welcomePageIsOpen,
    setWelcomePageOpenState,
};
