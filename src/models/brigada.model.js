import { db } from "../db/connection.database.js"

export class BrigadaModel {
  // Obtener todas las brigadas con información del encargado
  static async findAll() {
    try {
      console.log("🔍 Obteniendo todas las brigadas...")

      const result = await db.query(`
        SELECT 
          b.id,
          b.name,
          b.created_at,
          b.updated_at,
          p.name as encargado_name,
          p."lastName" as encargado_lastName,
          p.ci as encargado_ci,
          btd."dateI" as fecha_inicio,
          COUNT(sb."studentID") as studentcount
        FROM brigade b
        LEFT JOIN "brigadeTeacherDate" btd ON b.id = btd."brigadeID"
        LEFT JOIN personal p ON btd."personalID" = p.id
        LEFT JOIN "studentBrigade" sb ON b.id = sb."brigadeID"
        GROUP BY b.id, b.name, b.created_at, b.updated_at, 
                 p.name, p."lastName", p.ci, btd."dateI"
        ORDER BY b.id
      `)

      return result.rows
    } catch (error) {
      console.error("❌ Error en findAll:", error)
      throw error
    }
  }

  // Buscar brigada por ID
  static async findById(id) {
    try {
      console.log(`🔍 Buscando brigada con ID: ${id}`)

      const result = await db.query(
        `
        SELECT 
          b.id,
          b.name,
          b.created_at,
          b.updated_at,
          p.name as encargado_name,
          p."lastName" as encargado_lastName,
          p.ci as encargado_ci,
          p.id as encargado_id,
          btd."dateI" as fecha_inicio,
          COUNT(sb."studentID") as studentcount
        FROM brigade b
        LEFT JOIN "brigadeTeacherDate" btd ON b.id = btd."brigadeID"
        LEFT JOIN personal p ON btd."personalID" = p.id
        LEFT JOIN "studentBrigade" sb ON b.id = sb."brigadeID"
        WHERE b.id = $1
        GROUP BY b.id, b.name, b.created_at, b.updated_at, 
                 p.id, p.name, p."lastName", p.ci, btd."dateI"
      `,
        [id],
      )

      return result.rows[0] || null
    } catch (error) {
      console.error("❌ Error en findById:", error)
      throw error
    }
  }

  // Crear nueva brigada
  static async create(data) {
    try {
      console.log("➕ Creando nueva brigada:", data)

      const result = await db.query(
        `
        INSERT INTO brigade (name, created_at, updated_at)
        VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `,
        [data.name],
      )

      return result.rows[0]
    } catch (error) {
      console.error("❌ Error en create:", error)
      throw error
    }
  }

  // Actualizar brigada
  static async update(id, data) {
    try {
      console.log(`✏️ Actualizando brigada ID: ${id}`, data)

      const result = await db.query(
        `
        UPDATE brigade 
        SET name = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `,
        [data.name, id],
      )

      return result.rows[0]
    } catch (error) {
      console.error("❌ Error en update:", error)
      throw error
    }
  }

  // Eliminar brigada
  static async remove(id) {
    try {
      console.log(`🗑️ Eliminando brigada ID: ${id}`)

      // Primero eliminar relaciones en orden correcto
      await db.query('DELETE FROM "studentBrigade" WHERE "brigadeID" = $1', [id])
      await db.query('DELETE FROM "brigadeTeacherDate" WHERE "brigadeID" = $1', [id])

      // Luego eliminar la brigada
      const result = await db.query("DELETE FROM brigade WHERE id = $1 RETURNING *", [id])

      return result.rows[0]
    } catch (error) {
      console.error("❌ Error en remove:", error)
      throw error
    }
  }

  // Buscar brigadas por nombre
  static async searchByName(name) {
    try {
      console.log(`🔍 Buscando brigadas con nombre: ${name}`)

      const result = await db.query(
        `
        SELECT 
          b.id,
          b.name,
          b.created_at,
          b.updated_at,
          p.name as encargado_name,
          p."lastName" as encargado_lastName,
          p.ci as encargado_ci,
          btd."dateI" as fecha_inicio,
          COUNT(sb."studentID") as studentcount
        FROM brigade b
        LEFT JOIN "brigadeTeacherDate" btd ON b.id = btd."brigadeID"
        LEFT JOIN personal p ON btd."personalID" = p.id
        LEFT JOIN "studentBrigade" sb ON b.id = sb."brigadeID"
        WHERE LOWER(b.name) LIKE LOWER($1)
        GROUP BY b.id, b.name, b.created_at, b.updated_at, 
                 p.name, p."lastName", p.ci, btd."dateI"
        ORDER BY b.id
      `,
        [`%${name}%`],
      )

      return result.rows
    } catch (error) {
      console.error("❌ Error en searchByName:", error)
      throw error
    }
  }

  // Obtener estudiantes de una brigada
  static async getStudentsByBrigade(brigadeId) {
    try {
      console.log(`👥 Obteniendo estudiantes de brigada ID: ${brigadeId}`)

      const result = await db.query(
        `
        SELECT 
          s.id,
          s.name,
          s."lastName",
          s.ci,
          s.sex,
          g.name as grade_name,
          sb."assignmentDate"
        FROM student s
        JOIN "studentBrigade" sb ON s.id = sb."studentID"
        LEFT JOIN enrollment e ON s.id = e."studentID"
        LEFT JOIN section sec ON e."sectionID" = sec.id
        LEFT JOIN grade g ON sec."gradeID" = g.id
        WHERE sb."brigadeID" = $1
        ORDER BY s.name, s."lastName"
      `,
        [brigadeId],
      )

      return result.rows
    } catch (error) {
      console.error("❌ Error en getStudentsByBrigade:", error)
      throw error
    }
  }

