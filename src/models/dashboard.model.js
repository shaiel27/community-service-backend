import { db } from "../db/connection.database.js"

export class DashboardModel {
  // Obtener resumen general del dashboard
  static async getDashboardSummary() {
    try {
      console.log("📊 Obteniendo resumen del dashboard...")

      // Consultas paralelas para obtener estadísticas
      const [totalStudentsResult, activeStudentsResult, totalTeachersResult, totalSectionsResult, totalBrigadesResult] =
        await Promise.all([
          db.query("SELECT COUNT(*) as total FROM student"),
          db.query("SELECT COUNT(*) as total FROM student WHERE status_id = 1"),
          db.query('SELECT COUNT(*) as total FROM personal WHERE "idRole" = 1'),
          db.query("SELECT COUNT(*) as total FROM section"),
          db.query("SELECT COUNT(*) as total FROM brigade"),
        ])

      // Calcular tasa de asistencia promedio
      const attendanceResult = await db.query(`
        SELECT 
          ROUND(
            (COUNT(CASE WHEN ad.assistant = true THEN 1 END) * 100.0 / 
             NULLIF(COUNT(*), 0)), 2
          ) as attendance_rate
        FROM "attendanceDetails" ad
        JOIN attendance a ON ad."attendanceID" = a.id
        WHERE a.date_a >= CURRENT_DATE - INTERVAL '30 days'
      `)

      // Calcular rendimiento académico promedio
      const performanceResult = await db.query(`
        SELECT ROUND(AVG(notes), 2) as avg_performance
        FROM notes
        WHERE period = 'Primer Lapso'
      `)

      const summary = {
        totalStudents: Number.parseInt(totalStudentsResult.rows[0].total),
        activeStudents: Number.parseInt(activeStudentsResult.rows[0].total),
        totalTeachers: Number.parseInt(totalTeachersResult.rows[0].total),
        totalSections: Number.parseInt(totalSectionsResult.rows[0].total),
        totalBrigades: Number.parseInt(totalBrigadesResult.rows[0].total),
        attendanceRate: Number.parseFloat(attendanceResult.rows[0]?.attendance_rate || 0),
        academicPerformance: Number.parseFloat(performanceResult.rows[0]?.avg_performance || 0),
        lastUpdated: new Date().toISOString(),
      }

      return summary
    } catch (error) {
      console.error("❌ Error en getDashboardSummary:", error)
      throw error
    }
  }

  // Obtener distribución de estudiantes por grado
  static async getStudentDistributionByGrade() {
    try {
      console.log("📈 Obteniendo distribución por grado...")

      const result = await db.query(`
        SELECT 
          g.name as grade,
          COUNT(e."studentID") as count,
          ROUND(
            (COUNT(e."studentID") * 100.0 / 
             (SELECT COUNT(*) FROM enrollment WHERE "registrationDate" >= '2024-09-01')
            ), 1
          ) as percentage
        FROM grade g
        LEFT JOIN section s ON g.id = s."gradeID"
        LEFT JOIN enrollment e ON s.id = e."sectionID"
        WHERE e."registrationDate" >= '2024-09-01'
        GROUP BY g.id, g.name
        ORDER BY g.id
      `)

      return result.rows
    } catch (error) {
      console.error("❌ Error en getStudentDistributionByGrade:", error)
      throw error
    }
  }

  // Obtener rendimiento académico por materia
  static async getAcademicPerformanceBySubject() {
    try {
      console.log("📚 Obteniendo rendimiento académico...")

      const result = await db.query(`
        SELECT 
          subject,
          ROUND(AVG(notes), 2) as average,
          COUNT(*) as students
        FROM notes
        WHERE period = 'Primer Lapso'
        GROUP BY subject
        ORDER BY average DESC
      `)

      return result.rows
    } catch (error) {
      console.error("❌ Error en getAcademicPerformanceBySubject:", error)
      throw error
    }
  }

  // Obtener personal por rol
  static async getStaffByRole() {
    try {
      console.log("👥 Obteniendo personal por rol...")

      const result = await db.query(`
        SELECT 
          r.name as role,
          COUNT(p.id) as count
        FROM rol r
        LEFT JOIN personal p ON r.id = p."idRole"
        GROUP BY r.id, r.name
        ORDER BY count DESC
      `)

      return result.rows
    } catch (error) {
      console.error("❌ Error en getStaffByRole:", error)
      throw error
    }
  }

