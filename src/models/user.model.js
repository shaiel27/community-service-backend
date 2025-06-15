import { db } from "../database/connection.database.js"
import bcryptjs from "bcryptjs"

const create = async ({ username, password, staff_id, guardian_id, role_id, permission_id, security_question }) => {
  try {
    // Hash the password
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    const getMaxIdQuery = {
      text: 'SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM "user_account"',
    }
    const {
      rows: [{ next_id }],
    } = await db.query(getMaxIdQuery)

    const query = {
      text: `
        INSERT INTO "user_account" (
          id, username, password, staff_id, guardian_id, role_id, permission_id, 
          security_question, is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, username, staff_id, guardian_id, role_id, permission_id, is_active
      `,
      values: [
        next_id,
        username,
        hashedPassword,
        staff_id,
        guardian_id,
        role_id,
        permission_id,
        security_question,
        true,
      ],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in create user:", error)
    throw error
  }
}

const findOneByUsername = async (username) => {
  try {
    const query = {
      text: `
        SELECT ua.*, r.name as role_name, p.name as permission_name
        FROM "user_account" ua
        LEFT JOIN role r ON ua.role_id = r.id
        LEFT JOIN permission p ON ua.permission_id = p.id
        WHERE ua.username = $1
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
        SELECT ua.*, r.name as role_name, p.name as permission_name
        FROM "user_account" ua
        LEFT JOIN role r ON ua.role_id = r.id
        LEFT JOIN permission p ON ua.permission_id = p.id
        WHERE ua.id = $1
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
        SELECT ua.id, ua.username, ua.staff_id, ua.guardian_id, 
               ua.role_id, ua.permission_id, ua.is_active, ua.created_at,
               r.name as role_name, p.name as permission_name,
               CASE 
                 WHEN ua.staff_id IS NOT NULL THEN CONCAT(s.first_name, ' ', s.last_name)
                 WHEN ua.guardian_id IS NOT NULL THEN CONCAT(g.first_name, ' ', g.last_name)
                 ELSE NULL
               END as full_name
        FROM "user_account" ua
        LEFT JOIN role r ON ua.role_id = r.id
        LEFT JOIN permission p ON ua.permission_id = p.id
        LEFT JOIN staff s ON ua.staff_id = s.id
        LEFT JOIN guardian g ON ua.guardian_id = g.id
        ORDER BY ua.id
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
        UPDATE "user_account"
        SET password = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, username
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

const updateProfile = async (id, { security_question }) => {
  try {
    const query = {
      text: `
        UPDATE "user_account"
        SET security_question = COALESCE($1, security_question),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, username, security_question
      `,
      values: [security_question, id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in updateProfile:", error)
    throw error
  }
}

const saveLoginToken = async (id, access_token, refresh_token, expiration) => {
  try {
    const query = {
      text: `
        UPDATE "user_account"
        SET access_token = $1,
            refresh_token = $2,
            token_expiry = $3,
            last_login = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
      `,
      values: [access_token, refresh_token, expiration, id],
    }
    await db.query(query)
  } catch (error) {
    console.error("Error in saveLoginToken:", error)
    throw error
  }
}

const findUserByAccessToken = async (token) => {
  try {
    const query = {
      text: `
        SELECT ua.*, r.name as role_name, p.name as permission_name
        FROM "user_account" ua
        LEFT JOIN role r ON ua.role_id = r.id
        LEFT JOIN permission p ON ua.permission_id = p.id
        WHERE ua.access_token = $1 AND ua.token_expiry > CURRENT_TIMESTAMP
      `,
      values: [token],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findUserByAccessToken:", error)
    throw error
  }
}

const clearLoginTokens = async (id) => {
  try {
    const query = {
      text: `
        UPDATE "user_account"
        SET access_token = NULL,
            refresh_token = NULL,
            token_expiry = NULL,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `,
      values: [id],
    }
    await db.query(query)
  } catch (error) {
    console.error("Error in clearLoginTokens:", error)
    throw error
  }
}

const setPasswordResetToken = async (username, token, expires) => {
  try {
    const query = {
      text: `
        UPDATE "user_account"
        SET password_reset_token = $1,
            password_reset_expires = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE username = $3
        RETURNING id, username
      `,
      values: [token, expires, username],
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
        SELECT * FROM "user_account"
        WHERE password_reset_token = $1
        AND password_reset_expires > CURRENT_TIMESTAMP
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
        UPDATE "user_account"
        SET password_reset_token = NULL,
            password_reset_expires = NULL,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
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
        UPDATE "user_account"
        SET is_active = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, username, is_active
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
      text: 'DELETE FROM "user_account" WHERE id = $1 RETURNING id',
      values: [id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in remove user:", error)
    throw error
  }
}

const findByStaffId = async (staff_id) => {
  try {
    const query = {
      text: `
        SELECT ua.*, r.name as role_name, p.name as permission_name
        FROM "user_account" ua
        LEFT JOIN role r ON ua.role_id = r.id
        LEFT JOIN permission p ON ua.permission_id = p.id
        WHERE ua.staff_id = $1
      `,
      values: [staff_id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findByStaffId:", error)
    throw error
  }
}

const findByGuardianId = async (guardian_id) => {
  try {
    const query = {
      text: `
        SELECT ua.*, r.name as role_name, p.name as permission_name
        FROM "user_account" ua
        LEFT JOIN role r ON ua.role_id = r.id
        LEFT JOIN permission p ON ua.permission_id = p.id
        WHERE ua.guardian_id = $1
      `,
      values: [guardian_id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findByGuardianId:", error)
    throw error
  }
}

const searchByUsername = async (username) => {
  try {
    const query = {
      text: `
        SELECT ua.id, ua.username, ua.staff_id, ua.guardian_id, 
               ua.role_id, ua.permission_id, ua.is_active, ua.created_at,
               r.name as role_name, p.name as permission_name,
               CASE 
                 WHEN ua.staff_id IS NOT NULL THEN CONCAT(s.first_name, ' ', s.last_name)
                 WHEN ua.guardian_id IS NOT NULL THEN CONCAT(g.first_name, ' ', g.last_name)
                 ELSE NULL
               END as full_name
        FROM "user_account" ua
        LEFT JOIN role r ON ua.role_id = r.id
        LEFT JOIN permission p ON ua.permission_id = p.id
        LEFT JOIN staff s ON ua.staff_id = s.id
        LEFT JOIN guardian g ON ua.guardian_id = g.id
        WHERE ua.username ILIKE $1
        ORDER BY ua.id
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

export const UserModel = {
  create,
  findOneByUsername,
  findOneById,
  findAll,
  updatePassword,
  updateProfile,
  saveLoginToken,
  findUserByAccessToken,
  clearLoginTokens,
  setPasswordResetToken,
  findByPasswordResetToken,
  clearPasswordResetToken,
  setActive,
  remove,
  findByStaffId,
  findByGuardianId,
  searchByUsername,
}
