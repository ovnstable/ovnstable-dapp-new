import { fileURLToPath, URL } from 'node:url';
import { constants } from 'zlib';
import { resolve } from 'path';

import { defineConfig, loadEnv } from 'vite';
import compression from 'vite-plugin-compression';
import vue from '@vitejs/plugin-vue';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import svgLoader from 'vite-svg-loader';
import dynamicImport from 'vite-plugin-dynamic-import';

const MODE = process.env.NODE_ENV;
const isDev = MODE === 'development';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {

    plugins: [
      vue(),
      svgLoader(),
      (compression as any)({
        ext: '.br',
        algorithm: 'brotliCompress',
        include: /\.(js|css|html|svg|json|map)(\?.*)?$/i,
        compressionOptions: {
          params: {
            [constants.BROTLI_PARAM_QUALITY]: 11,
          },
        },
        minRatio: 0.8,
        deleteOriginalAssets: false,
      }),
      // Gzip compression
      (compression as any)({
        ext: '.gz',
        algorithm: 'gzip',
        include: /\.(js|css|html|svg|json|map)(\?.*)?$/i,
        minRatio: 0.8,
        deleteOriginalAssets: false,
      }),
      isDev
      && (nodePolyfills as any)({
        include: [
          'node_modules/**/*.js',
          /node_modules\/.vite\/.*js/,
        ],
        crypto: true,
        http: true,
      }),
      dynamicImport(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
        assert: 'assert',
      },
    },
    define: {
      'process.env': env,
    },
    build: {
      rollupOptions: {
        plugins: [(nodePolyfills as any)({ crypto: true, http: true })],
        input: {
          // Production entry point
          main: resolve(__dirname, 'index.prod.html'),
        },
      },
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
  };
});
