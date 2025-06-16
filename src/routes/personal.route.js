import express from "express"
import { PersonalController } from "../controllers/personal.controller.js"
import { verifyToken, verifyAdmin, verifyAdminOrReadOnly } from "../middleware/jwt.middleware.js"

const router = express.Router()

// Utility endpoints (deben ir ANTES de las rutas con parámetros)
router.get("/utils/roles", verifyToken, verifyAdminOrReadOnly, PersonalController.getRoles)
router.get("/utils/parroquias", verifyToken, verifyAdminOrReadOnly, PersonalController.getParroquias)

// Search endpoints (deben ir ANTES de las rutas con parámetros)
router.get("/search/name", verifyToken, verifyAdminOrReadOnly, PersonalController.searchPersonalByName)
router.get("/search/ci", verifyToken, verifyAdminOrReadOnly, PersonalController.searchPersonalByCi)

// Role-specific endpoints (deben ir ANTES de las rutas con parámetros)
router.get("/teachers/all", verifyToken, verifyAdminOrReadOnly, PersonalController.getTeachers)
router.get("/administrators/all", verifyToken, verifyAdminOrReadOnly, PersonalController.getAdministrators)
router.get("/maintenance/all", verifyToken, verifyAdminOrReadOnly, PersonalController.getMaintenanceStaff)

// System access endpoints (deben ir ANTES de las rutas con parámetros)
router.get(
  "/system-access/without",
  verifyToken,
  verifyAdminOrReadOnly,
  PersonalController.getPersonalWithoutSystemAccess,
)
router.get("/system-access/with", verifyToken, verifyAdminOrReadOnly, PersonalController.getPersonalWithSystemAccess)

// Personal CRUD operations
router.post("/", verifyToken, verifyAdmin, PersonalController.createPersonal)
router.get("/", verifyToken, verifyAdminOrReadOnly, PersonalController.getAllPersonal)

// Routes with parameters (deben ir AL FINAL)
router.get("/role/:idrole", verifyToken, verifyAdminOrReadOnly, PersonalController.getPersonalByRole)
router.get("/:id", verifyToken, verifyAdminOrReadOnly, PersonalController.getPersonalById)
router.put("/:id", verifyToken, verifyAdmin, PersonalController.updatePersonal)
router.delete("/:id", verifyToken, verifyAdmin, PersonalController.deletePersonal)

export default router
