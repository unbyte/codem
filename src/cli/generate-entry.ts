import type { NormalizedConfig } from "./config"
import { writeFile } from "node:fs/promises"
import { join } from "node:path"

export async function generateEntry(config: NormalizedConfig) {
    const entry = `
export default async function(mountpoint, config) {
    globalThis._VSCODE_FILE_ROOT = '${config.baseUrl}/out/'
    await import('${config.baseUrl}/out/nls.messages.js')
    const { create } = await import('${config.baseUrl}/out/vs/workbench/workbench.web.main.internal.js')
    insertStyle()
    return create(mountpoint, config)
}

function insertStyle() {
    // insert style from vs/workbench/workbench.web.main.css if not yet
    if (document.querySelector('link[data-name="vs/workbench/workbench.web.main"]')) {
        return
    }
    const style = document.createElement('link')
    style.rel = 'stylesheet'
    style.setAttribute('data-name', 'vs/workbench/workbench.web.main')
    style.href = "${config.baseUrl}/out/vs/workbench/workbench.web.main.css"
    document.head.appendChild(style)
}
`
  const entryPath = join(config.output, 'index.js')
  await writeFile(entryPath, entry)
}

