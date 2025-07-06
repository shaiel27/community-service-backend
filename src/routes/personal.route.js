import express from "express"
import { PersonalController } from "../controllers/personal.controller.js"
import { verifyToken, verifyAdmin, verifyAdminOrReadOnly } from "../middleware/jwt.middleware.js"

const router = express.Router()

// Rutas de utilidad (deben ir ANTES de las rutas con parámetros)
router.get("/utils/roles", verifyToken, verifyAdminOrReadOnly, PersonalController.getRoles)

router.get("/utils/parroquias", verifyToken, verifyAdminOrReadOnly, PersonalController.getParishes)

router.get("/teachers/all", verifyToken, verifyAdminOrReadOnly, PersonalController.getAllTeachers)

router.get("/administrators/all", verifyToken, verifyAdminOrReadOnly, PersonalController.getAllAdministrators)

router.get("/search/name", verifyToken, verifyAdminOrReadOnly, PersonalController.searchPersonalByName)

router.get("/search/ci", verifyToken, verifyAdminOrReadOnly, PersonalController.searchPersonalByCi)

// Rutas principales de personal
router.post("/", verifyToken, verifyAdmin, PersonalController.createPersonal)

router.get("/", verifyToken, verifyAdminOrReadOnly, PersonalController.getAllPersonal)

// Rutas con parámetros (deben ir AL FINAL)
router.get("/:id", verifyToken, verifyAdminOrReadOnly, PersonalController.getPersonalById)

router.put("/:id", verifyToken, verifyAdmin, PersonalController.updatePersonal)

router.delete("/:id", verifyToken, verifyAdmin, PersonalController.deletePersonal)

export default router
