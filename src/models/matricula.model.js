import { db } from "../db/connection.database.js"

// Crear sección
const createSection = async (sectionData) => {
  try {
    const { seccion, gradeID, teacherCI, academicPeriodID } = sectionData

    // Verificar si ya existe una sección con el mismo nombre en el mismo grado y período
    const checkQuery = {
      text: `
        SELECT id FROM "section"
        WHERE "seccion" = $1 AND "gradeID" = $2 AND "academicPeriodID" = $3
        LIMIT 1
      `,
      values: [seccion, gradeID, academicPeriodID],
    }
    const { rows: existingRows } = await db.query(checkQuery)
    if (existingRows.length > 0) {
      throw new Error(`Ya existe una sección "${seccion}" para este grado en el período académico seleccionado.`)
    }

    // Verificar si el docente ya está asignado a otra sección en el mismo período
    const teacherCheckQuery = {
      text: `
        SELECT id FROM "section"
        WHERE "teacherCI" = $1 AND "academicPeriodID" = $2
        LIMIT 1
      `,
      values: [teacherCI, academicPeriodID],
    }
    const { rows: teacherRows } = await db.query(teacherCheckQuery)
    if (teacherRows.length > 0) {
      throw new Error("El docente ya está asignado a otra sección en este período académico.")
    }

    const query = {
      text: `
        INSERT INTO "section" ("seccion", "gradeID", "teacherCI", "academicPeriodID", "created_at", "updated_at")
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `,
      values: [seccion, gradeID, teacherCI, academicPeriodID],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in createSection:", error)
    throw error
  }
}

// Actualizar sección
const updateSection = async (id, sectionData) => {
  try {
    const { seccion, gradeID, teacherCI, academicPeriodID } = sectionData

    // Verificar si ya existe otra sección con el mismo nombre en el mismo grado y período
    const checkQuery = {
      text: `
        SELECT id FROM "section"
        WHERE "seccion" = $1 AND "gradeID" = $2 AND "academicPeriodID" = $3 AND id != $4
        LIMIT 1
      `,
      values: [seccion, gradeID, academicPeriodID, id],
    }
    const { rows: existingRows } = await db.query(checkQuery)
    if (existingRows.length > 0) {
      throw new Error(`Ya existe otra sección "${seccion}" para este grado en el período académico seleccionado.`)
    }

    // Verificar si el docente ya está asignado a otra sección en el mismo período
    const teacherCheckQuery = {
      text: `
        SELECT id FROM "section"
        WHERE "teacherCI" = $1 AND "academicPeriodID" = $2 AND id != $3
        LIMIT 1
      `,
      values: [teacherCI, academicPeriodID, id],
    }
    const { rows: teacherRows } = await db.query(teacherCheckQuery)
    if (teacherRows.length > 0) {
      throw new Error("El docente ya está asignado a otra sección en este período académico.")
    }

    const query = {
      text: `
        UPDATE "section"
        SET "seccion" = $1, "gradeID" = $2, "teacherCI" = $3, "academicPeriodID" = $4, "updated_at" = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING *
      `,
      values: [seccion, gradeID, teacherCI, academicPeriodID, id],
    }

    const { rows } = await db.query(query)
    if (rows.length === 0) {
      throw new Error(`Sección con ID ${id} no encontrada.`)
    }
    return rows[0]
  } catch (error) {
    console.error("Error in updateSection:", error)
    throw error
  }
}

// Obtener estudiantes de una sección
const getSectionStudents = async (sectionId) => {
  try {
    const query = {
      text: `
        SELECT 
          s.id,
          s.name,
          s."lastName",
          s.ci,
          s.sex,
          s.birthday,
          e."registrationDate" as "enrollmentDate",
          'Activo' as status
        FROM "enrollment" e
        JOIN "student" s ON e."studentID" = s.id
        WHERE e."sectionID" = $1
        ORDER BY s."lastName", s.name
      `,
      values: [sectionId],
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getSectionStudents:", error)
    throw error
  }
}

// Crear inscripción escolar
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
  }
  const { rows: historyRows } = await db.query(historyQuery)
  const history = historyRows[0]

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
  }
  const { rows: enrollmentRows } = await db.query(enrollmentQuery)
  const enrollment = enrollmentRows[0]

  // Comparar ambos y devolver el más reciente
  if (!history && !enrollment) return null
  if (!history) return enrollment
  if (!enrollment) return history

  // Compara por academicPeriodID (mayor = más reciente)
  if (enrollment.academicPeriodID > history.academicPeriodID) return enrollment
  if (history.academicPeriodID > enrollment.academicPeriodID) return history

  // Si el periodo es igual, compara por fecha de creación
  return enrollment.created_at > history.created_at ? enrollment : history
}

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
        WHERE p."idRole" = 2
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
    let query
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

