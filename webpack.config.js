const webpack = require('webpack')
const path = require('path')

const BUILD_DIR = path.resolve(__dirname, 'app/static/js')
const APP_DIR = path.resolve(__dirname, 'app/dashboard')

const config = {
  mode: 'development',
  entry: APP_DIR + '/index.js',
  output: {
    path: BUILD_DIR,
    filename: 'dashboard.js',
    hotUpdateChunkFilename: '.cache/hot-update.js',
    hotUpdateMainFilename: '.cache/hot-update.json'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: ['babel-loader'],
      include: APP_DIR
    }]
  }
}

module.exports = config