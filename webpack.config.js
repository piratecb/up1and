const webpack = require('webpack')
const path = require('path')

const BUILD_DIR = path.resolve(__dirname, 'app/static/js')
const APP_DIR = path.resolve(__dirname, 'app/dashboard')

const config = {
  entry: APP_DIR + '/index.js',
  output: {
    path: BUILD_DIR,
    filename: 'dashboard.js'
  },
  module : {
    loaders : [
      {
        test : /\.js?/,
        include : APP_DIR,
        loader : 'babel-loader'
      }
    ]
  }
}

module.exports = config