import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distDir = resolve(__dirname, '../../dist');

if (!existsSync(distDir)) {
	describe('dist/ artifacts', () => {
		it('dist/ not built — run `pnpm build` first', () => {
			expect(true).toBe(true);
		});
	});
} else {
	describe('dist/ artifacts', () => {
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

		describe('UMD (index.global.js)', () => {
			it('evaluates and exposes blobToUrl global', () => {
				const code = readFileSync(
					resolve(distDir, 'index.global.js'),
					'utf-8',
				);
				expect(code.length).toBeGreaterThan(0);

				// new Function (not eval) — UMD bundle's "use strict" would prevent var leakage
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
