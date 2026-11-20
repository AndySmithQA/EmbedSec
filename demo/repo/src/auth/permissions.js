// Role-based permissions. This is the single source of truth for what each role may do.
// Adding a capability means adding a permission here and protecting the route with
// requirePermission() from ./authorize.js.

const ROLE_PERMISSIONS = Object.freeze({
  admin: Object.freeze(['customers:read', 'customers:write', 'audit:read', 'users:manage']),
  support: Object.freeze(['customers:read', 'customers:write']),
  viewer: Object.freeze(['customers:read']),
});

function permissionsForRole(role) {
  return ROLE_PERMISSIONS[role] ?? [];
}

module.exports = { ROLE_PERMISSIONS, permissionsForRole };
