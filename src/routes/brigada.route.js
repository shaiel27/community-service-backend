import { Router } from "express"
import { BrigadaController } from "../controllers/brigada.controller.js"
import { jwtMiddleware } from "../middlewares/jwt.middleware.js"

const router = Router()

// Aplicar middleware de autenticación a todas las rutas
router.use(jwtMiddleware)

// Rutas principales de brigadas
router.get("/", BrigadaController.getAllBrigades)
router.get("/search", BrigadaController.searchBrigades)
router.get("/:id", BrigadaController.getBrigadeById)
router.post("/", BrigadaController.createBrigade)
router.put("/:id", BrigadaController.updateBrigade)
router.delete("/:id", BrigadaController.deleteBrigade)

// Rutas para gestión de docentes
router.post("/:id/assign-teacher", BrigadaController.assignTeacher)

// Rutas para gestión de estudiantes
router.get("/:id/students", BrigadaController.getBrigadeStudents)
router.post("/:id/enroll-students", BrigadaController.enrollStudents)
router.post("/:id/clear", BrigadaController.clearBrigade)

// Rutas utilitarias
router.get("/utils/available-students", BrigadaController.getAvailableStudents)
router.get("/utils/available-teachers", BrigadaController.getAvailableTeachers)

export default router
