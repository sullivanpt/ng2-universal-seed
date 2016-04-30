'use strict';

var path = require('path');
var _ = require('lodash');

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(path.resolve(__dirname, '../..')),

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Configuring application public DNS URL
  // Usually this is the load balancer or reverse proxy where SSL is terminated for this app.
  // This typically has the form: "https://<host>[/<root path>]"
  //
  // TODO: when not explicitly provided determine this dynamically using reverse DNS
  rootUrl: process.env.ROOT_URL || 'http://localhost:9000',

  // build version and time, provided by Gruntfile.js and config/express.js
  appConfig: {},

  // Should we populate the DB with sample data?
  // add - add or migrate missing seed data, but never delete
  // reset - delete all DB data and add it back from scratch
  seedDB: 'add',

  // name of express-session cookie
  cookieName: 'express.sess',

  // session expiration time
  // currently set to 30 minutes
  cookieMaxAgeSec: 3600,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'keyboard-cat'
  },

  analytics: {
    gaTrackingId: process.env.GOOGLE_ANALYTICS_ID || 'UA-XXXXXXXX-X'
  },
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + all.env + '.js') || {});
