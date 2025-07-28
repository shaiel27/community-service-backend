import { Router } from "express"
import { BrigadaController } from "../controllers/brigada.controller.js"
import { BrigadaValidator } from "../validators/brigada.validator.js"
import { verifyToken, verifyAdminOrReadOnly } from "../middlewares/jwt.middleware.js"

const router = Router()

// Aplicar middleware de autenticación a todas las rutas
router.use(verifyToken)
router.use(verifyAdminOrReadOnly)

// Middleware para validar IDs numéricos
router.param("id", (req, res, next, id) => {
  if (!Number.isInteger(Number(id)) || id <= 0) {
    return res.status(400).json({ ok: false, msg: "ID inválido" })
  }
  next()
})

// IMPORTANTE: Rutas utilitarias PRIMERO (antes de las rutas con parámetros)
router.get("/available-students", BrigadaController.getAvailableStudents)
router.get("/available-teachers", BrigadaController.getAvailableTeachers)
router.get("/search", BrigadaController.searchBrigades)
  
// Rutas principales de brigadas
router.get("/", BrigadaController.getAllBrigades)
router.post("/", BrigadaValidator.validateBrigadeData, BrigadaController.createBrigade)

// Rutas con parámetros ID (DESPUÉS de las rutas utilitarias)
router.get("/:id", BrigadaController.getBrigadeById)
router.put("/:id", BrigadaValidator.validateBrigadeData, BrigadaController.updateBrigade)
router.delete("/:id", BrigadaController.deleteBrigade)

// Rutas para gestión de docentes
router.post("/:id/teacher", BrigadaValidator.validateTeacherAssignment, BrigadaController.assignTeacher)
router.delete("/:id/teacher", BrigadaController.removeTeacher)

// Rutas para gestión de estudiantes
router.get("/:id/students", BrigadaController.getBrigadeStudents)
router.post("/:id/students", BrigadaValidator.validateStudentEnrollment, BrigadaController.enrollStudents)
router.delete("/:id/students", BrigadaController.clearBrigade)
router.delete("/:id/students/:studentId", BrigadaController.removeStudentFromBrigade)

export default router
