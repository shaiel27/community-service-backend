import { db } from "../db/connection.database.js"

const create = async ({ name, lastName, idRole, telephoneNumber, ci, email, birthday, direction, parishID }) => {
  try {
    // Validaciones de longitud antes de insertar
    if (name && name.length > 100) {
      throw new Error(`El nombre es demasiado largo (máximo 100 caracteres, actual: ${name.length})`)
    }
    if (lastName && lastName.length > 100) {
      throw new Error(`El apellido es demasiado largo (máximo 100 caracteres, actual: ${lastName.length})`)
    }
    if (telephoneNumber && telephoneNumber.length > 20) {
      throw new Error(`El teléfono es demasiado largo (máximo 20 caracteres, actual: ${telephoneNumber.length})`)
    }
    if (ci && ci.length > 20) {
      throw new Error(`La cédula es demasiado larga (máximo 20 caracteres, actual: ${ci.length})`)
    }
    if (email && email.length > 100) {
      throw new Error(`El email es demasiado largo (máximo 100 caracteres, actual: ${email.length})`)
    }
    if (direction && direction.length > 30) {
      throw new Error(`La dirección es demasiado larga (máximo 30 caracteres, actual: ${direction.length})`)
    }

    const query = {
      text: `
        INSERT INTO "personal" (
          ci, name, "lastName", "idRole", "telephoneNumber", email, birthday,
          direction, parish, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, ci, name, "lastName", "idRole", "telephoneNumber", email, birthday, direction, parish, created_at
      `,
      values: [ci, name, lastName, idRole, telephoneNumber, email, birthday, direction, parishID],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in create personal:", error)
    throw error
  }
}

const findOneById = async (id) => {
  try {
    const query = {
      text: `
        SELECT p.id, p.ci, p.name, p."lastName", p."idRole", p."telephoneNumber", 
               p.email, p.birthday, p.direction, p.parish, p.created_at, p.updated_at,
               r.name as rol_nombre, r.description as rol_descripcion,
               par.name as parroquia_nombre
        FROM "personal" p
        LEFT JOIN rol r ON p."idRole" = r.id
        LEFT JOIN parish par ON p.parish = par.id
        WHERE p.id = $1
      `,
      values: [id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findOneById personal:", error)
    throw error
  }
}

const findAllPersonal = async () => {
  try {
    const query = {
      text: `
        SELECT p.id, p.ci, p.name, p."lastName", p."telephoneNumber", p.email,
               r.name as rol_nombre,
               par.name as parroquia_nombre
        FROM "personal" p
        LEFT JOIN rol r ON p."idRole" = r.id
        LEFT JOIN parish par ON p.parish = par.id
        ORDER BY p.name, p."lastName"
      `,
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findAllPersonal:", error)
    throw error
  }
}

const findByRoleId = async (roleId) => {
  try {
    const query = {
      text: `
        SELECT p.id, p.ci, p.name, p."lastName", p."telephoneNumber", p.email,
               r.name as rol_nombre,
               par.name as parroquia_nombre
        FROM "personal" p
        LEFT JOIN rol r ON p."idRole" = r.id
        LEFT JOIN parish par ON p.parish = par.id
        WHERE p."idRole" = $1
        ORDER BY p.name, p."lastName"
      `,
      values: [roleId],
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findByRoleId personal:", error)
    throw error
  }
}

const findOneByCi = async (ci) => {
  try {
    const query = {
      text: `
        SELECT p.id, p.ci, p.name, p."lastName", p."idRole", p."telephoneNumber", 
               p.email, p.birthday, p.direction, p.parish,
               r.name as rol_nombre, r.description as rol_descripcion,
               par.name as parroquia_nombre
        FROM "personal" p
        LEFT JOIN rol r ON p."idRole" = r.id
        LEFT JOIN parish par ON p.parish = par.id
        WHERE p.ci = $1
      `,
      values: [ci],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findOneByCi personal:", error)
    throw error
  }
}

const findOneByEmail = async (email) => {
  try {
    const query = {
      text: `
        SELECT p.id, p.ci, p.name, p."lastName", p."idRole", p."telephoneNumber", 
               p.email, p.birthday, p.direction, p.parish,
               r.name as rol_nombre, r.description as rol_descripcion,
               par.name as parroquia_nombre
        FROM "personal" p
        LEFT JOIN rol r ON p."idRole" = r.id
        LEFT JOIN parish par ON p.parish = par.id
        WHERE p.email = $1
      `,
      values: [email],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findOneByEmail personal:", error)
    throw error
  }
}

const findAll = async () => {
  try {
    const query = {
      text: `
        SELECT p.id, p.ci, p.name, p."lastName", p."idRole", p."telephoneNumber", 
               p.email, p.birthday, p.direction, p.parish, p.created_at,
               r.name as rol_nombre, r.description as rol_descripcion,
               par.name as parroquia_nombre,
               CASE 
                 WHEN u.id IS NOT NULL THEN true
                 ELSE false
               END as tiene_usuario_sistema
        FROM "personal" p
        LEFT JOIN rol r ON p."idRole" = r.id
        LEFT JOIN parish par ON p.parish = par.id
        LEFT JOIN usuario u ON p.id = u.personal_id
        ORDER BY p.id
      `,
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findAll personal:", error)
    throw error
  }
}

const findByRole = async (idRole) => {
  try {
    const query = {
      text: `
        SELECT p.id, p.ci, p.name, p."lastName", p."idRole", p."telephoneNumber", 
               p.email, p.birthday, p.direction, p.parish,
               r.name as rol_nombre, r.description as rol_descripcion,
               par.name as parroquia_nombre,
               CASE 
                 WHEN u.id IS NOT NULL THEN true
                 ELSE false
               END as tiene_usuario_sistema
        FROM "personal" p
        LEFT JOIN rol r ON p."idRole" = r.id
        LEFT JOIN parish par ON p.parish = par.id
        LEFT JOIN usuario u ON p.id = u.personal_id
        WHERE p."idRole" = $1
        ORDER BY p.id
      `,
      values: [idRole],
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findByRole personal:", error)
    throw error
  }
}

const findTeachers = async () => {
  try {
    const query = {
      text: `
        SELECT p.id, p.ci, p.name, p."lastName", p."idRole", p."telephoneNumber", 
               p.email, p.birthday, p.direction, p.parish,
               r.name as rol_nombre, r.description as rol_descripcion,
               par.name as parroquia_nombre,
               CASE 
                 WHEN u.id IS NOT NULL THEN true
                 ELSE false
               END as tiene_usuario_sistema
        FROM "personal" p
        LEFT JOIN rol r ON p."idRole" = r.id
        LEFT JOIN parish par ON p.parish = par.id
        LEFT JOIN usuario u ON p.id = u.personal_id
        WHERE p."idRole" = 1
        ORDER BY p.id
      `,
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findTeachers personal:", error)
    throw error
  }
}

const findAdministrators = async () => {
  try {
    const query = {
      text: `
        SELECT p.id, p.ci, p.name, p."lastName", p."idRole", p."telephoneNumber", 
               p.email, p.birthday, p.direction, p.parish,
               r.name as rol_nombre, r.description as rol_descripcion,
               par.name as parroquia_nombre,
               CASE 
                 WHEN u.id IS NOT NULL THEN true
                 ELSE false
               END as tiene_usuario_sistema
        FROM "personal" p
        LEFT JOIN rol r ON p."idRole" = r.id
        LEFT JOIN parish par ON p.parish = par.id
        LEFT JOIN usuario u ON p.id = u.personal_id
        WHERE p."idRole" = 2
        ORDER BY p.id
      `,
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findAdministrators personal:", error)
    throw error
  }
}

const findMaintenance = async () => {
  try {
    const query = {
      text: `
        SELECT p.id, p.ci, p.name, p."lastName", p."idRole", p."telephoneNumber", 
               p.email, p.birthday, p.direction, p.parish,
               r.name as rol_nombre, r.description as rol_descripcion,
               par.name as parroquia_nombre,
               CASE 
                 WHEN u.id IS NOT NULL THEN true
                 ELSE false
               END as tiene_usuario_sistema
        FROM "personal" p
        LEFT JOIN rol r ON p."idRole" = r.id
        LEFT JOIN parish par ON p.parish = par.id
        LEFT JOIN usuario u ON p.id = u.personal_id
        WHERE p."idRole" = 3
        ORDER BY p.id
      `,
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findMaintenance personal:", error)
    throw error
  }
}

const findWithoutSystemAccess = async () => {
  try {
    const query = {
      text: `
        SELECT p.id, p.ci, p.name, p."lastName", p."idRole", p."telephoneNumber", 
               p.email, p.birthday, p.direction, p.parish,
               r.name as rol_nombre, r.description as rol_descripcion,
               par.name as parroquia_nombre
        FROM "personal" p
        LEFT JOIN rol r ON p."idRole" = r.id
        LEFT JOIN parish par ON p.parish = par.id
        LEFT JOIN usuario u ON p.id = u.personal_id
        WHERE u.id IS NULL
        ORDER BY p.id
      `,
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findWithoutSystemAccess personal:", error)
    throw error
  }
}

const findWithSystemAccess = async () => {
  try {
    const query = {
      text: `
        SELECT p.id, p.ci, p.name, p."lastName", p."idRole", p."telephoneNumber", 
               p.email, p.birthday, p.direction, p.parish,
               r.name as rol_nombre, r.description as rol_descripcion,
               par.name as parroquia_nombre,
               u.username, u.email as usuario_email, u.is_active as usuario_activo
        FROM "personal" p
        LEFT JOIN rol r ON p."idRole" = r.id
        LEFT JOIN parish par ON p.parish = par.id
        INNER JOIN usuario u ON p.id = u.personal_id
        ORDER BY p.id
      `,
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findWithSystemAccess personal:", error)
    throw error
  }
}

const update = async (id, { name, lastName, idRole, telephoneNumber, email, birthday, direction, parishID }) => {
  try {
    // Validaciones de longitud antes de actualizar
    if (name && name.length > 100) {
      throw new Error(`El nombre es demasiado largo (máximo 100 caracteres, actual: ${name.length})`)
    }
    if (lastName && lastName.length > 100) {
      throw new Error(`El apellido es demasiado largo (máximo 100 caracteres, actual: ${lastName.length})`)
    }
    if (telephoneNumber && telephoneNumber.length > 20) {
      throw new Error(`El teléfono es demasiado largo (máximo 20 caracteres, actual: ${telephoneNumber.length})`)
    }
    if (email && email.length > 100) {
      throw new Error(`El email es demasiado largo (máximo 100 caracteres, actual: ${email.length})`)
    }
    if (direction && direction.length > 30) {
      throw new Error(`La dirección es demasiado larga (máximo 30 caracteres, actual: ${direction.length})`)
    }

    const query = {
      text: `
        UPDATE "personal"
        SET name = COALESCE($1, name),
            "lastName" = COALESCE($2, "lastName"),
            "idRole" = COALESCE($3, "idRole"),
            "telephoneNumber" = COALESCE($4, "telephoneNumber"),
            email = COALESCE($5, email),
            birthday = COALESCE($6, birthday),
            direction = COALESCE($7, direction),
            parish = COALESCE($8, parish),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $9
        RETURNING id, ci, name, "lastName", "idRole", "telephoneNumber", email, birthday, direction, parish
      `,
      values: [name, lastName, idRole, telephoneNumber, email, birthday, direction, parishID, id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in update personal:", error)
    throw error
  }
}

const remove = async (id) => {
  try {
    // First check if the personal has a user account
    const checkUserQuery = {
      text: `SELECT COUNT(*) FROM usuario WHERE personal_id = $1`,
      values: [id],
    }
    const checkUserResult = await db.query(checkUserQuery)
    if (Number.parseInt(checkUserResult.rows[0].count) > 0) {
      throw new Error("Cannot delete personal who has a user account. Delete the user account first.")
    }

    const query = {
      text: 'DELETE FROM "personal" WHERE id = $1 RETURNING id',
      values: [id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in remove personal:", error)
    throw error
  }
}

const searchByName = async (name) => {
  try {
    const query = {
      text: `
        SELECT p.id, p.ci, p.name, p."lastName", p."idRole", p."telephoneNumber", 
               p.email, p.birthday, p.direction, p.parish,
               r.name as rol_nombre, r.description as rol_descripcion,
               par.name as parroquia_nombre,
               CASE 
                 WHEN u.id IS NOT NULL THEN true
                 ELSE false
               END as tiene_usuario_sistema
        FROM "personal" p
        LEFT JOIN rol r ON p."idRole" = r.id
        LEFT JOIN parish par ON p.parish = par.id
        LEFT JOIN usuario u ON p.id = u.personal_id
        WHERE p.name ILIKE $1 OR p."lastName" ILIKE $1
        ORDER BY p.id
      `,
      values: [`%${name}%`],
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in searchByName personal:", error)
    throw error
  }
}

const searchByCi = async (ci) => {
  try {
    const query = {
      text: `
        SELECT p.id, p.ci, p.name, p."lastName", p."idRole", p."telephoneNumber", 
               p.email, p.birthday, p.direction, p.parish,
               r.name as rol_nombre, r.description as rol_descripcion,
               par.name as parroquia_nombre,
               CASE 
                 WHEN u.id IS NOT NULL THEN true
                 ELSE false
               END as tiene_usuario_sistema
        FROM "personal" p
        LEFT JOIN rol r ON p."idRole" = r.id
        LEFT JOIN parish par ON p.parish = par.id
        LEFT JOIN usuario u ON p.id = u.personal_id
        WHERE p.ci ILIKE $1
        ORDER BY p.id
      `,
      values: [`%${ci}%`],
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in searchByCi personal:", error)
    throw error
  }
}

const getRoles = async () => {
  try {
    const query = {
      text: `
        SELECT id, name as nombre, description as descripcion
        FROM "rol"
        ORDER BY id
      `,
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getRoles:", error)
    throw error
  }
}

const getParishes = async () => {
  try {
    const query = {
      text: `
        SELECT id, name as nombre
        FROM "parish"
        ORDER BY name
      `,
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getParishes:", error)
    throw error
  }
}

export const PersonalModel = {
  create,
  findOneById,
  findOneByCi,
  findOneByEmail,
  findAll,
  findByRole,
  findTeachers,
  findAdministrators,
  findMaintenance,
  findWithoutSystemAccess,
  findWithSystemAccess,
  update,
  remove,
  searchByName,
  searchByCi,
  getRoles,
  getParishes,
  findAllPersonal,
  findByRoleId,
}
