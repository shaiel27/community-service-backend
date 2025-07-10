import { Router } from "express"
import { StudentController } from "../controllers/student.controller.js"
import { verifyToken, verifyAdminOrReadOnly, verifyAdmin } from "../middlewares/jwt.middleware.js"
import validate from "../middlewares/validation.middleware.js"
import { createStudentRegistrySchema, updateStudentSchema } from "../validators/student.validator.js"

const router = Router()

// Middleware para validar IDs numéricos en las rutas que lo requieran
router.param('id', (req, res, next, id) => {
  if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
    return res.status(400).json({ ok: false, msg: "ID de estudiante inválido" });
  }
  next();
});

// Aplicar middleware de autenticación
router.use(verifyToken)
router.use(verifyAdminOrReadOnly)

// Registro estudiantil (estudiante + representante)
router.post(
  "/registry",
  verifyAdmin,
  validate(createStudentRegistrySchema),
  StudentController.createStudentRegistry
)

// Obtener estudiantes registrados (disponibles para inscripción)
router.get("/registered", verifyAdminOrReadOnly, StudentController.getRegisteredStudents)

// Buscar estudiante para inscripción
router.get("/inscription/:ci", verifyAdminOrReadOnly, StudentController.findStudentForInscription)

// Buscar estudiante por CI (general)
router.get("/:ci", verifyAdminOrReadOnly, StudentController.findStudentByCi)

// Obtener todos los estudiantes (sin importar estado de inscripción)
router.get("/list/all", verifyAdminOrReadOnly, StudentController.getAllStudents)

// Actualizar y eliminar estudiantes
router.put(
  "/:id",
  verifyAdmin,
  validate(updateStudentSchema),
  StudentController.updateStudent
)

router.delete(
  "/:id",
  verifyAdmin, 
  StudentController.deleteStudent
)

export default router