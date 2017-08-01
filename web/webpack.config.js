const path = require('path');

const FlowBabelWebpackPlugin = require('flow-babel-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: `index.js`
  },
  resolve: {
    extensions: ['.js', '.glsl'],
    modules: [
      path.resolve(__dirname, 'node_modules')
    ],
    alias: {
      "canvas":    path.resolve(__dirname, "src/canvas"),
      "constants": path.resolve(__dirname, "src/constants"),
      "node":      path.resolve(__dirname, "src/node"),
      "shaders":   path.resolve(__dirname, "src/shaders"),
      "grid":      path.resolve(__dirname, "src/grid.js"),
    }
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env','stage-2'],
            plugins: ['transform-flow-comments']
          }
        }
      },
      {
        test: /\.glsl$/,
        use: 'raw-loader'
      }
    ]
  },
  plugins: [
    new FlowBabelWebpackPlugin()
  ]
};