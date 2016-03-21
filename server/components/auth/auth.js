'use strict';

const errors = require('../errors');

/**
 * Mark the session as properly authorized.
 * TODO: silly at the moment, we have no user model yet
 */
exports.authorize = function(req) {
  req.session.authorized = true;
};

/**
 * middleware to test if session has been properly authorized
 */
exports.isAuthorized = function (req, res, next) {
  if (!req.session.authorized) {
    return next(new errors.HandledError(401));
  }
  next();
};
