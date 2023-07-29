import { existsSync, mkdirSync } from 'fs'
import { exec } from 'child_process'

const dist = './dist'
const pack = './pack'
const filesToPack = [dist]
const outputZipFile = `${pack}/minecraft.mcaddon`

if (!existsSync(dist)) mkdirSync(dist)
if (!existsSync(pack)) mkdirSync(pack)

function compressFiles(files, output, callback) {
  // Windows use tar compress
  if (process.platform === 'win32') {
    const tarCommand = `tar -cf ${output} ${files.join(' ')}`
    exec(tarCommand, callback)
  } else {
    // macOS and Linux use zip compress
    const zipCommand = `zip -r ${output} ${files.join(' ')}`
    exec(zipCommand, callback)
  }
}

compressFiles(filesToPack, outputZipFile, (error) => {
  if (error) {
    // eslint-disable-next-line no-console
    console.error(`compress error: ${error.message}`)
    return
  }
  // eslint-disable-next-line no-console
  console.log('file build success')
})
