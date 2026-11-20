const { permissionsForRole } = require('./permissions');
const { logSecurityEvent } = require('../security/securityLog');

/**
 * Returns true if the authenticated user holds the permission.
 */
function can(user, permission) {
  return Boolean(user) && permissionsForRole(user.role).includes(permission);
}

/**
 * Express middleware: the approved way to protect a route.
 * Denies by default and records the denial as a security event.
 *
 *   router.get('/thing', requirePermission('thing:read'), handler)
 */
function requirePermission(permission) {
  return function permissionGuard(req, res, next) {
    if (can(req.user, permission)) {
      return next();
    }
    logSecurityEvent({
      type: 'authz.denied',
      userId: req.user?.id,
      orgId: req.user?.orgId,
      permission,
      path: req.originalUrl,
    });
    return res.status(403).json({ error: 'Forbidden' });
  };
}

module.exports = { can, requirePermission };
