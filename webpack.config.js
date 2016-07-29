var webpack = require('webpack')
var path = require('path')
 
module.exports = {
  entry: [
    'webpack-hot-middleware/client',
    './index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
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