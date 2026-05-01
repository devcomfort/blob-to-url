/**
 * Integration tests for toBlobURL — the blob URL controller.
 *
 * The four tests form a sequential flow that mirrors real browser usage:
 *   1. assign — create blob URLs from Blob objects
 *   2. load   — fetch content through the generated blob: URLs
 *   3. revoke — release the blob URLs
 *   4. load-after-revoke — verify fetch returns 404 after revoke
 *
 * Each step depends on the previous one's output, accumulated through
 * the shared blobUrls fixture (see blob-files.ts). This design ensures
 * the full lifecycle is tested in the correct order.
 */
import { describe, assert } from "vitest";

import { toBlobURL } from "../blob-controller";
import blobFixtures from "./blob-files";

describe("Test: toBlobUrl", () => {
	// Step 1: Create blob URLs and store them in the shared fixture.
	// Each Sample produces one BlobURL entry (url + revoke + payload).
	blobFixtures("url assign test", async ({ samples, blobUrls }) => {
		blobUrls.push(
			...samples.map((sample) => {
				const blobUrl = toBlobURL(sample.object);
				return {
					blobUrl,
					payload: sample.payload,
				};
			}),
		);
	});

	// Step 2: Fetch each blob: URL and verify the content round-trips
	// correctly (response.ok and text match the original payload).
	blobFixtures("url load test", async ({ blobUrls }) => {
		const results = await Promise.all(
			blobUrls.map(async ({ blobUrl: { url }, payload }) => {
				const response = await fetch(url);
				const text = await response.text();

				return {
					ok: response.ok,
					payload,
					text,
				};
			}),
		);

		for (const { ok, text, payload } of results) {
			assert.isOk(ok, "Failed to fetch data using the Blob URL.");
			assert.equal(
				text,
				payload,
				"Strange data was loaded instead of the expected data.",
			);
		}
	});

	// Step 3: Revoke all blob URLs to release their in-memory storage.
	blobFixtures("url revoke test", async ({ blobUrls }) => {
		for (const {
			blobUrl: { revoke },
		} of blobUrls) {
			revoke();
		}
	});

	// Step 4: Fetch each revoked URL and verify the content is NOT the
	// original payload (the mock returns empty body after revocation).
	blobFixtures("url load after revoke test", async ({ blobUrls }) => {
		const results = await Promise.all(
			blobUrls.map(async ({ blobUrl: { url }, payload }) => {
				const response = await fetch(url);
				const text = await response.text();

				return {
					ok: response.ok,
					text,
					payload,
				};
			}),
		);

		for (const { ok, text, payload } of results) {
			assert.notEqual(
				text,
				payload,
				"Data is being loaded correctly after revoking.",
			);
		}
	});
});
