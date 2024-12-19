import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Transform } from 'node:stream'

export async function tempdir() {
  const path = await mkdtemp(join(tmpdir(), 'webcode-'))
  return {
    path,
    async [Symbol.asyncDispose]() {
      await rm(path, { recursive: true, force: true })
    },
  }
}

export function progress(label: string, total: number) {
  let current = 0
  const stream = new Transform({
    transform(chunk, _, callback) {
      current += chunk.length
      process.stdout.write(`${label} ${Math.round((current / total) * 100)}%\r`)
      callback(null, chunk)
    },
  })
  return {
    stream,
    [Symbol.dispose]() {
      process.stdout.write('\n')
    },
  }
}