  // Obtener estudiantes por estado
  static async getStudentsByStatus() {
    try {
      console.log("📊 Obteniendo estudiantes por estado...")

      const result = await db.query(`
        SELECT 
          ss.descripcion as status,
          COUNT(s.id) as count
        FROM status_student ss
        LEFT JOIN student s ON ss.id = s.status_id
        GROUP BY ss.id, ss.descripcion
        ORDER BY count DESC
      `)

      return result.rows
    } catch (error) {
      console.error("❌ Error en getStudentsByStatus:", error)
      throw error
    }
  }

  // Obtener estadísticas de brigadas
  static async getBrigadeStats() {
    try {
      console.log("🏆 Obteniendo estadísticas de brigadas...")

      const [totalResult, distributionResult] = await Promise.all([
        db.query(`
          SELECT 
            COUNT(DISTINCT b.id) as total,
            COUNT(DISTINCT sb."studentID") as students_enrolled,
            ROUND(AVG(student_count.count), 0) as average_size
          FROM brigade b
          LEFT JOIN "studentBrigade" sb ON b.id = sb."brigadeID"
          LEFT JOIN (
            SELECT "brigadeID", COUNT(*) as count
            FROM "studentBrigade"
            GROUP BY "brigadeID"
          ) student_count ON b.id = student_count."brigadeID"
        `),
        db.query(`
          SELECT 
            b.name,
            COUNT(sb."studentID") as students
          FROM brigade b
          LEFT JOIN "studentBrigade" sb ON b.id = sb."brigadeID"
          GROUP BY b.id, b.name
          ORDER BY students DESC
        `),
      ])

      const stats = totalResult.rows[0]
      const distribution = distributionResult.rows

      return {
        total: Number.parseInt(stats.total),
        active: Number.parseInt(stats.total), // Asumimos que todas están activas
        studentsEnrolled: Number.parseInt(stats.students_enrolled || 0),
        averageSize: Number.parseInt(stats.average_size || 0),
        distribution: distribution,
      }
    } catch (error) {
      console.error("❌ Error en getBrigadeStats:", error)
      throw error
    }
  }

  // Obtener estadísticas de asistencia
  static async getAttendanceStats() {
    try {
      console.log("📅 Obteniendo estadísticas de asistencia...")

      const [overallResult, byGradeResult, trendResult] = await Promise.all([
        db.query(`
          SELECT 
            ROUND(
              (COUNT(CASE WHEN ad.assistant = true THEN 1 END) * 100.0 / 
               NULLIF(COUNT(*), 0)), 2
            ) as overall_rate
          FROM "attendanceDetails" ad
          JOIN attendance a ON ad."attendanceID" = a.id
          WHERE a.date_a >= CURRENT_DATE - INTERVAL '30 days'
        `),
        db.query(`
          SELECT 
            g.name as grade,
            ROUND(
              (COUNT(CASE WHEN ad.assistant = true THEN 1 END) * 100.0 / 
               NULLIF(COUNT(*), 0)), 2
            ) as rate
          FROM grade g
          JOIN section s ON g.id = s."gradeID"
          JOIN enrollment e ON s.id = e."sectionID"
          JOIN student st ON e."studentID" = st.id
          JOIN "attendanceDetails" ad ON st.id = ad."studentID"
          JOIN attendance a ON ad."attendanceID" = a.id
          WHERE a.date_a >= CURRENT_DATE - INTERVAL '30 days'
          GROUP BY g.id, g.name
          ORDER BY g.id
        `),
        db.query(`
          SELECT 
            TO_CHAR(a.date_a, 'Month') as month,
            ROUND(
              (COUNT(CASE WHEN ad.assistant = true THEN 1 END) * 100.0 / 
               NULLIF(COUNT(*), 0)), 2
            ) as rate
          FROM attendance a
          JOIN "attendanceDetails" ad ON a.id = ad."attendanceID"
          WHERE a.date_a >= CURRENT_DATE - INTERVAL '90 days'
          GROUP BY TO_CHAR(a.date_a, 'Month'), EXTRACT(MONTH FROM a.date_a)
          ORDER BY EXTRACT(MONTH FROM a.date_a)
        `),
      ])

      return {
        overall: Number.parseFloat(overallResult.rows[0]?.overall_rate || 0),
        byGrade: byGradeResult.rows,
        trend: trendResult.rows,
      }
    } catch (error) {
      console.error("❌ Error en getAttendanceStats:", error)
      throw error
    }
  }

