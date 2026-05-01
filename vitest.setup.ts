/**
 * Test environment setup for blob-to-url.
 *
 * Patches missing browser APIs that happy-dom doesn't provide:
 *   - URL.createObjectURL / revokeObjectURL: in-memory blob map
 *   - fetch: intercept blob: scheme so round-trip loading works
 *
 * Each file in this project depends on these patches being active.
 * They are NOT undoable — once applied, they replace the original API
 * for the entire test run, which is the intended behavior.
 */
import { vi } from 'vitest';

// In-memory store mapping blob: URLs back to their Blob instances.
// Mirrors what a real browser does internally, but without the process-
// level memory mapping. The store is shared across all tests in the run.
const blobStore = new Map<string, Blob>();

// Replaces URL.createObjectURL — a browser-only API that happy-dom
// does not implement (and Node 22's experimental export is incompatible).
// Stores the blob keyed by a synthetic blob: URL so it can be looked up
// later by fetch or revokeObjectURL.
(globalThis.URL as any).createObjectURL = function (blob: Blob): string {
	const url = `blob:test-${Math.random().toString(36).substring(7)}`;
	blobStore.set(url, blob);
	return url;
};

// Replaces URL.revokeObjectURL — removes the blob from the in-memory
// store so that fetch returns 404 for that URL afterward.
(globalThis.URL as any).revokeObjectURL = function (url: string): void {
	blobStore.delete(url);
};

// Wraps the global fetch to handle blob: URLs that happy-dom's native
// fetch doesn't understand. Blob: URLs are resolved from the in-memory
// blobStore. Non-blob: requests are forwarded to the original fetch
// (happy-dom or Node native).
//
// We save the original fetch so non-blob requests still work —
// for example, if a test needs to make a real HTTP call.
const _originalFetch = globalThis.fetch;
const _mockFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
	const url = input.toString();

	if (url.startsWith('blob:')) {
		const blob = blobStore.get(url);
		if (blob) {
			const text = await blob.text();
			return new Response(text, {
				status: 200,
				headers: { 'Content-Type': blob.type },
			});
		}
		// blob was revoked or never existed — return 404 like a real browser
		return new Response('', { status: 404 });
	}

	// Non-blob URL: delegate to original fetch so real HTTP still works
	if (_originalFetch) {
		return _originalFetch(input, init);
	}

	return new Response('', { status: 404 });
};

globalThis.fetch = _mockFetch as typeof fetch;
