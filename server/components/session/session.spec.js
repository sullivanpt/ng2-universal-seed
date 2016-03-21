'use strict';

const serverMock = require('../../../spec/helpers/server.mock');
const session = require('./session');

describe('session', function() {
  describe('urlInsertSessionId', function() {
    var testUrl = 'scheme://host:port/root/path?query=value';
    it('should not alter the URL if leakSessionId is false', function() {
      expect(session.urlInsertSessionId({ sessionID: '123' }, testUrl)).toBe(testUrl);
      expect(session.urlInsertSessionId({ sessionID: '123', session: {} }, testUrl)).toBe(testUrl);
      expect(session.urlInsertSessionId({ sessionID: '123', session: { payload: { cookie: true } } }, testUrl)).toBe(testUrl);
    });
    it('should append the session ID to the URL if leakSessionId is true', function() {
      var sessionUrl = testUrl.replace('/path', '/path/session/123');
      expect(session.urlInsertSessionId({ sessionID: '123', session: { payload: {} } }, testUrl)).toBe(sessionUrl);
      expect(session.urlInsertSessionId({ sessionID: '123', session: { payload: { cookie: false } } }, testUrl)).toBe(sessionUrl);
    });
  });

  describe('session tracking', function() {
    var agent = serverMock.newAgent(); // this instance keeps the cookie
    var sessionId;

    it('should set session cookie on authorize', function authorize(done) { // note: we bypass /api/initialize
      agent
        .get('/api/test/authorize') // TODO: put login API here
        .expect(200)
        .expect('set-cookie', /express.sess=.*/, function(err, res) {
          expect(err).toBeFalsy();
          sessionId = /"sessionId":"([^"]*)"/.exec(res.text)[1];
          expect(sessionId).toBeTruthy();
          done();
        });
    });

    it('should not allow access to a protected API with no session ID', function(done) {
      serverMock.newAgent() // new instance has no cookie
        .get('/api/test/isauthorized')
        .expect(401, done);
    });

    it('should allow access to a protected API by passing the session ID in a cookie', function(done) {
      agent
        .get('/api/test/isauthorized')
        .expect(200, done);
    });

    it('should allow access to a protected API by passing the session ID in the Authorize header', function(done) {
      serverMock.newAgent() // new instance has no cookie
        .get('/api/test/isauthorized')
        .set('Authorization', 'Bearer ' + sessionId)
        .expect(200, done);
    });

    it('should allow access to a protected API by passing the session ID in the URL path', function(done) {
      serverMock.newAgent() // new instance has no cookie
        .get('/api/test/isauthorized/session/' + sessionId)
        .expect(200, done);
    });
  });
});
