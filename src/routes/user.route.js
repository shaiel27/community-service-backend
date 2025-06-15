import express from "express"
import { UserController } from "../controllers/user.controller.js"
import { verifyToken, verifyAdmin, verifyAdminOrReadOnly } from "../middleware/jwt.middleware.js"

const router = express.Router()

// Authentication routes (no auth required)
router.post("/register", UserController.register)
router.post("/login", UserController.login)
router.post("/refresh-token", UserController.refreshToken)
router.post("/forgot-password", UserController.forgotPassword)
router.post("/reset-password", UserController.resetPassword)

// Routes that require authentication
router.post("/logout", verifyToken, UserController.logout)
router.get("/profile", verifyToken, UserController.profile)
router.put("/profile", verifyToken, UserController.updateProfile)
router.put("/change-password", verifyToken, UserController.changePassword)

// Admin-only routes (permission_id = 1)
router.get("/list", verifyToken, verifyAdmin, UserController.listUsers)
router.get("/search", verifyToken, verifyAdminOrReadOnly, UserController.searchUsers) // Admin o solo lectura
router.put("/activate/:id", verifyToken, verifyAdmin, UserController.activateUser)
router.put("/deactivate/:id", verifyToken, verifyAdmin, UserController.deactivateUser)
router.delete("/:id", verifyToken, verifyAdmin, UserController.deleteUser)

export default router
