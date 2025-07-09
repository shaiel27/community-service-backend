import { db } from "../db/connection.database.js";

// Crear una nueva brigada
const create = async ({ name }) => {
  try {
    if (name && name.length > 100) {
      throw new Error(`El nombre de la brigada es demasiado largo (máximo 100 caracteres)`);
    }

    const query = {
      text: `INSERT INTO "brigade" (name, created_at, updated_at)
             VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
             RETURNING id, name, created_at, updated_at`,
      values: [name],
    };

    const { rows } = await db.query(query);
    return rows[0];
  } catch (error) {
    console.error("Error in create brigade:", error);
    throw error;
  }
};

// Obtener todas las brigadas
const findAll = async () => {
  try {
    const query = {
      text: `SELECT b.*, 
                p."name" as "encargado_name",
                p."lastName" as "encargado_lastName",
                p.ci as "encargado_ci",
                COUNT(DISTINCT s.id) as "studentCount"
             FROM "brigade" b
             LEFT JOIN "brigadeTeacherDate" bdf ON b.id = bdf."brigadeID"
             LEFT JOIN "personal" p ON bdf."personalID" = p.id
             LEFT JOIN "student" s ON s."brigadeTeacherDateID" = bdf.id 
             GROUP BY b.id, b.name, b.created_at, b.updated_at, 
                      p.name, p."lastName", p.ci
             ORDER BY b.name`,
    };

    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    console.error("Error in findAll brigades:", error);
    throw error;
  }
};

// Obtener brigada por ID
const findById = async (id) => {
  try {
    const query = {
      text: `SELECT b.*, 
                p.name as encargado_name,
                p."lastName" as encargado_lastName,
                p.ci as encargado_ci,
                p.email as encargado_email,
                p.telephone_number as encargado_phoneNumber,
                COUNT(DISTINCT s.id) as studentCount -- Alias corregido a camelCase
             FROM "brigade" b
             LEFT JOIN "brigadeTeacherDate" bdf ON b.id = bdf."brigadeID" -- Eliminado AND bdf."endDate" IS NULL
             LEFT JOIN "personal" p ON bdf."personalID" = p.id
             LEFT JOIN "student" s ON s."brigadeTeacherDateID" = bdf.id
             WHERE b.id = $1
             GROUP BY b.id, b.name, b.created_at, b.updated_at, 
                      p.name, p."lastName", p.ci, p.email, p.telephone_number -- Eliminado bdf."startDate"
             ORDER BY b.name`, // Añadido ORDER BY b.name para consistencia
      values: [id],
    };

    const { rows } = await db.query(query);
    return rows[0];
  } catch (error) {
    console.error("Error in findById brigade:", error);
    throw error;
  }
};

// Buscar brigadas por nombre
const searchByName = async (name) => {
  try {
    const query = {
      text: `SELECT b.*, 
                p.name as encargado_name,
                p."lastName" as encargado_lastName,
                p.ci as encargado_ci,
                COUNT(DISTINCT s.id) as studentCount -- Alias corregido a camelCase
             FROM "brigade" b
             LEFT JOIN "brigadeTeacherDate" bdf ON b.id = bdf."brigadeID" -- Eliminado AND bdf."endDate" IS NULL
             LEFT JOIN "personal" p ON bdf."personalID" = p.id
             LEFT JOIN "student" s ON s."brigadeTeacherDateID" = bdf.id
             WHERE b.name ILIKE $1
             GROUP BY b.id, b.name, b.created_at, b.updated_at, 
                      p.name, p."lastName", p.ci -- Eliminado bdf."startDate"
             ORDER BY b.name`,
      values: [`%${name}%`],
    };

    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    console.error("Error in searchByName brigades:", error);
    throw error;
  }
};

