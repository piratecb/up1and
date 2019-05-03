const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')

const buildPath = path.resolve(__dirname, 'build')

const config = {
  mode: 'development',
  entry: {
    main: path.resolve(__dirname, 'assets') + '/main.js'
  },
  output: {
    path: buildPath,
    filename: '[name].[chunkhash].js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ManifestPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.css']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
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

module.exports = config