import { loadConfig } from './config'
import { downloadVscode } from './download-vscode'
import { generateEntry } from './generate-entry'
import d from 'debug'

const debug = d('webcode:cli')

async function main() {
  const config = await loadConfig()
  // download
  await downloadVscode(config)
  // generate entry
  await generateEntry(config)
}

main().catch((error) => {
  debug('error occurred', error)
  console.error(error.message)
  process.exit(1)
})
