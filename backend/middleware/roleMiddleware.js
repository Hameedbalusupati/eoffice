// Role-based access control middleware

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user exists (set by authMiddleware)
      if (!req.user) {
        return res.status(401).json({ msg: "Unauthorized" });
      }

      // Check role
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          msg: "Access denied: insufficient permissions",
        });
      }

      next();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
};

module.exports = roleMiddleware;