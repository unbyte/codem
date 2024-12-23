import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { NormalizedConfig } from './config'

export async function generateEntry({ output }: NormalizedConfig) {
  const entry = `
async function init(baseUrl) {
  globalThis._VSCODE_FILE_ROOT = \`\${baseUrl}/out/\`

  await import(\`\${baseUrl}/out/nls.messages.js\`)
  const workbench = await import(\`\${baseUrl}/out/vs/workbench/workbench.web.main.internal.js\`)

  async function create(mountpoint, config) {
    insertStyle()
    return workbench.create(mountpoint, config)

    function insertStyle() {
      // insert style from vs/workbench/workbench.web.main.css if not yet
      if (document.querySelector('link[data-name="vs/workbench/workbench.web.main"]')) {
        return
      }
      const style = document.createElement('link')
      style.rel = 'stylesheet'
      style.setAttribute('data-name', 'vs/workbench/workbench.web.main')
      style.href = \`\${baseUrl}/out/vs/workbench/workbench.web.main.css\`
      document.head.appendChild(style)
    }
  }

  const exported = {
    create
  }
  for (const key in workbench) {
    if (key === 'create' || key === 'default' || key.startsWith('__')) {
      continue
    }
    Object.defineProperty(exported, key, {
      get() {
        return workbench[key]
      }
    })
  }

  return exported
}
export default await init(import.meta.resolve('./'))
`

  const entryPath = join(output, 'index.js')
  await writeFile(entryPath, entry)
}
