import { defineConfig } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import sucrase from "@rollup/plugin-sucrase";
import terser from "@rollup/plugin-terser";

export default defineConfig({
  input: "./src/index.ts",
  output: {
    file: "dist/index.global.js",
    format: "umd",
    name: "blobToUrl",
    sourcemap: false,
  },
  plugins: [
    resolve({
      extensions: [".js", ".ts"],
    }),
    sucrase({
      transforms: ["typescript"],
    }),
    terser({
      compress: true,
      mangle: true,
    }),
  ],
}); 