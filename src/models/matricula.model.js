import { db } from "../db/connection.database.js"

/**
 * Crear una nueva matrícula
 * @param {Object} matriculaData - Datos de la matrícula
 * @returns {Object} - Matrícula creada
 */
const create = async (matriculaData) => {
  try {
    const {
      estudiante_id,
      seccion_id,
      fecha_inscripcion,
      repitiente = false,
      talla_camisa,
      talla_pantalon,
      talla_zapatos,
      peso,
      estatura,
      enfermedades,
      observaciones,
      acta_nacimiento_check = false,
      tarjeta_vacunas_check = false,
      fotos_estudiante_check = false,
      fotos_representante_check = false,
      copia_cedula_representante_check = false,
      rif_representante_check = false,
      copia_cedula_autorizados_check = false,
    } = matriculaData

    // Verificar si el estudiante ya tiene matrícula en esta sección
    const existingEnrollment = await db.query(
      'SELECT id FROM "matricula" WHERE estudiante_id = $1 AND seccion_id = $2',
      [estudiante_id, seccion_id],
    )

    if (existingEnrollment.rows.length > 0) {
      throw new Error("El estudiante ya tiene una matrícula registrada para esta sección")
    }

    const query = {
      text: `
        INSERT INTO "matricula" (
          estudiante_id, seccion_id, fecha_inscripcion, repitiente,
          talla_camisa, talla_pantalon, talla_zapatos, peso, estatura,
          enfermedades, observaciones, acta_nacimiento_check, tarjeta_vacunas_check,
          fotos_estudiante_check, fotos_representante_check, copia_cedula_representante_check,
          rif_representante_check, copia_cedula_autorizados_check, fecha_creacion, fecha_actualizacion
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `,
      values: [
        estudiante_id,
        seccion_id,
        fecha_inscripcion,
        repitiente,
        talla_camisa,
        talla_pantalon,
        talla_zapatos,
        peso,
        estatura,
        enfermedades,
        observaciones,
        acta_nacimiento_check,
        tarjeta_vacunas_check,
        fotos_estudiante_check,
        fotos_representante_check,
        copia_cedula_representante_check,
        rif_representante_check,
        copia_cedula_autorizados_check,
      ],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in create matricula:", error)
    throw error
  }
}

/**
 * Obtener todas las matrículas con información completa
 * @returns {Array} - Lista de matrículas
 */
const findAll = async () => {
  try {
    const query = {
      text: `
        SELECT 
          m.*,
          e.nombre as estudiante_nombre,
          e.apellido as estudiante_apellido,
          e.cedula as estudiante_cedula,
          s.seccion,
          g.nombre as grado_nombre,
          p.nombre as docente_nombre,
          p.apellido as docente_apellido
        FROM "matricula" m
        LEFT JOIN "estudiante" e ON m.estudiante_id = e.id
        LEFT JOIN "seccion" s ON m.seccion_id = s.id
        LEFT JOIN "grado" g ON s.grado_id = g.id
        LEFT JOIN "personal" p ON s.docente_id = p.id
        ORDER BY m.fecha_creacion DESC
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findAll matriculas:", error)
    throw error
  }
}

/**
 * Obtener matrícula por ID
 * @param {number} id - ID de la matrícula
 * @returns {Object} - Matrícula encontrada
 */
const findById = async (id) => {
  try {
    const query = {
      text: `
        SELECT 
          m.*,
          e.nombre as estudiante_nombre,
          e.apellido as estudiante_apellido,
          e.cedula as estudiante_cedula,
          s.seccion,
          g.nombre as grado_nombre,
          p.nombre as docente_nombre,
          p.apellido as docente_apellido
        FROM "matricula" m
        LEFT JOIN "estudiante" e ON m.estudiante_id = e.id
        LEFT JOIN "seccion" s ON m.seccion_id = s.id
        LEFT JOIN "grado" g ON s.grado_id = g.id
        LEFT JOIN "personal" p ON s.docente_id = p.id
        WHERE m.id = $1
      `,
      values: [id],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findById matricula:", error)
    throw error
  }
}

/**
 * Obtener matrículas por estudiante
 * @param {number} estudianteId - ID del estudiante
 * @returns {Array} - Lista de matrículas del estudiante
 */
const findByEstudiante = async (estudianteId) => {
  try {
    const query = {
      text: `
        SELECT 
          m.*,
          s.seccion,
          g.nombre as grado_nombre,
          p.nombre as docente_nombre,
          p.apellido as docente_apellido
        FROM "matricula" m
        LEFT JOIN "seccion" s ON m.seccion_id = s.id
        LEFT JOIN "grado" g ON s.grado_id = g.id
        LEFT JOIN "personal" p ON s.docente_id = p.id
        WHERE m.estudiante_id = $1
        ORDER BY m.fecha_creacion DESC
      `,
      values: [estudianteId],
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findByEstudiante:", error)
    throw error
  }
}

/**
 * Obtener matrículas por período
 * @param {string} periodo - Período escolar
 * @returns {Array} - Lista de matrículas del período
 */
const findByPeriodo = async (periodo) => {
  try {
    const query = {
      text: `
        SELECT 
          m.*,
          e.nombre as estudiante_nombre,
          e.apellido as estudiante_apellido,
          e.cedula as estudiante_cedula,
          s.seccion,
          g.nombre as grado_nombre
        FROM "matricula" m
        LEFT JOIN "estudiante" e ON m.estudiante_id = e.id
        LEFT JOIN "seccion" s ON m.seccion_id = s.id
        LEFT JOIN "grado" g ON s.grado_id = g.id
        WHERE s.periodo = $1
        ORDER BY g.id, s.seccion, e.apellido, e.nombre
      `,
      values: [periodo],
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findByPeriodo:", error)
    throw error
  }
}

/**
 * Obtener grados disponibles
 * @returns {Array} - Lista de grados
 */
const getGrados = async () => {
  try {
    const query = {
      text: 'SELECT * FROM "grado" ORDER BY id',
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getGrados:", error)
    throw error
  }
}

/**
 * Obtener secciones con información de docentes
 * @returns {Array} - Lista de secciones
 */
const getSeccionesConDocentes = async () => {
  try {
    const query = {
      text: `
        SELECT 
          s.*,
          g.nombre as grado_nombre,
          p.nombre as docente_nombre,
          p.apellido as docente_apellido,
          p.cedula as docente_cedula
        FROM "seccion" s
        LEFT JOIN "grado" g ON s.grado_id = g.id
        LEFT JOIN "personal" p ON s.docente_id = p.id
        ORDER BY g.id, s.seccion
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getSeccionesConDocentes:", error)
    throw error
  }
}

/**
 * Actualizar matrícula
 * @param {number} id - ID de la matrícula
 * @param {Object} updateData - Datos a actualizar
 * @returns {Object} - Matrícula actualizada
 */
const update = async (id, updateData) => {
  try {
    const fields = []
    const values = []
    let paramCount = 1

    // Construir dinámicamente la consulta de actualización
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined && updateData[key] !== null) {
        fields.push(`${key} = $${paramCount}`)
        values.push(updateData[key])
        paramCount++
      }
    })

    if (fields.length === 0) {
      throw new Error("No hay campos para actualizar")
    }

    fields.push(`fecha_actualizacion = CURRENT_TIMESTAMP`)
    values.push(id)

    const query = {
      text: `
        UPDATE "matricula" 
        SET ${fields.join(", ")}
        WHERE id = $${paramCount}
        RETURNING *
      `,
      values: values,
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in update matricula:", error)
    throw error
  }
}

export const MatriculaModel = {
  create,
  findAll,
  findById,
  findByEstudiante,
  findByPeriodo,
  getGrados,
  getSeccionesConDocentes,
  update,
}
