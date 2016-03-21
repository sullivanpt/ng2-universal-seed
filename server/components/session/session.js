/**
 * Session policy
 * Expose our session ID in multiple channels to work around third party cookie privacy policies.
 *
 * In particular, in addition the to storing the session ID in cookies we also:
 * - expose the session ID to client side JS so that AJAX calls can exclude it as an explicit header.
 * - expose the session ID in the path url for non AJAX calls where we cannot adjust the header.
 *
 * To be certain these policies reduce the security of the session, in particular we become vulnerable to
 * session fixation attacks.  We mitigate the risk by only accepting session ID in URLs for API routes, for
 * which we never return a new session cookie.
 */
'use strict';

// var logger = require('../logs').getLogger('session');

var url = require('url');
var config = require('../../environment');

// Helper to fake out express-session so it thinks it is getting session ID from a cookie
// See https://github.com/expressjs/session/issues/158
function setExpressSessionId(req, sessionId) {
  if (!req.signedCookies) {
    req.signedCookies = {};
  }
  req.signedCookies[config.cookieName] = sessionId;
  delete req.headers.cookie;
}

/**
 * Returns true if we are allowed to leak the session ID outside of the cookie.
 * In general since we cannot reliably know if a customer's browser handles our cookies
 * correctly we always return true for a valid payload.
 * But to keep our unit tests simple we keep the option to turn of session ID leaking.
 */
function leakSessionId(req) {
  if (req.session && req.session.payload) {
    return !req.session.payload.cookie; // if 'payload.cookie' is true do not leak session
  }
  return false; // if there is no payload do not leak session
}
exports.leakSessionId = leakSessionId;

// function to optionally add the session ID explicitly to the URL to work around third party cookies restrictions
// currently appends session ID to url immediately before any query params
exports.urlInsertSessionId = function (req, url) {
  if (!leakSessionId(req)) {
    return url;
  }
  var parts = url.split('?');
  parts[0] += '/session/' + req.sessionID;
  return parts.join('?');
};

// middleware to grab the session ID from the URL and stuff it into a virtual cookie
// where express-session expects to find it.
// Expects a URL of the form scheme://host:port/root/session/session-id/remainder
// and rewrites the URL as scheme://host:port/root/remainder
exports.urlRewriteSessionId = function urlRewriteSessionId(req, res, next) {
  var urlParts = url.parse(req.url);
  var pathParts = urlParts.pathname.split('/');
  var sessionIdx = pathParts.indexOf('session');
  if (sessionIdx !== -1 && sessionIdx + 1 < pathParts.length) {
    setExpressSessionId(req, pathParts[sessionIdx + 1]);
    urlParts.pathname = (pathParts.splice(sessionIdx, 2), pathParts).join('/');
    req.url = url.format(urlParts);
  }
  next();
};

// middleware to grab the session ID from a Bearer token and stuff it into a virtual cookie
// where express-session expects to find it
exports.bearerSessionId = function bearerSessionId(req, res, next) {
  var header = (req.get('authorization') || '').trim().split(' ');
  if (header[0] === 'Bearer' && header[1]) {
    setExpressSessionId(req, header[1]);
  }
  next();
};
