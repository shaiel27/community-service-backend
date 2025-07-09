import { Router } from "express"
import { StudentController } from "../controllers/student.controller.js"

const router = Router()

// Aplicar middleware de autenticación (comentado temporalmente para testing)
// router.use(verifyToken)
// router.use(verifyAdminOrReadOnly)

// Rutas de estudiantes
router.get("/", StudentController.findAll)
router.get("/search", StudentController.search)
router.get("/:id", StudentController.findById)
router.post("/", StudentController.create)
router.put("/:id", StudentController.update)
router.delete("/:id", StudentController.delete)

export default router
