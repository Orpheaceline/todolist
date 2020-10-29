'use strict'

const path = require('path')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const MiniCssExtractPlugin  = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = merge(baseConfig, {
  mode: 'production',

  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].min.js'
  },

  optimization: {
    splitChunks: {
      minSize: 10000,
      maxSize: 250000,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ],
      }, {
        test: /\.sass?$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              indentedSyntax: true,
              resolveUrlLoader: false,
              data: '@import "./assets/sass/_variables.sass", "./assets/sass/_mixins.sass"',
              sassOptions: {
                outputStyle: 'compressed',
              },
            },
          },
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
        {
          from: 'assets/images',
          to: '../dist/images/[name].[contenthash].[ext]',
        }, {
          from: 'node_modules/@fortawesome/fontawesome-free/webfonts',
          to: '../dist/fonts/[name].[contenthash].[ext]',
        }
    ]),
    new MiniCssExtractPlugin({
          filename: "css/[name][chunkhash].css",
          allChunks: true
        }
      )
  ]
})
