import { Router } from "express"
import { RepresentativeController } from "../controllers/representative.controller.js"
import { verifyToken, verifyAdminOrReadOnly } from "../middlewares/jwt.middleware.js"

const router = Router()

// Aplicar middleware de autenticación
router.use(verifyToken)
router.use(verifyAdminOrReadOnly)

// Rutas de representantes
router.get("/", RepresentativeController.findAll)
router.get("/search", RepresentativeController.search)
router.get("/:ci", RepresentativeController.findByCi)
router.post("/", RepresentativeController.create)
router.put("/:ci", RepresentativeController.update)
router.delete("/:ci", RepresentativeController.delete)

export default router
