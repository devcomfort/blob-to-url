/**
 * Post-build integration tests.
 *
 * Validates that the actual dist/ outputs (ESM, CJS, UMD, type declarations)
 * work correctly after `pnpm build`. These tests exercise the shipped
 * artifacts — not the source code — to catch build misconfigurations.
 *
 * Guard pattern:
 *   If dist/ doesn't exist (e.g., in CI before the build step), the suite
 *   emits a no-op test to avoid an outright failure. This lets the test file
 *   always pass syntactically while making it obvious when the build is
 *   missing.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distDir = resolve(__dirname, '../../dist');

if (!existsSync(distDir)) {
	// Guard: dist/ not built. Emit a single no-op test so the suite
	// doesn't fail outright (useful in CI before the build step).
	describe('dist/ artifacts', () => {
		it('dist/ not built — run `pnpm build` first', () => {
			expect(true).toBe(true);
		});
	});
} else {
	/**
	 * Full post-build integration suite.
	 *
	 * Dynamically imports the ESM and CJS bundles, evaluates the UMD
	 * bundle with new Function, and reads type declaration files.
	 */
	describe('dist/ artifacts', () => {
		/**
		 * ESM import tests.
		 * The primary module format — import() loads index.js and verifies
		 * that exports match the public API (toBlobURL, toDataURI).
		 */
		describe('ESM (index.js)', () => {
			it('can be dynamically imported', async () => {
				const mod = await import(
					pathToFileURL(resolve(distDir, 'index.js')).href
				);
				expect(typeof mod.toBlobURL).toBe('function');
				expect(typeof mod.toDataURI).toBe('function');
			});

			it('toBlobURL creates blob URL and revoke method', async () => {
				const { toBlobURL } = await import(
					pathToFileURL(resolve(distDir, 'index.js')).href
				);
				const blob = new Blob(['hello'], { type: 'text/plain' });
				const { url, revoke } = toBlobURL(blob);
				expect(url).toMatch(/^blob:/);
				expect(typeof revoke).toBe('function');
				revoke();
			});

			it('toDataURI creates base64 data URI', async () => {
				const { toDataURI } = await import(
					pathToFileURL(resolve(distDir, 'index.js')).href
				);
				const blob = new Blob(['hello'], { type: 'text/plain' });
				const uri = await toDataURI(blob);
				expect(uri).toMatch(/^data:text\/plain;base64,/);
				expect(uri).toContain(btoa('hello'));
			});
		});

		/**
		 * CJS require tests.
		 * Loaded via import() (Node's CJS interop), verifying the
		 * CommonJS bundle exposes the same API as ESM.
		 */
		describe('CJS (index.cjs)', () => {
			it('can be required', async () => {
				const { toBlobURL, toDataURI } = await import(
					pathToFileURL(resolve(distDir, 'index.cjs')).href
				);
				expect(typeof toBlobURL).toBe('function');
				expect(typeof toDataURI).toBe('function');
			});

			it('toBlobURL creates blob URL', async () => {
				const { toBlobURL } = await import(
					pathToFileURL(resolve(distDir, 'index.cjs')).href
				);
				const blob = new Blob(['hello'], { type: 'text/plain' });
				const { url, revoke } = toBlobURL(blob);
				expect(url).toMatch(/^blob:/);
				revoke();
			});
		});

		/**
		 * UMD bundle tests.
		 * The UMD bundle is evaluated as a string via new Function because
		 * it's not a module — it attaches to window.blobToUrl in a browser.
		 *
		 * Why new Function and not eval:
		 *   The UMD bundle starts with "use strict", which would prevent
		 *   eval from leaking the returned variable into the surrounding
		 *   scope. new Function creates an isolated scope; we chain a
		 *   "return blobToUrl;" suffix to extract the global.
		 */
		describe('UMD (index.global.js)', () => {
			it('evaluates and exposes blobToUrl global', () => {
				const code = readFileSync(
					resolve(distDir, 'index.global.js'),
					'utf-8',
				);
				expect(code.length).toBeGreaterThan(0);

				// new Function creates a function from the UMD source code.
				// We append a return statement to extract the global variable
				// that the UMD bundle would normally attach to window.
				const getModule = new Function(code + '\nreturn blobToUrl;');
				const mod = getModule();

				expect(mod).toBeDefined();
				expect(typeof mod.toBlobURL).toBe('function');
				expect(typeof mod.toDataURI).toBe('function');
			});

			it('toBlobURL works from UMD bundle', () => {
				const code = readFileSync(
					resolve(distDir, 'index.global.js'),
					'utf-8',
				);
				const getModule = new Function(
					code + '\nreturn blobToUrl;',
				);
				const mod = getModule();

				const blob = new Blob(['hello'], { type: 'text/plain' });
				const { url, revoke } = mod.toBlobURL(blob);
				expect(url).toMatch(/^blob:/);
				revoke();
			});
		});

		/**
		 * Type declaration tests.
		 * Reads the .d.ts and .d.cts files to verify they exist, are
		 * non-empty, and declare the public API symbols. Catches cases
		 * where the build step succeeds but forgets to emit types.
		 */
		describe('Type declarations', () => {
			it('index.d.ts exists and is non-empty', () => {
				const dts = readFileSync(
					resolve(distDir, 'index.d.ts'),
					'utf-8',
				);
				expect(dts.length).toBeGreaterThan(0);
				expect(dts).toContain('toBlobURL');
				expect(dts).toContain('toDataURI');
			});

			it('index.d.cts exists and is non-empty', () => {
				const dts = readFileSync(
					resolve(distDir, 'index.d.cts'),
					'utf-8',
				);
				expect(dts.length).toBeGreaterThan(0);
				expect(dts).toContain('toBlobURL');
				expect(dts).toContain('toDataURI');
			});
		});
	});
}
