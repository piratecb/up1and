const webpack = require('webpack')
const path = require('path')

const BUILD_DIR = path.resolve(__dirname, 'app/static/js')
const APP_DIR = path.resolve(__dirname, 'app/dashboard')

const config = {
  entry: APP_DIR + '/app.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'dashboard.js'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel-loader',
        options: {
        plugins: [
          ['import', { libraryName: "antd", style: true }]
        ]
      }
    ]
  }
}

module.exports = config