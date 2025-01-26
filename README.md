# blob-to-url

A lightweight utility for generating blob URLs and data URIs with ESM and CJS support.

## Features

- Supports both ESM and CommonJS module systems
- Generate blob URLs
- Convert blobs to data URIs

## API

- `toBlobURL(_blob: File | Blob)`: Creates a blob URL
  - Returns `{ url: string, revoke: () => void }`
- `toDataURI(_blob: File | Blob)`: Converts blob to base64 encoded URL
  - Returns `string`

## Usage Examples

```typescript
// ESM Import
import { toBlobURL, toDataURI } from "blob-to-url";

// CommonJS Require
const { toBlobURL, toDataURI } = require("blob-to-url");

// Blob URL Example
const { url, revoke } = toBlobURL(myBlob);
console.log(url);  // Blob URL
revoke();  // Clean up resource

// Data URI Example
const dataURI = toDataURI(myBlob);
console.log(dataURI);  // Base64 encoded URL
```

## Development Roadmap

- [ ] Implement Vitest test suite
- [ ] Set up GitHub Actions for CI/CD