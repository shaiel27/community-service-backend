import { db } from "../db/connection.database.js"

// Obtener estadísticas generales del sistema escolar
const getGeneralStats = async () => {
  try {
    const query = {
      text: `
        SELECT 
          (SELECT COUNT(*) FROM "student" WHERE "status_id" = 1) as total_students_active,
          (SELECT COUNT(*) FROM "student") as total_students,
          (SELECT COUNT(*) FROM "personal" WHERE "idRole" = 1) as total_teachers,
          (SELECT COUNT(*) FROM "personal") as total_staff,
          (SELECT COUNT(*) FROM "section") as total_sections,
          (SELECT COUNT(*) FROM "grade") as total_grades,
          (SELECT COUNT(*) FROM "brigade") as total_brigades,
          (SELECT COUNT(*) FROM "enrollment" WHERE "repeater" = true) as repeating_students,
          (SELECT COUNT(*) FROM "enrollment" WHERE "repeater" = false) as new_students,
          (SELECT COUNT(*) FROM "student" WHERE "sex" = 'Masculino') as male_students,
          (SELECT COUNT(*) FROM "student" WHERE "sex" = 'Femenino') as female_students,
          (SELECT COUNT(*) FROM "representative") as total_representatives
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
          COUNT(e."studentID") as student_count,
          COUNT(CASE WHEN s."sex" = 'Masculino' THEN 1 END) as male_count,
          COUNT(CASE WHEN s."sex" = 'Femenino' THEN 1 END) as female_count
        FROM "grade" g
        LEFT JOIN "section" sec ON g."id" = sec."gradeID"
        LEFT JOIN "enrollment" e ON sec."id" = e."sectionID"
        LEFT JOIN "student" s ON e."studentID" = s."id"
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

// Obtener rendimiento académico por materia
const getAcademicPerformanceBySubject = async () => {
  try {
    const query = {
      text: `
        SELECT 
          n."subject",
          COUNT(*) as total_notes,
          ROUND(AVG(n."notes"), 2) as average_grade,
          COUNT(CASE WHEN n."notes" >= 10 THEN 1 END) as passing_grades,
          COUNT(CASE WHEN n."notes" < 10 THEN 1 END) as failing_grades,
          MAX(n."notes") as highest_grade,
          MIN(n."notes") as lowest_grade
        FROM "notes" n
        GROUP BY n."subject"
        ORDER BY average_grade DESC
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getAcademicPerformanceBySubject:", error)
    throw error
  }
}

// Obtener estadísticas de asistencia
const getAttendanceStats = async () => {
  try {
    const query = {
      text: `
        SELECT 
          a."date_a",
          sec."seccion",
          g."name" as grade_name,
          COUNT(ad."studentID") as total_registered,
          COUNT(CASE WHEN ad."assistant" = true THEN 1 END) as present_students,
          COUNT(CASE WHEN ad."assistant" = false THEN 1 END) as absent_students,
          ROUND(
            (COUNT(CASE WHEN ad."assistant" = true THEN 1 END) * 100.0 / 
             NULLIF(COUNT(ad."studentID"), 0)), 2
          ) as attendance_percentage
        FROM "attendance" a
        LEFT JOIN "attendanceDetails" ad ON a."id" = ad."attendanceID"
        LEFT JOIN "section" sec ON a."sectionID" = sec."id"
        LEFT JOIN "grade" g ON sec."gradeID" = g."id"
        GROUP BY a."id", a."date_a", sec."seccion", g."name"
        ORDER BY a."date_a" DESC
        LIMIT 10
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getAttendanceStats:", error)
    throw error
  }
}

// Obtener estadísticas de brigadas (actualizado para nueva estructura)
const getBrigadeStats = async () => {
  try {
    const query = {
      text: `
        SELECT 
          b."name" as brigade_name,
          COUNT(sb."studentID") as student_count,
          p."name" as teacher_name,
          p."lastName" as teacher_lastName,
          btd."dateI" as start_date
        FROM "brigade" b
        LEFT JOIN "brigadeTeacherDate" btd ON b."id" = btd."brigadeID"
        LEFT JOIN "personal" p ON btd."personalID" = p."id"
        LEFT JOIN "studentBrigade" sb ON b."id" = sb."brigadeID"
        GROUP BY b."id", b."name", p."name", p."lastName", btd."dateI"
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

// Obtener estadísticas de personal por rol
const getStaffByRole = async () => {
  try {
    const query = {
      text: `
        SELECT 
          r."name" as role_name,
          r."description" as role_description,
          COUNT(p."id") as staff_count
        FROM "rol" r
        LEFT JOIN "personal" p ON r."id" = p."idRole"
        GROUP BY r."id", r."name", r."description"
        ORDER BY staff_count DESC
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getStaffByRole:", error)
    throw error
  }
}

// Obtener estudiantes por estado
const getStudentsByStatus = async () => {
  try {
    const query = {
      text: `
        SELECT 
          ss."descripcion" as status_description,
          COUNT(s."id") as student_count
        FROM "status_student" ss
        LEFT JOIN "student" s ON ss."id" = s."status_id"
        GROUP BY ss."id", ss."descripcion"
        ORDER BY student_count DESC
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getStudentsByStatus:", error)
    throw error
  }
}

// Obtener estadísticas de matrícula
const getEnrollmentStats = async () => {
  try {
    const query = {
      text: `
        SELECT 
          g."name" as grade_name,
          sec."seccion" as section_name,
          COUNT(e."id") as total_enrolled,
          COUNT(CASE WHEN e."repeater" = true THEN 1 END) as repeaters,
          COUNT(CASE WHEN e."repeater" = false THEN 1 END) as new_students,
          p."name" as teacher_name,
          p."lastName" as teacher_lastName
        FROM "enrollment" e
        LEFT JOIN "section" sec ON e."sectionID" = sec."id"
        LEFT JOIN "grade" g ON sec."gradeID" = g."id"
        LEFT JOIN "personal" p ON sec."teacherCI" = p."id"
        GROUP BY g."name", sec."seccion", p."name", p."lastName"
        ORDER BY g."name", sec."seccion"
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getEnrollmentStats:", error)
    throw error
  }
}

// Obtener datos para gráficas mensuales de asistencia
const getMonthlyAttendance = async () => {
  try {
    const query = {
      text: `
        SELECT 
          TO_CHAR(a."date_a", 'Month') as month,
          ROUND(AVG(
            CASE 
              WHEN COUNT(ad."studentID") > 0 THEN
                (COUNT(CASE WHEN ad."assistant" = true THEN 1 END) * 100.0 / COUNT(ad."studentID"))
              ELSE 0 
            END
          ), 2) as percentage
        FROM "attendance" a
        LEFT JOIN "attendanceDetails" ad ON a."id" = ad."attendanceID"
        WHERE a."date_a" >= CURRENT_DATE - INTERVAL '6 months'
        GROUP BY TO_CHAR(a."date_a", 'Month'), EXTRACT(MONTH FROM a."date_a")
        ORDER BY EXTRACT(MONTH FROM a."date_a")
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getMonthlyAttendance:", error)
    throw error
  }
}

// Obtener actividades extracurriculares (simulado con brigadas)
const getExtracurricularActivities = async () => {
  try {
    const query = {
      text: `
        SELECT 
          b."name",
          COUNT(sb."studentID") as participants
        FROM "brigade" b
        LEFT JOIN "studentBrigade" sb ON b."id" = sb."brigadeID"
        GROUP BY b."id", b."name"
        ORDER BY participants DESC
        LIMIT 5
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getExtracurricularActivities:", error)
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
          ROUND(AVG(n."notes"), 2) as avg_performance,
          COUNT(DISTINCT e."studentID") as total_students
        FROM "grade" g
        LEFT JOIN "section" sec ON g."id" = sec."gradeID"
        LEFT JOIN "enrollment" e ON sec."id" = e."sectionID"
        LEFT JOIN "notes" n ON e."id" = n."enrollmentID"
        GROUP BY g."id", g."name"
        HAVING COUNT(n."id") > 0
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

// Obtener resumen completo del dashboard
const getDashboardSummary = async () => {
  try {
    const [
      generalStats,
      gradeDistribution,
      academicPerformance,
      attendanceStats,
      brigadeStats,
      staffByRole,
      studentsByStatus,
      enrollmentStats,
      monthlyAttendance,
      extracurricular,
      academicPerformanceByGrade,
    ] = await Promise.all([
      getGeneralStats(),
      getStudentDistributionByGrade(),
      getAcademicPerformanceBySubject(),
      getAttendanceStats(),
      getBrigadeStats(),
      getStaffByRole(),
      getStudentsByStatus(),
      getEnrollmentStats(),
      getMonthlyAttendance(),
      getExtracurricularActivities(),
      getAcademicPerformanceByGrade(),
    ])

    return {
      generalStats,
      gradeDistribution,
      academicPerformance,
      attendanceStats,
      brigadeStats,
      staffByRole,
      studentsByStatus,
      enrollmentStats,
      monthlyAttendance,
      extracurricular,
      academicPerformanceByGrade,
    }
  } catch (error) {
    console.error("Error in getDashboardSummary:", error)
    throw error
  }
}

export const DashboardModel = {
  getGeneralStats,
  getStudentDistributionByGrade,
  getAcademicPerformanceBySubject,
  getAttendanceStats,
  getBrigadeStats,
  getStaffByRole,
  getStudentsByStatus,
  getEnrollmentStats,
  getMonthlyAttendance,
  getExtracurricularActivities,
  getAcademicPerformanceByGrade,
  getDashboardSummary,
}
