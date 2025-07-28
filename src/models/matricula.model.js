import { db } from "../db/connection.database.js"

// Crear inscripción escolar (enrollment)
const createSchoolInscription = async (inscriptionData) => {
  try {
    const {
      studentID,
      sectionID,
      brigadeTeacherDateID,
      repeater,
      chemiseSize,
      pantsSize,
      shoesSize,
      weight,
      stature,
      diseases,
      observation,
      birthCertificateCheck,
      vaccinationCardCheck,
      studentPhotosCheck,
      representativePhotosCheck,
      representativeCopyIDCheck,
      representativeRIFCheck,
      autorizedCopyIDCheck,
    } = inscriptionData

    const query = {
      text: `
        INSERT INTO "enrollment" (
          "studentID", "sectionID", "brigadeTeacherDateID", "registrationDate",
          repeater, "chemiseSize", "pantsSize", "shoesSize", weight, stature,
          diseases, observation, "birthCertificateCheck", "vaccinationCardCheck",
          "studentPhotosCheck", "representativePhotosCheck", "representativeCopyIDCheck",
          "representativeRIFCheck", "autorizedCopyIDCheck", created_at, updated_at
        )
        VALUES ($1, $2, $3, CURRENT_DATE, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `,
      values: [
        studentID,
        sectionID,
        brigadeTeacherDateID || null,
        repeater || false,
        chemiseSize,
        pantsSize,
        shoesSize,
        weight,
        stature,
        diseases,
        observation,
        birthCertificateCheck || false,
        vaccinationCardCheck || false,
        studentPhotosCheck || false,
        representativePhotosCheck || false,
        representativeCopyIDCheck || false,
        representativeRIFCheck || false,
        autorizedCopyIDCheck || false,
      ],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in createSchoolInscription:", error)
    throw error
  }
}

// Obtener el último registro académico del estudiante (considerando periodos)
const getLastAcademicRecord = async (studentID) => {
  // Consulta el historial externo
  const historyQuery = {
    text: `
      SELECT sah."academicPeriodID", sah."gradeID", sah."gradeAchieved", sah."isApproved",
             sah."created_at", ap.name AS academic_period, g.name AS grade, 'history' AS source
      FROM "student_academic_history" sah
      LEFT JOIN "academic_period" ap ON sah."academicPeriodID" = ap.id
      LEFT JOIN "grade" g ON sah."gradeID" = g.id
      WHERE sah."studentID" = $1
      ORDER BY sah."academicPeriodID" DESC, sah."created_at" DESC
      LIMIT 1
    `,
    values: [studentID],
  };
  const { rows: historyRows } = await db.query(historyQuery);
  const history = historyRows[0];

  // Consulta la inscripción interna (periodo desde section)
  const enrollmentQuery = {
    text: `
      SELECT e."id" AS enrollmentID, sec."academicPeriodID", sec."gradeID", e."final_grade" AS gradeAchieved,
             e."created_at", ap.name AS academic_period, g.name AS grade, 'enrollment' AS source
      FROM "enrollment" e
      JOIN "section" sec ON e."sectionID" = sec.id
      LEFT JOIN "academic_period" ap ON sec."academicPeriodID" = ap.id
      LEFT JOIN "grade" g ON sec."gradeID" = g.id
      WHERE e."studentID" = $1
      ORDER BY sec."academicPeriodID" DESC, e."created_at" DESC
      LIMIT 1
    `,
    values: [studentID],
  };
  const { rows: enrollmentRows } = await db.query(enrollmentQuery);
  const enrollment = enrollmentRows[0];

  // Comparar ambos y devolver el más reciente
  if (!history && !enrollment) return null;
  if (!history) return enrollment;
  if (!enrollment) return history;

  // Compara por academicPeriodID (mayor = más reciente)
  if (enrollment.academicPeriodID > history.academicPeriodID) return enrollment;
  if (history.academicPeriodID > enrollment.academicPeriodID) return history;

  // Si el periodo es igual, compara por fecha de creación
  return (enrollment.created_at > history.created_at) ? enrollment : history;
};

// Obtener grados disponibles para inscripción
const getAvailableGrades = async () => {
  try {
    const query = {
      text: `SELECT * FROM "grade" ORDER BY id`,
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getAvailableGrades:", error)
    throw error
  }
}

// Obtener secciones por grado y periodo con información del docente
const getSectionsByGradeAndPeriod = async (gradeId, periodId) => {
  try {
    const query = {
      text: `
        SELECT 
          s.*,
          p.name as teacher_name,
          p."lastName" as teacher_lastName,
          COUNT(e."studentID") as student_count
        FROM "section" s
        LEFT JOIN "personal" p ON s."teacherCI" = p.id
        LEFT JOIN "enrollment" e ON s.id = e."sectionID"
        WHERE s."gradeID" = $1 AND s."academicPeriodID" = $2
        GROUP BY s.id, p.name, p."lastName"
        ORDER BY s.seccion
      `,
      values: [gradeId, periodId],
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getSectionsByGradeAndPeriod:", error)
    throw error
  }
}

// Obtener docentes disponibles (por periodo si lo necesitas)
const getAvailableTeachers = async () => {
  try {
    const query = {
      text: `
        SELECT 
          p.id,
          p.ci,
          p.name,
          p."lastName",
          p.email,
          p."telephoneNumber"
        FROM "personal" p
        WHERE p."idRole" = 1
        ORDER BY p.name, p."lastName"
      `,
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getAvailableTeachers:", error)
    throw error
  }
}

// Asignar docente a sección (por periodo)
const assignTeacherToSection = async (gradeId, teacherId, periodId) => {
  // Verificar si el docente ya está asignado a otra sección en el mismo periodo
  const checkQuery = {
    text: `
      SELECT id FROM "section"
      WHERE "teacherCI" = $1 AND "academicPeriodID" = $2
      LIMIT 1
    `,
    values: [teacherId, periodId],
  };
  const { rows: assignedRows } = await db.query(checkQuery);
  if (assignedRows.length > 0) {
    throw new Error("El docente ya está asignado a otra sección en este periodo académico.");
  }

  // Si no está asignado, procede con la actualización
  const updateQuery = {
    text: `
      INSERT INTO "section" ("teacherID", "gradeID", "academicPeriodID", "created_at", "updated_at") 
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP )
      RETURNING *
    `,
    values: [teacherId, gradeId, periodId],
  };
  const { rows } = await db.query(updateQuery);
  return rows[0];
};

// Obtener inscripciones por grado y periodo para vista de matrícula
const getInscriptionsByGradeAndPeriod = async (gradeId, periodId) => {
  try {
    const query = {
      text: `
        SELECT 
          e.*,
          s.name as student_name,
          s."lastName" as student_lastName,
          s.sex as student_sex,
          s.birthday as student_birthday,
          s.ci as student_ci,
          g.name as grade_name,
          sec.seccion as section_name,
          p.name as teacher_name,
          p."lastName" as teacher_lastName
        FROM "enrollment" e
        JOIN "student" s ON e."studentID" = s.id
        JOIN "section" sec ON e."sectionID" = sec.id
        JOIN "grade" g ON sec."gradeID" = g.id
        LEFT JOIN "personal" p ON sec."teacherCI" = p.id
        WHERE sec."gradeID" = $1 AND sec."academicPeriodID" = $2
        ORDER BY sec.seccion, s."lastName", s.name
      `,
      values: [gradeId, periodId],
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getInscriptionsByGradeAndPeriod:", error)
    throw error
  }
}

// Obtener todas las inscripciones (puedes filtrar por periodo si lo necesitas)
const getAllInscriptions = async (periodId = null) => {
  try {
    let query;
    if (periodId) {
      query = {
        text: `
          SELECT 
            e.*,
            s.name as student_name,
            s."lastName" as "student_lastName",
            s.ci as student_ci,
            g.name as grade_name,
            sec.seccion as section_name,
            p.name as teacher_name,
            p."lastName" as "teacher_lastName"
          FROM "enrollment" e
          JOIN "student" s ON e."studentID" = s.id
          JOIN "section" sec ON e."sectionID" = sec.id
          JOIN "grade" g ON sec."gradeID" = g.id
          LEFT JOIN "personal" p ON sec."teacherCI" = p.id
          WHERE sec."academicPeriodID" = $1
          ORDER BY e."registrationDate" DESC
        `,
        values: [periodId],
      }
    } else {
      query = {
        text: `
          SELECT 
            e.*,
            s.name as student_name,
            s."lastName" as "student_lastName",
            s.ci as student_ci,
            g.name as grade_name,
            sec.seccion as section_name,
            p.name as teacher_name,
            p."lastName" as "teacher_lastName"
          FROM "enrollment" e
          JOIN "student" s ON e."studentID" = s.id
          JOIN "section" sec ON e."sectionID" = sec.id
          JOIN "grade" g ON sec."gradeID" = g.id
          LEFT JOIN "personal" p ON sec."teacherCI" = p.id
          ORDER BY e."registrationDate" DESC
        `,
      }
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getAllInscriptions:", error)
    throw error
  }
}

// Obtener una inscripción por su ID
const getInscriptionById = async (id) => {
  try {
    const query = {
      text: `
        SELECT
          e.*,
          s.name as student_name,
          s."lastName" as student_lastName,
          s.sex as student_sex,
          s.birthday as student_birthday,
          s.ci as student_ci,
          g.name as grade_name,
          sec.seccion as section_name,
          p.name as teacher_name,
          p."lastName" as teacher_lastName
        FROM "enrollment" e
        JOIN "student" s ON e."studentID" = s.id
        JOIN "section" sec ON e."sectionID" = sec.id
        JOIN "grade" g ON sec."gradeID" = g.id
        LEFT JOIN "personal" p ON sec."teacherCI" = p.id
        WHERE e.id = $1
      `,
      values: [id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in getInscriptionById:", error)
    throw error
  }
}

// Actualizar un registro de matrícula por su ID**
const update = async (id, updateData) => {
  try {
    const fields = []
    const values = []
    let paramIndex = 1

    for (const key in updateData) {
      // Ignorar studentID ya que no debe ser actualizable directamente en matrícula
      if (key === 'studentID') {
        continue;
      }
      fields.push(`"${key}" = $${paramIndex++}`)
      values.push(updateData[key])
    }

    if (fields.length === 0) {
      throw new Error("No se proporcionaron campos para actualizar la matrícula.")
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`)

    const query = {
      text: `
        UPDATE "enrollment"
        SET ${fields.join(", ")}
        WHERE id = $${paramIndex++}
        RETURNING *
      `,
      values: [...values, id],
    }

    const { rows } = await db.query(query)
    if (rows.length === 0) {
      throw new Error(`Matrícula con ID ${id} no encontrada.`)
    }
    return rows[0]
  } catch (error) {
    console.error("❌ Error in updateMatricula:", error)
    throw error
  }
}

// Eliminar un registro de matrícula por su ID**
const remove = async (id) => {
  try {
    const query = {
      text: `
        DELETE FROM "enrollment"
        WHERE id = $1
        RETURNING *
      `,
      values: [id],
    }

    const { rows } = await db.query(query)
    if (rows.length === 0) {
      throw new Error(`Matrícula con ID ${id} no encontrada para eliminar.`)
    }
    return rows[0] // Retorna la matrícula eliminada
  } catch (error) {
    console.error("❌ Error in deleteMatricula:", error)
    throw error
  }
}
// Obtener el periodo actual en curso
const getCurrentAcademicPeriod = async () => {
  try {
    const query = {
      text: `SELECT * FROM "academic_period" WHERE "is_current" = TRUE LIMIT 1`,
    }
    const { rows } = await db.query(query) //
    return rows[0]
  } catch (error) {
    console.error("Error in getCurrentAcademicPeriod:", error)
    throw error
  }
}

// Obtener todos los periodos académicos
const getAllAcademicPeriods = async () => {
  try {
    const query = {
      text: `SELECT * FROM "academic_period" ORDER BY "start_date" DESC`,
    }
    const { rows } = await db.query(query) //
    return rows
  } catch (error) {
    console.error("Error in getAllAcademicPeriods:", error)
    throw error
  }
}

// Crear un nuevo periodo académico con lógica de fechas consecutivas y manejar la lógica de 'is_current' y estados de estudiantes
const createNewAcademicPeriod = async () => {
  const client = db// Obtener una conexión del pool
  try {
    await client.query('BEGIN') // Iniciar transacción

    // 1. Obtener el periodo actual (el que pasará a ser el "anterior")
    const currentPeriodQuery = {
      text: `SELECT id, end_date FROM "academic_period" WHERE "is_current" = TRUE LIMIT 1`,
    }
    const { rows: currentPeriodRows } = await client.query(currentPeriodQuery)
    const currentPeriod = currentPeriodRows[0]

    let newPeriodStartDate
    let newPeriodEndDate
    let newPeriodName

    if (currentPeriod) {
      // Si existe un periodo actual, el nuevo periodo empieza al día siguiente del fin del anterior
      const previousEndDate = new Date(currentPeriod.end_date)
      newPeriodStartDate = new Date(previousEndDate)
      newPeriodStartDate.setDate(previousEndDate.getDate() + 1) // Sumar un día al end_date del anterior
      // El end_date del nuevo periodo es un año después de su start_date
      newPeriodEndDate = new Date(newPeriodStartDate)
      newPeriodEndDate.setFullYear(newPeriodStartDate.getFullYear() + 1)
      newPeriodEndDate.setDate(newPeriodEndDate.getDate() - 1); // Restar un día para que sea el día anterior al siguiente año de inicio (ej. 2024-07-27)

      // El nombre es "start_year-end_year"
      newPeriodName = `${newPeriodStartDate.getFullYear()}-${newPeriodEndDate.getFullYear()}`

      // Actualizar el 'is_current' del periodo anterior a FALSE
      const updateCurrentPeriodQuery = {
        text: `
          UPDATE "academic_period"
          SET "is_current" = FALSE, updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
          RETURNING *
        `,
        values: [currentPeriod.id],
      }
      await client.query(updateCurrentPeriodQuery)
    } else {
      newPeriodStartDate = new Date()
      newPeriodEndDate = new Date(newPeriodStartDate)
      newPeriodEndDate.setFullYear(newPeriodStartDate.getFullYear() + 1)
      newPeriodEndDate.setDate(newPeriodEndDate.getDate() - 1); // Restar un día para que sea el día anterior al siguiente año de inicio

      newPeriodName = `${newPeriodStartDate.getFullYear()}-${newPeriodEndDate.getFullYear()}`
    }

    // 2. Crear el nuevo periodo con 'is_current' en TRUE
    const insertNewPeriodQuery = {
      text: `
        INSERT INTO "academic_period" (name, start_date, end_date, "is_current", created_at, updated_at)
        VALUES ($1, $2, $3, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `,
      values: [newPeriodName, newPeriodStartDate, newPeriodEndDate],
    }
    const { rows: newPeriodRows } = await client.query(insertNewPeriodQuery)
    const newPeriod = newPeriodRows[0]

    // 3. Actualizar el status_id de los estudiantes de 'Inscrito' (2) a 'Activo' (1)
    const updateStudentsStatusQuery = {
      text: `
        UPDATE "student"
        SET status_id = 1, updated_at = CURRENT_TIMESTAMP
        WHERE status_id = 2
        RETURNING id
      `,
    }
    const { rowCount: updatedStudentsCount } = await client.query(updateStudentsStatusQuery)

    await client.query('COMMIT') // Confirmar transacción

    return { newPeriod, updatedStudentsCount }
  } catch (error) {
    await client.query('ROLLBACK') // Revertir transacción en caso de error
    console.error("Error in createNewAcademicPeriod:", error)
    throw error
  }
}
export const MatriculaModel = {
  createSchoolInscription,
  getLastAcademicRecord,
  getAvailableGrades,
  getSectionsByGradeAndPeriod,
  getAvailableTeachers,
  assignTeacherToSection,
  getInscriptionsByGradeAndPeriod,
  getAllInscriptions,
  getInscriptionById,
  update,
  remove,
  getCurrentAcademicPeriod,
  getAllAcademicPeriods,
  createNewAcademicPeriod,
}