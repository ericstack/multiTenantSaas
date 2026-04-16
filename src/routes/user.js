import express from "express";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../modules/user/user.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/rbacMiddleware.js";
import { PERMISSIONS } from "../../constants/permissions.js";
import { auditLogger } from "../middleware/audit.middleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize(PERMISSIONS.CREATE_USER),
  auditLogger({ entity: "User" }),
  createUser,
);
router.get(
  "/",
  authenticate,
  authorize(PERMISSIONS.VIEW_USERS),
  auditLogger({ entity: "User" }),
  getUsers,
);
router.get(
  "/:id",
  authenticate,
  authorize(PERMISSIONS.VIEW_USER),
  auditLogger({ entity: "User" }),
  getUser,
);
router.put(
  "/:id",
  authenticate,
  authorize(PERMISSIONS.MANAGE_USERS),
  auditLogger({ entity: "User" }),
  updateUser,
);
router.delete(
  "/:id",
  authenticate,
  authorize(PERMISSIONS.DELETE_USER),
  auditLogger({ entity: "User" }),
  deleteUser,
);

export default router;
