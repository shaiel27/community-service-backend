import { db } from "../db/connection.database.js"
import bcrypt from "bcryptjs"

/**
 * Crear un nuevo usuario
 * @param {Object} userData - Datos del usuario
 * @returns {Object} - Usuario creado
 */
const create = async (userData) => {
  try {
    const {
      nombre_usuario,
      email,
      contrasena,
      permiso_id,
      pregunta_seguridad,
      respuesta_seguridad,
      personal_id = null,
    } = userData

    // Validaciones básicas
    if (!nombre_usuario || !email || !contrasena) {
      throw new Error("Nombre de usuario, email y contraseña son obligatorios")
    }

    if (contrasena.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres")
    }

    // Verificar si el usuario ya existe
    const existingUser = await db.query('SELECT id FROM "usuario" WHERE nombre_usuario = $1 OR email = $2', [
      nombre_usuario,
      email,
    ])

    if (existingUser.rows.length > 0) {
      const existing = existingUser.rows[0]
      if (existing.nombre_usuario === nombre_usuario) {
        throw new Error("El nombre de usuario ya existe")
      }
      if (existing.email === email) {
        throw new Error("El email ya está registrado")
      }
    }

    // Encriptar contraseña
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds)
    const hashedSecurityAnswer = await bcrypt.hash(respuesta_seguridad.toLowerCase(), saltRounds)

    const query = {
      text: `
        INSERT INTO "usuario" (
          nombre_usuario, email, contrasena, permiso_id, pregunta_seguridad, 
          respuesta_seguridad, personal_id, activo, fecha_creacion, fecha_actualizacion
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, nombre_usuario, email, permiso_id, personal_id, activo, fecha_creacion
      `,
      values: [
        nombre_usuario,
        email,
        hashedPassword,
        permiso_id,
        pregunta_seguridad,
        hashedSecurityAnswer,
        personal_id,
      ],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in create user:", error)
    throw error
  }
}

/**
 * Buscar usuario por email
 * @param {string} email - Email del usuario
 * @returns {Object} - Usuario encontrado
 */
