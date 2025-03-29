import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'edge-runtime',
    environmentOptions: {
      edge: {
        // Edge Runtime 구성 옵션
        unstable_allowDynamicGlobals: true,
      }
    },
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  plugins: [
    {
      name: 'edge-runtime-environment',
      config: () => ({
        test: {
          environment: 'edge-runtime',
        }
      }),
    }
  ],
}); 