import { User, Role, UserRole } from "../../models/index.js";
import { applyTenantFilter } from "../../utils/tenant.js";

export async function assignRole(reqUser, targetUserId, roleId) {
  // 1. Find target user (tenant-safe)
  const user = await User.findOne({
    where: applyTenantFilter({ user: reqUser }, { id: targetUserId }),
  });

  if (!user) throw new Error("User not found");

  // 2. Find role (tenant-safe)
  const role = await Role.findOne({
    where: applyTenantFilter({ user: reqUser }, { id: roleId }),
  });

  if (!role) throw new Error("Role not found");

  // 3. Prevent duplicate
  const existing = await UserRole.findOne({
    where: {
      user_id: user.id,
      role_id: role.id,
    },
  });

  if (existing) {
    throw new Error("Role already assigned");
  }

  // 4. Assign role
  return await UserRole.create({
    user_id: user.id,
    role_id: role.id,
  });
}
export async function removeRole(reqUser, targetUserId, roleId) {
  const user = await User.findOne({
    where: applyTenantFilter({ user: reqUser }, { id: targetUserId }),
  });

  if (!user) throw new Error("User not found");

  return await UserRole.destroy({
    where: {
      user_id: user.id,
      role_id: roleId,
    },
  });
}
export async function getUserRoles(reqUser, targetUserId) {
  const user = await User.findOne({
    where: applyTenantFilter({ user: reqUser }, { id: targetUserId }),
    include: {
      model: Role,
      attributes: ["id", "name"],
    },
  });

  if (!user) throw new Error("User not found");

  return user.Roles;
}
