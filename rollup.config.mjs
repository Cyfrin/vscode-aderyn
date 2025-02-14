import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-import-css';

import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import { readFileSync } from 'fs';

async function transformStyles(content) {
    const result = await postcss([autoprefixer]).process(content, { from: undefined });
    return { code: result.css };
}

function webviewRollupConfig(name) {
    return {
        input: `media/unprocessed/${name}.js`,
        output: {
            sourcemap: true,
            name: 'app',
            file: `media/rolled-up/${name}.js`,
            format: 'iife',
        },
        plugins: [
            css({
                output: `${name}.svelte.css`,
                alwaysOutput: true,
                minify: true,
            }),
            svelte({
                include: `src/webview-providers/${name}/**/*.{svelte,ts}`,
                preprocess: {
                    style: async ({ content }) => {
                        return transformStyles(content);
                    },
                },

                emitCss: true,

                onwarn: (warning, handler) => {
                    if (warning.code === 'a11y-distracting-elements') return;
                    handler(warning);
                },

                compilerOptions: {
                    hydratable: true,
                    customElement: false,
                },
            }),
            resolve({
                browser: true,
                exportConditions: ['svelte', '.ts'],
                extensions: ['.svelte', '.ts'],
                dedupe: ['svelte', '.ts'],
            }),
        ],
    };
}

/*
 *
 * Read the package.json to find out the differen webviews that exist
 *
 */
function getConfig() {
    const extensionPackageJson = JSON.parse(readFileSync('package.json').toString());
    const webviews = extensionPackageJson['contributes']['views']['explorer'];
    // Make this conversion: aderyn.webview-providers.onboard-panel => onboard-panel
    return webviews
        .filter((view) => view['type'] == 'webview')
        .map((view) => view.id.split('.')[2])
        .map((name) => webviewRollupConfig(name));
}

export default getConfig();
