'use strict';

const path = require('path');
const config = require('../../environment');
const logger = require('../logs').getLogger('universal');
const publicRoot = path.join(config.root, 'public');

const auth = require('../auth');

// Angular 2
require('angular2-universal-polyfills');
const ng2Core = require('@angular/core');
const ng2ExpressEngine = require('angular2-express-engine');

// Application
const ModuleServer = require(path.join(publicRoot, 'module-server'));

/**
 * This function registers the view engine and routes for server side angular2 renders.
 * We assume the user's session is initialized before we get here.
 */
module.exports = function(app) {
  // TODO: is this necessary on server, should we not do this in 'development' mode?
  ng2Core.enableProdMode();

  // Angular 2 Express View Engine
  app.engine('.html', ng2ExpressEngine.createEngine());
  app.set('views', publicRoot);
  app.set('view engine', 'html');

  // Angular 2 'App' route handler
  function ngApp(req, res) {
    let url = req.originalUrl || '/'; // TODO: do we stll need to set a default when empty? Is it ever empty?

    logger.id(req.session.logId).debug('render', url);
    auth.authorize(req); // TODO: move this once we get a user model

    res.render('index', {
      req,
      res,
      ngModule: ModuleServer,
      preboot: false, // TODO: enable preboot as below
      /*
      async: true,
      preboot: { // note: when truthy client angular2 app will not start until prebootComplete is called
        debug: true, // TODO: preboot currently not working, load is called after complete
        uglify: false
      }
      */
      baseUrl: '/',
      requestUrl: url,
      originUrl: config.rootUrl, // TODO: what does this do?

      // TODO: inject logger.id(req.session.logId). Need to research angular2 dairy.js too
    });
  }

  // Routes
  // TODO: only recognize ng2Router paths and pass the rest through so express will 404 them
  app.use('/:url(|home|about)', ngApp);

  return ngApp;
};
