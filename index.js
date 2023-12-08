'use strict'

const { promisify } = require('util')
const path = require('path')
const os = require('os')
const fs = require('fs')

const cache = require('@actions/tool-cache')
const core = require('@actions/core')

const chmod = promisify(fs.chmod)

if (require.main === module) {
  main().catch((err) => {
    console.error(err.stack)
    process.exit(1)
  })
}

async function main() {
  try {
    const url = core.getInput('skopeo-url')
    const version = core.getInput('skopeo-version')
    const platform = os.platform()
    let arch = os.arch()
    if (arch === 'x64') {
      arch = 'amd64'
    }

    let toolPath = cache.find('skopeo', version, arch)

    if (!toolPath) {
      const context = {
        arch,
        platform,
        version,
      }
      const rendered = url.replace(/\{(\w+?)\}/g, (_, match) => {
        return context[match] || ''
      })

      const downloadPath = await cache.downloadTool(rendered)
      toolPath = await cache.cacheFile(
        downloadPath,
        'skopeo',
        'skopeo',
        version
      )
    }

    await chmod(path.join(toolPath, 'skopeo'), 0o755)
    core.addPath(toolPath)
  } catch (error) {
    core.setFailed(error.message)
  }
}
