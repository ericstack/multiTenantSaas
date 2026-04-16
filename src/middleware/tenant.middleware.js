export function withTenant(model) {
  return async (req, res, next) => {
    try {
      req.tenantFilter = {
        tenant_id: req.user.tenant_id,
      };
      next();
    } catch (err) {
      next(err);
    }
  };
}
