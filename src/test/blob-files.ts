/**
 * Shared test fixtures for blob-to-url controller tests.
 *
 * Uses vitest's `it.extend` (fixture injection) to share sample data
 * across multiple test files without duplicating setup code. Each test
 * file that imports this fixture automatically gets access to:
 *
 *   samples:  Blob objects paired with their known payload strings.
 *   blobUrls: Accumulator for toBlobURL return values (url + revoke).
 *   dataUris: Accumulator for toDataURI return values.
 *
 * Why it.extend instead of beforeEach:
 *   it.extend provides type-safe fixture injection scoped per test.
 *   It avoids global mutable state — each test gets its own fixture
 *   context, but shared fixtures like blobUrls/dataUris are initialized
 *   as empty arrays and populated by test code. This enables multi-test
 *   flows where, for example, test B loads URLs created by test A.
 */
import { it } from "vitest";
import type { toBlobURL } from "../blob-controller";

// Wraps a raw Blob with its known payload string so tests can
// generate a blob/URI and then verify the round-tripped content.
interface Sample {
	object: Blob;
	payload: string;
}

// Accumulates toBlobURL return values across test steps.
// blobUrl carries { url, revoke } — the revoke method is a side
// effect of the controller call.
interface BlobURL {
	blobUrl: ReturnType<typeof toBlobURL>;
	// The original payload string for cross-checking after round-trip.
	payload: string;
}

// Accumulates toDataURI return values across test steps.
interface DataURI {
	dataURI: string;
	// The original payload string for cross-checking after round-trip.
	payload: string;
}

// Known payload strings. Extend this array to test more edge cases.
const rawPayloads: string[] = ["Hello World!"];

const blobFixtures = it.extend<{
	samples: Sample[];
	blobUrls: BlobURL[];
	dataUris: DataURI[];
}>({
	// samples fixture: creates Blob objects from rawPayloads and
	// passes them to the test via the `use` callback. The fixture
	// is async to match vitest's fixture API shape.
	samples: async (
		// biome-ignore lint/correctness/noEmptyPattern: initial value
		{},
		use,
	) => {
		const samples: Sample[] = rawPayloads.map((payload) => {
			const object = new Blob([payload], {
				type: "text/plain",
			});

			return {
				object,
				payload,
			};
		});

		await use(samples);
	},
	// blobUrls and dataUris start as empty arrays; tests push into them.
	// This allows a multi-test flow: test A creates URLs, test B verifies them.
	blobUrls: [],
	dataUris: [],
});

export default blobFixtures;
