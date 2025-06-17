import { db } from "../db/connection.database.js"

const create = async ({ nombre, apellido, idrole, telefono, cedula, email, birthday, direccion, parroquia_id }) => {
  try {
    // Validaciones de longitud antes de insertar
    if (nombre && nombre.length > 30) {
      throw new Error(`El nombre es demasiado largo (máximo 30 caracteres, actual: ${nombre.length})`)
    }
    if (apellido && apellido.length > 30) {
      throw new Error(`El apellido es demasiado largo (máximo 30 caracteres, actual: ${apellido.length})`)
    }
    if (telefono && telefono.length > 30) {
      throw new Error(`El teléfono es demasiado largo (máximo 30 caracteres, actual: ${telefono.length})`)
    }
    if (cedula && cedula.length > 30) {
      throw new Error(`La cédula es demasiado larga (máximo 30 caracteres, actual: ${cedula.length})`)
    }
    if (email && email.length > 50) {
      throw new Error(`El email es demasiado largo (máximo 50 caracteres, actual: ${email.length})`)
    }
    if (direccion && direccion.length > 100) {
      throw new Error(`La dirección es demasiado larga (máximo 100 caracteres, actual: ${direccion.length})`)
    }

    const query = {
      text: `
        INSERT INTO "personal" (
          nombre, lastname, idrole, telephonenomber, ci, email, birthday,
          direccion, parroquia_id, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, nombre, lastname as apellido, idrole, telephonenomber as telefono, ci as cedula, email, birthday, direccion, parroquia_id, created_at
      `,
      values: [nombre, apellido, idrole, telefono, cedula, email, birthday, direccion, parroquia_id],
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
        SELECT p.id, p.nombre, p.lastname as apellido, p.idrole, p.telephonenomber as telefono, 
               p.ci as cedula, p.email, p.birthday, p.direccion, p.parroquia_id, p.created_at, p.updated_at,
               r.name as rol_nombre, r.description as rol_descripcion,
               par.nombre as parroquia_nombre
        FROM "personal" p
        LEFT JOIN rol r ON p.idrole = r.id
        LEFT JOIN parroquia par ON p.parroquia_id = par.id
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

const findOneByCedula = async (cedula) => {
  try {
    const query = {
      text: `
        SELECT p.id, p.nombre, p.lastname as apellido, p.idrole, p.telephonenomber as telefono, 
               p.ci as cedula, p.email, p.birthday, p.direccion, p.parroquia_id,
               r.name as rol_nombre, r.description as rol_descripcion,
               par.nombre as parroquia_nombre
        FROM "personal" p
        LEFT JOIN rol r ON p.idrole = r.id
        LEFT JOIN parroquia par ON p.parroquia_id = par.id
        WHERE p.ci = $1
      `,
      values: [cedula],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findOneByCedula personal:", error)
    throw error
  }
}

const findOneByEmail = async (email) => {
  try {
    const query = {
      text: `
        SELECT p.id, p.nombre, p.lastname as apellido, p.idrole, p.telephonenomber as telefono, 
               p.ci as cedula, p.email, p.birthday, p.direccion, p.parroquia_id,
               r.name as rol_nombre, r.description as rol_descripcion,
               par.nombre as parroquia_nombre
        FROM "personal" p
        LEFT JOIN rol r ON p.idrole = r.id
        LEFT JOIN parroquia par ON p.parroquia_id = par.id
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
        SELECT p.id, p.nombre, p.lastname as apellido, p.idrole, p.telephonenomber as telefono, 
               p.ci as cedula, p.email, p.birthday, p.direccion, p.parroquia_id, p.created_at,
               r.name as rol_nombre, r.description as rol_descripcion,
               par.nombre as parroquia_nombre,
               CASE 
                 WHEN u.id IS NOT NULL THEN true
                 ELSE false
               END as tiene_usuario_sistema
        FROM "personal" p
        LEFT JOIN rol r ON p.idrole = r.id
        LEFT JOIN parroquia par ON p.parroquia_id = par.id
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

const findByRole = async (idrole) => {
  try {
    const query = {
      text: `
        SELECT p.id, p.nombre, p.lastname as apellido, p.idrole, p.telephonenomber as telefono, 
               p.ci as cedula, p.email, p.birthday, p.direccion, p.parroquia_id,
               r.name as rol_nombre, r.description as rol_descripcion,
               par.nombre as parroquia_nombre,
               CASE 
                 WHEN u.id IS NOT NULL THEN true
                 ELSE false
               END as tiene_usuario_sistema
        FROM "personal" p
        LEFT JOIN rol r ON p.idrole = r.id
        LEFT JOIN parroquia par ON p.parroquia_id = par.id
        LEFT JOIN usuario u ON p.id = u.personal_id
        WHERE p.idrole = $1
        ORDER BY p.id
      `,
      values: [idrole],
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
        SELECT p.id, p.nombre, p.lastname as apellido, p.idrole, p.telephonenomber as telefono, 
               p.ci as cedula, p.email, p.birthday, p.direccion, p.parroquia_id,
               r.name as rol_nombre, r.description as rol_descripcion,
               par.nombre as parroquia_nombre,
               CASE 
                 WHEN u.id IS NOT NULL THEN true
                 ELSE false
               END as tiene_usuario_sistema
        FROM "personal" p
        LEFT JOIN rol r ON p.idrole = r.id
        LEFT JOIN parroquia par ON p.parroquia_id = par.id
        LEFT JOIN usuario u ON p.id = u.personal_id
        WHERE p.idrole = 1
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
        SELECT p.id, p.nombre, p.lastname as apellido, p.idrole, p.telephonenomber as telefono, 
               p.ci as cedula, p.email, p.birthday, p.direccion, p.parroquia_id,
               r.name as rol_nombre, r.description as rol_descripcion,
               par.nombre as parroquia_nombre,
               CASE 
                 WHEN u.id IS NOT NULL THEN true
                 ELSE false
               END as tiene_usuario_sistema
        FROM "personal" p
        LEFT JOIN rol r ON p.idrole = r.id
        LEFT JOIN parroquia par ON p.parroquia_id = par.id
        LEFT JOIN usuario u ON p.id = u.personal_id
        WHERE p.idrole = 2
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
        SELECT p.id, p.nombre, p.lastname as apellido, p.idrole, p.telephonenomber as telefono, 
               p.ci as cedula, p.email, p.birthday, p.direccion, p.parroquia_id,
               r.name as rol_nombre, r.description as rol_descripcion,
               par.nombre as parroquia_nombre,
               CASE 
                 WHEN u.id IS NOT NULL THEN true
                 ELSE false
               END as tiene_usuario_sistema
        FROM "personal" p
        LEFT JOIN rol r ON p.idrole = r.id
        LEFT JOIN parroquia par ON p.parroquia_id = par.id
        LEFT JOIN usuario u ON p.id = u.personal_id
        WHERE p.idrole = 3
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
        SELECT p.id, p.nombre, p.lastname as apellido, p.idrole, p.telephonenomber as telefono, 
               p.ci as cedula, p.email, p.birthday, p.direccion, p.parroquia_id,
               r.name as rol_nombre, r.description as rol_descripcion,
               par.nombre as parroquia_nombre
        FROM "personal" p
        LEFT JOIN rol r ON p.idrole = r.id
        LEFT JOIN parroquia par ON p.parroquia_id = par.id
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
        SELECT p.id, p.nombre, p.lastname as apellido, p.idrole, p.telephonenomber as telefono, 
               p.ci as cedula, p.email, p.birthday, p.direccion, p.parroquia_id,
               r.name as rol_nombre, r.description as rol_descripcion,
               par.nombre as parroquia_nombre,
               u.username, u.email as usuario_email, u.is_active as usuario_activo
        FROM "personal" p
        LEFT JOIN rol r ON p.idrole = r.id
        LEFT JOIN parroquia par ON p.parroquia_id = par.id
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

const update = async (id, { nombre, apellido, idrole, telefono, email, birthday, direccion, parroquia_id }) => {
  try {
    // Validaciones de longitud antes de actualizar
    if (nombre && nombre.length > 30) {
      throw new Error(`El nombre es demasiado largo (máximo 30 caracteres, actual: ${nombre.length})`)
    }
    if (apellido && apellido.length > 30) {
      throw new Error(`El apellido es demasiado largo (máximo 30 caracteres, actual: ${apellido.length})`)
    }
    if (telefono && telefono.length > 30) {
      throw new Error(`El teléfono es demasiado largo (máximo 30 caracteres, actual: ${telefono.length})`)
    }
    if (email && email.length > 50) {
      throw new Error(`El email es demasiado largo (máximo 50 caracteres, actual: ${email.length})`)
    }
    if (direccion && direccion.length > 100) {
      throw new Error(`La dirección es demasiado larga (máximo 100 caracteres, actual: ${direccion.length})`)
    }

    const query = {
      text: `
        UPDATE "personal"
        SET nombre = COALESCE($1, nombre),
            lastname = COALESCE($2, lastname),
            idrole = COALESCE($3, idrole),
            telephonenomber = COALESCE($4, telephonenomber),
            email = COALESCE($5, email),
            birthday = COALESCE($6, birthday),
            direccion = COALESCE($7, direccion),
            parroquia_id = COALESCE($8, parroquia_id),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $9
        RETURNING id, nombre, lastname as apellido, idrole, telephonenomber as telefono, ci as cedula, email, birthday, direccion, parroquia_id
      `,
      values: [nombre, apellido, idrole, telefono, email, birthday, direccion, parroquia_id, id],
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
        SELECT p.id, p.nombre, p.lastname as apellido, p.idrole, p.telephonenomber as telefono, 
               p.ci as cedula, p.email, p.birthday, p.direccion, p.parroquia_id,
               r.name as rol_nombre, r.description as rol_descripcion,
               par.nombre as parroquia_nombre,
               CASE 
                 WHEN u.id IS NOT NULL THEN true
                 ELSE false
               END as tiene_usuario_sistema
        FROM "personal" p
        LEFT JOIN rol r ON p.idrole = r.id
        LEFT JOIN parroquia par ON p.parroquia_id = par.id
        LEFT JOIN usuario u ON p.id = u.personal_id
        WHERE p.nombre ILIKE $1 OR p.lastname ILIKE $1
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

const searchByCedula = async (cedula) => {
  try {
    const query = {
      text: `
        SELECT p.id, p.nombre, p.lastname as apellido, p.idrole, p.telephonenomber as telefono, 
               p.ci as cedula, p.email, p.birthday, p.direccion, p.parroquia_id,
               r.name as rol_nombre, r.description as rol_descripcion,
               par.nombre as parroquia_nombre,
               CASE 
                 WHEN u.id IS NOT NULL THEN true
                 ELSE false
               END as tiene_usuario_sistema
        FROM "personal" p
        LEFT JOIN rol r ON p.idrole = r.id
        LEFT JOIN parroquia par ON p.parroquia_id = par.id
        LEFT JOIN usuario u ON p.id = u.personal_id
        WHERE p.ci ILIKE $1
        ORDER BY p.id
      `,
      values: [`%${cedula}%`],
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in searchByCedula personal:", error)
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

const getParroquias = async () => {
  try {
    const query = {
      text: `
        SELECT id, nombre
        FROM "parroquia"
        ORDER BY nombre
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
  findOneById,
  findOneByCedula,
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
  searchByCedula,
  getRoles,
  getParroquias,
}
