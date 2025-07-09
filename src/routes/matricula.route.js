import { Router } from "express"
import { MatriculaController } from "../controllers/matricula.controller.js"

const router = Router()

// Aplicar middleware de autenticación (comentado temporalmente para testing)
// router.use(verifyToken)
// router.use(verifyAdminOrReadOnly)

// Rutas principales de matrícula
router.get("/", MatriculaController.getAllMatriculas)
router.get("/:id", MatriculaController.getMatriculaById)
router.post("/", MatriculaController.createMatricula)
router.put("/:id", MatriculaController.updateMatricula)
router.delete("/:id", MatriculaController.deleteMatricula)

// Rutas específicas
router.get("/estudiante/:estudiante_id", MatriculaController.getMatriculasByEstudiante)
router.get("/periodo/:periodo_escolar", MatriculaController.getMatriculasByPeriodo)

// Rutas de utilidades
router.get("/utils/grados", MatriculaController.getGrados)
router.get("/utils/docente-grados", MatriculaController.getDocenteGrados)

export default router
