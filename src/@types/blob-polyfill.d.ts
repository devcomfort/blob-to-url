declare module "blob-polyfill" {
  export class Blob extends globalThis.Blob {}
  export class File extends globalThis.File {}
  export class FileReader extends globalThis.FileReader {}
  export class URL extends globalThis.URL {}
}
