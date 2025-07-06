import { db } from "../db/connection.database.js"

/**
 * Crear una nueva brigada
 * @param {Object} brigadeData - Datos de la brigada
 * @param {string} brigadeData.nombre - Nombre de la brigada
 * @returns {Object} - Brigada creada
 */
const create = async ({ nombre }) => {
  try {
    // Validar longitud del nombre
    if (nombre && nombre.length > 100) {
      throw new Error(`El nombre de la brigada es demasiado largo (máximo 100 caracteres, actual: ${nombre.length})`)
    }

    const query = {
      text: `
        INSERT INTO "brigada" (
          nombre, fecha_creacion, fecha_actualizacion
        )
        VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `,
      values: [nombre],
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
          p.nombre as encargado_nombre,
          p.apellido as encargado_apellido,
          p.cedula as encargado_cedula,
          bdf.fecha_inicio as fecha_asignacion,
          COUNT(DISTINCT e.id) as cantidad_estudiantes
        FROM "brigada" b
        LEFT JOIN "brigada_docente_fecha" bdf ON b.id = bdf.brigada_id 
          AND bdf.fecha_inicio = (
            SELECT MAX(fecha_inicio) 
            FROM "brigada_docente_fecha" 
            WHERE brigada_id = b.id
          )
        LEFT JOIN "personal" p ON bdf.personal_id = p.id
        LEFT JOIN "estudiante" e ON e.brigada_docente_fecha_id = bdf.id
        GROUP BY b.id, b.nombre, b.fecha_creacion, b.fecha_actualizacion, 
                 p.nombre, p.apellido, p.cedula, bdf.fecha_inicio
        ORDER BY b.fecha_creacion DESC
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
          p.nombre as encargado_nombre,
          p.apellido as encargado_apellido,
          p.cedula as encargado_cedula,
          p.email as encargado_email,
          p.telefono as encargado_telefono,
          bdf.fecha_inicio as fecha_asignacion,
          bdf.id as brigada_docente_fecha_id
        FROM "brigada" b
        LEFT JOIN "brigada_docente_fecha" bdf ON b.id = bdf.brigada_id 
          AND bdf.fecha_inicio = (
            SELECT MAX(fecha_inicio) 
            FROM "brigada_docente_fecha" 
            WHERE brigada_id = b.id
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
 * @param {number} brigadaId - ID de la brigada
 * @returns {Array} - Lista de estudiantes
 */
const getEstudiantesPorBrigada = async (brigadaId) => {
  try {
    const query = {
      text: `
        SELECT 
          e.id,
          e.cedula,
          e.nombre,
          e.apellido,
          e.sexo,
          e.fecha_nacimiento,
          g.nombre as grado_nombre,
          s.seccion,
          r.nombre as representante_nombre,
          r.apellido as representante_apellido,
          r.telefono as representante_telefono
        FROM "estudiante" e
        INNER JOIN "brigada_docente_fecha" bdf ON e.brigada_docente_fecha_id = bdf.id
        LEFT JOIN "matricula" m ON e.id = m.estudiante_id
        LEFT JOIN "seccion" s ON m.seccion_id = s.id
        LEFT JOIN "grado" g ON s.grado_id = g.id
        LEFT JOIN "representante" r ON e.representante_id = r.cedula
        WHERE bdf.brigada_id = $1
          AND bdf.fecha_inicio = (
            SELECT MAX(fecha_inicio) 
            FROM "brigada_docente_fecha" 
            WHERE brigada_id = $1
          )
        ORDER BY e.apellido, e.nombre
      `,
      values: [brigadaId],
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getEstudiantesPorBrigada:", error)
    throw error
  }
}

/**
 * Asignar un encargado a una brigada
 * @param {number} brigadaId - ID de la brigada
 * @param {number} personalId - ID del personal
 * @param {string} fechaInicio - Fecha de asignación (opcional, por defecto hoy)
 * @returns {Object} - Asignación creada
 */
const asignarEncargado = async (brigadaId, personalId, fechaInicio = null) => {
  try {
    const assignmentDate = fechaInicio || new Date().toISOString().split("T")[0]

    const query = {
      text: `
        INSERT INTO "brigada_docente_fecha" (
          brigada_id, personal_id, fecha_inicio, fecha_creacion, fecha_actualizacion
        )
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `,
      values: [brigadaId, personalId, assignmentDate],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in asignarEncargado:", error)
    throw error
  }
}

/**
 * Inscribir estudiantes en una brigada
 * @param {Array} estudianteIds - Array de IDs de estudiantes
 * @param {number} brigadaDocenteFechaId - ID de la asignación brigada-encargado
 * @returns {Object} - Resultado de la operación
 */
const inscribirEstudiantes = async (estudianteIds, brigadaDocenteFechaId) => {
  try {
    // Construir la consulta para actualizar múltiples estudiantes
    const placeholders = estudianteIds.map((_, index) => `$${index + 1}`).join(",")

    const query = {
      text: `
        UPDATE "estudiante" 
        SET brigada_docente_fecha_id = $${estudianteIds.length + 1},
            fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id IN (${placeholders})
        RETURNING id, nombre, apellido
      `,
      values: [...estudianteIds, brigadaDocenteFechaId],
    }

    const { rows } = await db.query(query)
    return {
      success: true,
      estudiantesInscritos: rows.length,
      estudiantes: rows,
    }
  } catch (error) {
    console.error("Error in inscribirEstudiantes:", error)
    throw error
  }
}

/**
 * Limpiar una brigada (quitar encargado y todos los estudiantes)
 * @param {number} brigadaId - ID de la brigada
 * @returns {Object} - Resultado de la operación
 */
const limpiarBrigada = async (brigadaId) => {
  const client = await db.connect()

  try {
    await client.query("BEGIN")

    // Obtener el ID de la asignación actual
    const getCurrentAssignmentQuery = {
      text: `
        SELECT id FROM "brigada_docente_fecha" 
        WHERE brigada_id = $1 
        AND fecha_inicio = (
          SELECT MAX(fecha_inicio) 
          FROM "brigada_docente_fecha" 
          WHERE brigada_id = $1
        )
      `,
      values: [brigadaId],
    }

    const assignmentResult = await client.query(getCurrentAssignmentQuery)

    if (assignmentResult.rows.length > 0) {
      const brigadaDocenteFechaId = assignmentResult.rows[0].id

      // Quitar estudiantes de la brigada
      const removeStudentsQuery = {
        text: `
          UPDATE "estudiante" 
          SET brigada_docente_fecha_id = NULL,
              fecha_actualizacion = CURRENT_TIMESTAMP
          WHERE brigada_docente_fecha_id = $1
          RETURNING id
        `,
        values: [brigadaDocenteFechaId],
      }

      const studentsResult = await client.query(removeStudentsQuery)

      // Eliminar la asignación del encargado
      const removeTeacherQuery = {
        text: `
          DELETE FROM "brigada_docente_fecha" 
          WHERE id = $1
          RETURNING id
        `,
        values: [brigadaDocenteFechaId],
      }

      await client.query(removeTeacherQuery)

      await client.query("COMMIT")

      return {
        success: true,
        estudiantesRemovidos: studentsResult.rows.length,
        encargadoRemovido: true,
      }
    } else {
      await client.query("COMMIT")
      return {
        success: true,
        estudiantesRemovidos: 0,
        encargadoRemovido: false,
        message: "La brigada ya estaba vacía",
      }
    }
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error in limpiarBrigada:", error)
    throw error
  } finally {
    client.release()
  }
}

/**
 * Eliminar una brigada completamente
 * @param {number} id - ID de la brigada
 * @returns {Object} - Brigada eliminada
 */
const remove = async (id) => {
  const client = await db.connect()

  try {
    await client.query("BEGIN")

    // Primero limpiar la brigada
    await limpiarBrigada(id)

    // Luego eliminar la brigada
    const query = {
      text: 'DELETE FROM "brigada" WHERE id = $1 RETURNING id, nombre',
      values: [id],
    }

    const { rows } = await client.query(query)

    await client.query("COMMIT")
    return rows[0]
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error in remove brigada:", error)
    throw error
  } finally {
    client.release()
  }
}

/**
 * Obtener estudiantes disponibles para inscribir en brigadas
 * @returns {Array} - Lista de estudiantes sin brigada
 */
const getEstudiantesDisponibles = async () => {
  try {
    const query = {
      text: `
        SELECT 
          e.id,
          e.cedula,
          e.nombre,
          e.apellido,
          e.sexo,
          e.fecha_nacimiento,
          g.nombre as grado_nombre,
          s.seccion,
          r.nombre as representante_nombre,
          r.apellido as representante_apellido
        FROM "estudiante" e
        LEFT JOIN "matricula" m ON e.id = m.estudiante_id
        LEFT JOIN "seccion" s ON m.seccion_id = s.id
        LEFT JOIN "grado" g ON s.grado_id = g.id
        LEFT JOIN "representante" r ON e.representante_id = r.cedula
        WHERE e.brigada_docente_fecha_id IS NULL
          AND e.estado_id = 1  -- Solo estudiantes activos
        ORDER BY e.apellido, e.nombre
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getEstudiantesDisponibles:", error)
    throw error
  }
}

/**
 * Obtener personal disponible para ser encargado de brigadas
 * @returns {Array} - Lista de personal disponible
 */
const getDocentesDisponibles = async () => {
  try {
    const query = {
      text: `
        SELECT 
          p.id,
          p.cedula,
          p.nombre,
          p.apellido,
          p.email,
          p.telefono,
          r.nombre as rol_nombre
        FROM "personal" p
        LEFT JOIN "rol" r ON p.rol_id = r.id
        WHERE p.rol_id IN (1, 2, 3)  -- Director, Docente, Administrador
        ORDER BY p.apellido, p.nombre
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getDocentesDisponibles:", error)
    throw error
  }
}

export const BrigadaModel = {
  create,
  findAll,
  findById,
  getEstudiantesPorBrigada,
  asignarEncargado,
  inscribirEstudiantes,
  limpiarBrigada,
  remove,
  getEstudiantesDisponibles,
  getDocentesDisponibles,
}