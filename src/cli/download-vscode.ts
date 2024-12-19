import { rename, rm } from 'node:fs/promises'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import d from 'debug'
import gunzip from 'gunzip-maybe'
import { extract } from 'tar-fs'
import type { NormalizedConfig } from './config'
import { progress, tempdir } from './utils'

const debug = d('webcode:download-vscode')

export async function downloadVscode(config: NormalizedConfig) {
  await using downloadDir = await tempdir()
  debug('download directory', downloadDir.path)

  debug('remove output directory', config.output)
  await rm(config.output, { recursive: true, force: true })

  const specifier = config.commit ? `commit:${config.commit}` : config.version
  debug('specifier', specifier)

  const url = `https://update.code.visualstudio.com/${specifier}/web-standalone/${config.channel}`
  debug('downloading vscode from', url)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('failed to download VSCode', { cause: response })
  }

  const stream = response.body
  if (!stream) {
    throw new Error('response body is null', { cause: response })
  }

  const raw = Readable.fromWeb(stream)

  try {
    const total = Number(response.headers.get('content-length')) || 0
    using bar = progress('Downloading VSCode...', total)
    await pipeline(
      raw,
      bar.stream,
      gunzip(),
      extract(downloadDir.path, { strip: 1 }),
    )
  } catch (error) {
    throw new Error('failed to extract VSCode', { cause: error })
  }

  await rename(downloadDir.path, config.output)
}
