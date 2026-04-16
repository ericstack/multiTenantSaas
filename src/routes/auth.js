// routes/auth.js
import express from "express";
import {
  registerTenant,
  loginUser,
  logoutUser,
  refreshToken,
  getCurrentUser,
} from "../modules/auth/auth.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { auditLogger } from "../middleware/audit.middleware.js";

const router = express.Router();

router.post("/register", registerTenant);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshToken);
router.get("/me", authenticate, getCurrentUser);

export default router;
