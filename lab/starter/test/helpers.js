const request = require('supertest');
const { createApp } = require('../src/app');

const TOKENS = Object.freeze({
  acmeAdmin: 'token-alice-admin',
  acmeSupport: 'token-bob-support',
  acmeViewer: 'token-carol-viewer',
  globexAdmin: 'token-dave-admin',
});

/**
 * Returns a supertest agent wrapper that sends requests as the given user.
 *
 *   const res = await as(TOKENS.acmeAdmin).get('/api/customers');
 */
function as(token) {
  const app = createApp();
  const withAuth = (req) => (token ? req.set('Authorization', `Bearer ${token}`) : req);
  return {
    get: (url) => withAuth(request(app).get(url)),
    post: (url) => withAuth(request(app).post(url)),
  };
}

const anonymous = () => as(null);

module.exports = { TOKENS, as, anonymous };
