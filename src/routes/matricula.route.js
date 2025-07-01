import express from "express"
import { MatriculaController } from "../controllers/matricula.controller.js"
import { verifyToken, verifyAdmin, verifyAdminOrReadOnly } from "../middleware/jwt.middleware.js"

const router = express.Router()

// Rutas de utilidad (deben ir ANTES de las rutas con parámetros)
router.get("/utils/grados", verifyToken, verifyAdminOrReadOnly, MatriculaController.getGrados)

router.get("/utils/docente-grados", verifyToken, verifyAdminOrReadOnly, MatriculaController.getDocenteGrados)

// Rutas principales de matrícula
router.post("/", verifyToken, verifyAdmin, MatriculaController.createMatricula)

router.get("/", verifyToken, verifyAdminOrReadOnly, MatriculaController.getAllMatriculas)

// Rutas con parámetros (deben ir AL FINAL)
router.get("/periodo/:periodo_escolar", verifyToken, verifyAdminOrReadOnly, MatriculaController.getMatriculasByPeriodo)

router.get(
  "/estudiante/:estudiante_id",
  verifyToken,
  verifyAdminOrReadOnly,
  MatriculaController.getMatriculasByEstudiante,
)

router.get("/:id", verifyToken, verifyAdminOrReadOnly, MatriculaController.getMatriculaById)

router.put("/:id", verifyToken, verifyAdmin, MatriculaController.updateMatricula)

router.delete("/:id", verifyToken, verifyAdmin, MatriculaController.deleteMatricula)

export default router
