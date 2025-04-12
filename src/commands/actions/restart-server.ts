import { client, startServing, stopServing } from '../../state';

async function action() {
    if (!client) {
        await startServing();
        return;
    }
    try {
        if (client.isRunning()) {
            await stopServing();
        }
        await startServing();
    } catch (err) {
        client.error('Restarting Aderyn failed', err, 'force');
    }
}

export { action };
