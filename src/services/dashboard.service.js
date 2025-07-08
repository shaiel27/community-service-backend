import { DashboardModel } from "../models/dashboard.model.js"

class DashboardService {
  // Obtener datos completos del dashboard con procesamiento adicional
  async obtenerDatosDashboard() {
    try {
      const data = await DashboardModel.getDashboardSummary()

      // Procesar y formatear datos adicionales
      const processedData = {
        ...data,
        // Calcular porcentajes y métricas adicionales
        attendanceRate: this.calculateAttendanceRate(data.generalStats),
        genderDistribution: this.calculateGenderDistribution(data.generalStats),
        progressMetrics: this.calculateProgressMetrics(data.generalStats),
      }

      return processedData
    } catch (error) {
      console.error("Error in obtenerDatosDashboard:", error)
      throw error
    }
  }

  // Calcular tasa de asistencia
  calculateAttendanceRate(stats) {
    const totalStudents = Number.parseInt(stats.total_students) || 0
    if (totalStudents === 0) return 0

    // Simulamos una tasa de asistencia del 92%
    return 92
  }

  // Calcular distribución por género
  calculateGenderDistribution(stats) {
    const maleStudents = Number.parseInt(stats.male_students) || 0
    const femaleStudents = Number.parseInt(stats.female_students) || 0
    const total = maleStudents + femaleStudents

    if (total === 0) return { male: 0, female: 0 }

    return {
      male: Math.round((maleStudents / total) * 100),
      female: Math.round((femaleStudents / total) * 100),
    }
  }

  // Calcular métricas de progreso
  calculateProgressMetrics(stats) {
    const totalStudents = Number.parseInt(stats.total_students) || 0
    const newStudents = Number.parseInt(stats.new_students) || 0
    const repeatingStudents = Number.parseInt(stats.repeating_students) || 0

    return [
      {
        title: "Asistencia",
        value: `${totalStudents} Estudiantes`,
        percent: 92,
        color: "success",
      },
      {
        title: "Promedio Académico",
        value: "8.5/10",
        percent: 85,
        color: "info",
      },
      {
        title: "Participación de Padres",
        value: `${Math.floor(totalStudents * 0.75)} Padres`,
        percent: 75,
        color: "warning",
      },
      {
        title: "Nuevos Estudiantes",
        value: `${newStudents} Estudiantes`,
        percent: totalStudents > 0 ? Math.round((newStudents / totalStudents) * 100) : 0,
        color: "danger",
      },
      {
        title: "Tasa de Graduación",
        value: "Promedio",
        percent: 95.5,
        color: "primary",
      },
    ]
  }

  // Procesar datos para gráficas
  async procesarDatosGraficas() {
    try {
      const data = await DashboardModel.getDashboardSummary()

      return {
        studentDistribution: this.formatStudentDistributionChart(data.gradeDistribution),
        monthlyAttendance: this.formatMonthlyAttendanceChart(data.monthlyAttendance),
        extracurricular: this.formatExtracurricularChart(data.extracurricular),
        academicPerformance: this.formatAcademicPerformanceChart(data.academicPerformance),
      }
    } catch (error) {
      console.error("Error in procesarDatosGraficas:", error)
      throw error
    }
  }

  formatStudentDistributionChart(distribution) {
    const labels = distribution.map((item) => item.grade_name)
    const data = distribution.map((item) => Number.parseInt(item.student_count) || 0)

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#FF6384"],
          hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#FF6384"],
        },
      ],
    }
  }

  formatMonthlyAttendanceChart(attendance) {
    const labels = attendance.map((item) => item.month.substring(0, 3))
    const data = attendance.map((item) => item.percentage)

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

  formatExtracurricularChart(activities) {
    const labels = activities.map((item) => item.name)
    const data = activities.map((item) => item.participants)

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

  formatAcademicPerformanceChart(performance) {
    return performance.map((item) => ({
      title: item.grade_name,
      percent: Number.parseFloat(item.avg_performance) || 0,
      value: `${item.avg_performance}/10`,
      students: Number.parseInt(item.total_students) || 0,
    }))
  }
}

export default new DashboardService()
