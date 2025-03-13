import { projectDiagnosticsProvider } from '../../state/index';

async function action() {
    projectDiagnosticsProvider?.refresh();
}

export { action };
