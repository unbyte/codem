import { spawn, type SpawnOptions } from 'node:child_process'
import { resolve } from 'node:path'

const run = async (command: string, args: string[] = [], options?: Partial<SpawnOptions>) => {
  console.log(`$ ${command} ${args.join(' ')}`)
  const child = spawn(command, args, {
    stdio: 'inherit',
    ...options,
  })
  await new Promise((resolve) => child.on('close', resolve))
}

const playground = resolve(import.meta.dirname, '..', 'playground')

await run('pnpm', ['webcode'], {
  cwd: playground,
})
await run('pnpm', ['http-server', '-p', '8080'], {
  cwd: playground,
})
