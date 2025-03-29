import { describe } from "vitest";

import { toDataURI } from "../data-uri-controller";
import blobFixtures from "./blob-files";

describe("Test: toDataURI", () => {
	blobFixtures("dataURI assign test", ({ samples }) => {});
});
