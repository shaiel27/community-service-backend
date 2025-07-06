import { db } from "../db/connection.database.js"
import bcryptjs from "bcryptjs"

const create = async ({
  username,
  email,
  password,
  permiso_id,
  security_word,
  respuesta_de_seguridad,
  personal_id,
}) => {
  try {
    // Hash the password
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    const query = {
      text: `
        INSERT INTO "usuario" (
          "username", "email", "password", "permiso_id", "security_word", 
          "respuesta_de_seguridad", "personal_id", "is_active", "email_verified", 
          "created_at", "updated_at"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING "id", "username", "email", "permiso_id", "personal_id", "is_active", "email_verified", "created_at"
      `,
      values: [username, email, hashedPassword, permiso_id, security_word, respuesta_de_seguridad, personal_id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in create user:", error)
    throw error
  }
}

const findOneByEmail = async (email) => {
  try {
    const query = {
      text: `
        SELECT u.*,
               p."nombre" as permiso_nombre,
               p."descripcion" as permiso_descripcion,
               per."name" as personal_nombre,
               per."lastName" as personal_apellido,
               per."email" as personal_email,
               per."ci" as personal_ci,
               r."name" as rol_nombre,
               r."description" as rol_descripcion
        FROM "usuario" u
        LEFT JOIN "permisos" p ON u."permiso_id" = p."id"
        LEFT JOIN "personal" per ON u."personal_id" = per."id"
        LEFT JOIN "rol" r ON per."idRole" = r."id"
        WHERE u."email" = $1
      `,
      values: [email],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findOneByEmail:", error)
    throw error
  }
}

const findOneByUsername = async (username) => {
  try {
    const query = {
      text: `
        SELECT u.*,
               p."nombre" as permiso_nombre,
               p."descripcion" as permiso_descripcion,
               per."name" as personal_nombre,
               per."lastName" as personal_apellido,
               per."email" as personal_email,
               per."ci" as personal_ci,
               r."name" as rol_nombre,
               r."description" as rol_descripcion
        FROM "usuario" u
        LEFT JOIN "permisos" p ON u."permiso_id" = p."id"
        LEFT JOIN "personal" per ON u."personal_id" = per."id"
        LEFT JOIN "rol" r ON per."idRole" = r."id"
        WHERE u."username" = $1
      `,
      values: [username],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findOneByUsername:", error)
    throw error
  }
}

const findOneById = async (id) => {
  try {
    const query = {
      text: `
        SELECT u.*,
               p."nombre" as permiso_nombre,
               p."descripcion" as permiso_descripcion,
               per."name" as personal_nombre,
               per."lastName" as personal_apellido,
               per."email" as personal_email,
               per."ci" as personal_ci,
               r."name" as rol_nombre,
               r."description" as rol_descripcion
        FROM "usuario" u
        LEFT JOIN "permisos" p ON u."permiso_id" = p."id"
        LEFT JOIN "personal" per ON u."personal_id" = per."id"
        LEFT JOIN "rol" r ON per."idRole" = r."id"
        WHERE u."id" = $1
      `,
      values: [id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findOneById:", error)
    throw error
  }
}

const findAll = async () => {
  try {
    const query = {
      text: `
        SELECT u."id", u."username", u."email", u."personal_id", u."permiso_id",
               u."is_active", u."email_verified", u."created_at", u."last_login",
               p."nombre" as permiso_nombre,
               p."descripcion" as permiso_descripcion,
               CASE
                 WHEN u."personal_id" IS NOT NULL THEN CONCAT(per."name", ' ', per."lastName")
                 ELSE 'Usuario Externo'
               END as nombre_completo,
               per."ci" as cedula,
               per."email" as email_personal,
               r."name" as rol_nombre
        FROM "usuario" u
        LEFT JOIN "permisos" p ON u."permiso_id" = p."id"
        LEFT JOIN "personal" per ON u."personal_id" = per."id"
        LEFT JOIN "rol" r ON per."idRole" = r."id"
        ORDER BY u."id"
      `,
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findAll users:", error)
    throw error
  }
}

const updatePassword = async (id, hashedPassword) => {
  try {
    const query = {
      text: `
        UPDATE "usuario"
        SET "password" = $1,
            "updated_at" = CURRENT_TIMESTAMP
        WHERE "id" = $2
        RETURNING "id", "username", "email"
      `,
      values: [hashedPassword, id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in updatePassword:", error)
    throw error
  }
}

const updateProfile = async (id, { email, security_word, respuesta_de_seguridad }) => {
  try {
    const query = {
      text: `
        UPDATE "usuario"
        SET "email" = COALESCE($1, "email"),
            "security_word" = COALESCE($2, "security_word"),
            "respuesta_de_seguridad" = COALESCE($3, "respuesta_de_seguridad"),
            "updated_at" = CURRENT_TIMESTAMP
        WHERE "id" = $4
        RETURNING "id", "username", "email", "security_word"
      `,
      values: [email, security_word, respuesta_de_seguridad, id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in updateProfile:", error)
    throw error
  }
}

const updateLastLogin = async (id) => {
  try {
    const query = {
      text: `
        UPDATE "usuario"
        SET "last_login" = CURRENT_TIMESTAMP,
            "updated_at" = CURRENT_TIMESTAMP
        WHERE "id" = $1
      `,
      values: [id],
    }
    await db.query(query)
  } catch (error) {
    console.error("Error in updateLastLogin:", error)
    // No lanzar error si falla, es opcional
  }
}

const setPasswordResetToken = async (userId, token) => {
  try {
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

    const query = {
      text: `
        UPDATE "usuario"
        SET "password_reset_token" = $1,
            "password_reset_expires" = $2,
            "updated_at" = CURRENT_TIMESTAMP
        WHERE "id" = $3
        RETURNING "id", "username", "email"
      `,
      values: [token, expires, userId],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in setPasswordResetToken:", error)
    throw error
  }
}

const findByPasswordResetToken = async (token) => {
  try {
    const query = {
      text: `
        SELECT * FROM "usuario"
        WHERE "password_reset_token" = $1
        AND "password_reset_expires" > CURRENT_TIMESTAMP
      `,
      values: [token],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findByPasswordResetToken:", error)
    throw error
  }
}

const clearPasswordResetToken = async (id) => {
  try {
    const query = {
      text: `
        UPDATE "usuario"
        SET "password_reset_token" = NULL,
            "password_reset_expires" = NULL,
            "updated_at" = CURRENT_TIMESTAMP
        WHERE "id" = $1
      `,
      values: [id],
    }
    await db.query(query)
  } catch (error) {
    console.error("Error in clearPasswordResetToken:", error)
    throw error
  }
}

const setActive = async (id, isActive) => {
  try {
    const query = {
      text: `
        UPDATE "usuario"
        SET "is_active" = $1,
            "updated_at" = CURRENT_TIMESTAMP
        WHERE "id" = $2
        RETURNING "id", "username", "email", "is_active"
      `,
      values: [isActive, id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in setActive:", error)
    throw error
  }
}

const remove = async (id) => {
  try {
    const query = {
      text: 'DELETE FROM "usuario" WHERE "id" = $1 RETURNING "id"',
      values: [id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in remove user:", error)
    throw error
  }
}

const findByPersonalId = async (personal_id) => {
  try {
    const query = {
      text: `
        SELECT u.*,
               p."nombre" as permiso_nombre,
               p."descripcion" as permiso_descripcion,
               per."name" as personal_nombre,
               per."lastName" as personal_apellido,
               per."email" as personal_email,
               per."ci" as personal_ci,
               r."name" as rol_nombre,
               r."description" as rol_descripcion
        FROM "usuario" u
        LEFT JOIN "permisos" p ON u."permiso_id" = p."id"
        LEFT JOIN "personal" per ON u."personal_id" = per."id"
        LEFT JOIN "rol" r ON per."idRole" = r."id"
        WHERE u."personal_id" = $1
      `,
      values: [personal_id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findByPersonalId:", error)
    throw error
  }
}

const searchByUsername = async (username) => {
  try {
    const query = {
      text: `
        SELECT u."id", u."username", u."email", u."personal_id", u."permiso_id",
               u."is_active", u."email_verified", u."created_at", u."last_login",
               p."nombre" as permiso_nombre,
               CASE
                 WHEN u."personal_id" IS NOT NULL THEN CONCAT(per."name", ' ', per."lastName")
                 ELSE 'Usuario Externo'
               END as nombre_completo,
               per."ci" as cedula,
               r."name" as rol_nombre
        FROM "usuario" u
        LEFT JOIN "permisos" p ON u."permiso_id" = p."id"
        LEFT JOIN "personal" per ON u."personal_id" = per."id"
        LEFT JOIN "rol" r ON per."idRole" = r."id"
        WHERE u."username" ILIKE $1
        ORDER BY u."id"
      `,
      values: [`%${username}%`],
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in searchByUsername:", error)
    throw error
  }
}

const verifySecurityAnswer = async (username, respuesta_de_seguridad) => {
  try {
    const query = {
      text: `
        SELECT "id", "username", "email", "security_word", "respuesta_de_seguridad"
        FROM "usuario"
        WHERE "username" = $1 AND "respuesta_de_seguridad" = $2
      `,
      values: [username, respuesta_de_seguridad],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in verifySecurityAnswer:", error)
    throw error
  }
}

const updateProfileWithSecurity = async (
  id,
  { email, security_word, respuesta_de_seguridad, current_security_answer },
) => {
  try {
    // Primero verificar la respuesta de seguridad actual
    const userQuery = {
      text: `SELECT "respuesta_de_seguridad" FROM "usuario" WHERE "id" = $1`,
      values: [id],
    }
    const userResult = await db.query(userQuery)

    if (!userResult.rows[0] || userResult.rows[0].respuesta_de_seguridad !== current_security_answer) {
      throw new Error("Invalid security answer")
    }

    const query = {
      text: `
        UPDATE "usuario"
        SET "email" = COALESCE($1, "email"),
            "security_word" = COALESCE($2, "security_word"),
            "respuesta_de_seguridad" = COALESCE($3, "respuesta_de_seguridad"),
            "updated_at" = CURRENT_TIMESTAMP
        WHERE "id" = $4
        RETURNING "id", "username", "email", "security_word"
      `,
      values: [email, security_word, respuesta_de_seguridad, id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in updateProfileWithSecurity:", error)
    throw error
  }
}

const changePasswordWithSecurity = async (username, respuesta_de_seguridad, newPassword) => {
  try {
    // Verificar la respuesta de seguridad
    const user = await verifySecurityAnswer(username, respuesta_de_seguridad)
    if (!user) {
      throw new Error("Invalid username or security answer")
    }

    // Hash de la nueva contraseña
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(newPassword, salt)

    // Actualizar la contraseña
    const query = {
      text: `
        UPDATE "usuario"
        SET "password" = $1,
            "updated_at" = CURRENT_TIMESTAMP
        WHERE "id" = $2
        RETURNING "id", "username", "email"
      `,
      values: [hashedPassword, user.id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in changePasswordWithSecurity:", error)
    throw error
  }
}

const setEmailVerificationToken = async (id, token) => {
  try {
    const query = {
      text: `
        UPDATE "usuario"
        SET "email_verification_token" = $1,
            "updated_at" = CURRENT_TIMESTAMP
        WHERE "id" = $2
        RETURNING "id", "username", "email"
      `,
      values: [token, id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in setEmailVerificationToken:", error)
    throw error
  }
}

const verifyEmail = async (token) => {
  try {
    const query = {
      text: `
        UPDATE "usuario"
        SET "email_verified" = true,
            "email_verification_token" = NULL,
            "updated_at" = CURRENT_TIMESTAMP
        WHERE "email_verification_token" = $1
        RETURNING "id", "username", "email", "email_verified"
      `,
      values: [token],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in verifyEmail:", error)
    throw error
  }
}

export const UserModel = {
  create,
  findOneByUsername,
  findOneById,
  findOneByEmail,
  findAll,
  updatePassword,
  updateProfile,
  updateProfileWithSecurity,
  changePasswordWithSecurity,
  updateLastLogin,
  setPasswordResetToken,
  findByPasswordResetToken,
  clearPasswordResetToken,
  setActive,
  remove,
  findByPersonalId,
  searchByUsername,
  verifySecurityAnswer,
  setEmailVerificationToken,
  verifyEmail,
}
