import { Router } from "express"
import { RepresentativeController } from "../controllers/representative.controller.js"
import { verifyToken, verifyAdminOrReadOnly } from "../middlewares/jwt.middleware.js"

const router = Router()

// Aplicar middleware de autenticación
router.use(verifyToken)
router.use(verifyAdminOrReadOnly)

// Rutas para representantes
router.post("/", RepresentativeController.createRepresentative)
// Ruta para obtener todos los representantes
router.get("/", RepresentativeController.getAllRepresentatives)
//Ruta para obtener un representante por CI
router.get("/:ci", RepresentativeController.getRepresentativeByCi)
//Ruta para actualizar un representante por CI
router.put("/:ci", RepresentativeController.updateRepresentative)

export default router