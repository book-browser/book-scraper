const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'production',
  entry: {
    refresh: './aws/refresh.handler.ts',
    scrape: './aws/scrape.handler.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    libraryTarget: 'commonjs'
  },
  plugins: [new NodePolyfillPlugin(), new Dotenv({ systemvars: true })],
  externals: [nodeExternals()]
};
