/**
 * Shared functions for server integration, performance, and e2e testing
 */
'use strict';

const app = require('../../server/server-entry');
const request = require('supertest');

exports.app = app;
exports.request = request;

exports.newAgent = function() {
  return request.agent(app);
};
