# codem

> easily embed VSCode web-standalone in projects

## Installation

```bash
# npm
$ npm install -D codem

# pnpm
$ pnpm add -D codem

# yarn
$ yarn add -D codem
```

## Quick Start

#### 1. Create Config File

Config file can be one of the following:
- `codem.config.ts`
- `codem.config.mts`
- `codem.config.js`
- `codem.config.mjs`
- `codem.config.json`

```typescript
// codem.config.ts
import { defineConfig, VscodeChannel } from 'codem'

export default defineConfig({
  // Use stable or insider channel
  channel: VscodeChannel.Stable,
  
  // Specify VSCode version (optional)
  version: '1.96.1'
  
  // Or use a specific commit hash from microsoft/vscode repository (takes precedence over version)
  // commit: '123abc...',

  // The output directory for downloaded VSCode files
  output: './public/vscode'
})
```

#### 2. Run CLI

```bash
npx codem
```

#### 3. Use VSCode in your project

```typescript
// import entry from the codem ${output}/index.js
import workbench from '/vscode/index.js'

await workbench.create(window.document.body, {
  // vscode workbench construction options
  productConfiguration: {
    nameShort: "VSCode",
    nameLong: "VSCode in My Project",
    applicationName: "vscode-in-my-project",
    dataFolderName: ".vscode-in-my-project",
    version: "1.0.0",
  },
  // ... other options
})
```

See [Web Workbench API](https://github.com/microsoft/vscode/blob/main/src/vs/workbench/browser/web.api.ts) for more available options.

## Examples

- [playground](./playground)

## License

MIT License
