import { VscodeChannel, defineConfig } from 'codem'

export default defineConfig({
  channel: VscodeChannel.Stable,
  version: 'latest',
  basePath: '/vscode',
})
