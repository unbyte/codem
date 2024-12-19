import { Transform } from 'node:stream'

export function progress(label: string, total: number) {
  let current = 0
  const stream = new Transform({
    transform(chunk, _, callback) {
      current += chunk.length
      process.stdout.write(`${label} ${Math.round((current / total) * 100)}%\r`)
      callback(null, chunk)
    },
  })
  return {
    stream,
    [Symbol.dispose]() {
      process.stdout.write('\n')
    },
  }
}
