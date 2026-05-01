import { vi } from 'vitest';

// jsdom does NOT provide URL.createObjectURL / URL.revokeObjectURL.
// Provide mock implementations with a blob store so fetch can serve real content.
const blobStore = new Map<string, Blob>();

if (typeof globalThis.URL.createObjectURL !== 'function') {
	(globalThis.URL as any).createObjectURL = function (blob: Blob): string {
		const url = `blob:test-${Math.random().toString(36).substring(7)}`;
		blobStore.set(url, blob);
		return url;
	};

	(globalThis.URL as any).revokeObjectURL = function (url: string): void {
		blobStore.delete(url);
	};
}

// Mock fetch for blob: URLs. jsdom's native fetch does not support blob:.
const originalFetch = globalThis.fetch;
globalThis.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
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

	if (originalFetch) {
		return originalFetch(input, init);
	}

	return new Response('', { status: 404 });
});
