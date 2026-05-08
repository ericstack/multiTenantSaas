import * as service from "./rolePermission.service.js";

export async function assign(req, res, next) {
  try {
    const { role_id, permission_id } = req.body;

    const result = await service.assignPermissionToRole(
      req.user,
      role_id,
      permission_id,
    );

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}
export async function remove(req, res, next) {
  try {
    await service.removePermissionFromRole(req.user, req.params.id);

    res.json({ message: "Permission removed from role" });
  } catch (err) {
    next(err);
  }
}
export async function getByRole(req, res, next) {
  try {
    const permissions = await service.getPermissionsByRoleId(
      req.user,
      req.params.roleId,
    );

    res.json({
      role_id: req.params.roleId,
      permissions,
    });
  } catch (err) {
    next(err);
  }
}
