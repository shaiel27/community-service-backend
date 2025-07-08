import { db } from "../db/connection.database.js";

// Crear una nueva brigada
const create = async ({ name }) => {
  try {
    if (name && name.length > 100) {
      throw new Error(`El nombre de la brigada es demasiado largo (máximo 100 caracteres)`);
    }

    const query = {
      text: `INSERT INTO "brigada" (name, created_at, updated_at)
             VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
             RETURNING id, name, created_at, updated_at`,
      values: [name],
    };

    const { rows } = await db.query(query);
    return rows[0];
  } catch (error) {
    console.error("Error in create brigada:", error);
    throw error;
  }
};

// Obtener todas las brigadas
const findAll = async () => {
  try {
    const query = {
      text: `SELECT b.*, 
                p.name as encargado_name,
                p."lastName" as encargado_lastName,
                p.ci as encargado_ci,
                bdf.start_date as assignment_date,
                COUNT(DISTINCT s.id) as student_count
             FROM "brigada" b
             LEFT JOIN "brigada_docente_fecha" bdf ON b.id = bdf.brigade_id 
                AND bdf.end_date IS NULL
             LEFT JOIN "personal" p ON bdf.personal_id = p.id
             LEFT JOIN "student" s ON s.brigade_teacher_date_id = bdf.id
             GROUP BY b.id, b.name, b.created_at, b.updated_at, 
                      p.name, p."lastName", p.ci, bdf.start_date
             ORDER BY b.created_at DESC`,
    };

    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    console.error("Error in findAll brigadas:", error);
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
                p."telephoneNumber" as encargado_phone,
                bdf.start_date as assignment_date,
                bdf.id as brigade_teacher_date_id
             FROM "brigada" b
             LEFT JOIN "brigada_docente_fecha" bdf ON b.id = bdf.brigade_id 
                AND bdf.end_date IS NULL
             LEFT JOIN "personal" p ON bdf.personal_id = p.id
             WHERE b.id = $1`,
      values: [id],
    };

    const { rows } = await db.query(query);
    return rows[0];
  } catch (error) {
    console.error("Error in findById brigada:", error);
    throw error;
  }
};

// Obtener estudiantes de una brigada
const getStudentsByBrigade = async (brigadeId) => {
  try {
    const query = {
      text: `SELECT s.id, s.ci as school_id, s.name, s."lastName", s.sex, s.birthday,
                g.name as grade_name, sec.seccion as section_name,
                r.name as representative_name, r."lastName" as representative_lastName,
                r."telephoneNumber" as representative_phone
             FROM "student" s
             INNER JOIN "brigada_docente_fecha" bdf ON s.brigade_teacher_date_id = bdf.id
             LEFT JOIN "enrollment" e ON s.id = e."studentID"
             LEFT JOIN "section" sec ON e."sectionID" = sec.id
             LEFT JOIN "grade" g ON sec."gradeID" = g.id
             LEFT JOIN "representative" r ON s."representativeID" = r.ci
             WHERE bdf.brigade_id = $1 AND bdf.end_date IS NULL
             ORDER BY s."lastName", s.name`,
      values: [brigadeId],
    };

    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    console.error("Error in getStudentsByBrigade:", error);
    throw error;
  }
};

// Asignar docente a brigada
const assignTeacher = async (brigadeId, personalId, startDate = null) => {
  try {
    const assignmentDate = startDate || new Date().toISOString().split("T")[0];
    
    const query = {
      text: `INSERT INTO "brigada_docente_fecha" (brigade_id, personal_id, start_date, created_at, updated_at)
             VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
             RETURNING *`,
      values: [brigadeId, personalId, assignmentDate],
    };

    const { rows } = await db.query(query);
    return rows[0];
  } catch (error) {
    console.error("Error in assignTeacher:", error);
    throw error;
  }
};

// Inscribir estudiantes en brigada
const enrollStudents = async (studentIds, brigadeTeacherDateId) => {
  try {
    const placeholders = studentIds.map((_, index) => `$${index + 1}`).join(",");
    
    const query = {
      text: `UPDATE "student" 
             SET brigade_teacher_date_id = $${studentIds.length + 1},
                 updated_at = CURRENT_TIMESTAMP
             WHERE id IN (${placeholders})
             RETURNING id, name, "lastName"`,
      values: [...studentIds, brigadeTeacherDateId],
    };

    const { rows } = await db.query(query);
    return {
      success: true,
      studentsEnrolled: rows.length,
      students: rows,
    };
  } catch (error) {
    console.error("Error in enrollStudents:", error);
    throw error;
  }
};

// Limpiar brigada
const clearBrigade = async (brigadeId) => {
  try {
    const assignmentQuery = {
      text: `SELECT id FROM "brigada_docente_fecha" 
             WHERE brigade_id = $1 AND end_date IS NULL`,
      values: [brigadeId],
    };

    const assignmentResult = await db.query(assignmentQuery);
    if (assignmentResult.rows.length === 0) {
      return {
        success: true,
        studentsRemoved: 0,
        teacherRemoved: false,
        message: "La brigada ya estaba vacía",
      };
    }

    const brigadeTeacherDateId = assignmentResult.rows[0].id;

    // Quitar estudiantes
    const removeStudentsQuery = {
      text: `UPDATE "student" 
             SET brigade_teacher_date_id = NULL,
                 updated_at = CURRENT_TIMESTAMP
             WHERE brigade_teacher_date_id = $1
             RETURNING id`,
      values: [brigadeTeacherDateId],
    };

    const studentsResult = await db.query(removeStudentsQuery);

    // Desasignar docente
    const removeTeacherQuery = {
      text: `UPDATE "brigada_docente_fecha"
             SET end_date = CURRENT_DATE
             WHERE id = $1`,
      values: [brigadeTeacherDateId],
    };

    await db.query(removeTeacherQuery);

    return {
      success: true,
      studentsRemoved: studentsResult.rows.length,
      teacherRemoved: true,
    };
  } catch (error) {
    console.error("Error in clearBrigade:", error);
    throw error;
  }
};

// Actualizar brigada
const update = async (id, { name }) => {
  try {
    if (name && name.length > 100) {
      throw new Error(`El nombre de la brigada es demasiado largo (máximo 100 caracteres)`);
    }

    const query = {
      text: `UPDATE "brigada"
             SET name = COALESCE($1, name),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING id, name, created_at, updated_at`,
      values: [name, id],
    };

    const { rows } = await db.query(query);
    return rows[0];
  } catch (error) {
    console.error("Error in update brigada:", error);
    throw error;
  }
};

// Eliminar brigada
const remove = async (id) => {
  try {
    await clearBrigade(id);
    
    const query = {
      text: 'DELETE FROM "brigada" WHERE id = $1 RETURNING id, name',
      values: [id],
    };

    const { rows } = await db.query(query);
    return rows[0];
  } catch (error) {
    console.error("Error in remove brigada:", error);
    throw error;
  }
};

// Obtener estudiantes disponibles
const getAvailableStudents = async () => {
  try {
    const query = {
      text: `SELECT s.id, s.ci as school_id, s.name, s."lastName", s.sex, s.birthday,
                g.name as grade_name, sec.seccion as section_name,
                r.name as representative_name, r."lastName" as representative_lastName
             FROM "student" s
             LEFT JOIN "enrollment" e ON s.id = e."studentID"
             LEFT JOIN "section" sec ON e."sectionID" = sec.id
             LEFT JOIN "grade" g ON sec."gradeID" = g.id
             LEFT JOIN "representative" r ON s."representativeID" = r.ci
             WHERE s.brigade_teacher_date_id IS NULL
             ORDER BY s."lastName", s.name`,
    };

    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    console.error("Error in getAvailableStudents:", error);
    throw error;
  }
};

// Obtener docentes disponibles
const getAvailableTeachers = async () => {
  try {
    const query = {
      text: `SELECT p.id, p.ci, p.name, p."lastName", p.email, p."telephoneNumber" as phone,
                r.name as role_name
             FROM "personal" p
             LEFT JOIN "rol" r ON p."idRole" = r.id
             WHERE p."idRole" IN (1, 2, 3)
                AND NOT EXISTS (
                  SELECT 1 FROM "brigada_docente_fecha" bdf
                  WHERE bdf.personal_id = p.id AND bdf.end_date IS NULL
                )
             ORDER BY p."lastName", p.name`,
    };

    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    console.error("Error in getAvailableTeachers:", error);
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
                COUNT(DISTINCT s.id) as student_count
             FROM "brigada" b
             LEFT JOIN "brigada_docente_fecha" bdf ON b.id = bdf.brigade_id 
                AND bdf.end_date IS NULL
             LEFT JOIN "personal" p ON bdf.personal_id = p.id
             LEFT JOIN "student" s ON s.brigade_teacher_date_id = bdf.id
             WHERE b.name ILIKE $1
             GROUP BY b.id, b.name, b.created_at, b.updated_at, 
                      p.name, p."lastName", p.ci
             ORDER BY b.name`,
      values: [`%${name}%`],
    };

    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    console.error("Error in searchByName brigadas:", error);
    throw error;
  }
};

// Verificar asignación activa de docente
const checkTeacherAssignment = async (personalId) => {
  try {
    const query = {
      text: `SELECT brigade_id FROM "brigada_docente_fecha"
             WHERE personal_id = $1 AND end_date IS NULL`,
      values: [personalId],
    };
    
    const { rows } = await db.query(query);
    return rows.length > 0 ? rows[0].brigade_id : null;
  } catch (error) {
    console.error("Error in checkTeacherAssignment:", error);
    throw error;
  }
};

export const BrigadaModel = {
  create,
  findAll,
  findById,
  getStudentsByBrigade,
  assignTeacher,
  enrollStudents,
  clearBrigade,
  update,
  remove,
  getAvailableStudents,
  getAvailableTeachers,
  searchByName,
  checkTeacherAssignment
};