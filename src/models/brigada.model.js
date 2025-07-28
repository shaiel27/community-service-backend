import { db } from "../db/connection.database.js"

// Helper to get the current academic period ID
const getCurrentAcademicPeriodId = async () => {
  const query = {
    text: 'SELECT id FROM "academic_period" WHERE "is_current" = TRUE LIMIT 1',
  }
  const { rows } = await db.query(query)
  if (rows.length === 0) {
    throw new Error("No current academic period found. Please set one in the academic_period table.")
  }
  return rows[0].id
}

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
const findAll = async (academicPeriodId = null) => {
  try {
    const periodId = academicPeriodId || (await getCurrentAcademicPeriodId())
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
        LEFT JOIN "brigadeTeacherDate" btd ON b.id = btd."brigadeID" AND btd."academicPeriodID" = $1
        LEFT JOIN "personal" p ON btd."personalID" = p.id
        LEFT JOIN "studentBrigade" sb ON b.id = sb."brigadeID" AND sb."academicPeriodID" = $1
        GROUP BY b.id, b.name, p.name, p."lastName", p.ci, btd."dateI"
        ORDER BY b.name
      `,
      values: [periodId],
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in BrigadaModel.findAll:", error)
    throw error
  }
}

// Buscar brigada por ID
const findById = async (id, academicPeriodId = null) => {
  try {
    const periodId = academicPeriodId || (await getCurrentAcademicPeriodId())
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
        LEFT JOIN "brigadeTeacherDate" btd ON b.id = btd."brigadeID" AND btd."academicPeriodID" = $2
        LEFT JOIN "personal" p ON btd."personalID" = p.id
        WHERE b.id = $1
        ORDER BY btd."dateI" DESC
        LIMIT 1
      `,
      values: [id, periodId],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in BrigadaModel.findById:", error)
    throw error
  }
}

// Buscar brigadas por nombre
const searchByName = async (name, academicPeriodId = null) => {
  try {
    const periodId = academicPeriodId || (await getCurrentAcademicPeriodId())
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
        LEFT JOIN "brigadeTeacherDate" btd ON b.id = btd."brigadeID" AND btd."academicPeriodID" = $2
        LEFT JOIN "personal" p ON btd."personalID" = p.id
        LEFT JOIN "studentBrigade" sb ON b.id = sb."brigadeID" AND sb."academicPeriodID" = $2
        WHERE b.name ILIKE $1
        GROUP BY b.id, b.name, p.name, p."lastName", p.ci, btd."dateI"
        ORDER BY b.name
      `,
      values: [`%${name}%`, periodId],
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
    // Eliminar relaciones estudiante-brigada para cualquier período
    await db.query({
      text: 'DELETE FROM "studentBrigade" WHERE "brigadeID" = $1',
      values: [id],
    })

    // Eliminar asignaciones de docentes para cualquier período
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
const assignTeacher = async (brigadeId, personalId, startDate, academicPeriodId = null) => {
  try {
    const periodId = academicPeriodId || (await getCurrentAcademicPeriodId())

    // Verificar si ya hay un docente asignado a esta brigada para el período actual
    const existingQuery = {
      text: 'SELECT id FROM "brigadeTeacherDate" WHERE "brigadeID" = $1 AND "academicPeriodID" = $2',
      values: [brigadeId, periodId],
    }
    const existing = await db.query(existingQuery)

    if (existing.rows.length > 0) {
      // Actualizar la asignación existente para el período actual
      const updateQuery = {
        text: 'UPDATE "brigadeTeacherDate" SET "personalID" = $1, "dateI" = $2, updated_at = CURRENT_TIMESTAMP WHERE "brigadeID" = $3 AND "academicPeriodID" = $4 RETURNING *',
        values: [personalId, startDate || new Date().toISOString().split("T")[0], brigadeId, periodId],
      }
      const { rows } = await db.query(updateQuery)
      return rows[0]
    } else {
      // Crear nueva asignación para el período actual
      const query = {
        text: 'INSERT INTO "brigadeTeacherDate" ("brigadeID", "personalID", "dateI", "academicPeriodID", created_at, updated_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
        values: [brigadeId, personalId, startDate || new Date().toISOString().split("T")[0], periodId],
      }
      const { rows } = await db.query(query)
      return rows[0]
    }
  } catch (error) {
    console.error("Error in BrigadaModel.assignTeacher:", error)
    throw error
  }
}

// Remover docente de brigada
const removeTeacher = async (brigadeId, academicPeriodId = null) => {
  try {
    const periodId = academicPeriodId || (await getCurrentAcademicPeriodId())
    const query = {
      text: 'DELETE FROM "brigadeTeacherDate" WHERE "brigadeID" = $1 AND "academicPeriodID" = $2',
      values: [brigadeId, periodId],
    }
    const { rowCount } = await db.query(query)
    return {
      removed: rowCount > 0,
      teachersRemoved: rowCount,
    }
  } catch (error) {
    console.error("Error in BrigadaModel.removeTeacher:", error)
    throw error
  }
}

// Obtener estudiantes de una brigada para el período actual
const getStudentsByBrigade = async (brigadeId, academicPeriodId = null) => {
  try {
    const periodId = academicPeriodId || (await getCurrentAcademicPeriodId())
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
        LEFT JOIN "enrollment" e ON s.id = e."studentID" AND e."academicPeriodID" = $2 -- Assuming enrollment also links to academic period
        LEFT JOIN "section" sec ON e."sectionID" = sec.id
        LEFT JOIN "grade" g ON sec."gradeID" = g.id
        WHERE sb."brigadeID" = $1 AND sb."academicPeriodID" = $2
        ORDER BY s."lastName", s.name
      `,
      values: [brigadeId, periodId],
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in BrigadaModel.getStudentsByBrigade:", error)
    throw error
  }
}

