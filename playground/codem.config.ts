import { VscodeChannel, defineConfig } from 'codem'

export default defineConfig({
  channel: VscodeChannel.Stable,
  baseUrl: 'http://localhost:8080/vscode',
})
