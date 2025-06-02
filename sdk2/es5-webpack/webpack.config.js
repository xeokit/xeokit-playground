const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
    publicPath: './'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: ['> 1%', 'last 2 versions', 'ie >= 11']
                },
                modules: 'commonjs',
                useBuiltIns: 'entry',
                corejs: { version: 3, proposals: true }
              }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.wasm$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html'
    }),
    new webpack.DefinePlugin({
      'ENVIRONMENT_IS_NODE': false,
      'ENVIRONMENT_IS_WEB': true,
      'ENVIRONMENT_IS_SHELL': false
    })
  ],
  resolve: {
    extensions: ['.js', '.json'],
    fallback: {
      fs: false,
      path: false
    }
  },
  optimization: {
    minimize: false
  }
};
