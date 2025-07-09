import { db } from "../db/connection.database.js"

// Crear nueva brigada
const create = async (brigadeData) => {
  try {
    const { name } = brigadeData
    const query = {
      text: 'INSERT INTO "brigade" (name, created_at, updated_at) VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
      values: [name],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in BrigadaModel.create:", error)
    throw error
  }
}

// Obtener todas las brigadas con información del encargado
const findAll = async () => {
  try {
    const query = {
      text: `
        SELECT 
          b.id,
          b.name,
          p.name as encargado_name,
          p."lastName" as encargado_lastName,
          p.ci as encargado_ci,
          btd."dateI" as fecha_inicio,
          COUNT(s.id) as studentCount
        FROM "brigade" b
        LEFT JOIN "brigadeTeacherDate" btd ON b.id = btd."brigadeID"
        LEFT JOIN "personal" p ON btd."personalID" = p.id
        LEFT JOIN "student" s ON s."brigadeTeacherDateID" = btd.id
        GROUP BY b.id, b.name, p.name, p."lastName", p.ci, btd."dateI"
        ORDER BY b.name
      `,
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in BrigadaModel.findAll:", error)
    throw error
  }
}

// Buscar brigada por ID
const findById = async (id) => {
  try {
    const query = {
      text: `
        SELECT 
          b.id,
          b.name,
          p.name as encargado_name,
          p."lastName" as encargado_lastName,
          p.ci as encargado_ci,
          btd."dateI" as fecha_inicio
        FROM "brigade" b
        LEFT JOIN "brigadeTeacherDate" btd ON b.id = btd."brigadeID"
        LEFT JOIN "personal" p ON btd."personalID" = p.id
        WHERE b.id = $1
        ORDER BY btd."dateI" DESC
        LIMIT 1
      `,
      values: [id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in BrigadaModel.findById:", error)
    throw error
  }
}

// Buscar brigadas por nombre
const searchByName = async (name) => {
  try {
    const query = {
      text: `
        SELECT 
          b.id,
          b.name,
          p.name as encargado_name,
          p."lastName" as encargado_lastName,
          p.ci as encargado_ci,
          btd."dateI" as fecha_inicio,
          COUNT(s.id) as studentCount
        FROM "brigade" b
        LEFT JOIN "brigadeTeacherDate" btd ON b.id = btd."brigadeID"
        LEFT JOIN "personal" p ON btd."personalID" = p.id
        LEFT JOIN "student" s ON s."brigadeTeacherDateID" = btd.id
        WHERE b.name ILIKE $1
        GROUP BY b.id, b.name, p.name, p."lastName", p.ci, btd."dateI"
        ORDER BY b.name
      `,
      values: [`%${name}%`],
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in BrigadaModel.searchByName:", error)
    throw error
  }
}

// Actualizar brigada
const update = async (id, brigadeData) => {
  try {
    const { name } = brigadeData
    const query = {
      text: 'UPDATE "brigade" SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      values: [name, id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in BrigadaModel.update:", error)
    throw error
  }
}

// Eliminar brigada
const remove = async (id) => {
  try {
    // Primero limpiar estudiantes asignados
    await db.query({
      text: `
        UPDATE "student" 
        SET "brigadeTeacherDateID" = NULL 
        WHERE "brigadeTeacherDateID" IN (
          SELECT id FROM "brigadeTeacherDate" WHERE "brigadeID" = $1
        )
      `,
      values: [id],
    })

    // Eliminar asignaciones de docentes
    await db.query({
      text: 'DELETE FROM "brigadeTeacherDate" WHERE "brigadeID" = $1',
      values: [id],
    })

    // Eliminar brigada
    const query = {
      text: 'DELETE FROM "brigade" WHERE id = $1 RETURNING *',
      values: [id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in BrigadaModel.remove:", error)
    throw error
  }
}

// Asignar docente a brigada
const assignTeacher = async (brigadeId, personalId, startDate) => {
  try {
    // Verificar si ya hay un docente asignado a esta brigada
    const existingQuery = {
      text: 'SELECT id FROM "brigadeTeacherDate" WHERE "brigadeID" = $1',
      values: [brigadeId],
    }
    const existing = await db.query(existingQuery)

    if (existing.rows.length > 0) {
      // Actualizar la asignación existente
      const updateQuery = {
        text: 'UPDATE "brigadeTeacherDate" SET "personalID" = $1, "dateI" = $2, updated_at = CURRENT_TIMESTAMP WHERE "brigadeID" = $3 RETURNING *',
        values: [personalId, startDate || new Date().toISOString().split("T")[0], brigadeId],
      }
      const { rows } = await db.query(updateQuery)
      return rows[0]
    } else {
      // Crear nueva asignación
      const query = {
        text: 'INSERT INTO "brigadeTeacherDate" ("brigadeID", "personalID", "dateI", created_at, updated_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
        values: [brigadeId, personalId, startDate || new Date().toISOString().split("T")[0]],
      }
      const { rows } = await db.query(query)
      return rows[0]
    }
  } catch (error) {
    console.error("Error in BrigadaModel.assignTeacher:", error)
    throw error
  }
}

// Obtener estudiantes de una brigada
const getStudentsByBrigade = async (brigadeId) => {
  try {
    const query = {
      text: `
        SELECT 
          s.id,
          s.ci,
          s.name,
          s."lastName",
          s.sex,
          s.birthday,
          g.name as grade_name,
          sec.seccion as section_name
        FROM "student" s
        JOIN "brigadeTeacherDate" btd ON s."brigadeTeacherDateID" = btd.id
        LEFT JOIN "enrollment" e ON s.id = e."studentID"
        LEFT JOIN "section" sec ON e."sectionID" = sec.id
        LEFT JOIN "grade" g ON sec."gradeID" = g.id
        WHERE btd."brigadeID" = $1
        ORDER BY s."lastName", s.name
      `,
      values: [brigadeId],
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in BrigadaModel.getStudentsByBrigade:", error)
    throw error
  }
}

// Obtener estudiantes disponibles (sin brigada)
const getAvailableStudents = async () => {
  try {
    const query = {
      text: `
        SELECT 
          s.id,
          s.ci,
          s.name,
          s."lastName",
          s.sex,
          s.birthday,
          g.name as grade_name,
          sec.seccion as section_name
        FROM "student" s
        LEFT JOIN "enrollment" e ON s.id = e."studentID"
        LEFT JOIN "section" sec ON e."sectionID" = sec.id
        LEFT JOIN "grade" g ON sec."gradeID" = g.id
        WHERE s."brigadeTeacherDateID" IS NULL 
        AND s.status_id = 1
        ORDER BY g.name, sec.seccion, s."lastName", s.name
      `,
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in BrigadaModel.getAvailableStudents:", error)
    throw error
  }
}

// Obtener docentes disponibles
const getAvailableTeachers = async () => {
  try {
    const query = {
      text: `
        SELECT 
          p.id,
          p.ci,
          p.name,
          p."lastName",
          p.email,
          p."telephoneNumber",
          r.name as rol_nombre
        FROM "personal" p
        LEFT JOIN "rol" r ON p."idRole" = r.id
        WHERE p."idRole" IN (1, 2, 3, 4)
        ORDER BY p.name, p."lastName"
      `,
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in BrigadaModel.getAvailableTeachers:", error)
    throw error
  }
}

// Inscribir estudiantes en brigada
const enrollStudents = async (brigadeId, studentIds) => {
  try {
    // Obtener el brigadeTeacherDateID para esta brigada
    const brigadeQuery = {
      text: 'SELECT id FROM "brigadeTeacherDate" WHERE "brigadeID" = $1 ORDER BY "dateI" DESC LIMIT 1',
      values: [brigadeId],
    }
    const brigadeResult = await db.query(brigadeQuery)

    if (brigadeResult.rows.length === 0) {
      throw new Error("La brigada no tiene un docente asignado")
    }

    const brigadeTeacherDateId = brigadeResult.rows[0].id

    // Actualizar estudiantes
    const placeholders = studentIds.map((_, index) => `$${index + 1}`).join(",")
    const query = {
      text: `
        UPDATE "student" 
        SET "brigadeTeacherDateID" = $${studentIds.length + 1}
        WHERE id IN (${placeholders})
        AND "brigadeTeacherDateID" IS NULL
        RETURNING id, name, "lastName"
      `,
      values: [...studentIds, brigadeTeacherDateId],
    }

    const { rows } = await db.query(query)
    return {
      studentsEnrolled: rows.length,
      students: rows,
    }
  } catch (error) {
    console.error("Error in BrigadaModel.enrollStudents:", error)
    throw error
  }
}

// Limpiar brigada (remover todos los estudiantes)
const clearBrigade = async (brigadeId) => {
  try {
    const query = {
      text: `
        UPDATE "student" 
        SET "brigadeTeacherDateID" = NULL
        WHERE "brigadeTeacherDateID" IN (
          SELECT id FROM "brigadeTeacherDate" WHERE "brigadeID" = $1
        )
        RETURNING id
      `,
      values: [brigadeId],
    }
    const { rows } = await db.query(query)
    return {
      studentsRemoved: rows.length,
    }
  } catch (error) {
    console.error("Error in BrigadaModel.clearBrigade:", error)
    throw error
  }
}

export const BrigadaModel = {
  create,
  findAll,
  findById,
  searchByName,
  update,
  remove,
  assignTeacher,
  getStudentsByBrigade,
  getAvailableStudents,
  getAvailableTeachers,
  enrollStudents,
  clearBrigade,
}
