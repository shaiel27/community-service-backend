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

// Obtener datos para gráficas
const getDashboardCharts = async (req, res) => {
  try {
    const summary = await DashboardModel.getDashboardSummary()

    // Formatear datos para gráficas
    const chartData = {
      studentDistribution: formatStudentDistributionChart(summary.gradeDistribution),
      monthlyAttendance: formatMonthlyAttendanceChart(summary.monthlyAttendance),
      extracurricular: formatExtracurricularChart(summary.extracurricular),
      academicPerformance: formatAcademicPerformanceChart(summary.academicPerformanceByGrade),
    }

    res.json({
      ok: true,
      data: chartData,
    })
  } catch (error) {
    handleError(error, res)
  }
}

// Registrar asistencia semanal
const saveWeeklyAttendance = async (req, res) => {
  try {
    const { attendanceData } = req.body

    if (!attendanceData) {
      return res.status(400).json({
        ok: false,
        msg: "Datos de asistencia requeridos",
      })
    }

    // Aquí implementarías la lógica para guardar en la base de datos
    console.log("Datos de asistencia recibidos:", attendanceData)

    res.json({
      ok: true,
      msg: "Asistencia registrada exitosamente",
      data: { attendanceData },
    })
  } catch (error) {
    handleError(error, res)
  }
}

// Funciones auxiliares para formatear datos de gráficas
const formatStudentDistributionChart = (distribution) => {
  const labels = distribution.map((item) => item.grade_name)
  const data = distribution.map((item) => Number.parseInt(item.student_count) || 0)

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6384",
          "#C9CBCF",
          "#4BC0C0",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6384",
          "#C9CBCF",
          "#4BC0C0",
        ],
      },
    ],
  }
}

const formatMonthlyAttendanceChart = (attendance) => {
  const labels = attendance.map((item) => item.month.trim().substring(0, 3))
  const data = attendance.map((item) => Number.parseFloat(item.percentage) || 0)

  return {
    labels,
    datasets: [
      {
        label: "Asistencia (%)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
        pointBorderColor: "#fff",
        data,
      },
    ],
  }
}

const formatExtracurricularChart = (activities) => {
  const labels = activities.map((item) => item.name)
  const data = activities.map((item) => Number.parseInt(item.participants) || 0)

  return {
    labels,
    datasets: [
      {
        label: "Participación de estudiantes",
        backgroundColor: "#4BC0C0",
        data,
      },
    ],
  }
}

const formatAcademicPerformanceChart = (performance) => {
  return performance.map((item) => ({
    title: item.grade_name,
    percent: Number.parseFloat(item.avg_performance) || 0,
    value: `${item.avg_performance}/20`,
    students: Number.parseInt(item.total_students) || 0,
  }))
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
  getDashboardCharts,
  saveWeeklyAttendance,
}
