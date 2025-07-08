import { db } from "../db/connection.database.js"

// Obtener estadísticas generales del dashboard
const getGeneralStats = async () => {
  try {
    const query = {
      text: `
        SELECT 
          (SELECT COUNT(*) FROM "student") as total_students,
          (SELECT COUNT(*) FROM "personal" WHERE "idRole" = 1) as total_teachers,
          (SELECT COUNT(*) FROM "brigade") as total_brigades,
          (SELECT COUNT(*) FROM "enrollment" WHERE "repeater" = true) as repeating_students,
          (SELECT COUNT(*) FROM "enrollment" WHERE "repeater" = false) as new_students,
          (SELECT COUNT(*) FROM "student" WHERE "sex" = 'M') as male_students,
          (SELECT COUNT(*) FROM "student" WHERE "sex" = 'F') as female_students
      `,
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in getGeneralStats:", error)
    throw error
  }
}

// Obtener distribución de estudiantes por grado
const getStudentDistributionByGrade = async () => {
  try {
    const query = {
      text: `
        SELECT 
          g."name" as grade_name,
          COUNT(e."studentID") as student_count
        FROM "grade" g
        LEFT JOIN "section" s ON g."id" = s."gradeID"
        LEFT JOIN "enrollment" e ON s."id" = e."sectionID"
        GROUP BY g."id", g."name"
        ORDER BY g."name"
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getStudentDistributionByGrade:", error)
    throw error
  }
}

// Obtener asistencia mensual (simulada por ahora)
const getMonthlyAttendance = async () => {
  try {
    // Por ahora retornamos datos simulados, pero se puede implementar
    // una tabla de asistencia real en el futuro
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"]
    const attendance = months.map((month, index) => ({
      month,
      percentage: 90 + Math.floor(Math.random() * 8), // 90-98%
    }))

    return attendance
  } catch (error) {
    console.error("Error in getMonthlyAttendance:", error)
    throw error
  }
}

// Obtener rendimiento académico por grado
const getAcademicPerformanceByGrade = async () => {
  try {
    const query = {
      text: `
        SELECT 
          g."name" as grade_name,
          COUNT(e."studentID") as total_students,
          ROUND(AVG(CASE WHEN e."repeater" = false THEN 85 ELSE 75 END), 1) as avg_performance
        FROM "grade" g
        LEFT JOIN "section" s ON g."id" = s."gradeID"
        LEFT JOIN "enrollment" e ON s."id" = e."sectionID"
        GROUP BY g."id", g."name"
        HAVING COUNT(e."studentID") > 0
        ORDER BY g."name"
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getAcademicPerformanceByGrade:", error)
    throw error
  }
}

// Obtener estadísticas de brigadas
const getBrigadeStats = async () => {
  try {
    const query = {
      text: `
        SELECT 
          b."name" as brigade_name,
          COUNT(s."id") as student_count,
          p."name" as teacher_name,
          p."lastName" as teacher_lastName
        FROM "brigade" b
        LEFT JOIN "brigadeTeacherDate" btd ON b."id" = btd."brigadeID"
        LEFT JOIN "personal" p ON btd."personalID" = p."id"
        LEFT JOIN "student" s ON s."brigadeTeacherDateID" = btd."id"
        GROUP BY b."id", b."name", p."name", p."lastName"
        ORDER BY student_count DESC
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getBrigadeStats:", error)
    throw error
  }
}

// Obtener estadísticas de asistencia semanal por grado
const getWeeklyAttendanceByGrade = async () => {
  try {
    // Simulamos datos de asistencia semanal
    const grades = ["Educación Inicial", "1er Grado", "2do Grado", "3er Grado", "4to Grado", "5to Grado", "6to Grado"]
    const weekdays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]

    const attendanceData = grades.map((grade) => {
      const weekData = {}
      weekdays.forEach((day) => {
        weekData[day] = Math.floor(Math.random() * 10) + 85 // 85-95% asistencia
      })
      return {
        grade,
        attendance: weekData,
      }
    })

    return attendanceData
  } catch (error) {
    console.error("Error in getWeeklyAttendanceByGrade:", error)
    throw error
  }
}

// Obtener actividades extracurriculares (simuladas)
const getExtracurricularActivities = async () => {
  try {
    const activities = [
      { name: "Deportes", participants: 120 },
      { name: "Arte", participants: 85 },
      { name: "Música", participants: 70 },
      { name: "Ciencias", participants: 65 },
      { name: "Idiomas", participants: 95 },
    ]

    return activities
  } catch (error) {
    console.error("Error in getExtracurricularActivities:", error)
    throw error
  }
}

// Obtener resumen completo del dashboard
const getDashboardSummary = async () => {
  try {
    const [
      generalStats,
      gradeDistribution,
      monthlyAttendance,
      academicPerformance,
      brigadeStats,
      weeklyAttendance,
      extracurricular,
    ] = await Promise.all([
      getGeneralStats(),
      getStudentDistributionByGrade(),
      getMonthlyAttendance(),
      getAcademicPerformanceByGrade(),
      getBrigadeStats(),
      getWeeklyAttendanceByGrade(),
      getExtracurricularActivities(),
    ])

    return {
      generalStats,
      gradeDistribution,
      monthlyAttendance,
      academicPerformance,
      brigadeStats,
      weeklyAttendance,
      extracurricular,
    }
  } catch (error) {
    console.error("Error in getDashboardSummary:", error)
    throw error
  }
}

export const DashboardModel = {
  getGeneralStats,
  getStudentDistributionByGrade,
  getMonthlyAttendance,
  getAcademicPerformanceByGrade,
  getBrigadeStats,
  getWeeklyAttendanceByGrade,
  getExtracurricularActivities,
  getDashboardSummary,
}
