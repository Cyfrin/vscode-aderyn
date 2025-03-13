import { activeFileDiagnosticsProvider } from '../../state/index';

async function action() {
    activeFileDiagnosticsProvider?.refresh();
}

export { action };
