export enum VscodeChannel {
  /**
   * Stable release channel
   */
  Stable = 'stable',

  /**
   * Insiders preview channel
   */
  Insider = 'insider',
}

export interface Config {
  /**
   * The VSCode release channel to use
   *
   * @default VscodeChannel.Stable
   */
  channel?: VscodeChannel

  /**
   * The specific commit hash from microsoft/vscode repository to use
   */
  commit?: string

  /**
   * The specific VSCode release version to use
   *
   * Note: If both `commit` and `version` are specified, `commit` takes precedence.
   * If neither is specified, the `latest` version will be used.
   */
  version?: string

  /**
   * The base URL path for loading VSCode web-standalone resources
   *
   * @default `/webcode`
   */
  baseUrl?: string

  /**
   * The directory where VSCode web-standalone files will be output
   *
   * @default `${cwd}/webcode`
   */
  output?: string
}
