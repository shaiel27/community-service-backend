import express from "express";
import { BrigadaController } from "../controllers/brigada.controller.js";
import { 
  verifyToken, 
  verifyAdmin, 
  verifyAdminOrReadOnly 
} from "../middlewares/jwt.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import {
  createBrigadeSchema,
  assignTeacherSchema,
  enrollStudentsSchema,
  searchBrigadesSchema
} from "../validators/brigada.validator.js";

const router = express.Router();

// Middleware para validar IDs
router.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ ok: false, msg: "ID inválido" });
  }
  next();
});

// Rutas de utilidad
router.get("/utils/available-students", 
  verifyToken, 
  verifyAdminOrReadOnly, 
  BrigadaController.getAvailableStudents
);

router.get("/utils/available-teachers", 
  verifyToken, 
  verifyAdminOrReadOnly, 
  BrigadaController.getAvailableTeachers
);

// Ruta de búsqueda
router.get("/search", 
  verifyToken, 
  verifyAdminOrReadOnly, 
  validate(searchBrigadesSchema, { source: 'query' }),
  BrigadaController.searchBrigades
);

// Rutas principales
router.post("/", 
  verifyToken, 
  verifyAdmin, 
  validate(createBrigadeSchema),
  BrigadaController.createBrigade
);

router.get("/", 
  verifyToken, 
  verifyAdminOrReadOnly, 
  BrigadaController.getAllBrigades
);

// Rutas con parámetros
router.get("/:id", 
  verifyToken, 
  verifyAdminOrReadOnly, 
  BrigadaController.getBrigadeById
);

router.put("/:id", 
  verifyToken, 
  verifyAdmin, 
  validate(createBrigadeSchema),
  BrigadaController.updateBrigade
);

router.get("/:id/students", 
  verifyToken, 
  verifyAdminOrReadOnly, 
  BrigadaController.getStudentsByBrigade
);

router.post("/:id/assign-teacher", 
  verifyToken, 
  verifyAdmin, 
  validate(assignTeacherSchema),
  BrigadaController.assignTeacher
);

router.post("/:id/enroll-students", 
  verifyToken, 
  verifyAdmin, 
  validate(enrollStudentsSchema),
  BrigadaController.enrollStudents
);

router.post("/:id/clear", 
  verifyToken, 
  verifyAdmin, 
  BrigadaController.clearBrigade
);

router.delete("/:id", 
  verifyToken, 
  verifyAdmin, 
  BrigadaController.deleteBrigade
);

export default router;