import express from "express";

import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/rbacMiddleware.js";
import {
  assignRole,
  removeRole,
  getRoles,
} from "../modules/role/userRole.controller.js";

const router = express.Router();

router.post(
  "/users/:id/roles",
  authenticate,
  authorize("manage_roles"),
  assignRole,
);

router.delete(
  "/users/:id/roles/:roleId",
  authenticate,
  authorize("manage_roles"),
  removeRole,
);

router.get("/users/:id/roles", authenticate, authorize("view_users"), getRoles);

export default router;
