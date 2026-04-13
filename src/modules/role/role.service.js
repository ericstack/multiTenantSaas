import { RolePermission } from "../../models/index.js";

async function assignPermissions(role_id, permission_ids) {
  const data = permission_ids.map((pid) => ({
    role_id,
    permission_id: pid,
  }));

  return await RolePermission.bulkCreate(data);
}

export default {
  assignPermissions,
};
