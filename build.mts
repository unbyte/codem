import { rm } from 'node:fs/promises'
import { build } from 'tsup'

console.log('Cleaning dist')
await rm('dist', { recursive: true, force: true })

console.log('Building CLI')
await build({
  entry: ['src/cli/index.ts'],
  outDir: 'dist/cli',
  format: ['cjs'],
  minify: true,
  platform: 'node',
})

console.log('Building Config')
await build({
  entry: ['src/helper/index.ts'],
  outDir: 'dist/helper',
  format: ['esm', 'cjs'],
  minify: true,
  dts: true,
})
