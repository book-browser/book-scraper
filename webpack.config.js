const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development',
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
  target: 'node',
  devtool: 'eval-source-map',
  plugins: [new Dotenv({ systemvars: true })]
};
