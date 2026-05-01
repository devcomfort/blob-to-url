import { vi } from 'vitest';

// happy-dom does NOT provide URL.createObjectURL / URL.revokeObjectURL,
// but Node.js 22+ exports them as experimental APIs. Always override.
const blobStore = new Map<string, Blob>();

(globalThis.URL as any).createObjectURL = function (blob: Blob): string {
	const url = `blob:test-${Math.random().toString(36).substring(7)}`;
	blobStore.set(url, blob);
	return url;
};

(globalThis.URL as any).revokeObjectURL = function (url: string): void {
	blobStore.delete(url);
};

// Mock fetch for blob: URLs. happy-dom's native fetch does not support blob:.
// Use a wrapper that traps calls so we can verify the mock is working.
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
		return new Response('', { status: 404 });
	}

	if (_originalFetch) {
		return _originalFetch(input, init);
	}

	return new Response('', { status: 404 });
};

globalThis.fetch = _mockFetch as typeof fetch;
