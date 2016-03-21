'use strict';

const should = require('should');
const session = require('./session');

const app = require('../../index');
const request = require('supertest');

describe('session', function() {
  describe('urlInsertSessionId', function() {
    var testUrl = 'scheme://host:port/root/path?query=value';
    it('should not alter the URL if leakSessionId is false', function() {
      session.urlInsertSessionId({ sessionID: '123' }, testUrl).should.equal(testUrl);
      session.urlInsertSessionId({ sessionID: '123', session: {} }, testUrl).should.equal(testUrl);
      session.urlInsertSessionId({ sessionID: '123', session: { payload: { cookie: true } } }, testUrl).should.equal(testUrl);
    });
    it('should append the session ID to the URL if leakSessionId is true', function() {
      var sessionUrl = testUrl.replace('/path', '/path/session/123');
      session.urlInsertSessionId({ sessionID: '123', session: { payload: {} } }, testUrl).should.equal(sessionUrl);
      session.urlInsertSessionId({ sessionID: '123', session: { payload: { cookie: false } } }, testUrl).should.equal(sessionUrl);
    });
  });

  describe('session tracking', function() {
    var agent = request.agent(app); // this instance keeps the cookie
    var sessionId;

    it('should set session cookie on authorize', function authorize(done) { // note: we bypass /api/initialize
      agent
        .get('/api/test/authorize') // TODO: put login API here
        .expect(200)
        .expect('set-cookie', /express.sess=.*/, function(err, res) {
          should.not.exist(err);
          sessionId = /"sessionId":"([^"]*)"/.exec(res.text)[1];
          sessionId.should.exist;
          done();
        });
    });

    it('should not allow access to a protected API with no session ID', function(done) {
      request.agent(app) // new instance has no cookie
        .get('/api/test/isauthorized')
        .expect(401, done);
    });

    it('should allow access to a protected API by passing the session ID in a cookie', function(done) {
      agent
        .get('/api/test/isauthorized')
        .expect(200, done);
    });

    it('should allow access to a protected API by passing the session ID in the Authorize header', function(done) {
      request.agent(app) // new instance has no cookie
        .get('/api/test/isauthorized')
        .set('Authorization', 'Bearer ' + sessionId)
        .expect(200, done);
    });

    it('should allow access to a protected API by passing the session ID in the URL path', function(done) {
      request.agent(app) // new instance has no cookie
        .get('/api/test/isauthorized/session/' + sessionId)
        .expect(200, done);
    });
  });
});