// Obtener estudiantes disponibles (activos) - This generally means not assigned to *any* brigade in the current period
const getAvailableStudents = async (academicPeriodId = null) => {
  try {
    const periodId = academicPeriodId || (await getCurrentAcademicPeriodId())
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
        LEFT JOIN "enrollment" e ON s.id = e."studentID" AND e."academicPeriodID" = $1
        LEFT JOIN "section" sec ON e."sectionID" = sec.id
        LEFT JOIN "grade" g ON sec."gradeID" = g.id
        WHERE s.status_id = 1
        AND s.id NOT IN (SELECT "studentID" FROM "studentBrigade" WHERE "academicPeriodID" = $1)
        ORDER BY g.name, sec.seccion, s."lastName", s.name
      `,
      values: [periodId],
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in BrigadaModel.getAvailableStudents:", error)
    throw error
  }
}

// Obtener docentes disponibles (aquellos que no están asignados a una brigada en el período actual)
const getAvailableTeachers = async (academicPeriodId = null) => {
  try {
    const periodId = academicPeriodId || (await getCurrentAcademicPeriodId())
    const query = {
      text: `
        SELECT
          p.id,
          p.ci,
          p.name,
          p."lastName",
          p.email,
          p."telephoneNumber",
          r.name as role
        FROM "personal" p
        LEFT JOIN "rol" r ON p."idRole" = r.id
        WHERE p."idRole" IN (1, 2, 3, 4) -- Assuming these roles are for teachers/personal who can lead brigades
        AND p.id NOT IN (SELECT "personalID" FROM "brigadeTeacherDate" WHERE "academicPeriodID" = $1)
        ORDER BY p.name, p."lastName"
      `,
      values: [periodId],
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in BrigadaModel.getAvailableTeachers:", error)
    throw error
  }
}

// Inscribir estudiantes en brigada para el período actual
const enrollStudents = async (brigadeId, studentIds, academicPeriodId = null) => {
  try {
    const periodId = academicPeriodId || (await getCurrentAcademicPeriodId())
    const assignmentDate = new Date().toISOString().split("T")[0]
    let studentsEnrolled = 0
    const totalRequested = studentIds.length

    for (const studentId of studentIds) {
      try {
        // Verificar si el estudiante ya está en la brigada para el período actual
        const existingQuery = {
          text: 'SELECT 1 FROM "studentBrigade" WHERE "studentID" = $1 AND "brigadeID" = $2 AND "academicPeriodID" = $3',
          values: [studentId, brigadeId, periodId],
        }
        const existing = await db.query(existingQuery)

        if (existing.rows.length === 0) {
          // Insertar nueva relación estudiante-brigada
          const insertQuery = {
            text: 'INSERT INTO "studentBrigade" ("studentID", "brigadeID", "assignmentDate", "academicPeriodID", created_at, updated_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
            values: [studentId, brigadeId, assignmentDate, periodId],
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
      totalRequested,
      assignmentDate,
    }
  } catch (error) {
    console.error("Error in BrigadaModel.enrollStudents:", error)
    throw error
  }
}

// Limpiar brigada (remover todos los estudiantes para el período actual)
const clearBrigade = async (brigadeId, academicPeriodId = null) => {
  try {
    const periodId = academicPeriodId || (await getCurrentAcademicPeriodId())
    const query = {
      text: 'DELETE FROM "studentBrigade" WHERE "brigadeID" = $1 AND "academicPeriodID" = $2',
      values: [brigadeId, periodId],
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

// Remover estudiante específico de brigada para el período actual
const removeStudentFromBrigade = async (brigadeId, studentId, academicPeriodId = null) => {
  try {
    const periodId = academicPeriodId || (await getCurrentAcademicPeriodId())
    const query = {
      text: 'DELETE FROM "studentBrigade" WHERE "brigadeID" = $1 AND "studentID" = $2 AND "academicPeriodID" = $3',
      values: [brigadeId, studentId, periodId],
    }
    const { rowCount } = await db.query(query)
    return {
      removed: rowCount > 0,
      studentsRemoved: rowCount,
    }
  } catch (error) {
    console.error("Error in BrigadaModel.removeStudentFromBrigade:", error)
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
  removeTeacher,
  getStudentsByBrigade,
  getAvailableStudents,
  getAvailableTeachers,
  enrollStudents,
  clearBrigade,
  removeStudentFromBrigade,
}