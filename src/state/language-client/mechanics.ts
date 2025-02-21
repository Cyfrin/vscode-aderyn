import { client } from '..';
import { showAderynStatusOff, showAderynStatusOn } from '../statusbar/mechanics';

async function startServing() {
    if (!client) {
        throw new Error('Uninitialized Language Server asked to start serving');
    }
    showAderynStatusOn();
    return client.start();
}

function stopServing() {
    if (!client) {
        throw new Error('Uninitialized Language Server asked to stop serving');
    }
    showAderynStatusOff();
    return client.stop();
}

function stopServingIfOn(): Thenable<void> | null {
    if (client) {
        return stopServing();
    }
    return null;
}

export { startServing, stopServing, stopServingIfOn };
