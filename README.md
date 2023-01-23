# blob-to-url

- Support for ESM/CJS.
- Capable of generating a blob url.
- Capable of generating a data uri.

## Preview

- `toBlobURL(_blob: File | Blob): { url: string, revoke: () => void }` : Make a Blob URL out of a Blob or File object.
- `toDataURI(_blob: File | Blob): string` : Converts a Blob or a File object to a base64 encoded URL.

## Usage

```ts
import { toBlobURL } from "blob-to-url";
import { toDataURI } from "blob-to-url";

const { toBlobURL } = require("blob-to-url");
const { toDataURI } = require("blob-to-url");

const _blobUrl = toBlobURL(_blob);
console.log(_blobUrl.url); // converted blob url.
_blobUrl.revoke(); // Revoke blob url.

const _dataURI = toDataURI(_blob);
console.log(_dataURI); // translated base64-encoded Blob|File object.
```
