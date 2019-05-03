const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')

const kikoThemeConfig = require('./content/themes/kiko/webpack.config')

const buildPath = path.resolve(__dirname, 'build')
const clientPath = path.resolve(__dirname, 'client')
const serverPath = path.resolve(__dirname, 'server')

const config = {
  mode: 'development',
  entry: {
    dashboard: clientPath + '/index.js',
    common: serverPath + '/assets/common.js'
  },
  output: {
    path: buildPath,
    filename: '[name].[chunkhash].js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ManifestPlugin()
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.css']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
    ]
  }
}

module.exports = [config, kikoThemeConfig]