/**
 * Error responses
 */

'use strict';

var logger = require('../logs').getLogger('errors');
var config = require('../../environment');

var _ = require('lodash');
var accepts = require('accepts');

/**
 * Custom error type so we can recognize 'expected' errors we throw in our error handler
 * @param msg
 * @param status
 * @param errors
 * @constructor
 */
function HandledError(status, msg, errors) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  this.message = msg;
  this.status = status || 500;
  this.errors = errors || {};
}
HandledError.prototype = new Error(); // inherits from Error
HandledError.prototype.constructor = HandledError;
HandledError.prototype.name = 'HandledError';
HandledError.prototype.toString = function () {
  return this.name + (this.status ? ' (' + this.status + '): ' : ': ') + (this.message || '') +
    _.values(this.errors).join(', ');
};
exports.HandledError = HandledError;

/**
 * When HandledError is deserialized it loses it's type. This helps us rebuild it to it's correct type.
 * @param serializedError an object with fields similar to HandledError
 */
exports.reconstitute = function reconstitute(serializedError) {
  return new HandledError(serializedError.status, serializedError.message, serializedError.errors);
};

/**
 * Express route handler that passes the supplied status to our error handler
 * Usage note: you will get better stack traces if you forgo this method and directly throw HandledError
 * @param statusCode HTTP status code to return (500 if not defined)
 * @param msg optional message
 * @returns {Function}
 */
function sendError(statusCode, msg) {
  return function (req, res, next) {
    var err = new HandledError(statusCode, msg);
    if (next) {
      return next(err);
    } else {
      throw err;
    }
  };
}
exports.sendError = sendError;

/**
 * Express route middleware to capture HandledError and render them nicely to the user
 */
function handleError(err, req, res, next) {
  if (!(err instanceof HandledError)) { // not our error
    return next(err);
  }
  if ([
    400, 401, 403, 404, 500
  ].indexOf(err.status) === -1) { // not an error we have a template for, so we shouldn't handle it
    return next(err);
  }

  // it's ours, we can handle this one

  logger.id(req.session.logId).warn(err.toString()); // show it in the log for easier debugging

  var result = {
    status: err.status,
    message: err.message || undefined,
    errors: err.errors
  };
  res.status(result.status);
  if (accepts(req).type('json', 'html') === 'json') {
    return res.status(result.status).json(result);
  }
  res.render(err.status + '', {
    appConfigVersionRevision: (config.appConfig.version || {}).revision,
    errorMessage: err.message || undefined
  }, function (err, html) {
    if (err) {
      return res.status(result.status).json(result);
    }

    res.send(html);
  });
}
exports.handleError = handleError;
