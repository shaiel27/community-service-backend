import express from "express"
import { EnrollmentController } from "../controllers/matricula.controller.js"
import { verifyToken, verifyAdmin, verifyAdminOrReadOnly } from "../middleware/jwt.middleware.js"

const router = express.Router()

// Rutas de utilidad (deben ir ANTES de las rutas con parámetros)
router.get("/utils/grados", verifyToken, verifyAdminOrReadOnly, EnrollmentController.obtenerGrados)

router.get(
  "/utils/docente-grados",
  verifyToken,
  verifyAdminOrReadOnly,
  EnrollmentController.obtenerSeccionesConDocentes,
)

// Rutas principales de matrículas
router.post("/", verifyToken, verifyAdmin, EnrollmentController.crearMatricula)

router.get("/", verifyToken, verifyAdminOrReadOnly, EnrollmentController.obtenerTodasMatriculas)

// Rutas con parámetros (deben ir AL FINAL)
router.get("/:id", verifyToken, verifyAdminOrReadOnly, EnrollmentController.obtenerMatriculaPorId)

router.get(
  "/estudiante/:estudianteId",
  verifyToken,
  verifyAdminOrReadOnly,
  EnrollmentController.obtenerMatriculasPorEstudiante,
)

router.get("/periodo/:periodo", verifyToken, verifyAdminOrReadOnly, EnrollmentController.obtenerMatriculasPorPeriodo)

router.put("/:id", verifyToken, verifyAdmin, EnrollmentController.actualizarMatricula)

export default router
