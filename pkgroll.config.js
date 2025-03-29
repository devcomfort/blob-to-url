/** @type {import('pkgroll').Config} */
export default {
  input: {
    index: "src/index.ts",
  },
  external: [],
  outputs: {
    cjs: true,
    esm: true,
    umd: {
      name: "blobToUrl",
      fileName: "index.global.js",
    },
    dts: true,
  },
  esbuild: {
    minify: true,
    target: ["es2020"],
  },
}; 