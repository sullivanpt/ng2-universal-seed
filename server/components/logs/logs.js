/**
 * Wrapper around log4js to configure it to write formatted strings to the console with an optional session trace ID.
 */
'use strict';

const env = require('../../environment').env;

var log4js = require('log4js');
var _ = require('lodash');

// HELPFUL HINT: debug tests by bypassing this if clause during 'gulp test'
if (env === 'test') {
  log4js.configure({
    // replaceConsole: true -- leave console intact for karma output
    // no appenders for test mode
  });
} else {
  log4js.configure({
    replaceConsole: true,
    appenders: [
      {
        type: 'console', // we run inside PM2 so console logging is appropriate for dev and production; however be aware console is synchronous (slow)
        layout: {
          type: 'pattern',
          pattern: '[%d{hh:mm:ss}] [%c] %-5p %x{traceId} %m%n',
          tokens: {
            traceId: function (loggingEvent) {
              if (loggingEvent.categoryName === 'express') { // express logger handles traceId by itself
                return '';
              } else {
                return '[' + (loggingEvent.traceId || '') + '] -';
              }
            }
          }
        }
      }
    ],
    levels: {
      '[all]': process.env.LOG_LEVEL || 'DEBUG'
    }
  });
}

/**
 * Expose the core library
 */
exports.log4js = log4js;

/**
 * Generate a short but statistically probably unique ID we can use to track a customer session through the logs
 */
exports.generateLogId = function generateLogId() { // http://stackoverflow.com/a/8084248
  return (Math.random() + 1).toString(36).substr(2, 5);
};

/**
 * Attempts to remove sensitive data from object so it won't be logged.
 * @param obj object, array or string to filter
 */
function filter(obj) {
  if (_.isObject(obj) || _.isArray(obj)) {
    return _.cloneDeepWith(obj, function(value, key) {
      switch (key) {
        case 'password':
          return '<redacted>';
        default:
          break;
      }
    });
  }
  return obj; // could add regex filtering if needed
}
exports.filter = filter;

/**
 * Monkey patch our own logging event into log4j so we can include traceId
 */
function PwLoggingEvent (categoryName, level, data, logger, traceId) {
  this.startTime = new Date();
  this.categoryName = categoryName;
  this.data = data;
  this.level = level;
  this.logger = logger;
  this.traceId = traceId;
}

/**
 * Returns a logger for the given log4js category.
 * Only supports the 'default' log4js levels.
 * getLogger(category).id(traceId).warn(dataToFilter, ...)
 * getLogger(category).warn(dataToFilter, ...) # traceId undefined
 */
exports.getLogger = function getLogger(category) {
  var logger = log4js.getLogger(category);

  /**
   * Helper of form traceAndFilter(traceId, level)(dataToFilter, ...)
   */
  function traceAndFilter(traceId, level) {
    return function () {
      var args = Array.prototype.slice.call(arguments);
      var logLevel = log4js.levels.toLevel(level);
      var loggingEvent;
      if (logger.isLevelEnabled(logLevel)) {
        if (!logger.isLevelEnabled('TRACE')) { // don't filter for TRACE
          args = _.map(args, filter);
        }
        loggingEvent = new PwLoggingEvent(logger.category, logLevel, args, logger, traceId);
        logger.emit('log', loggingEvent);
      }
    };
  }

  return {
    /**
     *
     * @param traceId
     * @returns {Function}
     */
    id: function (traceId) {
      return {
        trace: traceAndFilter(traceId, 'trace'),
        debug: traceAndFilter(traceId, 'debug'),
        info: traceAndFilter(traceId, 'info'),
        warn: traceAndFilter(traceId, 'warn'),
        error: traceAndFilter(traceId, 'error'),
        fatal: traceAndFilter(traceId, 'fatal'),
        mark: traceAndFilter(traceId, 'mark')
      };
    },

    trace: traceAndFilter(null, 'trace'),
    debug: traceAndFilter(null, 'debug'),
    info: traceAndFilter(null, 'info'),
    warn: traceAndFilter(null, 'warn'),
    error: traceAndFilter(null, 'error'),
    fatal: traceAndFilter(null, 'fatal'),
    mark: traceAndFilter(null, 'mark'),

    isLevelEnabled: function (level) { return logger.isLevelEnabled(level); }
  };
};

/**
 * Helper to retrieve nested object key.
 * Use array.0.field as array[0].field
 * See http://stackoverflow.com/a/22129960
 *
 * TODO: why does _.get not work here?
 *
 * @param path
 * @param obj
 * @returns {*}
 */
function resolveProperty(path, obj) {
  return [obj].concat(path.split('.')).reduce(function(prev, curr) {
    return (prev || {})[curr];
  });
}

/**
 * Expose our connect logger
 */
exports.connectLogger = log4js.connectLogger(log4js.getLogger('express'), {
  level: 'auto',
  format: function (req, res, format) {
    return format('[' + (resolveProperty('session.logId', req) || req.logId || '') +
      '] :remote-addr - :method ' +
      req.originalUrl.split('?')[0] + // don't log query params here, may be sensitive
      ' :status :response-time ms');
  }
});
