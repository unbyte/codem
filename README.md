# webcode

> a tool to easily set up and embed VSCode web-standalone in projects.

## Installation

```bash
# npm
npm install webcode

# pnpm
pnpm add webcode

# yarn
yarn add webcode
```

## Quick Start

#### 1. Create Config File

```typescript
// webcode.config.ts
import { defineConfig, VscodeChannel } from 'webcode'

export default defineConfig({
  // Use stable or insider channel
  channel: VscodeChannel.Stable,
  
  // Specify VSCode version (optional)
  version: '1.86.0',
  
  // Or use a specific commit hash from microsoft/vscode repository (takes precedence over version)
  // commit: '123abc...',
  
  // Configure base URL for VSCode resources
  baseUrl: '/webcode',
  
  // Set output directory (default: ./webcode)
  output: './public/webcode'
})
```

#### 2. Run CLI

```bash
npx webcode
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
    // import entry from the webcode output
    import create from './webcode/index.js'
    
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
- `webcode.config.ts`
- `webcode.config.mts`
- `webcode.config.js`
- `webcode.config.mjs`
- `webcode.config.json`

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| channel | VscodeChannel | VscodeChannel.Stable | The VSCode release channel to use |
| version | string | 'latest' | Specific VSCode version to use |
| commit | string | undefined | Specific commit hash from microsoft/vscode repository |
| baseUrl | string | '/webcode' | Base URL path for loading VSCode resources |
| output | string | './webcode' | Directory where VSCode files will be output |

## Examples

- [playground](./playground)

## License

MIT License
