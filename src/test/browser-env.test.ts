import { describe, it, expect } from 'vitest';

describe('jsdom browser environment', () => {
	it('provides FileReader natively', () => {
		expect(typeof FileReader).toBe('function');
	});

	it('provides Blob natively', () => {
		expect(typeof Blob).toBe('function');
	});

	it('provides URL.createObjectURL via setup mock', () => {
		expect(typeof URL.createObjectURL).toBe('function');
	});

	it('generates blob: URLs with setup mock', () => {
		const blob = new Blob(['test'], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		expect(url).toMatch(/^blob:/);
		URL.revokeObjectURL(url);
	});

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
