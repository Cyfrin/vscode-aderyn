import { client, createOrInitLspClient, unsetAderynLSPLoading } from '..';
import {
    showAderynStatusLoading,
    showAderynStatusOff,
    showAderynStatusOn,
} from '../statusbar/index';

async function startServing() {
    await createOrInitLspClient();
    if (!client) {
        throw new Error('Uninitialized Language Server asked to start serving');
    }
    showAderynStatusLoading();
    await client.start();
    unsetAderynLSPLoading();
    showAderynStatusOn();
}

async function stopServing() {
    if (!client) {
        throw new Error('Uninitialized Language Server asked to stop serving');
    }
    showAderynStatusLoading();
    await client.stop();
    unsetAderynLSPLoading();
    showAderynStatusOff();
}

function stopServingIfOn(): Thenable<void> | null {
    if (client) {
        return stopServing();
    }
    return null;
}

export { startServing, stopServing, stopServingIfOn };
