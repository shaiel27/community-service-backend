import { Router } from "express"
import { BrigadaController } from "../controllers/brigada.controller.js"
import { verifyToken, verifyAdminOrReadOnly } from "../middlewares/jwt.middleware.js"
<<<<<<< HEAD
import {
  validateBrigadeData,
  validateTeacherAssignment,
  validateStudentEnrollment,
} from "../validators/brigada.validator.js"
=======
>>>>>>> 6e1b82ff7bf7915a9f0b9d51a58b45d63278ae09

const router = Router()

// Aplicar middleware de autenticación a todas las rutas
router.use(verifyToken)
router.use(verifyAdminOrReadOnly)

// Rutas principales CRUD
router.get("/", BrigadaController.getAllBrigades)
router.get("/search", BrigadaController.searchBrigades)
router.get("/available-students", BrigadaController.getAvailableStudents)
router.get("/available-teachers", BrigadaController.getAvailableTeachers)
router.get("/:id", BrigadaController.getBrigadeById)
router.post("/", validateBrigadeData, BrigadaController.createBrigade)
router.put("/:id", validateBrigadeData, BrigadaController.updateBrigade)
router.delete("/:id", BrigadaController.deleteBrigade)

// Rutas para gestión de estudiantes
router.get("/:id/students", BrigadaController.getBrigadeStudents)
router.post("/:id/students", validateStudentEnrollment, BrigadaController.enrollStudents)
router.delete("/:id/students", BrigadaController.clearBrigade)
router.delete("/:id/students/:studentId", BrigadaController.removeStudentFromBrigade)

// Rutas para gestión de docentes
router.post("/:id/teacher", validateTeacherAssignment, BrigadaController.assignTeacher)
router.delete("/:id/teacher", BrigadaController.removeTeacherFromBrigade)

export default router
