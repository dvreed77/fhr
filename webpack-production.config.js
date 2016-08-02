//var WebpackStripLoader = require('strip-loader');
//var devConfig = require('./webpack.config.js');
//var stripLoader = {
//  test: [/\.js$/, /\.es6$/],
//  exclude: /node_modules/,
//  loader: WebpackStripLoader.loader('console.log')
//}
//devConfig.module.loaders.push(stripLoader);
//module.exports = devConfig;

// TO RUN:
// export NODE_ENV=production
// webpack --config webpack-production.config.js -p

var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    './index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],
  resolve: {
    alias: {
      'webworkify': 'webworkify-webpack'
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'babel' ],
        exclude: /node_modules/,
        include: __dirname
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.js$/,
        include: path.resolve('node_modules/mapbox-gl-shaders/index.js'),
        loader: 'transform/cacheable?brfs'
      }
    ],
    postLoaders: [{
      include: /node_modules\/mapbox-gl-shaders/,
      loader: 'transform',
      query: 'brfs'
    }]
  }
};