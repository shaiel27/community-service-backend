import express from "express"
import { UserController } from "../controllers/user.controller.js"
import { verifyToken, verifyAdmin } from "../middleware/jwt.middleware.js"
import cors from "cors"

const router = express.Router()

router.options("*", cors())

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

// Admin-only routes
router.get("/list", verifyToken, verifyAdmin, UserController.listUsers)
router.get("/search", verifyToken, verifyAdmin, UserController.searchUsers)
router.put("/activate/:id", verifyToken, verifyAdmin, UserController.activateUser)
router.put("/deactivate/:id", verifyToken, verifyAdmin, UserController.deactivateUser)
router.delete("/:id", verifyToken, verifyAdmin, UserController.deleteUser)

export default router
