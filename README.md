# blob-to-url

A lightweight utility for generating blob URLs and data URIs with ESM, CJS, and UMD support.

## Features

- Supports ESM, CommonJS, and UMD module systems
- Generate blob URLs
- Convert blobs to data URIs
- No external dependencies
- TypeScript definitions included

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

// Browser (UMD)
<script src="https://unpkg.com/blob-to-url"></script>
<script>
  const { toBlobURL, toDataURI } = window.blobToUrl;
</script>

// Blob URL Example
const { url, revoke } = toBlobURL(myBlob);
console.log(url);  // Blob URL
revoke();  // Clean up resource

// Data URI Example
const dataURI = toDataURI(myBlob);
console.log(dataURI);  // Base64 encoded URL
```

## Build System

This package uses [pkgroll](https://github.com/privatenumber/pkgroll) for ESM and CJS build, and Rollup for UMD build.

## Development

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Run tests
pnpm test
```

## CI/CD

The project uses GitHub Actions for continuous integration and deployment:

- Automated tests run on pull requests
- Automated builds and npm package publishing
- Manual releases via GitHub Actions workflow

## Development Status

- [x] ESM, CJS, and UMD module support
- [x] Implement Vitest test suite with Edge Runtime
- [x] Set up GitHub Actions for CI/CD