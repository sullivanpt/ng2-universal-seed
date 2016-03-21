'use strict';

const should = require('should'); // TODO: prefer expect semantics
const logs = require('./logs');
const _ = require('lodash');

describe('logs', function() {
  describe('log ID generator', function() {
    it('should create random strings of length 5', function() {
      logs.generateLogId().length.should.equal(5);
    });

    it('should should rarely repeat', function() {
      var samples = _.times(100, logs.generateLogId);
      var unique = _.uniq(samples);
      samples.length.should.be.below(unique.length + 3); // allow 3 of 100 dups
    });
  });

  describe('log filter', function() {
    it('should pass non-object and non-arrays through unchanged', function() {
      should(logs.filter()).be.undefined;
      should(logs.filter(null)).be.null;
      logs.filter(5).should.equal(5);
      logs.filter('text').should.equal('text');
    });

    it('should deeply filter objects and arrays', function() {
      logs.filter({
        key1: [
          {
            firstName: 'not a secret',
            password: 'secret'
          }
        ]
      }).should.eql({
        key1: [
          {
            firstName: 'not a secret',
            password: '<redacted>'
          }]
      });
    });

    it('should redact all known sensitive fields', function() {
      [
        'password',
      ]
        .forEach(function(key) {
          var src = {};
          var dst = {};
          src[key] = 'value';
          dst[key] = '<redacted>';
          logs.filter(src).should.eql(dst);
        });
    });
  });

  describe('logger', function() {
    it('should expose debug, info, fatal etc.', function() {
      var logger = logs.getLogger('testCat');
      logger.debug.should.be.a.function;
      logger.info.should.be.a.function;
      logger.fatal.should.be.a.function;
    });

    it('should expose id setter which exposes debug, info, fatal etc.', function() {
      var logger = logs.getLogger('testCat').id('myid');
      logger.debug.should.be.a.function;
      logger.info.should.be.a.function;
      logger.fatal.should.be.a.function;
    });
  });
});
