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

```typescript
// codem.config.ts
import { defineConfig, VscodeChannel } from 'codem'

export default defineConfig({
  // Use stable or insider channel
  channel: VscodeChannel.Stable,
  
  // Specify VSCode version (optional)
  version: '1.86.0',
  
  // Or use a specific commit hash from microsoft/vscode repository (takes precedence over version)
  // commit: '123abc...',
  
  // Configure base URL for VSCode resources
  baseUrl: '/vscode',
  
  // Set output directory (default: ./vscode)
  output: './public/vscode'
})
```

#### 2. Run CLI

```bash
npx codem
```

#### 3. Use VSCode in your project

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>VSCode Web</title>
</head>
<body>
  <div id="app"></div>
  <script type="module">
    // import entry from the codem output
    import create from './vscode/index.js'
    
    create(window.document.body, {
      // VSCode workbench options
      folderUri: '/workspace',
      // ... other VSCode options
    })
  </script>
</body>
</html>
```

## Configuration Files

Config file can be one of the following:
- `codem.config.ts`
- `codem.config.mts`
- `codem.config.js`
- `codem.config.mjs`
- `codem.config.json`

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| channel | VscodeChannel | VscodeChannel.Stable | The VSCode release channel to use |
| version | string | 'latest' | Specific VSCode version to use |
| commit | string | undefined | Specific commit hash from microsoft/vscode repository |
| baseUrl | string | '/vscode' | Base URL path for loading VSCode resources |
| output | string | './vscode' | Directory where VSCode files will be output |

## Examples

- [playground](./playground)

## License

MIT License
