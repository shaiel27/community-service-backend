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

// Obtener rendimiento académico por materia
const getAcademicPerformance = async (req, res) => {
  try {
    const performance = await DashboardModel.getAcademicPerformanceBySubject()
    res.json({
      ok: true,
      performance,
    })
  } catch (error) {
    handleError(error, res)
  }
}

// Obtener estadísticas de asistencia
const getAttendanceStats = async (req, res) => {
  try {
    const attendance = await DashboardModel.getAttendanceStats()
    res.json({
      ok: true,
      attendance,
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

// Obtener personal por rol
const getStaffByRole = async (req, res) => {
  try {
    const staffStats = await DashboardModel.getStaffByRole()
    res.json({
      ok: true,
      staffStats,
    })
  } catch (error) {
    handleError(error, res)
  }
}

// Obtener estudiantes por estado
const getStudentsByStatus = async (req, res) => {
  try {
    const statusStats = await DashboardModel.getStudentsByStatus()
    res.json({
      ok: true,
      statusStats,
    })
  } catch (error) {
    handleError(error, res)
  }
}

// Obtener estadísticas de matrícula
const getEnrollmentStats = async (req, res) => {
  try {
    const enrollmentStats = await DashboardModel.getEnrollmentStats()
    res.json({
      ok: true,
      enrollmentStats,
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

// Registrar asistencia diaria
const saveAttendance = async (req, res) => {
  try {
    const { sectionId, date, attendanceData, observations } = req.body

    if (!sectionId || !date || !attendanceData) {
      return res.status(400).json({
        ok: false,
        msg: "Datos de asistencia incompletos",
      })
    }

    // Aquí implementarías la lógica para guardar en la base de datos
    console.log("Datos de asistencia recibidos:", {
      sectionId,
      date,
      attendanceData,
      observations,
    })

    res.json({
      ok: true,
      msg: "Asistencia registrada exitosamente",
      data: { sectionId, date, attendanceData, observations },
    })
  } catch (error) {
    handleError(error, res)
  }
}

export const DashboardController = {
  getGeneralStats,
  getStudentDistribution,
  getAcademicPerformance,
  getAttendanceStats,
  getBrigadeStats,
  getStaffByRole,
  getStudentsByStatus,
  getEnrollmentStats,
  getDashboardSummary,
  saveAttendance,
}