  // Asignar docente a brigada
  static async assignTeacher(brigadeId, personalId, startDate) {
    try {
      console.log(`👨‍🏫 Asignando docente ${personalId} a brigada ${brigadeId}`)

      // Primero verificar si ya hay un docente asignado y eliminarlo
      await db.query('DELETE FROM "brigadeTeacherDate" WHERE "brigadeID" = $1', [brigadeId])

      // Asignar el nuevo docente
      const result = await db.query(
        `
        INSERT INTO "brigadeTeacherDate" ("brigadeID", "dateI", "personalID", created_at, updated_at)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `,
        [brigadeId, startDate, personalId],
      )

      return result.rows[0]
    } catch (error) {
      console.error("❌ Error en assignTeacher:", error)
      throw error
    }
  }

  // Inscribir estudiantes en brigada
  static async enrollStudents(brigadeId, studentIds) {
    try {
      console.log(`👥 Inscribiendo estudiantes en brigada ${brigadeId}`)

      let enrolledCount = 0
      const errors = []

      for (const studentId of studentIds) {
        try {
          const result = await db.query(
            `
            INSERT INTO "studentBrigade" ("studentID", "brigadeID", "assignmentDate", created_at, updated_at)
            VALUES ($1, $2, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT ("studentID", "brigadeID") DO NOTHING
            RETURNING "studentID"
          `,
            [studentId, brigadeId],
          )

          if (result.rows.length > 0) {
            enrolledCount++
          }
        } catch (error) {
          console.warn(`⚠️ No se pudo inscribir estudiante ${studentId}:`, error.message)
          errors.push(`Estudiante ${studentId}: ${error.message}`)
        }
      }

      return {
        brigadeId,
        studentsEnrolled: enrolledCount,
        totalRequested: studentIds.length,
        studentIds,
        errors,
        enrolledAt: new Date().toISOString(),
      }
    } catch (error) {
      console.error("❌ Error en enrollStudents:", error)
      throw error
    }
  }

  // Limpiar brigada (remover todos los estudiantes)
  static async clearBrigade(brigadeId) {
    try {
      console.log(`🧹 Limpiando brigada ID: ${brigadeId}`)

      const result = await db.query(
        `
        DELETE FROM "studentBrigade" 
        WHERE "brigadeID" = $1
        RETURNING "studentID"
      `,
        [brigadeId],
      )

      return {
        brigadeId,
        studentsRemoved: result.rowCount,
        clearedAt: new Date().toISOString(),
      }
    } catch (error) {
      console.error("❌ Error en clearBrigade:", error)
      throw error
    }
  }

  // Obtener estudiantes disponibles (no asignados a ninguna brigada)
  static async getAvailableStudents() {
    try {
      console.log("👥 Obteniendo estudiantes disponibles...")

      const result = await db.query(`
        SELECT 
          s.id,
          s.name,
          s."lastName",
          s.ci,
          g.name as grade_name
        FROM student s
        LEFT JOIN "studentBrigade" sb ON s.id = sb."studentID"
        LEFT JOIN enrollment e ON s.id = e."studentID"
        LEFT JOIN section sec ON e."sectionID" = sec.id
        LEFT JOIN grade g ON sec."gradeID" = g.id
        WHERE sb."studentID" IS NULL AND s.status_id = 1
        ORDER BY s.name, s."lastName"
      `)

      return result.rows
    } catch (error) {
      console.error("❌ Error en getAvailableStudents:", error)
      throw error
    }
  }

  // Obtener docentes disponibles
  static async getAvailableTeachers() {
    try {
      console.log("👨‍🏫 Obteniendo docentes disponibles...")

      const result = await db.query(`
        SELECT 
          p.id,
          p.name,
          p."lastName",
          p.ci,
          r.name as role
        FROM personal p
        JOIN rol r ON p."idRole" = r.id
        WHERE r.name = 'Docente'
        ORDER BY p.name, p."lastName"
      `)

      return result.rows
    } catch (error) {
      console.error("❌ Error en getAvailableTeachers:", error)
      throw error
    }
  }

  // Remover estudiante específico de brigada
  static async removeStudentFromBrigade(brigadeId, studentId) {
    try {
      console.log(`👤 Removiendo estudiante ${studentId} de brigada ${brigadeId}`)

      const result = await db.query(
        `
        DELETE FROM "studentBrigade" 
        WHERE "brigadeID" = $1 AND "studentID" = $2
        RETURNING "studentID"
      `,
        [brigadeId, studentId],
      )

      return {
        brigadeId,
        studentId,
        removed: result.rowCount > 0,
        removedAt: new Date().toISOString(),
      }
    } catch (error) {
      console.error("❌ Error en removeStudentFromBrigade:", error)
      throw error
    }
  }

  // Remover docente de brigada
  static async removeTeacherFromBrigade(brigadeId) {
    try {
      console.log(`👨‍🏫 Removiendo docente de brigada ${brigadeId}`)

      const result = await db.query(
        `
        DELETE FROM "brigadeTeacherDate" 
        WHERE "brigadeID" = $1
        RETURNING "personalID"
      `,
        [brigadeId],
      )

      return {
        brigadeId,
        removed: result.rowCount > 0,
        removedAt: new Date().toISOString(),
      }
    } catch (error) {
      console.error("❌ Error en removeTeacherFromBrigade:", error)
      throw error
    }
  }
}
