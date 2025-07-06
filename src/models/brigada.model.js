import { db } from "../db/connection.database.js"

/**
 * Crear una nueva brigada
 * @param {Object} brigadeData - Datos de la brigada
 * @param {string} brigadeData.name - Nombre de la brigada
 * @returns {Object} - Brigada creada
 */
const create = async ({ name }) => {
  try {
    // Validar longitud del nombre
    if (name && name.length > 100) {
      throw new Error(`El nombre de la brigada es demasiado largo (máximo 100 caracteres, actual: ${name.length})`)
    }

    const query = {
      text: `
        INSERT INTO "brigada" (
          name, created_at, updated_at
        )
        VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, name, created_at, updated_at
      `,
      values: [name],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in create brigada:", error)
    throw error
  }
}

/**
 * Obtener todas las brigadas con información del encargado y cantidad de estudiantes
 * @returns {Array} - Lista de brigadas
 */
const findAll = async () => {
  try {
    const query = {
      text: `
        SELECT 
          b.*,
          p.name as encargado_name,
          p."lastName" as encargado_lastName,
          p.ci as encargado_ci,
          bdf.start_date as assignment_date,
          COUNT(DISTINCT s.id) as student_count
        FROM "brigada" b
        LEFT JOIN "brigada_docente_fecha" bdf ON b.id = bdf.brigade_id 
          AND bdf.start_date = (
            SELECT MAX(start_date) 
            FROM "brigada_docente_fecha" 
            WHERE brigade_id = b.id
          )
        LEFT JOIN "personal" p ON bdf.personal_id = p.id
        LEFT JOIN "student" s ON s.brigade_teacher_date_id = bdf.id
        GROUP BY b.id, b.name, b.created_at, b.updated_at, 
                 p.name, p."lastName", p.ci, bdf.start_date
        ORDER BY b.created_at DESC
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findAll brigadas:", error)
    throw error
  }
}

/**
 * Obtener una brigada por ID con detalles completos
 * @param {number} id - ID de la brigada
 * @returns {Object} - Brigada con detalles
 */
const findById = async (id) => {
  try {
    const query = {
      text: `
        SELECT 
          b.*,
          p.name as encargado_name,
          p."lastName" as encargado_lastName,
          p.ci as encargado_ci,
          p.email as encargado_email,
          p."telephoneNumber" as encargado_phone,
          bdf.start_date as assignment_date,
          bdf.id as brigade_teacher_date_id
        FROM "brigada" b
        LEFT JOIN "brigada_docente_fecha" bdf ON b.id = bdf.brigade_id 
          AND bdf.start_date = (
            SELECT MAX(start_date) 
            FROM "brigada_docente_fecha" 
            WHERE brigade_id = b.id
          )
        LEFT JOIN "personal" p ON bdf.personal_id = p.id
        WHERE b.id = $1
      `,
      values: [id],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findById brigada:", error)
    throw error
  }
}

/**
 * Obtener estudiantes de una brigada específica
 * @param {number} brigadeId - ID de la brigada
 * @returns {Array} - Lista de estudiantes
 */
const getStudentsByBrigade = async (brigadeId) => {
  try {
    const query = {
      text: `
        SELECT 
          s.id,
          s.ci as school_id,
          s.name,
          s."lastName",
          s.sex,
          s.birthday,
          g.name as grade_name,
          sec.seccion as section_name,
          r.name as representative_name,
          r."lastName" as representative_lastName,
          r."telephoneNumber" as representative_phone
        FROM "student" s
        INNER JOIN "brigada_docente_fecha" bdf ON s.brigade_teacher_date_id = bdf.id
        LEFT JOIN "enrollment" e ON s.id = e."studentID"
        LEFT JOIN "section" sec ON e."sectionID" = sec.id
        LEFT JOIN "grade" g ON sec."gradeID" = g.id
        LEFT JOIN "representative" r ON s."representativeID" = r.ci
        WHERE bdf.brigade_id = $1
          AND bdf.start_date = (
            SELECT MAX(start_date) 
            FROM "brigada_docente_fecha" 
            WHERE brigade_id = $1
          )
        ORDER BY s."lastName", s.name
      `,
      values: [brigadeId],
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getStudentsByBrigade:", error)
    throw error
  }
}

/**
 * Asignar un encargado a una brigada
 * @param {number} brigadeId - ID de la brigada
 * @param {number} personalId - ID del personal
 * @param {string} startDate - Fecha de asignación (opcional, por defecto hoy)
 * @returns {Object} - Asignación creada
 */
const assignTeacher = async (brigadeId, personalId, startDate = null) => {
  try {
    const assignmentDate = startDate || new Date().toISOString().split("T")[0]

    const query = {
      text: `
        INSERT INTO "brigada_docente_fecha" (
          brigade_id, personal_id, start_date, created_at, updated_at
        )
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `,
      values: [brigadeId, personalId, assignmentDate],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in assignTeacher:", error)
    throw error
  }
}

/**
 * Inscribir estudiantes en una brigada
 * @param {Array} studentIds - Array de IDs de estudiantes
 * @param {number} brigadeTeacherDateId - ID de la asignación brigada-encargado
 * @returns {Object} - Resultado de la operación
 */
const enrollStudents = async (studentIds, brigadeTeacherDateId) => {
  try {
    // Construir la consulta para actualizar múltiples estudiantes
    const placeholders = studentIds.map((_, index) => `$${index + 1}`).join(",")

    const query = {
      text: `
        UPDATE "student" 
        SET brigade_teacher_date_id = $${studentIds.length + 1},
            updated_at = CURRENT_TIMESTAMP
        WHERE id IN (${placeholders})
        RETURNING id, name, "lastName"
      `,
      values: [...studentIds, brigadeTeacherDateId],
    }

    const { rows } = await db.query(query)
    return {
      success: true,
      studentsEnrolled: rows.length,
      students: rows,
    }
  } catch (error) {
    console.error("Error in enrollStudents:", error)
    throw error
  }
}

/**
 * Limpiar una brigada (quitar encargado y todos los estudiantes)
 * @param {number} brigadeId - ID de la brigada
 * @returns {Object} - Resultado de la operación
 */
const clearBrigade = async (brigadeId) => {
  try {
    // Obtener el ID de la asignación actual
    const getCurrentAssignmentQuery = {
      text: `
        SELECT id FROM "brigada_docente_fecha" 
        WHERE brigade_id = $1 
        AND start_date = (
          SELECT MAX(start_date) 
          FROM "brigada_docente_fecha" 
          WHERE brigade_id = $1
        )
      `,
      values: [brigadeId],
    }

    const assignmentResult = await db.query(getCurrentAssignmentQuery)

    if (assignmentResult.rows.length > 0) {
      const brigadeTeacherDateId = assignmentResult.rows[0].id

      // Quitar estudiantes de la brigada
      const removeStudentsQuery = {
        text: `
          UPDATE "student" 
          SET brigade_teacher_date_id = NULL,
              updated_at = CURRENT_TIMESTAMP
          WHERE brigade_teacher_date_id = $1
          RETURNING id
        `,
        values: [brigadeTeacherDateId],
      }

      const studentsResult = await db.query(removeStudentsQuery)

      // Eliminar la asignación del encargado
      const removeTeacherQuery = {
        text: `
          DELETE FROM "brigada_docente_fecha" 
          WHERE id = $1
          RETURNING id
        `,
        values: [brigadeTeacherDateId],
      }

      await db.query(removeTeacherQuery)

      return {
        success: true,
        studentsRemoved: studentsResult.rows.length,
        teacherRemoved: true,
      }
    } else {
      return {
        success: true,
        studentsRemoved: 0,
        teacherRemoved: false,
        message: "La brigada ya estaba vacía",
      }
    }
  } catch (error) {
    console.error("Error in clearBrigade:", error)
    throw error
  }
}

/**
 * Actualizar una brigada
 * @param {number} id - ID de la brigada
 * @param {Object} updateData - Datos a actualizar
 * @returns {Object} - Brigada actualizada
 */
const update = async (id, { name }) => {
  try {
    // Validar longitud del nombre
    if (name && name.length > 100) {
      throw new Error(`El nombre de la brigada es demasiado largo (máximo 100 caracteres, actual: ${name.length})`)
    }

    const query = {
      text: `
        UPDATE "brigada"
        SET name = COALESCE($1, name),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, name, created_at, updated_at
      `,
      values: [name, id],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in update brigada:", error)
    throw error
  }
}

/**
 * Eliminar una brigada completamente
 * @param {number} id - ID de la brigada
 * @returns {Object} - Brigada eliminada
 */
const remove = async (id) => {
  try {
    // Primero limpiar la brigada
    await clearBrigade(id)

    // Luego eliminar la brigada
    const query = {
      text: 'DELETE FROM "brigada" WHERE id = $1 RETURNING id, name',
      values: [id],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in remove brigada:", error)
    throw error
  }
}

/**
 * Obtener estudiantes disponibles para inscribir en brigadas
 * @returns {Array} - Lista de estudiantes sin brigada
 */
const getAvailableStudents = async () => {
  try {
    const query = {
      text: `
        SELECT 
          s.id,
          s.ci as school_id,
          s.name,
          s."lastName",
          s.sex,
          s.birthday,
          g.name as grade_name,
          sec.seccion as section_name,
          r.name as representative_name,
          r."lastName" as representative_lastName
        FROM "student" s
        LEFT JOIN "enrollment" e ON s.id = e."studentID"
        LEFT JOIN "section" sec ON e."sectionID" = sec.id
        LEFT JOIN "grade" g ON sec."gradeID" = g.id
        LEFT JOIN "representative" r ON s."representativeID" = r.ci
        WHERE s.brigade_teacher_date_id IS NULL
        ORDER BY s."lastName", s.name
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getAvailableStudents:", error)
    throw error
  }
}

/**
 * Obtener personal disponible para ser encargado de brigadas
 * @returns {Array} - Lista de personal disponible
 */
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
          p."telephoneNumber" as phone,
          r.name as role_name
        FROM "personal" p
        LEFT JOIN "rol" r ON p."idRole" = r.id
        WHERE p."idRole" IN (1, 2, 3)  -- Docente, Administrador, Mantenimiento
        ORDER BY p."lastName", p.name
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getAvailableTeachers:", error)
    throw error
  }
}

