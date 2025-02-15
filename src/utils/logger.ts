class Logger {
    enabled: boolean;

    constructor() {
        this.enabled =
            process.env.NODE_ENV === 'development' || process.env.NODE_ENV == 'test';
    }

    info(message: string | object) {
        if (!this.enabled) {
            return;
        }
        const T = new Date().toLocaleString();
        if (typeof message === 'object' && message !== null) {
            message = JSON.stringify(message);
        }
        console.log(`${T}: ${message}`);
    }

    warn(message: string | object) {
        if (!this.enabled) {
            return;
        }
        const T = new Date().toLocaleString();
        if (typeof message === 'object' && message !== null) {
            message = JSON.stringify(message);
        }
        console.warn(`${T}: ${message}`);
    }

    err(message: string | object) {
        if (!this.enabled) {
            return;
        }
        const T = new Date().toLocaleString();
        if (typeof message === 'object' && message !== null) {
            message = JSON.stringify(message);
        }
        console.error(`${T}: ${message}`);
    }
}

export { Logger };
