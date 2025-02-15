import { whichAderyn } from '../install/avm';
import { Logger } from '../logger';

test('which aderyn', async () => {
    await whichAderyn(new Logger());
});
