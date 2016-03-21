'use strict';

const _ = require('lodash');
const logs = require('./logs');

describe('logs', function() {
  describe('log ID generator', function() {
    it('should create random strings of length 5', function() {
      expect(logs.generateLogId().length).toBe(5);
    });

    it('should should rarely repeat', function() {
      var samples = _.times(100, logs.generateLogId);
      var unique = _.uniq(samples);
      expect(samples.length).toBeLessThan(unique.length + 3); // allow 3 of 100 dups
    });
  });

  describe('log filter', function() {
    it('should pass non-object and non-arrays through unchanged', function() {
      expect(logs.filter()).toBeUndefined();
      expect(logs.filter(null)).toBeNull();
      expect(logs.filter(5)).toBe(5);
      expect(logs.filter('text')).toBe('text');
    });

    it('should deeply filter objects and arrays', function() {
      expect(logs.filter({
        key1: [
          {
            firstName: 'not a secret',
            password: 'secret'
          }
        ]
      })).toEqual({
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
          expect(logs.filter(src)).toEqual(dst);
        });
    });
  });

  describe('logger', function() {
    it('should expose debug, info, fatal etc.', function() {
      var logger = logs.getLogger('testCat');
      expect(_.isFunction(logger.debug)).toBeTruthy();
      expect(_.isFunction(logger.info)).toBeTruthy();
      expect(_.isFunction(logger.fatal)).toBeTruthy();
    });

    it('should expose id setter which exposes debug, info, fatal etc.', function() {
      var logger = logs.getLogger('testCat').id('myid');
      expect(_.isFunction(logger.debug)).toBeTruthy();
      expect(_.isFunction(logger.info)).toBeTruthy();
      expect(_.isFunction(logger.fatal)).toBeTruthy();
    });
  });
});
