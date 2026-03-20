import { defineConfig } from 'vite'
import { builtinModules } from 'node:module'
import path from 'node:path'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

export default defineConfig({
  root: __dirname,
  build: {
    target: 'node22',
    outDir: '../../dist/main',
    lib: {
      entry: 'index.ts',
      formats: ['es'],
      fileName: () => 'index.js'
    },
    minify: false,
    emptyOutDir: true,
    rollupOptions: {
      external: [
        'electron',
        ...builtinModules,
        ...builtinModules.map((m) => `node:${m}`)
      ]
    }
  }
})
