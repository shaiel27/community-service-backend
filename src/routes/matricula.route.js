// src/routes/matricula.route.js
import { Router } from "express"
import { MatriculaController } from "../controllers/matricula.controller.js"
import { verifyToken, verifyAdmin, verifyAdminOrReadOnly } from "../middlewares/jwt.middleware.js"
import validate  from "../middlewares/validation.middleware.js" 
import { createMatriculaSchema,  updateMatriculaSchema} from "../validators/matricula.validator.js"

const router = Router()

router.use(verifyToken)

router.param('id', (req, res, next, id) => {
  if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
    return res.status(400).json({ ok: false, msg: "ID de inscripción inválido" });
  }
  next();
});

// Rutas para el nuevo sistema de inscripción escolar
router.post(
  "/inscription",
  verifyAdmin, // Solo admins pueden crear inscripciones completas
  validate(createMatriculaSchema), // Asumiendo que crearMatriculaSchema valida todo el cuerpo de la matrícula completa
  MatriculaController.createSchoolInscription,
)

// Rutas de consulta (pueden ser leídas por roles de solo lectura)
router.get("/grades", verifyAdminOrReadOnly, MatriculaController.getAvailableGrades)
router.get("/sections/:gradeId", verifyAdminOrReadOnly, MatriculaController.getSectionsByGrade)
router.get("/teachers", verifyAdminOrReadOnly, MatriculaController.getAvailableTeachers)
router.get("/inscriptions/:gradeId", verifyAdminOrReadOnly, MatriculaController.getInscriptionsByGrade)
router.get("/all", verifyAdminOrReadOnly, MatriculaController.getAllInscriptions)
router.get("/:id", verifyAdminOrReadOnly, MatriculaController.getInscriptionById)

// Rutas que requieren permisos de administrador o gestión académica
router.post(
  "/assign-teacher",
  verifyAdmin, // Asignar docente es una acción administrativa
  MatriculaController.assignTeacherToSection,
)

// NUEVAS RUTAS: Actualizar y Eliminar Matrícula
router.put(
  "/:id",
  verifyAdmin, // Solo admins pueden actualizar inscripciones
  validate(updateMatriculaSchema), // Validador para la actualización
  MatriculaController.updateSchoolInscription,
)

router.delete(
  "/:id",
  verifyAdmin, // Solo admins pueden eliminar inscripciones
  MatriculaController.deleteSchoolInscription,
)

export default router