import { defineConfig } from 'tsup';

const mainConfig = defineConfig({
  splitting: true,
  clean: true,
  experimentalDts: true,
  name: 'cfdi-to-pdf',
  globalName: 'cfdiToPdf',
  treeshake: true,
  format: ['esm', 'cjs', 'iife'],
  shims: true,
  entry: {
    'cfdi-to-pdf': 'src/index.ts',
  },
});

export default mainConfig;
