/** @type {import('pkgroll').Config} */
export default {
  input: {
    index: "src/index.ts",
  },
  external: [],
  outputs: {
    cjs: true,
    esm: true,
    dts: true,
  },
  esbuild: {
    minify: true,
    target: ["es2020"],
  },
}; 