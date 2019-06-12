const path = require('path');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const FlowBabelWebpackPlugin = require('flow-babel-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
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
      "dat":       path.resolve(__dirname, "src/lib/dat-gui.min.js"),
      "stats":     path.resolve(__dirname, "src/lib/stats.js"),
    }
  },
  devtool: process.env.NODE_ENV === 'production' ? 'none' : 'source-map',
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
  devServer: {
    host: '0.0.0.0',
    port: 8088,
    contentBase: './public',
    historyApiFallback: true,
    overlay: {
      errors: true,
    },
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
  },
  plugins: [
    new FlowBabelWebpackPlugin(),
    process.env.NODE_ENV === 'production' ? new UglifyJSPlugin() : () => {},
    new HtmlWebpackPlugin({
      title: 'Interlace',
      hash: true,
      template: './src/index.html'
    }),
  ],
  externals: {
    Stats: 'Stats'
  }
};