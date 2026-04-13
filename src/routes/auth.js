// routes/auth.js
import express from "express";
import {
  registerTenant,
  loginUser,
  logoutUser,
  refreshToken,
  getCurrentUser,
} from "../modules/auth/auth.controller.js";

const router = express.Router();

router.post("/register", registerTenant);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshToken);
router.get("/me", getCurrentUser);

export default router;
