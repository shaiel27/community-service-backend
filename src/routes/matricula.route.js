import { Router } from "express"
import { MatriculaController } from "../controllers/matricula.controller.js"
import { verifyToken, verifyAdminOrReadOnly } from "../middlewares/jwt.middleware.js"

const router = Router()

// Aplicar middleware de autenticación
router.use(verifyToken)
router.use(verifyAdminOrReadOnly)

// === RUTAS PARA SECCIONES ===
// Crear sección
router.post("/sections", MatriculaController.createSection)

// Obtener todas las secciones (filtrables por período y grado)
router.get("/sections", MatriculaController.getAllSections)

// Actualizar sección
router.put("/sections/:id", MatriculaController.updateSection)

// Eliminar sección
router.delete("/sections/:id", MatriculaController.deleteSection)

// Obtener estudiantes de una sección específica
router.get("/sections/:id/students", MatriculaController.getSectionStudents)

// === RUTAS PARA PERÍODOS ACADÉMICOS ===
// Obtener período académico actual
router.get("/academic-periods/current", MatriculaController.getAcademicPeriodCurrent)

// Obtener todos los períodos académicos
router.get("/academic-periods", MatriculaController.getAcademicPeriodsAll)

// Crear nuevo período académico
router.post("/academic-periods", MatriculaController.createAcademicPeriod)

// === RUTAS PARA GRADOS Y DOCENTES ===
// Obtener grados disponibles para inscripción
router.get("/grades", MatriculaController.getAvailableGrades)

// Obtener docentes disponibles
router.get("/teachers", MatriculaController.getAvailableTeachers)

// === RUTAS PARA INSCRIPCIONES/MATRÍCULAS ===
// Crear inscripción escolar
router.post("/inscription", MatriculaController.createSchoolInscription)

// Obtener el último registro académico del estudiante
router.get("/history/last/:studentID", MatriculaController.getLastAcademicRecord)

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