const findByEmail = async (email) => {
  try {
    const query = {
      text: `
        SELECT 
          u.id,
          u.nombre_usuario,
          u.email,
          u.contrasena,
          u.permiso_id,
          u.personal_id,
          u.activo,
          u.fecha_creacion,
          u.fecha_actualizacion,
          p.nombre as permiso_nombre,
          per.nombre as personal_nombre,
          per.apellido as personal_apellido,
          per.rol_id as personal_rol_id,
          r.nombre as rol_nombre
        FROM "usuario" u
        LEFT JOIN "permisos" p ON u.permiso_id = p.id
        LEFT JOIN "personal" per ON u.personal_id = per.id
        LEFT JOIN "rol" r ON per.rol_id = r.id
        WHERE u.email = $1
      `,
      values: [email],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findByEmail:", error)
    throw error
  }
}

/**
 * Buscar usuario por nombre de usuario
 * @param {string} nombre_usuario - Nombre de usuario
 * @returns {Object} - Usuario encontrado
 */
const findByUsername = async (nombre_usuario) => {
  try {
    const query = {
      text: `
        SELECT 
          u.id,
          u.nombre_usuario,
          u.email,
          u.permiso_id,
          u.personal_id,
          u.pregunta_seguridad,
          u.activo,
          u.fecha_creacion,
          p.nombre as permiso_nombre,
          per.nombre as personal_nombre,
          per.apellido as personal_apellido,
          per.rol_id as personal_rol_id,
          r.nombre as rol_nombre
        FROM "usuario" u
        LEFT JOIN "permisos" p ON u.permiso_id = p.id
        LEFT JOIN "personal" per ON u.personal_id = per.id
        LEFT JOIN "rol" r ON per.rol_id = r.id
        WHERE u.nombre_usuario = $1
      `,
      values: [nombre_usuario],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findByUsername:", error)
    throw error
  }
}

/**
 * Buscar usuario por ID
 * @param {number} id - ID del usuario
 * @returns {Object} - Usuario encontrado
 */
const findById = async (id) => {
  try {
    const query = {
      text: `
        SELECT 
          u.id,
          u.nombre_usuario,
          u.email,
          u.permiso_id,
          u.personal_id,
          u.activo,
          u.fecha_creacion,
          u.fecha_actualizacion,
          p.nombre as permiso_nombre,
          per.nombre as personal_nombre,
          per.apellido as personal_apellido,
          per.rol_id as personal_rol_id,
          r.nombre as rol_nombre
        FROM "usuario" u
        LEFT JOIN "permisos" p ON u.permiso_id = p.id
        LEFT JOIN "personal" per ON u.personal_id = per.id
        LEFT JOIN "rol" r ON per.rol_id = r.id
        WHERE u.id = $1
      `,
      values: [id],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findById:", error)
    throw error
  }
}

/**
 * Obtener todos los usuarios (solo para admin)
 * @returns {Array} - Lista de usuarios
 */
const findAll = async () => {
  try {
    const query = {
      text: `
        SELECT 
          u.id,
          u.nombre_usuario,
          u.email,
          u.permiso_id,
          u.personal_id,
          u.activo,
          u.fecha_creacion,
          u.fecha_actualizacion,
          p.nombre as permiso_nombre,
          per.nombre as personal_nombre,
          per.apellido as personal_apellido,
          per.rol_id as personal_rol_id,
          r.nombre as rol_nombre
        FROM "usuario" u
        LEFT JOIN "permisos" p ON u.permiso_id = p.id
        LEFT JOIN "personal" per ON u.personal_id = per.id
        LEFT JOIN "rol" r ON per.rol_id = r.id
        ORDER BY u.fecha_creacion DESC
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findAll users:", error)
    throw error
  }
}

/**
 * Actualizar contraseña del usuario
 * @param {number} userId - ID del usuario
 * @param {string} newPassword - Nueva contraseña
 * @returns {Object} - Usuario actualizado
 */
const updatePassword = async (userId, newPassword) => {
  try {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    const query = {
      text: `
        UPDATE "usuario" 
        SET contrasena = $1, fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, nombre_usuario, email, fecha_actualizacion
      `,
      values: [hashedPassword, userId],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in updatePassword:", error)
    throw error
  }
}

/**
 * Verificar respuesta de seguridad
 * @param {string} nombre_usuario - Nombre de usuario
 * @param {string} securityAnswer - Respuesta de seguridad
 * @returns {boolean} - True si la respuesta es correcta
 */
const verifySecurityAnswer = async (nombre_usuario, securityAnswer) => {
  try {
    const query = {
      text: 'SELECT respuesta_seguridad FROM "usuario" WHERE nombre_usuario = $1',
      values: [nombre_usuario],
    }

    const { rows } = await db.query(query)
    if (rows.length === 0) {
      return false
    }

    const hashedAnswer = rows[0].respuesta_seguridad
    return await bcrypt.compare(securityAnswer.toLowerCase(), hashedAnswer)
  } catch (error) {
    console.error("Error in verifySecurityAnswer:", error)
    throw error
  }
}

/**
 * Actualizar estado del usuario
 * @param {number} userId - ID del usuario
 * @param {boolean} isActive - Estado activo/inactivo
 * @returns {Object} - Usuario actualizado
 */
const updateStatus = async (userId, isActive) => {
  try {
    const query = {
      text: `
        UPDATE "usuario" 
        SET activo = $1, fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, nombre_usuario, email, activo, fecha_actualizacion
      `,
      values: [isActive, userId],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in updateStatus:", error)
    throw error
  }
}

export const UsuarioModel = {
  create,
  findByEmail,
  findByUsername,
  findById,
  findAll,
  updatePassword,
  verifySecurityAnswer,
  updateStatus,
}
