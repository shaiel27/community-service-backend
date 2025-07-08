import { Router } from "express"
import { DashboardController } from "../controllers/dashboard.controller.js"
import { verifyToken, verifyAdminOrReadOnly } from "../middlewares/jwt.middleware.js"

const router = Router()

// Aplicar middleware de autenticación a todas las rutas
router.use(verifyToken)
router.use(verifyAdminOrReadOnly)

// Rutas del dashboard
router.get("/summary", DashboardController.getDashboardSummary)
router.get("/stats/general", DashboardController.getGeneralStats)
router.get("/stats/distribution", DashboardController.getStudentDistribution)
router.get("/stats/attendance/monthly", DashboardController.getMonthlyAttendance)
router.get("/stats/attendance/weekly", DashboardController.getWeeklyAttendance)
router.get("/stats/academic-performance", DashboardController.getAcademicPerformance)
router.get("/stats/brigades", DashboardController.getBrigadeStats)
router.get("/stats/extracurricular", DashboardController.getExtracurricularActivities)

// Ruta para guardar asistencia
router.post("/attendance/weekly", DashboardController.saveWeeklyAttendance)

export default router
