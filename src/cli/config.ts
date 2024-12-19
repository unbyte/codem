import { join } from 'node:path'
import { cosmiconfig } from 'cosmiconfig'
import { TypeScriptLoader } from 'cosmiconfig-typescript-loader'
import d from 'debug'
import { type Config, VscodeChannel } from '../types'

const debug = d('codem:config')

export interface NormalizedConfig {
  channel: VscodeChannel
  version?: string
  commit?: string
  output: string
  baseUrl: string
}

export async function loadConfig() {
  const explorer = cosmiconfig('codem', {
    searchPlaces: [
      'package.json',
      'codem.config.mts',
      'codem.config.ts',
      'codem.config.mjs',
      'codem.config.js',
      'codem.config.json',
    ],
    loaders: {
      '.ts': TypeScriptLoader(),
      '.mts': TypeScriptLoader(),
    },
  })

  try {
    const result = await explorer.search()
    if (!result?.config) {
      throw new Error('codem: no configuration file found')
    }
    debug('read configuration from', result?.filepath)
    debug('raw configuration', result?.config)
    const normalized = normalizeConfig(result.config)
    debug('normalized configuration', normalized)
    return normalized
  } catch (error) {
    throw new Error('codem: failed to load configuration', { cause: error })
  }
}

function normalizeConfig(config: Config): NormalizedConfig {
  let version: string | undefined
  let commit: string | undefined
  if (config.commit) {
    console.log('using commit', config.commit)
    commit = config.commit
  } else if (config.version) {
    console.log('using version', config.version)
    version = config.version
  } else {
    console.log('no version or commit found, using latest')
    version = 'latest'
  }
  return {
    output: config.output || join(process.cwd(), 'vscode'),
    channel: config.channel || VscodeChannel.Insider,
    baseUrl: config.baseUrl || '/vscode',
    version,
    commit,
  }
}
