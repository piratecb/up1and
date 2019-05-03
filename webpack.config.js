const webpack = require('webpack')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries")

const staticPath = path.resolve(__dirname, 'app/static')
const buildPath = path.resolve(__dirname, 'app/static/build')
const clientPath = path.resolve(__dirname, 'client')

function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  } else if (m.name) {
    return m.name;
  } else {
    return false;
  }
}

const config = {
  mode: 'development',
  entry: {
    main: [staticPath + '/js/prism.js'],
    dashboard: clientPath + '/index.js',
    style: [staticPath + '/css/style.css', staticPath + '/css/prism.css'],
    dash: [staticPath + '/css/dashboard.css'],
  },
  output: {
    path: buildPath,
    filename: '[name].[chunkhash].js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        mainStyles: {
          name: 'style',
          test: (m, c, entry = 'style') =>
            m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true,
        },
        dashStyles: {
          name: 'dash',
          test: (m, c, entry = 'dash') =>
            m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new FixStyleOnlyEntriesPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash].css',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.css']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        include: clientPath
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ]
  }
}

module.exports = config