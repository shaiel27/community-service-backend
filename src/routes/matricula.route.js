import { Router } from "express"
import { MatriculaController } from "../controllers/matricula.controller.js"
import { verifyToken, verifyAdminOrReadOnly } from "../middlewares/jwt.middleware.js"

const router = Router()

// Aplicar middleware de autenticación
router.use(verifyToken)
router.use(verifyAdminOrReadOnly)

// Crear inscripción escolar
router.post("/inscription", MatriculaController.createSchoolInscription)

// Obtener el último registro académico del estudiante
router.get("/history/last/:studentID", MatriculaController.getLastAcademicRecord)

// Obtener grados disponibles para inscripción
router.get("/grades", MatriculaController.getAvailableGrades)

// Obtener secciones disponibles por grado y periodo (periodId por query param)
router.get("/sections/:gradeId", MatriculaController.getSectionsByGrade)

// Obtener docentes disponibles
router.get("/teachers", MatriculaController.getAvailableTeachers)

// Asignar docente a sección por periodo
router.post("/assign-teacher", MatriculaController.assignTeacherToSection)

// Obtener inscripciones por grado y periodo (periodId por query param)
router.get("/inscriptions/:gradeId", MatriculaController.getInscriptionsByGrade)

// Obtener todas las inscripciones (opcionalmente por periodo, periodId por query param)
router.get("/all", MatriculaController.getAllInscriptions)

// Obtener inscripción por ID
router.get("/:id", MatriculaController.getInscriptionById)

// Actualizar matrícula
router.put("/:id", MatriculaController.updateMatricula)

// Eliminar matrícula
router.delete("/:id", MatriculaController.deleteMatricula)

export default router
