import { join } from 'node:path'
import { cosmiconfig } from 'cosmiconfig'
import { TypeScriptLoader } from 'cosmiconfig-typescript-loader'
import d from 'debug'
import { type Config, VscodeChannel } from '../types'

const debug = d('webcode:config')

export interface NormalizedConfig {
  channel: VscodeChannel
  version?: string
  commit?: string
  output: string
  baseUrl: string
}

export async function loadConfig() {
  const explorer = cosmiconfig('webcode', {
    searchPlaces: [
      'package.json',
      'webcode.config.mts',
      'webcode.config.ts',
      'webcode.config.mjs',
      'webcode.config.js',
      'webcode.config.json',
    ],
    loaders: {
      '.ts': TypeScriptLoader(),
      '.mts': TypeScriptLoader(),
    },
  })

  try {
    const result = await explorer.search()
    if (!result?.config) {
      throw new Error('webcode: no configuration file found')
    }
    debug('read configuration from', result?.filepath)
    debug('raw configuration', result?.config)
    const normalized = normalizeConfig(result.config)
    debug('normalized configuration', normalized)
    return normalized
  } catch (error) {
    throw new Error('webcode: failed to load configuration', { cause: error })
  }
}

function normalizeConfig(config: Config): NormalizedConfig {
  let version: string | undefined
  let commit: string | undefined
  if (config.commit) {
    commit = config.commit
  } else if (config.version) {
    version = config.version
  } else {
    version = 'latest'
  }
  return {
    output: config.output || join(process.cwd(), 'webcode'),
    channel: config.channel || VscodeChannel.Insider,
    baseUrl: config.baseUrl || '/webcode',
    version,
    commit,
  }
}
