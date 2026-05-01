/**
 * Smoke tests for the happy-dom test environment setup.
 *
 * These tests don't test the library itself — they verify that the
 * environment patches (see vitest.setup.ts) are active and working.
 * All other test suites depend on these assumptions being true.
 */
import { describe, it, expect } from 'vitest';

/**
 * happy-dom provides a browser-like environment for tests, but it
 * doesn't implement URL.createObjectURL / fetch for blob: URLs.
 * This suite confirms that our vitest.setup.ts patches those gaps.
 */
describe('happy-dom browser environment', () => {
	// native happy-dom APIs — must be present without any patching
	it('provides FileReader natively', () => {
		expect(typeof FileReader).toBe('function');
	});

	it('provides Blob natively', () => {
		expect(typeof Blob).toBe('function');
	});

	// patched by vitest.setup.ts — verifies the mock is installed
	it('provides URL.createObjectURL via setup mock', () => {
		expect(typeof URL.createObjectURL).toBe('function');
	});

	// round-trip: create a blob URL, verify it has the blob: scheme
	it('generates blob: URLs with setup mock', () => {
		const blob = new Blob(['test'], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		expect(url).toMatch(/^blob:/);
		URL.revokeObjectURL(url);
	});

	// round-trip: create a blob URL, fetch it, verify the content matches
	it('fetches blob: URLs via setup mock', async () => {
		const blob = new Blob(['test'], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const response = await fetch(url);
		expect(response.ok).toBe(true);
		const text = await response.text();
		expect(text).toBe('test');
		URL.revokeObjectURL(url);
	});
});
