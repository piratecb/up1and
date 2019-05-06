const CleanWebpackPlugin = require('clean-webpack-plugin')
const WebpackAssetsManifest = require('webpack-assets-manifest')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function createConfig(entry, outpath) {
  let config = {
    mode: 'development',
    output: {
      filename: '[name].[chunkhash].js',
    },
    plugins: [
      new CleanWebpackPlugin(),
      new WebpackAssetsManifest(),
      new MiniCssExtractPlugin({
        filename: '[name].[chunkhash].css'
      })
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
          use: [MiniCssExtractPlugin.loader, 'css-loader']
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
  config.entry = entry
  config.output.path = outpath
  return config
}

module.exports = createConfig