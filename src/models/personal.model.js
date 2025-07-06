import { db } from "../db/connection.database.js";

<<<<<<< HEAD
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
=======
const create = async ({
  nombre,
  apellido,
  idrole,
  telefono,
  cedula,
  email,
  birthday,
  direccion,
  parroquia_id,
}) => {
  try {
    // Validaciones de longitud antes de insertar
    if (nombre && nombre.length > 30) {
      throw new Error(
        `El nombre es demasiado largo (máximo 30 caracteres, actual: ${nombre.length})`
      );
    }
    if (apellido && apellido.length > 30) {
      throw new Error(
        `El apellido es demasiado largo (máximo 30 caracteres, actual: ${apellido.length})`
      );
    }
    if (telefono && telefono.length > 30) {
      throw new Error(
        `El teléfono es demasiado largo (máximo 30 caracteres, actual: ${telefono.length})`
      );
    }
    if (cedula && cedula.length > 30) {
      throw new Error(
        `La cédula es demasiado larga (máximo 30 caracteres, actual: ${cedula.length})`
      );
    }
    if (email && email.length > 50) {
      throw new Error(
        `El email es demasiado largo (máximo 50 caracteres, actual: ${email.length})`
      );
    }
    if (direccion && direccion.length > 100) {
      throw new Error(
        `La dirección es demasiado larga (máximo 100 caracteres, actual: ${direccion.length})`
      );
>>>>>>> 24a998aba6d94a101e81893a7e0fd5a7139b67fa
    }

    const query = {
      text: `
        INSERT INTO "personal" (
<<<<<<< HEAD
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
=======
          nombre, lastname, idrole, telephonenomber, ci, email, birthday,
          direccion, parroquia_id, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, nombre, lastname as apellido, idrole, telephonenomber as telefono, ci as cedula, email, birthday, direccion, parroquia_id, created_at
      `,
      values: [
        nombre,
        apellido,
        idrole,
        telefono,
        cedula,
        email,
        birthday,
        direccion,
        parroquia_id,
      ],
    };
    const { rows } = await db.query(query);
    return rows[0];
>>>>>>> 24a998aba6d94a101e81893a7e0fd5a7139b67fa
  } catch (error) {
    console.error("Error in create personal:", error);
    throw error;
  }
<<<<<<< HEAD
}
=======
};

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
    };
    const { rows } = await db.query(query);
    return rows[0];
  } catch (error) {
    console.error("Error in findOneById personal:", error);
    throw error;
  }
};

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
    };
    const { rows } = await db.query(query);
    return rows[0];
  } catch (error) {
    console.error("Error in findOneByCedula personal:", error);
    throw error;
  }
};

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
    };
    const { rows } = await db.query(query);
    return rows[0];
  } catch (error) {
    console.error("Error in findOneByEmail personal:", error);
    throw error;
  }
};
>>>>>>> 24a998aba6d94a101e81893a7e0fd5a7139b67fa

/**
 * Obtener todo el personal con información de rol y parroquia
 * @returns {Array} - Lista de personal
 */
const findAll = async () => {
  try {
    const query = {
      text: `
<<<<<<< HEAD
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
=======
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
    };
    const { rows } = await db.query(query);
    return rows;
>>>>>>> 24a998aba6d94a101e81893a7e0fd5a7139b67fa
  } catch (error) {
    console.error("Error in findAll personal:", error);
    throw error;
  }
};

<<<<<<< HEAD
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
=======
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
    };
    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    console.error("Error in findByRole personal:", error);
    throw error;
>>>>>>> 24a998aba6d94a101e81893a7e0fd5a7139b67fa
  }
};

/**
 * Buscar personal por cédula
 * @param {string} cedula - Cédula del personal
 * @returns {Object} - Personal encontrado
 */
const findByCedula = async (cedula) => {
  try {
    const query = {
      text: `
<<<<<<< HEAD
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
=======
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
    };
    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    console.error("Error in findTeachers personal:", error);
    throw error;
>>>>>>> 24a998aba6d94a101e81893a7e0fd5a7139b67fa
  }
};

/**
 * Buscar personal por nombre
 * @param {string} nombre - Nombre a buscar
 * @returns {Array} - Lista de personal que coincide
 */
const findByNombre = async (nombre) => {
  try {
    const query = {
      text: `
<<<<<<< HEAD
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
=======
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
    };
    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    console.error("Error in findAdministrators personal:", error);
    throw error;
>>>>>>> 24a998aba6d94a101e81893a7e0fd5a7139b67fa
  }
};

/**
 * Obtener personal por rol
 * @param {number} roleId - ID del rol
 * @returns {Array} - Lista de personal del rol
 */
const findByRol = async (roleId) => {
  try {
    const query = {
      text: `
<<<<<<< HEAD
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
=======
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
    };
    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    console.error("Error in findMaintenance personal:", error);
    throw error;
>>>>>>> 24a998aba6d94a101e81893a7e0fd5a7139b67fa
  }
};

/**
 * Obtener solo docentes (rol ID = 2)
 * @returns {Array} - Lista de docentes
 */
