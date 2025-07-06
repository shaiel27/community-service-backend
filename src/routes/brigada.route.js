import express from "express"
import { BrigadeController } from "../controllers/brigada.controller.js"
import { verifyToken, verifyAdmin, verifyAdminOrReadOnly } from "../middleware/jwt.middleware.js"

const router = express.Router()

// Rutas de utilidad (deben ir ANTES de las rutas con parámetros)
router.get("/utils/available-students", verifyToken, verifyAdminOrReadOnly, BrigadeController.getAvailableStudents)

router.get("/utils/available-teachers", verifyToken, verifyAdminOrReadOnly, BrigadeController.getAvailableTeachers)

// Rutas principales de brigadas
router.post("/", verifyToken, verifyAdmin, BrigadeController.createBrigade)

router.get("/", verifyToken, verifyAdminOrReadOnly, BrigadeController.getAllBrigades)

// Rutas con parámetros (deben ir AL FINAL)
router.get("/:id", verifyToken, verifyAdminOrReadOnly, BrigadeController.getBrigadeById)

router.get("/:id/students", verifyToken, verifyAdminOrReadOnly, BrigadeController.getStudentsByBrigade)

router.post("/:id/assign-teacher", verifyToken, verifyAdmin, BrigadeController.assignTeacher)

router.post("/:id/enroll-students", verifyToken, verifyAdmin, BrigadeController.enrollStudents)

router.post("/:id/clear", verifyToken, verifyAdmin, BrigadeController.clearBrigade)

router.delete("/:id", verifyToken, verifyAdmin, BrigadeController.deleteBrigade)

export default router
