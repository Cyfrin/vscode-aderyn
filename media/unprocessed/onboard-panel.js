import App from '../../src/webview-providers/onboard-panel/App.svelte';
import { mount } from 'svelte';

const app = mount(App, {
    target: document.getElementById('app'),
});

export default app;
