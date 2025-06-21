import express from "express";
import { UserController } from "../controllers/user.controller.js";
import {
  verifyToken,
  verifyAdmin,
  verifyAdminOrReadOnly,
} from "../middleware/jwt.middleware.js";

const router = express.Router();

// Authentication routes (no auth required) - PRIMERO
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/refresh-token", UserController.refreshToken);
router.post("/forgot-password", UserController.forgotPassword);
router.post("/reset-password", UserController.resetPassword);
router.post(
  "/recover-password-security",
  UserController.recoverPasswordWithSecurity
);


// Routes with specific paths - ANTES de las rutas con parámetros
router.get("/list", verifyToken, verifyAdmin, UserController.listUsers);
router.get(
  "/search",
  verifyToken,
  verifyAdminOrReadOnly,
  UserController.searchUsers
);
router.get("/profile", verifyToken, UserController.profile);
router.put("/profile", verifyToken, UserController.updateProfile);
router.put("/change-password", verifyToken, UserController.changePassword);

// Routes that require authentication
router.post("/logout", verifyToken, UserController.logout);

// Routes with parameters - AL FINAL
router.get("/security-question/:username", UserController.getSecurityQuestion);
router.put(
  "/activate/:id",
  verifyToken,
  verifyAdmin,
  UserController.activateUser
);
router.put(
  "/deactivate/:id",
  verifyToken,
  verifyAdmin,
  UserController.deactivateUser
);
router.delete("/:id", verifyToken, verifyAdmin, UserController.deleteUser);

export default router;
