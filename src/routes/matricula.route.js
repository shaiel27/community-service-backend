import { Router } from "express"
import { MatriculaController } from "../controllers/matricula.controller.js"
import { verifyToken, verifyAdminOrReadOnly } from "../middlewares/jwt.middleware.js"

const router = Router()

// Aplicar middleware de autenticación
router.use(verifyToken)
router.use(verifyAdminOrReadOnly)

// Rutas para el nuevo sistema de inscripción escolar
router.post("/inscription", MatriculaController.createSchoolInscription)
router.get("/grades", MatriculaController.getAvailableGrades)
router.get("/sections/:gradeId", MatriculaController.getSectionsByGrade)
router.get("/teachers", MatriculaController.getAvailableTeachers)
router.post("/assign-teacher", MatriculaController.assignTeacherToSection)
router.get("/inscriptions/:gradeId", MatriculaController.getInscriptionsByGrade)
router.get("/all", MatriculaController.getAllInscriptions)
router.get("/:id", MatriculaController.getInscriptionById)
router.put("/:id", MatriculaController.updateMatricula)
router.delete("/:id", MatriculaController.deleteMatricula)
export default router
