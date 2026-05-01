/**
 * Integration tests for toDataURI — the data URI controller.
 *
 * Unlike blob URLs, data URIs encode the content directly into the URL
 * string (base64). There's no revoke lifecycle — the URI is self-contained
 * and stateless. These tests verify correct encoding and MIME type
 * preservation.
 */
import { describe, expect } from "vitest";

import { toDataURI } from "../data-uri-controller";
import blobFixtures from "./blob-files";

describe("Test: toDataURI", () => {
	// Round-trip test: create a data URI from a Blob and verify the
	// base64-encoded content matches the original payload.
	blobFixtures("converts Blob to base64 data URI", async ({ samples, dataUris }) => {
		for (const sample of samples) {
			const dataURI = await toDataURI(sample.object);
			dataUris.push({ dataURI, payload: sample.payload });
			expect(dataURI).toMatch(/^data:text\/plain;base64,/);
			expect(dataURI).toContain(btoa(sample.payload));
		}
	});

	// Verify that the MIME type from the Blob is preserved in the data URI.
	// Non-plaintext types should produce the correct data: prefix.
	blobFixtures("different blob types produce correct MIME", async () => {
		const jsonBlob = new Blob(['{"key":"value"}'], { type: "application/json" });
		const uri = await toDataURI(jsonBlob);
		expect(uri).toMatch(/^data:application\/json;base64,/);
	});
});
