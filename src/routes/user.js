import express from "express";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../modules/user/user.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { authorize } from "../../middleware/rbacMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, authorize("create_user"), createUser);
router.get("/", authMiddleware, authorize("view_users"), getUsers);
router.get("/:id", authMiddleware, authorize("view_users"), getUser);
router.put("/:id", authMiddleware, authorize("manage_users"), updateUser);
router.delete("/:id", authMiddleware, authorize("delete_user"), deleteUser);

export default router;
