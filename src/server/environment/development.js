'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/ng2-universal-dev'
  },
  redis: {
    uri: 'redis://localhost'
  },

  seedDB: 'reset',

};
