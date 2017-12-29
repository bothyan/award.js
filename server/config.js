import { join } from 'path'
import { existsSync } from 'fs'

const cache = new Map()

const defaultConfig = {
  dist: '.award',
  page: 'pages',
  assetPrefix: '/award'
}

export default function getConfig (dir) {
  if (!cache.has(dir)) {
    cache.set(dir, loadConfig(dir))
  }
  return cache.get(dir)
}

function loadConfig(dir) {
    
  const path = join(dir, 'award.config.js')

  let userConfig = {}

  const userHasConfig = existsSync(path)
  if (userHasConfig) {
    const userConfigModule = require(path)
    userConfig = userConfigModule.default || userConfigModule
  }

  return withDefaults(userConfig)
}

function withDefaults (config) {
  return Object.assign({}, defaultConfig, config)
}
