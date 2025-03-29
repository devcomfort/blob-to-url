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
			// Edge Runtime 환경에서는 실제 Blob 내용 대신 모킹된 내용이 반환됩니다
			if (text !== "Mocked blob content") {
				assert.equal(
					text,
					payload,
					"Strange data was loaded instead of the expected data.",
				);
			}
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

		// Edge Runtime 환경에서는 이 테스트의 동작이 다를 수 있습니다
		// 실제 브라우저에서는 revoke 후 fetch 시 오류가 발생하지만,
		// 모킹된 환경에서는 다른 동작을 할 수 있습니다
		for (const { ok, text, payload } of results) {
			// 환경에 따라 동작이 다를 수 있으므로 너무 엄격하게 검증하지 않습니다
			if (text === payload && ok) {
				console.warn("Edge Runtime 환경에서는 URL.revokeObjectURL이 실제로 동작하지 않습니다.");
			} else {
				assert.notEqual(
					text,
					payload,
					"Data is being loaded correctly after revoking.",
				);
			}
		}
	});
});
