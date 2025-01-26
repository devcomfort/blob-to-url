import { defineConfig } from "rollup";

import clear from "rollup-plugin-clear";
import terser from "@rollup/plugin-terser";

import sucrase from "@rollup/plugin-sucrase";
import resolve from "@rollup/plugin-node-resolve";
import dts from "rollup-plugin-dts";
import progress from "rollup-plugin-progress";

export default defineConfig([
	// Setup for ESM, CJS, and UMD module.
	{
		input: "./src/index.ts",
		treeshake: "recommended",
		output: [
			{
				dir: "dist/esm",
				format: "esm",
			},
			{
				dir: "dist/cjs",
				format: "cjs",
			},
			{
				dir: "dist/umd",
				format: "umd",
				name: "blobToUrl",
			},
		],
		plugins: [
			// 기존 빌드 파일 제거
			clear({
				targets: ["./dist"],
				watch: true,
			}),
			progress(),
			resolve({
				extensions: [".js", ".ts"],
			}),
			sucrase({
				transforms: ["typescript"],
			}),
			terser({
				compress: true,
				sourceMap: true,
				module: true,
				mangle: true,
			}),
		],
	},
	// Setup for ambient file (e.g. ".d.ts")
	{
		input: "src/index.ts",
		treeshake: "recommended",
		output: {
			dir: "./dist",
			format: "esm",
		},
		plugins: [dts()],
	},
]);
