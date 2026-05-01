import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'edge-runtime',
    environmentOptions: {
      edge: {
        unstable_allowDynamicGlobals: true,
      }
    },
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
}); 