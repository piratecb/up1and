const path = require('path')

const createConfig = require('./webpack.base.config')
const themesConfig = require('./webpack.theme.config')

const clientPath = path.resolve(__dirname, 'client')
const serverPath = path.resolve(__dirname, 'server')
const buildPath = path.resolve(__dirname, 'server/static/assets')

const config = createConfig(
  {
    dashboard: clientPath + '/index.js',
    common: serverPath + '/assets/common.js'
  },
  buildPath
)

module.exports = themesConfig.concat([config])