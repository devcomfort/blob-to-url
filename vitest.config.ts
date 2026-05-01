/**
 * Vitest configuration for blob-to-url.
 *
 * Environment: happy-dom
 *   Chosen over jsdom because it's lighter and Blob/FileReader are native.
 *   happy-dom does NOT implement URL.createObjectURL / URL.revokeObjectURL
 *   (those are browser-only), so vitest.setup.ts patches them.
 *
 * Globals: true
 *   Enables describe/it/expect without explicit imports in every test file.
 *   Keeps test files concise since this project has one consistent test framework.
 *
 * Setup files: ./vitest.setup.ts
 *   Runs before every test suite to patch missing browser APIs:
 *   URL.createObjectURL, URL.revokeObjectURL, and blob: fetch support.
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'happy-dom',
		globals: true,
		setupFiles: ['./vitest.setup.ts'],
	},
});
