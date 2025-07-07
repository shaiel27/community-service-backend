import express from "express";
import { MatriculaController } from "../controllers/matricula.controller.js";
import { verifyToken, verifyAdmin, verifyAdminOrReadOnly } from "../middlewares/jwt.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import {
  createMatriculaSchema,
  updateMatriculaSchema,
  periodoEscolarSchema
} from "../validators/matricula.validator.js";

const router = express.Router();

// Middleware para validar IDs numéricos
router.param('id', (req, res, next, id) => {
  if (!Number.isInteger(Number(id)) || id <= 0) {
    return res.status(400).json({ ok: false, msg: "ID inválido" });
  }
  next();
});

// Rutas de utilidad
router.get("/utils/grados", 
  verifyToken, 
  verifyAdminOrReadOnly, 
  MatriculaController.getGrados
);

router.get("/utils/docente-grados", 
  verifyToken, 
  verifyAdminOrReadOnly, 
  MatriculaController.getDocenteGrados
);

// Rutas principales
router.post("/", 
  verifyToken, 
  verifyAdmin, 
  validate(createMatriculaSchema),
  MatriculaController.createMatricula
);

router.get("/", 
  verifyToken, 
  verifyAdminOrReadOnly, 
  MatriculaController.getAllMatriculas
);

// Rutas con parámetros
router.get("/periodo/:periodo_escolar", 
  verifyToken, 
  verifyAdminOrReadOnly,
  validate(periodoEscolarSchema, { source: 'params' }),
  MatriculaController.getMatriculasByPeriodo
);

router.get("/estudiante/:estudiante_id", 
  verifyToken, 
  verifyAdminOrReadOnly, 
  MatriculaController.getMatriculasByEstudiante
);

router.get("/:id", 
  verifyToken, 
  verifyAdminOrReadOnly, 
  MatriculaController.getMatriculaById
);

router.put("/:id", 
  verifyToken, 
  verifyAdmin, 
  validate(updateMatriculaSchema),
  MatriculaController.updateMatricula
);

router.delete("/:id", 
  verifyToken, 
  verifyAdmin, 
  MatriculaController.deleteMatricula
);

export default router;