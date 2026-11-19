import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: [
      'index.ts',
      './src/types.ts',
      './src/builders/node/index.ts',
      './src/builders/browser/index.ts',
      './templates/index.ts',
    ],
    clean: true,
    format: 'esm',
    unbundle: true,
    minify: 'dce-only',
    fixedExtension: false,
    dts: true,
    platform: 'neutral',
    deps: {
      neverBundle: [/^node:/],
    },
    target: 'esnext',
    exports: true,
  },
  {
    entry: {
      index: 'index.ts',
    },
    clean: false,
    format: 'iife',
    globalName: 'ncfdiCfdiToPdf',
    platform: 'browser',
    unbundle: false,
    minify: 'dce-only',
    fixedExtension: false,
    dts: false,
    target: 'esnext',
  },
]);
