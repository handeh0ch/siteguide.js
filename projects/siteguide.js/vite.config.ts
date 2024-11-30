import path from 'path';
import { PreRenderedAsset } from 'rollup';
import { defineConfig, UserConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    base: './',
    plugins: [
        dts({
            tsconfigPath: './tsconfig.json',
            rollupTypes: true,
            rollupOptions: {
                showVerboseMessages: true,
            },
        }),
    ],
    build: {
        assetsDir: '',
        outDir: 'dist',
        target: 'ES6',
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'siteguide.js',
            formats: ['es', 'cjs'],
            fileName: (format: string): string => {
                format = format.replace('es', 'mjs');
                format = format.replace('cjs', 'js');

                return `index.${format}`;
            },
        },
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo: PreRenderedAsset): string => {
                    if (assetInfo.name?.endsWith('.css')) {
                        return 'css/siteguide.css';
                    }
                    return '[name].[ext]';
                },
            },
        },
    },
} satisfies UserConfig);
