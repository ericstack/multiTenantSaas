export function applyTenantFilter(req, where = {}) {
  if (req.user.is_super_admin) {
    return where; // 👑 NO tenant restriction
  }

  return {
    ...where,
    tenant_id: req.user.tenant_id,
  };
}
