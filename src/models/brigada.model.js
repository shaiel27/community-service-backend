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
          b."id",
          b."name",
          p.name as "encargado_name",
          p."lastName" as "encargado_lastName",
          p.ci as "encargado_ci",
          btd."dateI" as "fecha_inicio",
          COUNT(sb."studentID") as "studentCount"
        FROM "brigade" b
        LEFT JOIN "brigadeTeacherDate" btd ON b.id = btd."brigadeID"
        LEFT JOIN "personal" p ON btd."personalID" = p.id
        LEFT JOIN "studentBrigade" sb ON b.id = sb."brigadeID"
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
          COUNT(sb."studentID") as studentCount
        FROM "brigade" b
        LEFT JOIN "brigadeTeacherDate" btd ON b.id = btd."brigadeID"
        LEFT JOIN "personal" p ON btd."personalID" = p.id
        LEFT JOIN "studentBrigade" sb ON b.id = sb."brigadeID"
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
    // Primero eliminar relaciones estudiante-brigada
    await db.query({
      text: 'DELETE FROM "studentBrigade" WHERE "brigadeID" = $1',
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
          sec.seccion as section_name,
          sb."assignmentDate"
        FROM "student" s
        JOIN "studentBrigade" sb ON s.id = sb."studentID"
        LEFT JOIN "enrollment" e ON s.id = e."studentID"
        LEFT JOIN "section" sec ON e."sectionID" = sec.id
        LEFT JOIN "grade" g ON sec."gradeID" = g.id
        WHERE sb."brigadeID" = $1
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

// Obtener estudiantes disponibles (sin brigada o que pueden estar en múltiples brigadas)
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
        WHERE s.status_id = 1
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
    const assignmentDate = new Date().toISOString().split("T")[0]
    let studentsEnrolled = 0

    for (const studentId of studentIds) {
      try {
        // Verificar si el estudiante ya está en la brigada
        const existingQuery = {
          text: 'SELECT 1 FROM "studentBrigade" WHERE "studentID" = $1 AND "brigadeID" = $2',
          values: [studentId, brigadeId],
        }
        const existing = await db.query(existingQuery)

        if (existing.rows.length === 0) {
          // Insertar nueva relación estudiante-brigada
          const insertQuery = {
            text: 'INSERT INTO "studentBrigade" ("studentID", "brigadeID", "assignmentDate", created_at, updated_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
            values: [studentId, brigadeId, assignmentDate],
          }
          await db.query(insertQuery)
          studentsEnrolled++
        }
      } catch (error) {
        console.error(`Error enrolling student ${studentId}:`, error)
        // Continuar con el siguiente estudiante
      }
    }

    return {
      studentsEnrolled,
      assignmentDate,
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
      text: 'DELETE FROM "studentBrigade" WHERE "brigadeID" = $1',
      values: [brigadeId],
    }
    const { rowCount } = await db.query(query)
    return {
      studentsRemoved: rowCount,
    }
  } catch (error) {
    console.error("Error in BrigadaModel.clearBrigade:", error)
    throw error
  }
}

// Remover estudiante específico de brigada
const removeStudentFromBrigade = async (brigadeId, studentId) => {
  try {
    const query = {
      text: 'DELETE FROM "studentBrigade" WHERE "brigadeID" = $1 AND "studentID" = $2',
      values: [brigadeId, studentId],
    }
    const { rowCount } = await db.query(query)
    return rowCount > 0
  } catch (error) {
    console.error("Error in BrigadaModel.removeStudentFromBrigade:", error)
    throw error
  }
}

const getStudentsInBrigade = async (brigadeId) => {
  try {
    const query = {
      text: `
        SELECT
          s.id,
          s.name as student_name,
          s."lastName" as "student_lastName",
          s.ci as student_ci,
          s.birthday as "student_birthday"
        FROM "studentBrigade" sb
        JOIN "student" s ON sb."studentID" = s.id
        WHERE sb."brigadeID" = $1
        ORDER BY s.name, s."lastName"
      `,
      values: [brigadeId],
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in BrigadaModel.getStudentsInBrigade:", error)
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
  removeStudentFromBrigade,
  getStudentsInBrigade
}
