const { users } = require('../data/fixtures');
const { logSecurityEvent } = require('../security/securityLog');

/**
 * Resolves the bearer token to a user and attaches it as req.user.
 * Every /api route sits behind this middleware.
 */
function authenticate(req, res, next) {
  const header = req.get('authorization') || '';
  const [scheme, token] = header.split(' ');

  const user = scheme === 'Bearer' && token ? users.find((u) => u.token === token) : undefined;

  if (!user) {
    logSecurityEvent({ type: 'authn.failed', path: req.path });
    return res.status(401).json({ error: 'Authentication required' });
  }

  req.user = { id: user.id, orgId: user.orgId, role: user.role, name: user.name };
  return next();
}

module.exports = { authenticate };
