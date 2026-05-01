# blob-to-url

[![npm version](https://img.shields.io/npm/v/blob-to-url?color=blue)](https://www.npmjs.com/package/blob-to-url) [![npm downloads/week](https://img.shields.io/npm/dw/blob-to-url?color=blue)](https://www.npmjs.com/package/blob-to-url) [![npm downloads/month](https://img.shields.io/npm/dm/blob-to-url?color=blue)](https://www.npmjs.com/package/blob-to-url) [![npm total downloads](https://img.shields.io/npm/dt/blob-to-url?color=blue)](https://www.npmjs.com/package/blob-to-url) [![size](https://img.shields.io/bundlephobia/minzip/blob-to-url?label=size)](https://bundlephobia.com/package/blob-to-url) [![min](https://img.shields.io/bundlephobia/min/blob-to-url?label=min)](https://bundlephobia.com/package/blob-to-url) [![license](https://img.shields.io/npm/l/blob-to-url)](https://github.com/devcomfort/blob-to-url/blob/main/LICENSE) [![types](https://img.shields.io/npm/types/blob-to-url)](https://www.npmjs.com/package/blob-to-url) [![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/) [![dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](https://www.npmjs.com/package/blob-to-url) [![CI](https://img.shields.io/github/actions/workflow/status/devcomfort/blob-to-url/release-package.yml?branch=main&label=CI)](https://github.com/devcomfort/blob-to-url/actions) [![issues](https://img.shields.io/github/issues/devcomfort/blob-to-url)](https://github.com/devcomfort/blob-to-url/issues) [![last commit](https://img.shields.io/github/last-commit/devcomfort/blob-to-url)](https://github.com/devcomfort/blob-to-url)

A lightweight, zero-dependency utility for generating **blob URLs** and **base64 data URIs** in the browser. Ships ESM, CommonJS, and UMD builds with TypeScript definitions.

## Installation

```bash
npm install blob-to-url
# or
pnpm add blob-to-url
# or
yarn add blob-to-url
```

## Quick Start

### ESM / TypeScript

```typescript
import { toBlobURL, toDataURI } from "blob-to-url";

// Create a blob URL
const blob = new Blob(["Hello, world!"], { type: "text/plain" });
const { url, revoke } = toBlobURL(blob);

console.log(url);      // blob:http://...
revoke();              // Release browser resources

// Convert blob to data URI (async)
const dataURI = await toDataURI(blob);
console.log(dataURI);  // data:text/plain;base64,SGVsbG8sIHdvcmxkIQ==
```

### CommonJS

```javascript
const { toBlobURL, toDataURI } = require("blob-to-url");
```

### Browser (UMD via CDN)

```html
<script src="https://unpkg.com/blob-to-url"></script>
<script>
  const { toBlobURL, toDataURI } = blobToUrl;

  const blob = new Blob(["Hello!"], { type: "text/plain" });
  const { url } = toBlobURL(blob);
  console.log(url); // blob:...
</script>
```

## API

### `toBlobURL(blob: File | Blob): { url: string; revoke: () => void }`

Creates a browser-cached URL for a File or Blob using `URL.createObjectURL`. Returns an object with:

- `url` — the generated blob URL string
- `revoke` — cleanup function that calls `URL.revokeObjectURL`

```typescript
const image = new Blob([imageData], { type: "image/png" });
const { url, revoke } = toBlobURL(image);

document.getElementById("preview").src = url;
revoke(); // Call when the URL is no longer needed
```

### `toDataURI(blob: File | Blob): Promise<string>`

Converts a File or Blob to a base64-encoded data URI using `FileReader.readAsDataURL`. Returns a Promise that resolves with the data URI string.

```typescript
const blob = new Blob(['{"key":"value"}'], { type: "application/json" });
const uri = await toDataURI(blob);
// uri = "data:application/json;base64,eyJrZXkiOiJ2YWx1ZSJ9"
```

## Features

- **Zero dependencies** — no runtime dependencies, tiny bundle
- **ESM, CommonJS, and UMD** — works everywhere
- **TypeScript-first** — type definitions included out of the box
- **Tree-shakeable** — import only what you need
- **Lightweight** — < 1KB minified + gzipped

## Build

This package uses [pkgroll](https://github.com/privatenumber/pkgroll) for ESM, CJS, and type declaration generation, and [esbuild](https://esbuild.github.io/) for the UMD/IIFE browser bundle.

## Development

```bash
pnpm install          # Install dependencies
pnpm build            # Build all outputs
pnpm test             # Run tests (requires build first)
pnpm test:ci          # Build + run all tests
```

## License

[MIT](LICENSE) © devcomfort
