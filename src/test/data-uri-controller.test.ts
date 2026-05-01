import { describe, expect } from "vitest";

import { toDataURI } from "../data-uri-controller";
import blobFixtures from "./blob-files";

describe("Test: toDataURI", () => {
	blobFixtures("converts Blob to base64 data URI", async ({ samples, dataUris }) => {
		for (const sample of samples) {
			const dataURI = await toDataURI(sample.object);
			dataUris.push({ dataURI, payload: sample.payload });
			expect(dataURI).toMatch(/^data:text\/plain;base64,/);
			expect(dataURI).toContain(btoa(sample.payload));
		}
	});

	blobFixtures("different blob types produce correct MIME", async () => {
		const jsonBlob = new Blob(['{"key":"value"}'], { type: "application/json" });
		const uri = await toDataURI(jsonBlob);
		expect(uri).toMatch(/^data:application\/json;base64,/);
	});
});