const findDocentes = async () => {
  try {
    const query = {
      text: `
<<<<<<< HEAD
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
=======
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
    };
    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    console.error("Error in findWithoutSystemAccess personal:", error);
    throw error;
>>>>>>> 24a998aba6d94a101e81893a7e0fd5a7139b67fa
  }
};

/**
 * Obtener solo administradores (rol ID = 3)
 * @returns {Array} - Lista de administradores
 */
const findAdministradores = async () => {
  try {
    const query = {
      text: `
<<<<<<< HEAD
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
=======
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
    };
    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    console.error("Error in findWithSystemAccess personal:", error);
    throw error;
>>>>>>> 24a998aba6d94a101e81893a7e0fd5a7139b67fa
  }
};

<<<<<<< HEAD
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
=======
const update = async (
  id,
  {
    nombre,
    apellido,
    idrole,
    telefono,
    email,
    birthday,
    direccion,
    parroquia_id,
  }
) => {
  try {
    // Validaciones de longitud antes de actualizar
    if (nombre && nombre.length > 30) {
      throw new Error(
        `El nombre es demasiado largo (máximo 30 caracteres, actual: ${nombre.length})`
      );
    }
    if (apellido && apellido.length > 30) {
      throw new Error(
        `El apellido es demasiado largo (máximo 30 caracteres, actual: ${apellido.length})`
      );
    }
    if (telefono && telefono.length > 30) {
      throw new Error(
        `El teléfono es demasiado largo (máximo 30 caracteres, actual: ${telefono.length})`
      );
    }
    if (email && email.length > 50) {
      throw new Error(
        `El email es demasiado largo (máximo 50 caracteres, actual: ${email.length})`
      );
    }
    if (direccion && direccion.length > 100) {
      throw new Error(
        `La dirección es demasiado larga (máximo 100 caracteres, actual: ${direccion.length})`
      );
>>>>>>> 24a998aba6d94a101e81893a7e0fd5a7139b67fa
    }

    fields.push(`fecha_actualizacion = CURRENT_TIMESTAMP`)
    values.push(id)

    const query = {
      text: `
<<<<<<< HEAD
        UPDATE "personal" 
        SET ${fields.join(", ")}
        WHERE id = $${paramCount}
        RETURNING *
      `,
      values: values,
    }

    const { rows } = await db.query(query)
    return rows[0]
=======
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
      values: [
        nombre,
        apellido,
        idrole,
        telefono,
        email,
        birthday,
        direccion,
        parroquia_id,
        id,
      ],
    };
    const { rows } = await db.query(query);
    return rows[0];
>>>>>>> 24a998aba6d94a101e81893a7e0fd5a7139b67fa
  } catch (error) {
    console.error("Error in update personal:", error);
    throw error;
  }
};

/**
 * Eliminar personal
 * @param {number} id - ID del personal
 * @returns {Object} - Personal eliminado
 */
const remove = async (id) => {
  try {
<<<<<<< HEAD
    const query = {
      text: 'DELETE FROM "personal" WHERE id = $1 RETURNING *',
      values: [id],
    }

    const { rows } = await db.query(query)
    return rows[0]
=======
    // First check if the personal has a user account
    const checkUserQuery = {
      text: `SELECT COUNT(*) FROM usuario WHERE personal_id = $1`,
      values: [id],
    };
    const checkUserResult = await db.query(checkUserQuery);
    if (Number.parseInt(checkUserResult.rows[0].count) > 0) {
      throw new Error(
        "Cannot delete personal who has a user account. Delete the user account first."
      );
    }

    const query = {
      text: 'DELETE FROM "personal" WHERE id = $1 RETURNING id',
      values: [id],
    };
    const { rows } = await db.query(query);
    return rows[0];
>>>>>>> 24a998aba6d94a101e81893a7e0fd5a7139b67fa
  } catch (error) {
    console.error("Error in remove personal:", error);
    throw error;
  }
};

<<<<<<< HEAD
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
=======
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
    };
    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    console.error("Error in searchByName personal:", error);
    throw error;
  }
};

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
    };
    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    console.error("Error in searchByCedula personal:", error);
    throw error;
  }
};

const getRoles = async () => {
  try {
    const query = {
      text: `
        SELECT id, name as nombre, description as descripcion
        FROM "rol"
        ORDER BY id
      `,
    };
    const { rows } = await db.query(query);
    return rows;
>>>>>>> 24a998aba6d94a101e81893a7e0fd5a7139b67fa
  } catch (error) {
    console.error("Error in getRoles:", error);
    throw error;
  }
};

<<<<<<< HEAD
/**
 * Obtener todas las parroquias disponibles
 * @returns {Array} - Lista de parroquias
 */
=======
>>>>>>> 24a998aba6d94a101e81893a7e0fd5a7139b67fa
const getParroquias = async () => {
  try {
    const query = {
      text: `
<<<<<<< HEAD
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
=======
        SELECT id, nombre
        FROM "parroquia"
        ORDER BY nombre
      `,
    };
    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    console.error("Error in getParroquias:", error);
    throw error;
>>>>>>> 24a998aba6d94a101e81893a7e0fd5a7139b67fa
  }
};

export const PersonalModel = {
  create,
<<<<<<< HEAD
=======
  findOneById,
  findOneByCedula,
  findOneByEmail,
>>>>>>> 24a998aba6d94a101e81893a7e0fd5a7139b67fa
  findAll,
  findById,
  findByCedula,
  findByNombre,
  findByRol,
  findDocentes,
  findAdministradores,
  update,
  remove,
<<<<<<< HEAD
  getRoles,
  getParroquias,
}
=======
  searchByName,
  searchByCedula,
  getRoles,
  getParroquias,
};
>>>>>>> 24a998aba6d94a101e81893a7e0fd5a7139b67fa