// Obtener estudiantes por brigada
const getStudentsByBrigade = async (brigadeId) => {
  try {
    const query = {
      text: `
        SELECT
          s.id,
          s.ci,
          s.name,
          s."lastName",
          s.sex,
          s.birthday,
          g.name as grade_name,
          sec.seccion as section_name,
          r.name as representative_name,
          r."lastName" as representative_lastName,
          r.ci as representative_ci
        FROM "student" s
        JOIN "enrollment" e ON s.id = e."studentID"
        JOIN "section" sec ON e."sectionID" = sec.id
        JOIN "grade" g ON sec."gradeID" = g.id
        LEFT JOIN "representative" r ON s."representativeID" = r.ci
        WHERE s."brigadeTeacherDateID" IN (
            SELECT bdf.id
            FROM "brigadeTeacherDate" bdf
            WHERE bdf."brigadeID" = $1 -- Eliminado AND bdf."endDate" IS NULL
        )
        ORDER BY s."lastName", s.name
      `,
      values: [brigadeId],
    };
    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    console.error("Error in getStudentsByBrigade:", error);
    throw error;
  }
};


// Verificar asignación activa de docente
const checkTeacherAssignment = async (personalId) => {
  try {
    const query = {
      text: `SELECT "brigadeID" FROM "brigadeTeacherDate"
             WHERE "personalID" = $1`, // Eliminado AND "endDate" IS NULL
      values: [personalId],
    };
    
    const { rows } = await db.query(query);
    return rows.length > 0 ? rows[0].brigadeID : null;
  } catch (error) {
    console.error("Error in checkTeacherAssignment:", error);
    throw error;
  }
};


// Asignar docente a brigada
const assignTeacherToBrigade = async (brigadeId, personalId) => {
  try {
    // Primero, verificar si el docente ya tiene una brigada activa
    const existingAssignment = await checkTeacherAssignment(personalId);
    if (existingAssignment) {
      throw new Error(`El docente ya está asignado a la brigada con ID: ${existingAssignment}.`);
    }

    // Insertar la nueva asignación
    const query = {
      text: `INSERT INTO "brigadeTeacherDate" ("brigadeID", "personalID", created_at, updated_at) -- Eliminado "startDate"
             VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
             RETURNING id, "brigadeID", "personalID"`, // Eliminado "startDate"
      values: [brigadeId, personalId],
    };
    const { rows } = await db.query(query);
    return rows[0];
  } catch (error) {
    console.error("Error in assignTeacherToBrigade:", error);
    throw error;
  }
};

// Finalizar asignación de docente
const endTeacherAssignment = async (brigadeId, personalId) => {
  try {
    const query = {
      text: `UPDATE "brigadeTeacherDate"
             SET updated_at = CURRENT_TIMESTAMP
             WHERE "brigadeID" = $1 AND "personalID" = $2
             RETURNING *`,
      values: [brigadeId, personalId],
    };
    const { rows } = await db.query(query);
    if (rows.length === 0) {
      throw new Error("No se encontró una asignación activa para finalizar con los IDs proporcionados.");
    }
    return rows[0];
  } catch (error) {
    console.error("Error in endTeacherAssignment:", error);
    throw error;
  }
};


// Actualizar una brigada
const update = async (id, { name }) => {
  try {
    if (name && name.length > 100) {
      throw new Error(`El nombre de la brigada es demasiado largo (máximo 100 caracteres)`);
    }

    const query = {
      text: `UPDATE "brigade" SET name = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING id, name, created_at, updated_at`,
      values: [name, id],
    };

    const { rows } = await db.query(query);
    return rows[0];
  } catch (error) {
    console.error("Error in update brigade:", error);
    throw error;
  }
};

// Eliminar una brigada
const remove = async (id) => {
  try {
    const query = {
      text: `DELETE FROM "brigade" WHERE id = $1 RETURNING id`,
      values: [id],
    };

    const { rows } = await db.query(query);
    return rows[0];
  } catch (error) {
    console.error("Error in delete brigade:", error);
    throw error;
  }
};

export const BrigadaModel = {
  create,
  findAll,
  findById,
  searchByName,
  getStudentsByBrigade,
  assignTeacherToBrigade,
  endTeacherAssignment,
  update,
  remove,
};