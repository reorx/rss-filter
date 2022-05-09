const path = require('path')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

const mode = process.env.WEBPACK_MODE || 'development'

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'worker.js',
    path: path.join(__dirname, 'dist'),
  },
  devtool: 'cheap-module-source-map',
  mode,
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    // fallback: {
    //   "fs": false,
    //   "tls": false,
    //   "net": false,
    //   "path": false,
    //   "zlib": false,
    //   "http": false,
    //   "https": false,
    //   "stream": false,
    //   "crypto": false,
    // }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          // transpileOnly is useful to skip typescript checks occasionally:
          // transpileOnly: true,
        },
      },
    ],
  },
  performance: {
    maxAssetSize: 1000000,
    maxEntrypointSize: 1000000,
  },
  plugins: [
    new NodePolyfillPlugin(),
  ]
}
