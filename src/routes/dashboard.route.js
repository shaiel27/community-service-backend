import { Router } from "express"
import { DashboardController } from "../controllers/dashboard.controller.js"
import { verifyToken, verifyAdminOrReadOnly } from "../middlewares/jwt.middleware.js"

const router = Router()

// Aplicar middleware de autenticación a todas las rutas
router.use(verifyToken)
router.use(verifyAdminOrReadOnly)

// Rutas del dashboard escolar
router.get("/summary", DashboardController.getDashboardSummary)
router.get("/stats/general", DashboardController.getGeneralStats)
router.get("/stats/distribution", DashboardController.getStudentDistribution)
router.get("/stats/academic-performance", DashboardController.getAcademicPerformance)
router.get("/stats/attendance", DashboardController.getAttendanceStats)
router.get("/stats/brigades", DashboardController.getBrigadeStats)
router.get("/stats/staff", DashboardController.getStaffByRole)
router.get("/stats/student-status", DashboardController.getStudentsByStatus)
router.get("/stats/enrollment", DashboardController.getEnrollmentStats)

// Ruta para registrar asistencia
router.post("/attendance", DashboardController.saveAttendance)

export default router
