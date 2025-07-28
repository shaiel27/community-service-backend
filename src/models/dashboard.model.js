import { db } from "../db/connection.database.js"

export class DashboardModel {
  // Obtener resumen completo del dashboard
  static async getDashboardSummary() {
    try {
      console.log("📊 Obteniendo resumen completo del dashboard...")

      // Ensure we query for the current academic period where applicable
      const currentAcademicPeriod = await db.query(`
        SELECT id FROM academic_period WHERE is_current = TRUE
      `);
      const academicPeriodId = currentAcademicPeriod.rows[0]?.id;

      if (!academicPeriodId) {
        console.warn("No current academic period found. Some stats might be incomplete.");
      }

      const [
        generalStats,
        gradeDistribution,
        academicPerformance,
        attendanceStats,
        brigadeStats,
        staffByRole,
        studentsByStatus,
        enrollmentStats,
        monthlyTrends,
      ] = await Promise.all([
        this.getGeneralStats(academicPeriodId), // Pass academic period ID
        this.getStudentDistributionByGrade(academicPeriodId), // Pass academic period ID
        this.getAcademicPerformanceBySubject(academicPeriodId), // Pass academic period ID
        this.getAttendanceStats(academicPeriodId), // Pass academic period ID
        this.getBrigadeStats(academicPeriodId), // Pass academic period ID
        this.getStaffByRole(),
        this.getStudentsByStatus(),
        this.getEnrollmentStats(academicPeriodId), // Pass academic period ID
        this.getMonthlyAttendance(academicPeriodId), // Pass academic period ID
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
        monthlyTrends,
        lastUpdated: new Date().toISOString(),
      }
    } catch (error) {
      console.error("❌ Error en getDashboardSummary:", error)
      throw error
    }
  }

  // Estadísticas generales mejoradas, now accepting academicPeriodId
  static async getGeneralStats(academicPeriodId) {
    try {
      const result = await db.query(`
        SELECT 
          -- Estudiantes
          (SELECT COUNT(*) FROM "student" WHERE status_id = (SELECT id FROM "status_student" WHERE descripcion = 'Activo')) as total_students_active,
          (SELECT COUNT(*) FROM "student") as total_students,
          (SELECT COUNT(*) FROM "student" WHERE sex = 'Masculino' AND status_id = (SELECT id FROM "status_student" WHERE descripcion = 'Activo')) as male_students,
          (SELECT COUNT(*) FROM "student" WHERE sex = 'Femenino' AND status_id = (SELECT id FROM "status_student" WHERE descripcion = 'Activo')) as female_students,
          
          -- Personal
          (SELECT COUNT(*) FROM "personal" WHERE "idRole" = (SELECT id FROM "rol" WHERE name = 'Docente')) as total_teachers,
          (SELECT COUNT(*) FROM "personal") as total_staff,
          
          -- Estructura académica (filtered by current academic period for sections and enrollments)
          (SELECT COUNT(DISTINCT s.id) 
             FROM "section" s
             WHERE s."academicPeriodID" = $1) as total_sections_current_period,
          (SELECT COUNT(*) FROM "grade") as total_grades,
          (SELECT COUNT(*) FROM "brigade") as total_brigades,
          
          -- Matrículas (filtered by current academic period)
          (SELECT COUNT(*) 
             FROM "enrollment" e
             JOIN "section" sec ON e."sectionID" = sec.id
             WHERE e.repeater = true AND sec."academicPeriodID" = $1) as repeating_students_current_period,
          (SELECT COUNT(*) 
             FROM "enrollment" e
             JOIN "section" sec ON e."sectionID" = sec.id
             WHERE e.repeater = false AND sec."academicPeriodID" = $1) as new_students_current_period,
          
          -- Representantes
          (SELECT COUNT(DISTINCT "representativeID") FROM "student" WHERE status_id = (SELECT id FROM "status_student" WHERE descripcion = 'Activo')) as total_representatives
        `, [academicPeriodId])

      return result.rows[0]
    } catch (error) {
      console.error("❌ Error en getGeneralStats:", error)
      throw error
    }
  }

  // Distribución por grado con detalles, now accepting academicPeriodId
  static async getStudentDistributionByGrade(academicPeriodId) {
    try {
      const result = await db.query(`
        SELECT 
          g.name as grade_name,
          COUNT(e."studentID") as student_count,
          COUNT(CASE WHEN s.sex = 'Masculino' THEN 1 END) as male_count,
          COUNT(CASE WHEN s.sex = 'Femenino' THEN 1 END) as female_count,
          COUNT(CASE WHEN e.repeater = true THEN 1 END) as repeater_count,
          COUNT(DISTINCT sec.id) as section_count,
          ROUND(AVG(EXTRACT(YEAR FROM AGE(s.birthday))), 1) as average_age
        FROM "grade" g
        LEFT JOIN "section" sec ON g.id = sec."gradeID" AND sec."academicPeriodID" = $1
        LEFT JOIN "enrollment" e ON sec.id = e."sectionID"
        LEFT JOIN "student" s ON e."studentID" = s.id AND s.status_id = (SELECT id FROM "status_student" WHERE descripcion = 'Activo')
        GROUP BY g.id, g.name
        ORDER BY g.id
      `, [academicPeriodId])

      return result.rows
    } catch (error) {
      console.error("❌ Error en getStudentDistributionByGrade:", error)
      throw error
    }
  }

  // Rendimiento académico por materia, now accepting academicPeriodId
  static async getAcademicPerformanceBySubject(academicPeriodId) {
    try {
      const result = await db.query(`
        SELECT 
          n.subject,
          COUNT(*) as total_notes,
          -- Assuming notes are numeric for AVG, otherwise adjust
          ROUND(AVG(CASE WHEN n.notes ~ '^[0-9\.]+$' THEN CAST(n.notes AS NUMERIC) ELSE NULL END), 2) as average_grade,
          COUNT(CASE WHEN (CASE WHEN n.notes ~ '^[0-9\.]+$' THEN CAST(n.notes AS NUMERIC) ELSE NULL END) >= 10 THEN 1 END) as passing_grades,
          COUNT(CASE WHEN (CASE WHEN n.notes ~ '^[0-9\.]+$' THEN CAST(n.notes AS NUMERIC) ELSE NULL END) < 10 THEN 1 END) as failing_grades,
          MAX(CASE WHEN n.notes ~ '^[0-9\.]+$' THEN CAST(n.notes AS NUMERIC) ELSE NULL END) as highest_grade,
          MIN(CASE WHEN n.notes ~ '^[0-9\.]+$' THEN CAST(n.notes AS NUMERIC) ELSE NULL END) as lowest_grade
        FROM "notes" n
        JOIN "enrollment" e ON n."enrollmentID" = e.id
        JOIN "section" sec ON e."sectionID" = sec.id
        WHERE sec."academicPeriodID" = $1 -- Filter by current academic period
        GROUP BY n.subject
        ORDER BY average_grade DESC
      `, [academicPeriodId])

      return result.rows
    } catch (error) {
      console.error("❌ Error en getAcademicPerformanceBySubject:", error)
      throw error
    }
  }

  // Estadísticas de asistencia detalladas, now accepting academicPeriodId
  static async getAttendanceStats(academicPeriodId) {
    try {
      const result = await db.query(`
        SELECT 
          a.date_a,
          g.name as grade_name,
          sec.seccion,
          COUNT(ad."studentID") as total_registered,
          COUNT(CASE WHEN ad.assistant = true THEN 1 END) as present_students,
          COUNT(CASE WHEN ad.assistant = false THEN 1 END) as absent_students,
          ROUND(
            (COUNT(CASE WHEN ad.assistant = true THEN 1 END) * 100.0 / 
             NULLIF(COUNT(ad."studentID"), 0)), 2
          ) as attendance_percentage
        FROM "attendance" a
        JOIN "section" sec ON a."sectionID" = sec.id
        JOIN "grade" g ON sec."gradeID" = g.id
        JOIN "attendanceDetails" ad ON a.id = ad."attendanceID"
        WHERE sec."academicPeriodID" = $1 -- Filter by current academic period
        GROUP BY a.id, a.date_a, g.name, sec.seccion, g.id
        ORDER BY a.date_a DESC, g.id, sec.seccion
        LIMIT 20
      `, [academicPeriodId])

      return result.rows
    } catch (error) {
      console.error("❌ Error en getAttendanceStats:", error)
      throw error
    }
  }

  // Estadísticas de brigadas con docentes, now accepting academicPeriodId
  static async getBrigadeStats(academicPeriodId) {
    try {
      const result = await db.query(`
        SELECT 
          b.name as brigade_name,
          COUNT(DISTINCT sb."studentID") as student_count, -- Count distinct students
          p.name as teacher_name,
          p."lastName" as teacher_lastName,
          btd."dateI" as assignment_date,
          COUNT(CASE WHEN s.sex = 'Masculino' THEN 1 END) as male_students,
          COUNT(CASE WHEN s.sex = 'Femenino' THEN 1 END) as female_students
        FROM "brigade" b
        LEFT JOIN "studentBrigade" sb ON b.id = sb."brigadeID" AND sb."academicPeriodID" = $1
        LEFT JOIN "student" s ON sb."studentID" = s.id AND s.status_id = (SELECT id FROM "status_student" WHERE descripcion = 'Activo')
        LEFT JOIN "brigadeTeacherDate" btd ON b.id = btd."brigadeID" AND btd."academicPeriodID" = $1
        LEFT JOIN "personal" p ON btd."personalID" = p.id
        GROUP BY b.id, b.name, p.name, p."lastName", btd."dateI"
        ORDER BY student_count DESC
      `, [academicPeriodId])

      return result.rows
    } catch (error) {
      console.error("❌ Error en getBrigadeStats:", error)
      throw error
    }
  }

  // Personal por rol (no needs academicPeriodId)
  static async getStaffByRole() {
    try {
      const result = await db.query(`
        SELECT 
          r.name as role_name,
          r.description as role_description,
          COUNT(p.id) as staff_count,
          ROUND(AVG(EXTRACT(YEAR FROM AGE(p.birthday))), 1) as average_age
        FROM "rol" r
        LEFT JOIN "personal" p ON r.id = p."idRole"
        GROUP BY r.id, r.name, r.description
        ORDER BY staff_count DESC
      `)

      return result.rows
    } catch (error) {
      console.error("❌ Error en getStaffByRole:", error)
      throw error
    }
  }

  // Estudiantes por estado (no needs academicPeriodId)
  static async getStudentsByStatus() {
    try {
      const result = await db.query(`
        SELECT 
          ss.descripcion as status_description,
          COUNT(s.id) as student_count,
          COUNT(CASE WHEN s.sex = 'Masculino' THEN 1 END) as male_count,
          COUNT(CASE WHEN s.sex = 'Femenino' THEN 1 END) as female_count
        FROM "status_student" ss
        LEFT JOIN "student" s ON ss.id = s.status_id
        GROUP BY ss.id, ss.descripcion
        ORDER BY student_count DESC
      `)

      return result.rows
    } catch (error) {
      console.error("❌ Error en getStudentsByStatus:", error)
      throw error
    }
  }

  // Estadísticas de matrícula por grado y sección, now accepting academicPeriodId
  static async getEnrollmentStats(academicPeriodId) {
    try {
      const result = await db.query(`
        SELECT 
          g.name as grade_name,
          sec.seccion as section_name,
          COUNT(e."studentID") as total_enrolled,
          COUNT(CASE WHEN e.repeater = true THEN 1 END) as repeaters,
          COUNT(CASE WHEN e.repeater = false THEN 1 END) as new_students,
          p.name as teacher_name,
          p."lastName" as teacher_lastName
        FROM "enrollment" e
        JOIN "section" sec ON e."sectionID" = sec.id
        JOIN "grade" g ON sec."gradeID" = g.id
        LEFT JOIN "personal" p ON sec."teacherCI" = p.id
        WHERE sec."academicPeriodID" = $1 -- Filter by current academic period
        GROUP BY g.id, g.name, sec.id, sec.seccion, p.name, p."lastName"
        ORDER BY g.id, sec.seccion
      `, [academicPeriodId])

      return result.rows
    } catch (error) {
      console.error("❌ Error en getEnrollmentStats:", error)
      throw error
    }
  }

  // Tendencias mensuales de asistencia, now accepting academicPeriodId
  static async getMonthlyAttendance(academicPeriodId) {
    try {
      const result = await db.query(`
        SELECT 
          TO_CHAR(a.date_a, 'YYYY-MM') as month,
          TO_CHAR(a.date_a, 'Month') as month_name,
          COUNT(CASE WHEN ad.assistant = true THEN 1 END) as present,
          COUNT(CASE WHEN ad.assistant = false THEN 1 END) as absent,
          COUNT(ad."studentID") as total,
          ROUND(
            (COUNT(CASE WHEN ad.assistant = true THEN 1 END) * 100.0 / 
             NULLIF(COUNT(ad."studentID"), 0)), 2
          ) as attendance_rate
        FROM "attendance" a
        JOIN "attendanceDetails" ad ON a.id = ad."attendanceID"
        JOIN "section" sec ON a."sectionID" = sec.id
        WHERE sec."academicPeriodID" = $1 -- Filter by current academic period
        GROUP BY TO_CHAR(a.date_a, 'YYYY-MM'), TO_CHAR(a.date_a, 'Month'), EXTRACT(MONTH FROM a.date_a)
        ORDER BY TO_CHAR(a.date_a, 'YYYY-MM')
      `, [academicPeriodId])

      return result.rows
    } catch (error) {
      console.error("❌ Error en getMonthlyAttendance:", error)
      throw error
    }
  }

  // Obtener secciones disponibles para asistencia, now accepting academicPeriodId
  static async getAvailableSections(academicPeriodId) {
    try {
      // Fetch the current academic period ID if not provided, for use in filters
      if (!academicPeriodId) {
        const currentAcademicPeriod = await db.query(`
          SELECT id FROM academic_period WHERE is_current = TRUE
        `);
        academicPeriodId = currentAcademicPeriod.rows[0]?.id;
      }

      const result = await db.query(`
        SELECT 
          sec.id,
          g.name as grade_name,
          sec.seccion,
          p.name as teacher_name,
          p."lastName" as teacher_lastName,
          COUNT(e."studentID") as student_count
        FROM "section" sec
        JOIN "grade" g ON sec."gradeID" = g.id
        LEFT JOIN "personal" p ON sec."teacherCI" = p.id
        LEFT JOIN "enrollment" e ON sec.id = e."sectionID"
        WHERE sec."academicPeriodID" = $1
        GROUP BY sec.id, g.name, sec.seccion, p.name, p."lastName", g.id
        ORDER BY g.id, sec.seccion
      `, [academicPeriodId])

      return result.rows
    } catch (error) {
      console.error("❌ Error en getAvailableSections:", error)
      throw error
    }
  }

  // Guardar asistencia
  static async saveAttendance(attendanceData) {
    try {
      const { sectionId, date, observations, students } = attendanceData

      // Insertar registro de asistencia
      const attendanceResult = await db.query({
        text: `INSERT INTO "attendance" (date_a, "sectionID", observaciones, created_at, updated_at) 
               VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id`,
        values: [date, sectionId, observations],
      })

      const attendanceId = attendanceResult.rows[0].id

      // Insertar detalles de asistencia para cada estudiante
      if (students && students.length > 0) {
        for (const student of students) {
          await db.query({
            text: `INSERT INTO "attendanceDetails" ("attendanceID", "studentID", assistant) 
                   VALUES ($1, $2, $3)`,
            values: [attendanceId, student.studentId, student.present],
          })
        }
      }

      return {
        attendanceId,
        studentsProcessed: students?.length || 0,
      }
    } catch (error) {
      console.error("❌ Error en saveAttendance:", error)
      throw error
    }
  }
}