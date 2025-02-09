import { client } from './index';

function startServing() {
    if (!client) {
        throw new Error('Uninitialized Language Server asked to start serving');
    }
    return client.start();
}

function stopServing() {
    if (!client) {
        throw new Error('Uninitialized Language Server asked to stop serving');
    }
    return client.stop();
}

function stopServingIfOn(): Thenable<void> | null {
    if (client) {
        return stopServing();
    }
    return null;
}

export { startServing, stopServing, stopServingIfOn };
