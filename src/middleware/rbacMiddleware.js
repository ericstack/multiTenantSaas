export function authorize(requiredPermission) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // 🔥 SUPER ADMIN BYPASS
    if (user.is_super_admin) return next();

    if (!user.permissions.includes(requiredPermission)) {
      return res.status(403).json({
        message: "Forbidden: insufficient permissions",
      });
    }

    next();
  };
}
