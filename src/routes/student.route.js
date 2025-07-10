import { Router } from "express"
import { StudentController } from "../controllers/student.controller.js"
import { verifyToken, verifyAdminOrReadOnly } from "../middlewares/jwt.middleware.js"

const router = Router()

// Aplicar middleware de autenticación
router.use(verifyToken)
router.use(verifyAdminOrReadOnly)

// NUEVA RUTA: Registro estudiantil (estudiante + representante)
router.post("/registry", StudentController.createStudentRegistry)

// NUEVA RUTA: Obtener estudiantes registrados (disponibles para inscripción)
router.get("/registered", StudentController.getRegisteredStudents)

// NUEVA RUTA: Buscar estudiante para inscripción
router.get("/inscription/:ci", StudentController.findStudentForInscription)

// Buscar estudiante por CI (general)
router.get("/:ci", StudentController.findStudentByCi)

// Obtener todos los estudiantes (sin importar estado de inscripción)
router.get("/list/all", StudentController.getAllStudents)

export default router