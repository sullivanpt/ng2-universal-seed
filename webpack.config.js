'use strict';

var webpackMerge = require('webpack-merge');
var webpack = require('webpack');
var path = require('path');

var commonConfig = {
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [ // bottom to top order
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(true)
  ]
};

var clientConfig = {
  devtool: 'cheap-module-source-map',
  debug: true,
  target: 'web',
  entry: './public',
  output: {
    path: path.join(__dirname, '.tmp', 'public')
  }
};

// Default config
var defaultConfig = {
  module: {
    noParse: [
      path.join(__dirname, 'zone.js', 'dist'),
      path.join(__dirname, 'angular2', 'bundles')
    ]
  },
  context: __dirname,
  resolve: {
    root: path.join(__dirname, 'public')
  },
  output: {
    publicPath: path.resolve(__dirname),
    filename: 'bundle.js'
  }
};

module.exports = webpackMerge({}, defaultConfig, commonConfig, clientConfig);
