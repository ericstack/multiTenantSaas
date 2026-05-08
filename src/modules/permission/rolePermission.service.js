import { Role, Permission, RolePermission } from "../../models/index.js";
import { applyTenantFilter } from "../../utils/tenant.js";

export async function assignPermissionToRole(reqUser, roleId, permissionId) {
  const role = await Role.findOne({
    where: applyTenantFilter({ user: reqUser }, { id: roleId }),
  });

  if (!role) throw new Error("Role not found");

  const permission = await Permission.findByPk(permissionId);
  if (!permission) throw new Error("Permission not found");

  const exists = await RolePermission.findOne({
    where: {
      role_id: roleId,
      permission_id: permissionId,
    },
  });

  if (exists) throw new Error("Permission already assigned");

  return await RolePermission.create({
    role_id: roleId,
    permission_id: permissionId,
  });
}
