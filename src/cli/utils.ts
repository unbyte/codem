import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export async function tempdir() {
  const path = await mkdtemp(join(tmpdir(), 'webcode-'))
  return {
    path,
    async [Symbol.asyncDispose]() {
      await rm(path, { recursive: true, force: true })
    },
  }
}
