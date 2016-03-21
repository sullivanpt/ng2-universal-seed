'use strict';

/**
 * Some test fixtures to support development, unit testing and integration testing.
 *
 * WARNING: to facilitate post deployment verification these test endpoints ARE INCLUDED in the production build. Please
 * keep security in mind when exposing test points and test data.
 */

const auth = require('../../components/auth');

const express = require('express');

const router = express.Router();

router.get('/authorize', // TODO: delete this route when user model implemented
  function(req, res) {
    auth.authorize(req);
    res.send({ success: true, sessionId: req.sessionID });
  });

router.get('/isauthorized',
  auth.isAuthorized,
  function(req, res) { res.send({ success: true }); });

module.exports = router;
