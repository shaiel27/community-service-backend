import express from "express"
import { UserController } from "../controllers/user.controller.js"
import { verifyToken, verifyAdmin } from "../middleware/jwt.middleware.js"

const router = express.Router()

// Rutas públicas (no requieren autenticación)
router.post("/register", UserController.registerUser)
router.post("/login", UserController.loginUser)
router.get("/security-question/:username", UserController.getSecurityQuestion)
router.post("/verify-security-answer", UserController.verifySecurityAnswer)

// Rutas protegidas (requieren autenticación)
router.get("/profile", verifyToken, UserController.getUserProfile)
router.put("/change-password", verifyToken, UserController.changePassword)
router.post("/logout", verifyToken, UserController.logout)

// Rutas de administrador
router.get("/list", verifyToken, verifyAdmin, UserController.getAllUsers)

export default router
