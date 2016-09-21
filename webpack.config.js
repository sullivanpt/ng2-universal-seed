'use strict';

var nodeExternals = require('webpack-node-externals');
var webpackMerge = require('webpack-merge');
var path = require('path');

var commonConfig = {
  // debug: true,
  context: __dirname,
  output: {
    publicPath: path.resolve(__dirname),
    filename: 'bundle.js'
  },
  resolve: {
    root: path.join(__dirname, 'public'),
    extensions: ['', '.js', '.json']
  },
  module: {
    loaders: [ // bottom to top order
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel?presets[]=es2015', 'angular2-template-loader'],
      },
      { test: /\.html$/, loader: 'raw-loader' },
      { test: /\.css$/, loader: 'raw-loader' },
      { test: /\.json$/, loader: 'json-loader' },
    ],
    noParse: [
      path.join(__dirname, 'zone.js', 'dist'),
      path.join(__dirname, 'angular2', 'bundles')
    ]
  },
  plugins: [],
};

var clientConfig = {
  devtool: 'cheap-module-source-map',
  target: 'web',
  entry: './public/client-entry.js',
  output: {
    path: path.join(__dirname, '.tmp', 'public')
  },
};

var serverConfig = {
  target: 'node',
  entry: './public/module-server.js', // we're only bundling the presentation layer, not the whole server
  output: {
    path: path.join(__dirname, '.tmp', 'server'),
    libraryTarget: 'commonjs2', // Support module.exports. See https://github.com/webpack/webpack/issues/1114
  },
  node: {
    global: true,
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: true
  },
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
};

module.exports = [
  // client bundle
  webpackMerge({}, commonConfig, clientConfig),

  // server bundle
  webpackMerge({}, commonConfig, serverConfig),
];

