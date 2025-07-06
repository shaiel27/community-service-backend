import { db } from "../db/connection.database.js"

/**
 * Crear un nuevo estudiante
 * @param {Object} estudianteData - Datos del estudiante
 * @returns {Object} - Estudiante creado
 */
const create = async (estudianteData) => {
  try {
    const {
      cedula,
      nombre,
      apellido,
      sexo,
      fecha_nacimiento,
      lugar_nacimiento,
      parroquia_id,
      estado_id = 1, // Activo por defecto
      cantidad_hermanos = 0,
      representante_id,
      nombre_madre,
      cedula_madre,
      telefono_madre,
      nombre_padre,
      cedula_padre,
      telefono_padre,
      vive_con_madre = false,
      vive_con_padre = false,
      vive_con_ambos = false,
      vive_con_representante = false,
      rol_representante,
    } = estudianteData

    // Verificar si ya existe un estudiante con la misma cédula
    const existingStudent = await db.query('SELECT id FROM "estudiante" WHERE cedula = $1', [cedula])
    if (existingStudent.rows.length > 0) {
      throw new Error("Ya existe un estudiante con esta cédula")
    }

    const query = {
      text: `
        INSERT INTO "estudiante" (
          cedula, nombre, apellido, sexo, fecha_nacimiento, lugar_nacimiento,
          parroquia_id, estado_id, cantidad_hermanos, representante_id,
          nombre_madre, cedula_madre, telefono_madre, nombre_padre, cedula_padre,
          telefono_padre, vive_con_madre, vive_con_padre, vive_con_ambos,
          vive_con_representante, rol_representante, fecha_creacion, fecha_actualizacion
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `,
      values: [
        cedula,
        nombre,
        apellido,
        sexo,
        fecha_nacimiento,
        lugar_nacimiento,
        parroquia_id,
        estado_id,
        cantidad_hermanos,
        representante_id,
        nombre_madre,
        cedula_madre,
        telefono_madre,
        nombre_padre,
        cedula_padre,
        telefono_padre,
        vive_con_madre,
        vive_con_padre,
        vive_con_ambos,
        vive_con_representante,
        rol_representante,
      ],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in create estudiante:", error)
    throw error
  }
}

/**
 * Obtener todos los estudiantes con información completa
 * @returns {Array} - Lista de estudiantes
 */
const findAll = async () => {
  try {
    const query = {
      text: `
        SELECT 
          e.*,
          r.nombre as representante_nombre,
          r.apellido as representante_apellido,
          r.telefono as representante_telefono,
          est.descripcion as estado_descripcion,
          par.nombre as parroquia_nombre
        FROM "estudiante" e
        LEFT JOIN "representante" r ON e.representante_id = r.cedula
        LEFT JOIN "estado_estudiante" est ON e.estado_id = est.id
        LEFT JOIN "parroquia" par ON e.parroquia_id = par.id
        ORDER BY e.apellido, e.nombre
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findAll estudiantes:", error)
    throw error
  }
}

/**
 * Obtener estudiante por ID
 * @param {number} id - ID del estudiante
 * @returns {Object} - Estudiante encontrado
 */
const findById = async (id) => {
  try {
    const query = {
      text: `
        SELECT 
          e.*,
          r.nombre as representante_nombre,
          r.apellido as representante_apellido,
          r.telefono as representante_telefono,
          r.email as representante_email,
          est.descripcion as estado_descripcion,
          par.nombre as parroquia_nombre
        FROM "estudiante" e
        LEFT JOIN "representante" r ON e.representante_id = r.cedula
        LEFT JOIN "estado_estudiante" est ON e.estado_id = est.id
        LEFT JOIN "parroquia" par ON e.parroquia_id = par.id
        WHERE e.id = $1
      `,
      values: [id],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findById estudiante:", error)
    throw error
  }
}

/**
 * Buscar estudiante por cédula
 * @param {string} cedula - Cédula del estudiante
 * @returns {Object} - Estudiante encontrado
 */
const findByCedula = async (cedula) => {
  try {
    const query = {
      text: `
        SELECT 
          e.*,
          r.nombre as representante_nombre,
          r.apellido as representante_apellido,
          est.descripcion as estado_descripcion
        FROM "estudiante" e
        LEFT JOIN "representante" r ON e.representante_id = r.cedula
        LEFT JOIN "estado_estudiante" est ON e.estado_id = est.id
        WHERE e.cedula = $1
      `,
      values: [cedula],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findByCedula estudiante:", error)
    throw error
  }
}

/**
 * Buscar estudiantes por nombre
 * @param {string} nombre - Nombre a buscar
 * @returns {Array} - Lista de estudiantes que coinciden
 */
const findByNombre = async (nombre) => {
  try {
    const query = {
      text: `
        SELECT 
          e.*,
          r.nombre as representante_nombre,
          r.apellido as representante_apellido,
          est.descripcion as estado_descripcion
        FROM "estudiante" e
        LEFT JOIN "representante" r ON e.representante_id = r.cedula
        LEFT JOIN "estado_estudiante" est ON e.estado_id = est.id
        WHERE LOWER(e.nombre) LIKE LOWER($1) OR LOWER(e.apellido) LIKE LOWER($1)
        ORDER BY e.apellido, e.nombre
      `,
      values: [`%${nombre}%`],
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findByNombre estudiante:", error)
    throw error
  }
}

/**
 * Obtener estudiantes por estado
 * @param {number} estadoId - ID del estado
 * @returns {Array} - Lista de estudiantes
 */
const findByEstado = async (estadoId) => {
  try {
    const query = {
      text: `
        SELECT 
          e.*,
          r.nombre as representante_nombre,
          r.apellido as representante_apellido,
          est.descripcion as estado_descripcion
        FROM "estudiante" e
        LEFT JOIN "representante" r ON e.representante_id = r.cedula
        LEFT JOIN "estado_estudiante" est ON e.estado_id = est.id
        WHERE e.estado_id = $1
        ORDER BY e.apellido, e.nombre
      `,
      values: [estadoId],
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findByEstado estudiante:", error)
    throw error
  }
}

/**
 * Actualizar estudiante
 * @param {number} id - ID del estudiante
 * @param {Object} updateData - Datos a actualizar
 * @returns {Object} - Estudiante actualizado
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
        UPDATE "estudiante" 
        SET ${fields.join(", ")}
        WHERE id = $${paramCount}
        RETURNING *
      `,
      values: values,
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in update estudiante:", error)
    throw error
  }
}

/**
 * Eliminar estudiante
 * @param {number} id - ID del estudiante
 * @returns {Object} - Estudiante eliminado
 */
const remove = async (id) => {
  try {
    const query = {
      text: 'DELETE FROM "estudiante" WHERE id = $1 RETURNING *',
      values: [id],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in remove estudiante:", error)
    throw error
  }
}

/**
 * Obtener estados de estudiante disponibles
 * @returns {Array} - Lista de estados
 */
const getEstados = async () => {
  try {
    const query = {
      text: 'SELECT * FROM "estado_estudiante" ORDER BY id',
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getEstados:", error)
    throw error
  }
}

export const EstudianteModel = {
  create,
  findAll,
  findById,
  findByCedula,
  findByNombre,
  findByEstado,
  update,
  remove,
  getEstados,
}
