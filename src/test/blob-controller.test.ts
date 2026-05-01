import { describe, assert } from "vitest";

import { toBlobURL } from "../blob-controller";
import blobFixtures from "./blob-files";

describe("Test: toBlobUrl", () => {
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

	blobFixtures("url revoke test", async ({ blobUrls }) => {
		for (const {
			blobUrl: { revoke },
		} of blobUrls) {
			revoke();
		}
	});

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
