import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { NormalizedConfig } from './config'

export async function generateEntry({ base, output }: NormalizedConfig) {
  const fragments = []
  fragments.push(`
async function createVSCode(baseUrl, mountpoint, config) {
  globalThis._VSCODE_FILE_ROOT = \`\${baseUrl}/out/\`
  await import(\`\${baseUrl}/out/nls.messages.js\`)
  const { create } = await import(\`\${baseUrl}/out/vs/workbench/workbench.web.main.internal.js\`)
  insertStyle(baseUrl)
  return create(mountpoint, config)
}`)

  fragments.push(`
function insertStyle(baseUrl) {
  // insert style from vs/workbench/workbench.web.main.css if not yet
  if (document.querySelector('link[data-name="vs/workbench/workbench.web.main"]')) {
    return
  }
  const style = document.createElement('link')
  style.rel = 'stylesheet'
  style.setAttribute('data-name', 'vs/workbench/workbench.web.main')
  style.href = \`\${baseUrl}/out/vs/workbench/workbench.web.main.css\`
  document.head.appendChild(style)
}`)

  if (base.type === 'url') {
    fragments.push(`
export default function(mountpoint, config) {
  return createVSCode(${JSON.stringify(base.value)}, mountpoint, config)
}`)
  } else {
    fragments.push(`
function getBaseUrl() {
  const url = new URL(window.location.href)
  url.pathname = ${JSON.stringify(base.value)}
  url.search = ''
  url.hash = ''
  return url.toString()
}`)
    fragments.push(`
export default function(mountpoint, config) {
  return createVSCode(getBaseUrl(), mountpoint, config)
}`)
  }

  const entry = fragments.join('\n')

  const entryPath = join(output, 'index.js')
  await writeFile(entryPath, entry)
}
