// Role hierarchy — higher index = higher privilege
const ROLE_HIERARCHY = ['viewer', 'collector', 'accounts', 'admin', 'super_admin'];

/**
 * requireRole(...roles)
 * Pass one or more minimum-required roles.
 * The user must have the specified role OR a higher role to access the route.
 *
 * Example: requireRole('admin') allows admin and super_admin.
 *          requireRole('accounts') allows accounts, admin, super_admin.
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const userRoleIndex = ROLE_HIERARCHY.indexOf(req.user.role);

    // Check if the user's role meets at least one of the required minimum roles
    const allowed = roles.some((role) => {
      const requiredIndex = ROLE_HIERARCHY.indexOf(role);
      return userRoleIndex >= requiredIndex;
    });

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`,
      });
    }

    next();
  };
};

module.exports = { requireRole };
