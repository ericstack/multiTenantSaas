import express from "express";

import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/rbacMiddleware.js";
import {
  getRolesByUserId,
  assignRole,
  removeRole,
  getRoles,
} from "../modules/role/userRole.controller.js";

const router = express.Router();

router.post(
  "/users-roles/:id/roles",
  authenticate,
  authorize("manage_roles"),
  assignRole,
);

router.delete(
  "/users-roles/:roleId",
  authenticate,
  authorize("manage_roles"),
  removeRole,
);

router.get(
  "/users-role/:id/roles",
  authenticate,
  authorize("view_users"),
  getRoles,
);
router.get(
  "/users-role/:id/assigned",
  authenticate,
  authorize("view_users"),
  getRolesByUserId,
);

export default router;
