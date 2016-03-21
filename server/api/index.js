/*
 * API Routes
 */
'use strict';

const express = require('express');
const router = express.Router();

router.use('/users', require('./user'));
router.use('/test', require('./test'));

module.exports = router;
