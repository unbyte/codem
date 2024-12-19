export enum VscodeChannel {
  /**
   * stable channel.
   */
  Stable = 'stable',

  /**
   * insider channel.
   */
  Insider = 'insider',
}

export interface Config {
  /**
   * The channel to use.
   *
   * @default VscodeChannel.Stable
   */
  channel?: VscodeChannel

  /**
   * The commit hash of microsoft/vscode to use.
   */
  commit?: string

  /**
   * The released version of vscode to use.
   *
   * If both `commit` and `version` are provided, `commit` will be used.
   *
   * If neither are provided, the latest version will be used.
   */
  version?: string

  /**
   * The base url which will be used to reference resources from
   * the vscode web-standalone.
   *
   * @default `/webcode`
   */
  baseUrl?: string

  /**
   * The output directory of the vscode web-standalone.
   *
   * @default `${cwd}/webcode`
   */
  output?: string
}
