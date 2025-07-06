import { db } from "../db/connection.database.js"

/**
 * Crear un nuevo miembro del personal
 * @param {Object} personalData - Datos del personal
 * @returns {Object} - Personal creado
 */
const create = async (personalData) => {
  try {
    const { nombre, apellido, rol_id, telefono, cedula, email, fecha_nacimiento, direccion, parroquia_id } =
      personalData

    // Validar longitud de campos
    if (nombre && nombre.length > 100) {
      throw new Error(`El nombre es demasiado largo (máximo 100 caracteres, actual: ${nombre.length})`)
    }

    if (apellido && apellido.length > 100) {
      throw new Error(`El apellido es demasiado largo (máximo 100 caracteres, actual: ${apellido.length})`)
    }

    if (direccion && direccion.length > 30) {
      throw new Error(`La dirección es demasiado larga (máximo 30 caracteres, actual: ${direccion.length})`)
    }

    // Verificar si ya existe un personal con la misma cédula
    const existingPersonal = await db.query('SELECT id FROM "personal" WHERE cedula = $1', [cedula])
    if (existingPersonal.rows.length > 0) {
      throw new Error("Ya existe un miembro del personal con esta cédula")
    }

    const query = {
      text: `
        INSERT INTO "personal" (
          nombre, apellido, rol_id, telefono, cedula, email, 
          fecha_nacimiento, direccion, parroquia_id, fecha_creacion, fecha_actualizacion
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `,
      values: [nombre, apellido, rol_id, telefono, cedula, email, fecha_nacimiento, direccion, parroquia_id],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in create personal:", error)
    throw error
  }
}

/**
 * Obtener todo el personal con información de rol y parroquia
 * @returns {Array} - Lista de personal
 */
const findAll = async () => {
  try {
    const query = {
      text: `
        SELECT 
          p.*,
          r.nombre as rol_nombre,
          r.descripcion as rol_descripcion,
          par.nombre as parroquia_nombre,
          mun.nombre as municipio_nombre,
          est.nombre as estado_nombre
        FROM "personal" p
        LEFT JOIN "rol" r ON p.rol_id = r.id
        LEFT JOIN "parroquia" par ON p.parroquia_id = par.id
        LEFT JOIN "municipio" mun ON par.municipio_id = mun.id
        LEFT JOIN "estado" est ON mun.estado_id = est.id
        ORDER BY p.fecha_creacion DESC
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findAll personal:", error)
    throw error
  }
}

/**
 * Obtener personal por ID
 * @param {number} id - ID del personal
 * @returns {Object} - Personal encontrado
 */
const findById = async (id) => {
  try {
    const query = {
      text: `
        SELECT 
          p.*,
          r.nombre as rol_nombre,
          r.descripcion as rol_descripcion,
          par.nombre as parroquia_nombre,
          mun.nombre as municipio_nombre,
          est.nombre as estado_nombre
        FROM "personal" p
        LEFT JOIN "rol" r ON p.rol_id = r.id
        LEFT JOIN "parroquia" par ON p.parroquia_id = par.id
        LEFT JOIN "municipio" mun ON par.municipio_id = mun.id
        LEFT JOIN "estado" est ON mun.estado_id = est.id
        WHERE p.id = $1
      `,
      values: [id],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findById personal:", error)
    throw error
  }
}

/**
 * Buscar personal por cédula
 * @param {string} cedula - Cédula del personal
 * @returns {Object} - Personal encontrado
 */
const findByCedula = async (cedula) => {
  try {
    const query = {
      text: `
        SELECT 
          p.*,
          r.nombre as rol_nombre,
          r.descripcion as rol_descripcion
        FROM "personal" p
        LEFT JOIN "rol" r ON p.rol_id = r.id
        WHERE p.cedula = $1
      `,
      values: [cedula],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findByCedula personal:", error)
    throw error
  }
}

/**
 * Buscar personal por nombre
 * @param {string} nombre - Nombre a buscar
 * @returns {Array} - Lista de personal que coincide
 */
const findByNombre = async (nombre) => {
  try {
    const query = {
      text: `
        SELECT 
          p.*,
          r.nombre as rol_nombre,
          r.descripcion as rol_descripcion
        FROM "personal" p
        LEFT JOIN "rol" r ON p.rol_id = r.id
        WHERE LOWER(p.nombre) LIKE LOWER($1) OR LOWER(p.apellido) LIKE LOWER($1)
        ORDER BY p.nombre, p.apellido
      `,
      values: [`%${nombre}%`],
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findByNombre personal:", error)
    throw error
  }
}

/**
 * Obtener personal por rol
 * @param {number} roleId - ID del rol
 * @returns {Array} - Lista de personal del rol
 */
const findByRol = async (roleId) => {
  try {
    const query = {
      text: `
        SELECT 
          p.*,
          r.nombre as rol_nombre,
          r.descripcion as rol_descripcion
        FROM "personal" p
        LEFT JOIN "rol" r ON p.rol_id = r.id
        WHERE p.rol_id = $1
        ORDER BY p.nombre, p.apellido
      `,
      values: [roleId],
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findByRol personal:", error)
    throw error
  }
}

/**
 * Obtener solo docentes (rol ID = 2)
 * @returns {Array} - Lista de docentes
 */
const findDocentes = async () => {
  try {
    const query = {
      text: `
        SELECT 
          p.*,
          r.nombre as rol_nombre,
          r.descripcion as rol_descripcion
        FROM "personal" p
        LEFT JOIN "rol" r ON p.rol_id = r.id
        WHERE p.rol_id = 2
        ORDER BY p.nombre, p.apellido
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findDocentes:", error)
    throw error
  }
}

/**
 * Obtener solo administradores (rol ID = 3)
 * @returns {Array} - Lista de administradores
 */
const findAdministradores = async () => {
  try {
    const query = {
      text: `
        SELECT 
          p.*,
          r.nombre as rol_nombre,
          r.descripcion as rol_descripcion
        FROM "personal" p
        LEFT JOIN "rol" r ON p.rol_id = r.id
        WHERE p.rol_id = 3
        ORDER BY p.nombre, p.apellido
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findAdministradores:", error)
    throw error
  }
}

/**
 * Actualizar personal
 * @param {number} id - ID del personal
 * @param {Object} updateData - Datos a actualizar
 * @returns {Object} - Personal actualizado
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
        UPDATE "personal" 
        SET ${fields.join(", ")}
        WHERE id = $${paramCount}
        RETURNING *
      `,
      values: values,
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in update personal:", error)
    throw error
  }
}

/**
 * Eliminar personal
 * @param {number} id - ID del personal
 * @returns {Object} - Personal eliminado
 */
const remove = async (id) => {
  try {
    const query = {
      text: 'DELETE FROM "personal" WHERE id = $1 RETURNING *',
      values: [id],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in remove personal:", error)
    throw error
  }
}

/**
 * Obtener todos los roles disponibles
 * @returns {Array} - Lista de roles
 */
const getRoles = async () => {
  try {
    const query = {
      text: 'SELECT * FROM "rol" ORDER BY nombre',
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getRoles:", error)
    throw error
  }
}

/**
 * Obtener todas las parroquias disponibles
 * @returns {Array} - Lista de parroquias
 */
const getParroquias = async () => {
  try {
    const query = {
      text: `
        SELECT 
          p.*,
          m.nombre as municipio_nombre,
          s.nombre as estado_nombre
        FROM "parroquia" p
        LEFT JOIN "municipio" m ON p.municipio_id = m.id
        LEFT JOIN "estado" s ON m.estado_id = s.id
        ORDER BY s.nombre, m.nombre, p.nombre
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getParroquias:", error)
    throw error
  }
}

export const PersonalModel = {
  create,
  findAll,
  findById,
  findByCedula,
  findByNombre,
  findByRol,
  findDocentes,
  findAdministradores,
  update,
  remove,
  getRoles,
  getParroquias,
}
