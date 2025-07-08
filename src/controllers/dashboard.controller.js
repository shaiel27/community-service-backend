import { DashboardModel } from "../models/dashboard.model.js"

// Manejador centralizado de errores
const handleError = (error, res) => {
  console.error("Dashboard Controller Error:", error)
  const status = error.message.includes("no encontrad") ? 404 : 500

  res.status(status).json({
    ok: false,
    msg: error.message || "Error interno del servidor",
  })
}

// Obtener estadísticas generales
const getGeneralStats = async (req, res) => {
  try {
    const stats = await DashboardModel.getGeneralStats()
    res.json({
      ok: true,
      stats,
    })
  } catch (error) {
    handleError(error, res)
  }
}

// Obtener distribución de estudiantes por grado
const getStudentDistribution = async (req, res) => {
  try {
    const distribution = await DashboardModel.getStudentDistributionByGrade()
    res.json({
      ok: true,
      distribution,
    })
  } catch (error) {
    handleError(error, res)
  }
}

// Obtener asistencia mensual
const getMonthlyAttendance = async (req, res) => {
  try {
    const attendance = await DashboardModel.getMonthlyAttendance()
    res.json({
      ok: true,
      attendance,
    })
  } catch (error) {
    handleError(error, res)
  }
}

// Obtener rendimiento académico por grado
const getAcademicPerformance = async (req, res) => {
  try {
    const performance = await DashboardModel.getAcademicPerformanceByGrade()
    res.json({
      ok: true,
      performance,
    })
  } catch (error) {
    handleError(error, res)
  }
}

// Obtener estadísticas de brigadas
const getBrigadeStats = async (req, res) => {
  try {
    const brigadeStats = await DashboardModel.getBrigadeStats()
    res.json({
      ok: true,
      brigadeStats,
    })
  } catch (error) {
    handleError(error, res)
  }
}

// Obtener asistencia semanal por grado
const getWeeklyAttendance = async (req, res) => {
  try {
    const weeklyAttendance = await DashboardModel.getWeeklyAttendanceByGrade()
    res.json({
      ok: true,
      weeklyAttendance,
    })
  } catch (error) {
    handleError(error, res)
  }
}

// Obtener actividades extracurriculares
const getExtracurricularActivities = async (req, res) => {
  try {
    const activities = await DashboardModel.getExtracurricularActivities()
    res.json({
      ok: true,
      activities,
    })
  } catch (error) {
    handleError(error, res)
  }
}

// Obtener resumen completo del dashboard
const getDashboardSummary = async (req, res) => {
  try {
    const summary = await DashboardModel.getDashboardSummary()
    res.json({
      ok: true,
      data: summary,
    })
  } catch (error) {
    handleError(error, res)
  }
}

// Guardar asistencia semanal
const saveWeeklyAttendance = async (req, res) => {
  try {
    const { attendanceData } = req.body

    if (!attendanceData) {
      return res.status(400).json({
        ok: false,
        msg: "Los datos de asistencia son requeridos",
      })
    }

    // Aquí se implementaría la lógica para guardar en base de datos
    // Por ahora solo simulamos la respuesta
    console.log("Datos de asistencia recibidos:", attendanceData)

    res.json({
      ok: true,
      msg: "Asistencia guardada exitosamente",
      data: attendanceData,
    })
  } catch (error) {
    handleError(error, res)
  }
}

export const DashboardController = {
  getGeneralStats,
  getStudentDistribution,
  getMonthlyAttendance,
  getAcademicPerformance,
  getBrigadeStats,
  getWeeklyAttendance,
  getExtracurricularActivities,
  getDashboardSummary,
  saveWeeklyAttendance,
}
