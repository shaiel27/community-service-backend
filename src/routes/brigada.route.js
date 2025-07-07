import express from "express"
import { BrigadaController } from "../controllers/brigada.controller.js"
import { verifyToken, verifyAdmin, verifyAdminOrReadOnly } from "../middleware/jwt.middleware.js"

const router = express.Router()

// Rutas de utilidad (deben ir ANTES de las rutas con parámetros)
router.get("/utils/available-students", verifyToken, verifyAdminOrReadOnly, BrigadaController.getAvailableStudents)

router.get("/utils/available-teachers", verifyToken, verifyAdminOrReadOnly, BrigadaController.getAvailableTeachers)

// Rutas de búsqueda (deben ir ANTES de las rutas con parámetros)
router.get("/search", verifyToken, verifyAdminOrReadOnly, BrigadaController.searchBrigades)

// Rutas principales de brigadas
router.post("/", verifyToken, verifyAdmin, BrigadaController.createBrigade)

router.get("/", verifyToken, verifyAdminOrReadOnly, BrigadaController.getAllBrigades)

// Rutas con parámetros (deben ir AL FINAL)
router.param('id', (req, res, next, id) => {
    if (!Number.isInteger(Number(id)) || id <= 0) {
        return res.status(400).json({ ok: false, msg: "ID inválido" });
    }
    next();
});

router.get("/:id", verifyToken, verifyAdminOrReadOnly, BrigadaController.getBrigadeById)

router.put("/:id", verifyToken, verifyAdmin, BrigadaController.updateBrigade)

router.get("/:id/students", verifyToken, verifyAdminOrReadOnly, BrigadaController.getStudentsByBrigade)

router.post("/:id/assign-teacher", verifyToken, verifyAdmin, BrigadaController.assignTeacher)

router.post("/:id/enroll-students", verifyToken, verifyAdmin, BrigadaController.enrollStudents)

router.post("/:id/clear", verifyToken, verifyAdmin, BrigadaController.clearBrigade)

router.delete("/:id", verifyToken, verifyAdmin, BrigadaController.deleteBrigade)

export default router