// Actualizar un registro de matrícula por su ID
const update = async (id, updateData) => {
  try {
    const fields = []
    const values = []
    let paramIndex = 1

    for (const key in updateData) {
      // Ignorar studentID ya que no debe ser actualizable directamente en matrícula
      if (key === "studentID") {
        continue
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

// Eliminar un registro de matrícula por su ID
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
    const { rows } = await db.query(query)
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
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getAllAcademicPeriods:", error)
    throw error
  }
}

// Crear un nuevo periodo académico
const createNewAcademicPeriod = async () => {
  const client = db
  try {
    await client.query("BEGIN")

    // 1. Obtener el periodo actual
    const currentPeriodQuery = {
      text: `SELECT id, end_date FROM "academic_period" WHERE "is_current" = TRUE LIMIT 1`,
    }
    const { rows: currentPeriodRows } = await client.query(currentPeriodQuery)
    const currentPeriod = currentPeriodRows[0]

    let newPeriodStartDate
    let newPeriodEndDate
    let newPeriodName

    if (currentPeriod) {
      const previousEndDate = new Date(currentPeriod.end_date)
      newPeriodStartDate = new Date(previousEndDate)
      newPeriodStartDate.setDate(previousEndDate.getDate() + 1)
      newPeriodEndDate = new Date(newPeriodStartDate)
      newPeriodEndDate.setFullYear(newPeriodStartDate.getFullYear() + 1)
      newPeriodEndDate.setDate(newPeriodEndDate.getDate() - 1)

      newPeriodName = `${newPeriodStartDate.getFullYear()}-${newPeriodEndDate.getFullYear()}`

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
      newPeriodEndDate.setDate(newPeriodEndDate.getDate() - 1)

      newPeriodName = `${newPeriodStartDate.getFullYear()}-${newPeriodEndDate.getFullYear()}`
    }

    // 2. Crear el nuevo periodo
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

    // 3. Actualizar el status_id de los estudiantes
    const updateStudentsStatusQuery = {
      text: `
        UPDATE "student"
        SET status_id = 1, updated_at = CURRENT_TIMESTAMP
        WHERE status_id = 2
        RETURNING id
      `,
    }
    const { rowCount: updatedStudentsCount } = await client.query(updateStudentsStatusQuery)

    await client.query("COMMIT")

    return { newPeriod, updatedStudentsCount }
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error in createNewAcademicPeriod:", error)
    throw error
  }
}

// Obtener todas las secciones con filtros opcionales
const getAllSections = async (periodId, gradeId) => {
  let text = `
    SELECT 
      s.*,
      g.name as grade_name,
      p.name as teacher_name,
      p."lastName" as teacher_lastName,
      ap.name as academic_period_name,
      (SELECT COUNT(*) FROM "enrollment" e WHERE e."sectionID" = s.id) as student_count
    FROM "section" s
    JOIN "grade" g ON s."gradeID" = g.id
    JOIN "academic_period" ap ON s."academicPeriodID" = ap.id
    LEFT JOIN "personal" p ON s."teacherCI" = p.id
    WHERE 1=1
  `
  const values = []

  if (periodId) {
    values.push(periodId)
    text += ` AND s."academicPeriodID" = $${values.length}`
  }
  if (gradeId) {
    values.push(gradeId)
    text += ` AND s."gradeID" = $${values.length}`
  }

  text += ` ORDER BY ap.name, g.name, s.seccion`

  const query = { text, values }
  const { rows } = await db.query(query)
  return rows
}

// Eliminar una sección
const removeSection = async (id) => {
  // 1. Verificar si hay estudiantes inscritos
  const checkQuery = {
    text: `SELECT 1 FROM "enrollment" WHERE "sectionID" = $1 LIMIT 1`,
    values: [id],
  }
  const { rows: enrollmentRows } = await db.query(checkQuery)
  if (enrollmentRows.length > 0) {
    throw new Error("No se puede eliminar la sección porque tiene estudiantes inscritos.")
  }

  // 2. Si no hay estudiantes, proceder a eliminar
  const deleteQuery = {
    text: `DELETE FROM "section" WHERE id = $1 RETURNING *`,
    values: [id],
  }
  const { rows } = await db.query(deleteQuery)
  if (rows.length === 0) {
    throw new Error(`Sección con ID ${id} no encontrada para eliminar.`)
  }
  return rows[0]
}

export const MatriculaModel = {
  createSection,
  updateSection,
  getSectionStudents,
  createSchoolInscription,
  getLastAcademicRecord,
  getAvailableGrades,
  getSectionsByGradeAndPeriod,
  getAvailableTeachers,
  getInscriptionsByGradeAndPeriod,
  getAllInscriptions,
  getInscriptionById,
  update,
  remove,
  getCurrentAcademicPeriod,
  getAllAcademicPeriods,
  createNewAcademicPeriod,
  getAllSections,
  removeSection,
}
