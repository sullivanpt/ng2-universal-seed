'use strict';

var path = require('path');
var _ = require('lodash');

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV || 'development',

  // Root path of server
  root: path.normalize(path.resolve(__dirname, '../..')),

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // build version and time, provided by Gruntfile.js and config/express.js
  appConfig: {},

  // Should we populate the DB with sample data?
  // add - add or migrate missing seed data, but never delete
  // reset - delete all DB data and add it back from scratch
  seedDB: 'add',

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'floorview-webserver-s#cr!@'
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
