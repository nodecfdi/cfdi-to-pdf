import { defineConfig } from 'tsdown';

const entry = [
  './index.ts',
  './src/types.ts',
  './src/builders/node/index.ts',
  './src/builders/browser/index.ts',
  './templates/index.ts',
];

export default defineConfig([
  {
    entry,
    outDir: './build',
    format: 'esm',
    dts: true,
    fixedExtension: false,
    target: 'esnext',
    clean: false,
  },
  {
    entry: { index: './index.ts' },
    outDir: './build/iife',
    format: 'iife',
    fixedExtension: false,
    globalName: 'CfdiToPdf',
    target: 'esnext',
    clean: false,
  },
]);
