'use strict'

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader')

console.log(path.resolve(__dirname, 'src/components'));

module.exports = {
  entry: {
    todo: './src/index.js',
    base: './assets/sass/base.sass'
  },

  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'pages': path.resolve(__dirname, '../src/pages'),
      'components': path.resolve(__dirname, '../src/components')
    }
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.(jpg|JPG|jpeg|png|gif|mp3|svg|ttf|woff2|woff|eot)$/,
        use: {
          loader: "url-loader"
        }
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      filename: "index.html",
      inject: true,
      favicon: "static/favicon.ico"
    }),
    new ESLintPlugin(),
    new VueLoaderPlugin()
  ]
}
