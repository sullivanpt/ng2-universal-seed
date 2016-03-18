'use strict';

const path = require('path');
const express = require('express');

// Angular 2
require('angular2-universal-preview/polyfills');
const ng2Universal = require('angular2-universal-preview');
const ng2Core = require('angular2/core');
const ng2Router = require('angular2/router');

// Config
const config = require('./environment');

// Application
const App = require('../client/app/app');
// import {Title, ServerOnlyApp} from './server-only-app/server-only-app';

const app = express();

// TODO: is this necessary on server, should we not do this in 'development' mode?
ng2Core.enableProdMode();

// Angular 2 Express View Engine
app.engine('.html', ng2Universal.expressEngine);
app.set('views', path.join(config.root, 'client'));
app.set('view engine', 'html');

// Angular 2 'App' route handler
function ngApp(req, res) {
  let baseUrl = '/';
  let url = req.originalUrl || '/';
  res.render('index', {
    directives: [App], // [App, Title, ServerOnlyApp],
    providers: [
      ng2Core.provide(ng2Router.APP_BASE_HREF, { useValue: baseUrl }),
      ng2Core.provide(ng2Universal.REQUEST_URL, { useValue: url }),
      ng2Router.ROUTER_PROVIDERS,
      ng2Universal.NODE_LOCATION_PROVIDERS,
    ],
    preboot: true
  });
}

// Serve static files
app.use(express.static(path.join(config.root, '.tmp')));
app.use('/node_modules', express.static(path.join(config.root, 'node_modules')));
app.use('/client', express.static(path.join(config.root, 'client')));

// Routes
app.get('/', ngApp);

// Start the server by listening on a port
app.listen(config.port, function() {
  console.log(`Listening on http://localhost:${config.port} with the ${config.env} config loaded!`); // eslint-disable-line
});
