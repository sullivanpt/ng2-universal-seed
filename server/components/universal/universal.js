'use strict';

const path = require('path');
const config = require('../../environment');
const logger = require('../logs').getLogger('universal');
const publicRoot = path.join(config.root, 'public');

const auth = require('../auth');

// Angular 2
require('angular2-universal-preview/polyfills');
const ng2Universal = require('angular2-universal-preview');
const ng2Core = require('angular2/core');
const ng2Router = require('angular2/router');

// Application
const App = require(path.join(publicRoot, 'app/app'));
const ServerOnlyApp = require(path.join(publicRoot, 'server-only-app/server-only-app'));
// TODO: for better SEO. import {Title} from './server-only-app/server-only-app';

/**
 * This function registers the view engine and routes for server side angular2 renders.
 * We assume the user's session is initialized before we get here.
 */
module.exports = function(app) {
  // TODO: is this necessary on server, should we not do this in 'development' mode?
  ng2Core.enableProdMode();

  // Angular 2 Express View Engine
  app.engine('.html', ng2Universal.expressEngine);
  app.set('views', publicRoot);
  app.set('view engine', 'html');

  // Angular 2 'App' route handler
  function ngApp(req, res) {
    let baseUrl = '/';
    let url = req.originalUrl || '/';

    logger.id(req.session.logId).debug('render', url);
    auth.authorize(req); // TODO: move this once we get a user model

    res.render('index', {
      directives: [App, ServerOnlyApp], // [App, Title],
      providers: [
        ng2Core.provide(ng2Router.APP_BASE_HREF, { useValue: baseUrl }),
        ng2Core.provide(ng2Universal.REQUEST_URL, { useValue: url }),
        ng2Router.ROUTER_PROVIDERS,
        ng2Universal.NODE_LOCATION_PROVIDERS,
        // TODO: inject logger.id(req.session.logId). Need to research angular2 dairy.js too
      ],
      preboot: true // note: when true client angular2 app will not start until prebootComplete is called
    });
  }

  // Routes
  // TODO: only recognize ng2Router paths and pass the rest through so express will 404 them
  app.use('/:url(|home|about)', ngApp);

  return ngApp;
};
