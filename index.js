'use strict';

// Use babel primarily to process import statements
// TODO: is node babel in production really a good idea?
// maybe harmony flag or node 5+ would be better and more efficient
//
// for now we just stick to require() instead of import. it's MUCH faster than babel
// require('babel-register');

require('./server/server-entry');
