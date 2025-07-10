import { Router } from "express"
import { RepresentativeController } from "../controllers/representative.controller.js"
import { verifyToken, verifyAdminOrReadOnly } from "../middlewares/jwt.middleware.js"

const router = Router()

// Aplicar middleware de autenticación
router.use(verifyToken)
router.use(verifyAdminOrReadOnly)

// Rutas para representantes
router.post("/", RepresentativeController.createRepresentative)
router.get("/", RepresentativeController.getAllRepresentatives)
router.get("/:ci", RepresentativeController.getRepresentativeByCi)
router.put("/:ci", RepresentativeController.updateRepresentative)

export default router
