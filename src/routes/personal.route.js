import express from "express";
import { PersonalController } from "../controllers/personal.controller.js";
import {
  verifyToken,
  verifyAdmin,
  verifyAdminOrReadOnly
} from "../middlewares/jwt.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import {
  createPersonalSchema,
  updatePersonalSchema,
  searchByNameSchema,
  searchByCiSchema
} from "../validators/personal.validator.js";

const router = express.Router();

// Middleware para validar IDs numéricos
router.param('id', (req, res, next, id) => {
  if (!Number.isInteger(Number(id)) || id <= 0) {
    return res.status(400).json({ ok: false, msg: "ID inválido" });
  }
  next();
});

// Utility endpoints
router.get("/utils/roles", verifyToken, verifyAdminOrReadOnly, PersonalController.getRoles);

router.get("/utils/parroquias", verifyToken, verifyAdminOrReadOnly, PersonalController.getParroquias);
// Search endpoints
router.get("/search/name", verifyToken, verifyAdminOrReadOnly, validate(searchByNameSchema, { source: 'query' }), PersonalController.searchPersonalByName);

router.get("/search/ci", verifyToken, verifyAdminOrReadOnly, validate(searchByCiSchema, { source: 'query' }), PersonalController.searchPersonalByCedula);
// Role-specific endpoints
router.get("/teachers/all", verifyToken, verifyAdminOrReadOnly, PersonalController.getTeachers);

router.get(
  "/administrators/all",
  verifyToken,
  verifyAdminOrReadOnly,
  PersonalController.getAdministrators
);

router.get(
  "/maintenance/all",
  verifyToken,
  verifyAdminOrReadOnly,
  PersonalController.getMaintenanceStaff
);

// System access endpoints
router.get(
  "/system-access/without",
  verifyToken,
  verifyAdminOrReadOnly,
  PersonalController.getPersonalWithoutSystemAccess
);

router.get(
  "/system-access/with",
  verifyToken,
  verifyAdminOrReadOnly,
  PersonalController.getPersonalWithSystemAccess
);

// Personal CRUD operations
router.post("/", verifyToken, verifyAdmin, validate(createPersonalSchema), PersonalController.createPersonal);

router.get("/", verifyToken, verifyAdmin, PersonalController.getAllPersonal);

// Routes with parameters
router.get("/role/:idrole", verifyToken, verifyAdminOrReadOnly, PersonalController.getPersonalByRole );

router.get("/:id", verifyToken, verifyAdminOrReadOnly, PersonalController.getPersonalById);

router.put(
  "/:id", 
  verifyToken, 
  verifyAdmin, 
  validate(updatePersonalSchema),
  PersonalController.updatePersonal
);

router.delete(
  "/:id", 
  verifyToken, 
  verifyAdmin, 
  PersonalController.deletePersonal
);

export default router;