  // Obtener estadísticas generales
  static async getGeneralStats() {
    try {
      console.log("📈 Obteniendo estadísticas generales...")

      const [enrollmentResult, monthlyResult] = await Promise.all([
        db.query(`
          SELECT COUNT(*) as total_enrollment
          FROM enrollment
          WHERE "registrationDate" >= '2024-09-01'
        `),
        db.query(`
          SELECT 
            COUNT(CASE WHEN "registrationDate" >= DATE_TRUNC('month', CURRENT_DATE) THEN 1 END) as new_enrollments,
            COUNT(CASE WHEN repeater = false THEN 1 END) as new_students
          FROM enrollment
          WHERE "registrationDate" >= '2024-09-01'
        `),
      ])

      return {
        totalEnrollment: Number.parseInt(enrollmentResult.rows[0].total_enrollment),
        currentMonth: {
          newEnrollments: Number.parseInt(monthlyResult.rows[0].new_enrollments),
          newStudents: Number.parseInt(monthlyResult.rows[0].new_students),
        },
        academicYear: "2024-2025",
        currentPeriod: "Primer Período",
      }
    } catch (error) {
      console.error("❌ Error en getGeneralStats:", error)
      throw error
    }
  }

  // Obtener estadísticas de matrícula
  static async getEnrollmentStats() {
    try {
      console.log("📝 Obteniendo estadísticas de matrícula...")

      const result = await db.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN repeater = false THEN 1 END) as new_this_year,
          COUNT(CASE WHEN repeater = true THEN 1 END) as renewals,
          EXTRACT(MONTH FROM "registrationDate") as month,
          COUNT(*) as monthly_enrollments
        FROM enrollment
        WHERE "registrationDate" >= '2024-09-01'
        GROUP BY EXTRACT(MONTH FROM "registrationDate")
        ORDER BY month
      `)

      const totalStats = await db.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN repeater = false THEN 1 END) as new_this_year,
          COUNT(CASE WHEN repeater = true THEN 1 END) as renewals
        FROM enrollment
        WHERE "registrationDate" >= '2024-09-01'
      `)

      const monthNames = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ]

      return {
        total: Number.parseInt(totalStats.rows[0].total),
        newThisYear: Number.parseInt(totalStats.rows[0].new_this_year),
        renewals: Number.parseInt(totalStats.rows[0].renewals),
        byMonth: result.rows.map((row) => ({
          month: monthNames[row.month - 1],
          enrollments: Number.parseInt(row.monthly_enrollments),
        })),
      }
    } catch (error) {
      console.error("❌ Error en getEnrollmentStats:", error)
      throw error
    }
  }

  // Obtener asistencia mensual
  static async getMonthlyAttendance() {
    try {
      console.log("📊 Obteniendo asistencia mensual...")

      const result = await db.query(`
        SELECT 
          TO_CHAR(a.date_a, 'Month') as month,
          COUNT(CASE WHEN ad.assistant = true THEN 1 END) as present,
          COUNT(CASE WHEN ad.assistant = false THEN 1 END) as absent,
          ROUND(
            (COUNT(CASE WHEN ad.assistant = true THEN 1 END) * 100.0 / 
             NULLIF(COUNT(*), 0)), 2
          ) as rate
        FROM attendance a
        JOIN "attendanceDetails" ad ON a.id = ad."attendanceID"
        WHERE a.date_a >= CURRENT_DATE - INTERVAL '90 days'
        GROUP BY TO_CHAR(a.date_a, 'Month'), EXTRACT(MONTH FROM a.date_a)
        ORDER BY EXTRACT(MONTH FROM a.date_a)
      `)

      return result.rows
    } catch (error) {
      console.error("❌ Error en getMonthlyAttendance:", error)
      throw error
    }
  }
}
