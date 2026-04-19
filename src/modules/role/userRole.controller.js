import * as userRoleService from "./userRole.service.js";

export const assignRole = async (req, res, next) => {
  try {
    const { role_id } = req.body;
    console.log(req.body);
    const result = await userRoleService.assignRole(
      req.user,
      req.params.id,
      role_id,
    );

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};
export const removeRole = async (req, res, next) => {
  try {
    await userRoleService.removeRole(
      req.user,
      req.params.id,
      req.params.roleId,
    );

    res.json({ message: "Role removed" });
  } catch (err) {
    next(err);
  }
};
export const getRoles = async (req, res, next) => {
  try {
    const roles = await userRoleService.getUserRoles(req.user, req.params.id);

    res.json(roles);
  } catch (err) {
    next(err);
  }
};
