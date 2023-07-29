import { existsSync, readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { join } from 'path'
import { rollup } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const distPath = join(__dirname, '../dist')
const BPPath = join(distPath, 'behavior_pack')
const manifestPath = join(BPPath, 'manifest.json')

if (existsSync(manifestPath)) {
  const json = JSON.parse(readFileSync(manifestPath))

  const modules = json?.modules ? json.modules : []

  for (const item of modules) {
    if (item?.language?.toLowerCase() === 'javascript' && item?.type?.toLowerCase() === 'script' && item?.entry) {
      build(join(BPPath, item.entry))
    }
  }
}

async function build(entry) {
  let bundle
  let buildFailed = false
  try {
    bundle = await rollup({ input: entry, plugins: [resolve()] })
    await bundle.write({ file: entry })
  } catch (error) {
    buildFailed = true
    // eslint-disable-next-line no-console
    console.error(error)
  }
  if (bundle) {
    await bundle.close()
  }
  process.exit(buildFailed ? 1 : 0)
}
