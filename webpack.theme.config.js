const fs = require('fs')
const path = require('path')

const createConfig = require('./webpack.base.config')
const themesPath = path.resolve(__dirname, 'content/themes')
const buildPath = path.resolve(__dirname, 'server/static/themes')

function getThemes(dir) {
  themes = []
  let files = fs.readdirSync(dir);
  for (let i in files) {
      let name = dir + '/' + files[i]
      if (fs.statSync(name).isDirectory()){
        themes.push(files[i])
      }
  }
  return themes
}

function createThemesConfig(dir) {
  let themes = getThemes(dir)
  let configs = []
  for (let i in themes) {
    let root = path.resolve(dir, themes[i])
    let entry = {
      main: path.resolve(root, 'assets/main.js')
    }
    let outpath = path.resolve(buildPath, themes[i])
    configs.push(createConfig(entry, outpath))
  }
  return configs
}

const themeConfigs = createThemesConfig(themesPath)

module.exports = themeConfigs