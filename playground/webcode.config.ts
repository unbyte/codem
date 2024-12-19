import { VscodeChannel, defineConfig } from 'webcode'

export default defineConfig({
  channel: VscodeChannel.Stable,
  baseUrl: 'http://localhost:8080/webcode',
})
