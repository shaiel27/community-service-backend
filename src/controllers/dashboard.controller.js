import { DashboardModel } from "../models/dashboard.model.js"

const getDashboardSummary = async (req, res) => {
  try {
    console.log("🔄 Obteniendo resumen completo del dashboard...")

    const dashboardData = await DashboardModel.getDashboardSummary()

    console.log("✅ Datos del dashboard obtenidos exitosamente")

    return res.status(200).json({
      ok: true,
      msg: "Datos del dashboard obtenidos exitosamente",
      data: dashboardData,
    })
  } catch (error) {
    console.error("❌ Error en getDashboardSummary:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor al obtener datos del dashboard",
      error: error.message,
    })
  }
}

const getDashboardCharts = async (req, res) => {
  try {
    console.log("📊 Obteniendo datos para gráficas...")

    const [gradeDistribution, academicPerformance, staffByRole, studentsByStatus, monthlyAttendance] =
      await Promise.all([
        DashboardModel.getStudentDistributionByGrade(),
        DashboardModel.getAcademicPerformanceBySubject(),
        DashboardModel.getStaffByRole(),
        DashboardModel.getStudentsByStatus(),
        DashboardModel.getMonthlyAttendance(),
      ])

    const chartData = {
      gradeDistribution,
      academicPerformance,
      staffByRole,
      studentsByStatus,
      monthlyAttendance,
    }

    console.log("✅ Datos de gráficas obtenidos exitosamente")

    return res.status(200).json({
      ok: true,
      msg: "Datos de gráficas obtenidos exitosamente",
      data: chartData,
    })
  } catch (error) {
    console.error("❌ Error en getDashboardCharts:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor al obtener datos de gráficas",
      error: error.message,
    })
  }
}

const getAvailableSections = async (req, res) => {
  try {
    console.log("📚 Obteniendo secciones disponibles...")

    const sections = await DashboardModel.getAvailableSections()

    console.log("✅ Secciones obtenidas exitosamente")

    return res.status(200).json({
      ok: true,
      msg: "Secciones obtenidas exitosamente",
      data: sections,
    })
  } catch (error) {
    console.error("❌ Error en getAvailableSections:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor al obtener secciones",
      error: error.message,
    })
  }
}

const saveAttendance = async (req, res) => {
  try {
    console.log("💾 Guardando asistencia...")

    const { sectionId, date, observations, students } = req.body

    // Validaciones básicas
    if (!sectionId || !date) {
      return res.status(400).json({
        ok: false,
        msg: "Sección y fecha son requeridos",
      })
    }

    const result = await DashboardModel.saveAttendance({
      sectionId: Number.parseInt(sectionId),
      date,
      observations: observations || "",
      students: students || [],
    })

    console.log("✅ Asistencia guardada exitosamente")

    return res.status(200).json({
      ok: true,
      msg: "Asistencia guardada exitosamente",
      data: result,
    })
  } catch (error) {
    console.error("❌ Error en saveAttendance:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor al guardar asistencia",
      error: error.message,
    })
  }
}

// Mantener las funciones existentes para compatibilidad
const getGeneralStats = async (req, res) => {
  try {
    const stats = await DashboardModel.getGeneralStats()
    return res.status(200).json({
      ok: true,
      msg: "Estadísticas generales obtenidas exitosamente",
      data: stats,
    })
  } catch (error) {
    console.error("❌ Error en getGeneralStats:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor al obtener estadísticas generales",
      error: error.message,
    })
  }
}

const getStudentDistribution = async (req, res) => {
  try {
    const distribution = await DashboardModel.getStudentDistributionByGrade()
    return res.status(200).json({
      ok: true,
      msg: "Distribución de estudiantes obtenida exitosamente",
      data: distribution,
    })
  } catch (error) {
    console.error("❌ Error en getStudentDistribution:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor al obtener distribución de estudiantes",
      error: error.message,
    })
  }
}

const getAcademicPerformance = async (req, res) => {
  try {
    const performance = await DashboardModel.getAcademicPerformanceBySubject()
    return res.status(200).json({
      ok: true,
      msg: "Rendimiento académico obtenido exitosamente",
      data: performance,
    })
  } catch (error) {
    console.error("❌ Error en getAcademicPerformance:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor al obtener rendimiento académico",
      error: error.message,
    })
  }
}

const getAttendanceStats = async (req, res) => {
  try {
    const attendance = await DashboardModel.getAttendanceStats()
    return res.status(200).json({
      ok: true,
      msg: "Estadísticas de asistencia obtenidas exitosamente",
      data: attendance,
    })
  } catch (error) {
    console.error("❌ Error en getAttendanceStats:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor al obtener estadísticas de asistencia",
      error: error.message,
    })
  }
}

const getBrigadeStats = async (req, res) => {
  try {
    const brigades = await DashboardModel.getBrigadeStats()
    return res.status(200).json({
      ok: true,
      msg: "Estadísticas de brigadas obtenidas exitosamente",
      data: brigades,
    })
  } catch (error) {
    console.error("❌ Error en getBrigadeStats:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor al obtener estadísticas de brigadas",
      error: error.message,
    })
  }
}

const getStaffByRole = async (req, res) => {
  try {
    const staff = await DashboardModel.getStaffByRole()
    return res.status(200).json({
      ok: true,
      msg: "Personal por rol obtenido exitosamente",
      data: staff,
    })
  } catch (error) {
    console.error("❌ Error en getStaffByRole:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor al obtener personal por rol",
      error: error.message,
    })
  }
}

const getStudentsByStatus = async (req, res) => {
  try {
    const students = await DashboardModel.getStudentsByStatus()
    return res.status(200).json({
      ok: true,
      msg: "Estudiantes por estado obtenidos exitosamente",
      data: students,
    })
  } catch (error) {
    console.error("❌ Error en getStudentsByStatus:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor al obtener estudiantes por estado",
      error: error.message,
    })
  }
}

const getEnrollmentStats = async (req, res) => {
  try {
    const enrollment = await DashboardModel.getEnrollmentStats()
    return res.status(200).json({
      ok: true,
      msg: "Estadísticas de matrícula obtenidas exitosamente",
      data: enrollment,
    })
  } catch (error) {
    console.error("❌ Error en getEnrollmentStats:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor al obtener estadísticas de matrícula",
      error: error.message,
    })
  }
}

export const DashboardController = {
  getDashboardSummary,
  getDashboardCharts,
  getAvailableSections,
  saveAttendance,
  getGeneralStats,
  getStudentDistribution,
  getAcademicPerformance,
  getAttendanceStats,
  getBrigadeStats,
  getStaffByRole,
  getStudentsByStatus,
  getEnrollmentStats,
}
