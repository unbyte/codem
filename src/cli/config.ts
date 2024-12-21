import { join } from 'node:path'
import { cosmiconfig } from 'cosmiconfig'
import { TypeScriptLoader } from 'cosmiconfig-typescript-loader'
import d from 'debug'
import { type Config, VscodeChannel } from '../types'

const debug = d('codem:config')

export interface Base {
  type: 'url' | 'path'
  value: string
}

export type Specifier =
  | {
      channel: VscodeChannel
      commit: string
    }
  | {
      channel: VscodeChannel
      version: string
    }

export interface NormalizedConfig {
  specifier: Specifier
  output: string
  base: Base
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
  const specifier = normalizeSpecifier()
  const base = normalizeBase()

  return {
    specifier,
    base,
    output: config.output || join(process.cwd(), 'vscode'),
  }

  function normalizeSpecifier(): Specifier {
    const channel = config.channel || VscodeChannel.Stable
    if (config.commit) {
      console.log('using commit', config.commit)
      return {
        channel,
        commit: config.commit,
      }
    } else if (config.version) {
      console.log('using version', config.version)
      return {
        channel,
        version: config.version,
      }
    } else {
      console.log('no version or commit found, using latest')
      return {
        channel,
        version: 'latest',
      }
    }
  }

  function normalizeBase(): Base {
    if (config.baseUrl) {
      return {
        type: 'url',
        value: config.baseUrl.replace(/\/$/, ''),
      }
    } else {
      return {
        type: 'path',
        value: config.basePath?.replace(/\/$/, '') || '/vscode',
      }
    }
  }
}
