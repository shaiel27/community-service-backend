import { Router } from "express"
import { DashboardController } from "../controllers/dashboard.controller.js"
import { verifyToken, verifyAdminOrReadOnly } from "../middlewares/jwt.middleware.js"

const router = Router()

// Aplicar middleware de autenticación a todas las rutas
router.use(verifyToken)
router.use(verifyAdminOrReadOnly)

// Rutas principales del dashboard
router.get("/summary", DashboardController.getDashboardSummary)
router.get("/charts", DashboardController.getDashboardCharts)

// Rutas específicas para estadísticas
router.get("/stats/general", DashboardController.getGeneralStats)
router.get("/stats/students", DashboardController.getStudentDistribution)
router.get("/stats/academic", DashboardController.getAcademicPerformance)
router.get("/stats/attendance", DashboardController.getAttendanceStats)
router.get("/stats/brigades", DashboardController.getBrigadeStats)
router.get("/stats/staff", DashboardController.getStaffByRole)
router.get("/stats/status", DashboardController.getStudentsByStatus)
router.get("/stats/enrollment", DashboardController.getEnrollmentStats)

// Rutas para registro de asistencia
router.post("/attendance/weekly", DashboardController.saveWeeklyAttendance)

export default router
