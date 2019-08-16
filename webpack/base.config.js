const webpack = require('webpack')
const path = require('path')

const VueLoaderPlugin = require('vue-loader/lib/plugin')
const DotenvPlugin = require('dotenv-webpack')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  devtool: isProduction
    ? false
    : '#cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[chunkhash].js',
    publicPath: '/dist/'
  },
  module: {
    noParse: /es6-promise\.js$/,
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        BASE_URL: '"/"'
      }
    }),
    new DotenvPlugin({
      path: path.resolve(__dirname, '../.env')
    }),
    new webpack.HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 7
    })
  ],
  resolve: {
    extensions: [
      '.js',
      '.json',
      '.vue'
    ],
    alias: {
      'public': path.resolve(__dirname, '../public'),
      '~': path.resolve(__dirname, '../src')
    }
  },
  performance: {
    hints: false
  }
}
