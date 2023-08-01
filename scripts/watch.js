/* eslint-disable camelcase */
import { existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { join } from 'path'
import { spawnSync } from 'child_process'
import chokidar from 'chokidar'
import { copy } from 'fs-extra'

const { LOCALAPPDATA } = process.env
const [game] = process.argv.slice(2)

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const distPath = join(__dirname, '../dist')
const BPPath = join(__dirname, '../src/behavior_pack')
const RPPath = join(__dirname, '../src/resource_pack')
const distBPPath = join(distPath, 'behavior_pack')
const distRPPath = join(distPath, 'resource_pack')

const gamePath = join(LOCALAPPDATA, '/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang')
const development_behavior_packs = join(gamePath, 'development_behavior_packs')
const development_resource_packs = join(gamePath, 'development_resource_packs')

const NPM = process.platform === 'win32' ? 'npm.cmd' : 'npm'

if (existsSync(BPPath)) chokidar.watch(BPPath).on('change', throttle(handler))
if (existsSync(RPPath)) chokidar.watch(RPPath).on('change', throttle(handler))

function handler() {
  spawnSync(NPM, ['run', 'build'])
  if (game === 'game') {
    if (existsSync(distBPPath)) copy(distBPPath, join(development_behavior_packs, '_dev_behavior_pack'))
    if (existsSync(distRPPath)) copy(distBPPath, join(development_resource_packs, '_dev_resource_pack'))
  }
}

function throttle(callback, wait = 1000) {
  let pre = 0
  return function () {
    let now = new Date()
    if (now - pre > wait) {
      callback.apply(this, arguments)
      pre = now
    }
  }
}
