/**
 * Express configuration
 */

'use strict';

const logs = require('../logs');
const config = require('../../environment');

const path = require('path');
const fs = require('fs');
const express = require('express');
const expressSession = require('express-session');
// const csurf = require('csurf');
const bodyParser = require('body-parser');
// const p3p = require('p3p');
const serveFavicon = require('serve-favicon');
const session = require('../session');

exports.appFactory = function() {
  const app = express();

  app.enable('trust proxy'); // trust X-Forwarded-* headers from our load balancer
  app.disable('etag'); // caching and 304s cause content issues on every browser except Chrome
  // app.use(p3p(p3p.recommended)); // Allow cookies in IE IFRAME. See http://stackoverflow.com/a/16053685
  // app.use(bodyParser.urlencoded({ extended: false })); // TODO: add this if want to support HTML FORM POST
  app.use(bodyParser.json());

  // proxy in alternative methods of carrying the session ID as a work-around for third-party cookie policies.
  // WARNING: these can expose us to session fixation attacks if used unwisely
  app.use(session.urlRewriteSessionId);
  app.use(session.bearerSessionId);

  // Some session and security
  app.use(expressSession({
    // store: sessionStore, using memory store. TODO: swap in mongodb or redis session store
    name: config.cookieName, // RFC6265 compliant name. https://github.com/expressjs/cookie-session/issues/16
    secret: config.secrets.session,
    cookie: { maxAge: config.cookieMaxAgeSec * 1000 },
    saveUninitialized: false,
    resave: false
    // secureProxy: true // note: we could lock down the cookie security to domain and SSL, but we expose the session ID elsewhere anyway
  }));

  // generate a unique session tracking ID for the logs
  app.use((req, res, next) => {
    if (!req.session.logId) {
      req.session.logId = logs.generateLogId(); // attach a unique log traceId to this session
    }
    next();
  });

  // TODO: we want to apply CSRF protection to HTTP FORM POST and cookie session routes
  // app.use(csurf({}));
  // app.use(function(req, res, next) {
  //   res.cookie('XSRF-TOKEN', req.csrfToken()); // expose CSRF token to angular1 JS
  //   next();
  // });

  // if ('production' === env) {
  //
  // }

  // if (config.env === 'development' || config.env === 'test') {
  //   app.use(require('connect-livereload')());
  // }

  // Expose our git commit ID for easier problem diagnosis
  config.appConfig.version = JSON.parse(fs.readFileSync(path.join(config.root, 'public', 'version.json')));
  app.use(serveFavicon(path.join(config.root, 'public', 'favicon.ico')));

  // Serve static files (only the '.tmp' is really needed for webpack client)
  app.use('/public', express.static(path.join(config.root, '.tmp/public')));
  app.use('/public', express.static(path.join(config.root, 'public')));
  app.use('/node_modules', express.static(path.join(config.root, 'node_modules'))); // if using JSPM  then change this to jspm_packages

  // prevent IE from caching any AJAX responses
  app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache');
    next();
  });

  app.use(logs.connectLogger);

  return app;
};
