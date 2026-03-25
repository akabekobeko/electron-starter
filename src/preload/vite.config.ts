import { defineConfig } from 'vite'
import { builtinModules } from 'node:module'
import path from 'node:path'
import { getElectronNodeTarget } from '../../scripts/electron-chrome-version.mjs'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

export default defineConfig({
  root: __dirname,
  build: {
    target: getElectronNodeTarget(),
    outDir: '../../dist/preload',
    lib: {
      entry: 'index.ts',
      formats: ['cjs'],
      fileName: () => 'index.cjs'
    },
    minify: false,
    emptyOutDir: true,
    rolldownOptions: {
      external: [
        'electron',
        ...builtinModules,
        ...builtinModules.map((m) => `node:${m}`)
      ]
    }
  }
})
