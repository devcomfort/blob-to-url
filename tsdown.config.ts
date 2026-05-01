import { defineConfig } from 'tsdown'
import { renameSync, copyFileSync, existsSync, unlinkSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['esm', 'cjs', 'iife'],
  platform: 'browser',
  target: 'es2020',
  globalName: 'blobToUrl',
  dts: {
    cjsReexport: true,
  },
  outExtensions: ({ format }) => {
    if (format === 'iife') return { js: '.global.js' }
  },
  minify: true,
  clean: true,
  sourcemap: false,
  hooks: {
    'build:done': () => {
      const distDir = resolve(process.cwd(), 'dist')
      const iifeSrc = resolve(distDir, 'index.iife.global.js')
      const iifeDst = resolve(distDir, 'index.global.js')
      if (existsSync(iifeSrc)) {
        renameSync(iifeSrc, iifeDst)
      }
      const iifeDts = resolve(distDir, 'index.iife.global.d.ts')
      if (existsSync(iifeDts)) {
        unlinkSync(iifeDts)
      }
      const dtsSrc = resolve(distDir, 'index.d.ts')
      const dtsDst = resolve(distDir, 'index.d.cts')
      if (existsSync(dtsSrc) && existsSync(dtsDst)) {
        copyFileSync(dtsSrc, dtsDst)
      }
    },
  },
})