/**
 * Buscar brigadas por nombre
 * @param {string} name - Nombre a buscar
 * @returns {Array} - Lista de brigadas encontradas
 */
const searchByName = async (name) => {
  try {
    const query = {
      text: `
        SELECT 
          b.*,
          p.name as encargado_name,
          p."lastName" as encargado_lastName,
          p.ci as encargado_ci,
          COUNT(DISTINCT s.id) as student_count
        FROM "brigada" b
        LEFT JOIN "brigada_docente_fecha" bdf ON b.id = bdf.brigade_id 
          AND bdf.start_date = (
            SELECT MAX(start_date) 
            FROM "brigada_docente_fecha" 
            WHERE brigade_id = b.id
          )
        LEFT JOIN "personal" p ON bdf.personal_id = p.id
        LEFT JOIN "student" s ON s.brigade_teacher_date_id = bdf.id
        WHERE b.name ILIKE $1
        GROUP BY b.id, b.name, b.created_at, b.updated_at, 
                 p.name, p."lastName", p.ci
        ORDER BY b.name
      `,
      values: [`%${name}%`],
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in searchByName brigadas:", error)
    throw error
  }
}

export const BrigadaModel = {
  create,
  findAll,
  findById,
  getStudentsByBrigade,
  assignTeacher,
  enrollStudents,
  clearBrigade,
  update,
  remove,
  getAvailableStudents,
  getAvailableTeachers,
  searchByName,
}
