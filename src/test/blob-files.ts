import { it } from "vitest";
import type { toBlobURL } from "../blob-controller";

interface Sample {
	object: Blob;
	payload: string;
}

interface BlobURL {
	// Generated blob url
	blobUrl: ReturnType<typeof toBlobURL>;
	// label
	payload: string;
}

interface DataURI {
	// Generated data uri
	dataURI: string;
	// label
	payload: string;
}

const rawPayloads: string[] = ["Hello World!"];

const blobFixtures = it.extend<{
	samples: Sample[];
	blobUrls: BlobURL[];
	dataUris: DataURI[];
}>({
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
	blobUrls: [],
	dataUris: [],
});

export default blobFixtures;
