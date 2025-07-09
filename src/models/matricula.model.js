import { db } from "../db/connection.database.js"

const create = async (matriculaData) => {
  try {
    const {
      studentID,
      sectionID,
      registrationDate,
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
      autorizedCopyIDCheck,
    } = matriculaData

    const query = {
      text: `
        INSERT INTO "matricula" (
          "studentID", "sectionID", "registrationDate", repeater, "chemiseSize", 
          "pantsSize", "shoesSize", weight, stature, diseases, observation,
          "birthCertificateCheck", "vaccinationCardCheck", "studentPhotosCheck",
          "representativePhotosCheck", "representativeCopyIDCheck", "autorizedCopyIDCheck",
          created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `,
      values: [
        studentID,
        sectionID,
        registrationDate || new Date(),
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
        autorizedCopyIDCheck || false,
      ],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in create matricula:", error)
    throw error
  }
}

const findAll = async () => {
  try {
    const query = {
      text: `
        SELECT 
          m.*,
          s.name as student_name,
          s."lastName" as student_lastName,
          s.ci as student_ci,
          sec.name as section_name,
          g.name as grade_name,
          t.name as teacher_name,
          t."lastName" as teacher_lastName
        FROM "matricula" m
        LEFT JOIN "student" s ON m."studentID" = s.id
        LEFT JOIN "section" sec ON m."sectionID" = sec.id
        LEFT JOIN "grade" g ON sec."gradeID" = g.id
        LEFT JOIN "teacher" t ON sec."teacherID" = t.id
        ORDER BY m.created_at DESC
      `,
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findAll matriculas:", error)
    throw error
  }
}

const findById = async (id) => {
  try {
    const query = {
      text: `
        SELECT 
          m.*,
          s.name as student_name,
          s."lastName" as student_lastName,
          s.ci as student_ci,
          s.birthday as student_birthday,
          s.sex as student_sex,
          sec.name as section_name,
          g.name as grade_name,
          t.name as teacher_name,
          t."lastName" as teacher_lastName,
          r.name as representative_name,
          r."lastName" as representative_lastName,
          r."telephoneNumber" as representative_phone
        FROM "matricula" m
        LEFT JOIN "student" s ON m."studentID" = s.id
        LEFT JOIN "section" sec ON m."sectionID" = sec.id
        LEFT JOIN "grade" g ON sec."gradeID" = g.id
        LEFT JOIN "teacher" t ON sec."teacherID" = t.id
        LEFT JOIN "representative" r ON s."representativeID" = r.ci
        WHERE m.id = $1
      `,
      values: [id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findById matricula:", error)
    throw error
  }
}

const findByEstudianteId = async (studentID) => {
  try {
    const query = {
      text: `
        SELECT 
          m.*,
          sec.name as section_name,
          g.name as grade_name,
          t.name as teacher_name,
          t."lastName" as teacher_lastName
        FROM "matricula" m
        LEFT JOIN "section" sec ON m."sectionID" = sec.id
        LEFT JOIN "grade" g ON sec."gradeID" = g.id
        LEFT JOIN "teacher" t ON sec."teacherID" = t.id
        WHERE m."studentID" = $1
        ORDER BY m.created_at DESC
      `,
      values: [studentID],
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findByEstudianteId matricula:", error)
    throw error
  }
}

const findByPeriodoEscolar = async (periodo) => {
  try {
    const query = {
      text: `
        SELECT 
          m.*,
          s.name as student_name,
          s."lastName" as student_lastName,
          s.ci as student_ci,
          sec.name as section_name,
          g.name as grade_name
        FROM "matricula" m
        LEFT JOIN "student" s ON m."studentID" = s.id
        LEFT JOIN "section" sec ON m."sectionID" = sec.id
        LEFT JOIN "grade" g ON sec."gradeID" = g.id
        WHERE EXTRACT(YEAR FROM m."registrationDate") = $1
        ORDER BY g.id, sec.name, s."lastName", s.name
      `,
      values: [periodo],
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findByPeriodoEscolar matricula:", error)
    throw error
  }
}

const checkExistingMatricula = async (studentID, sectionID) => {
  try {
    const query = {
      text: `
        SELECT id FROM "matricula" 
        WHERE "studentID" = $1 AND "sectionID" = $2
      `,
      values: [studentID, sectionID],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in checkExistingMatricula:", error)
    throw error
  }
}

const update = async (id, updateData) => {
  try {
    // Construir query dinámicamente
    const fields = []
    const values = []
    let paramCount = 1

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined && key !== "id") {
        fields.push(`"${key}" = $${paramCount}`)
        values.push(updateData[key])
        paramCount++
      }
    })

    if (fields.length === 0) {
      throw new Error("No hay campos para actualizar")
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(id)

    const query = {
      text: `UPDATE "matricula" SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`,
      values: values,
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in update matricula:", error)
    throw error
  }
}

const remove = async (id) => {
  try {
    const query = {
      text: 'DELETE FROM "matricula" WHERE id = $1 RETURNING *',
      values: [id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in remove matricula:", error)
    throw error
  }
}

const getGrados = async () => {
  try {
    const query = {
      text: `SELECT * FROM "grade" ORDER BY id`,
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getGrados:", error)
    throw error
  }
}

const getDocenteGrados = async () => {
  try {
    const query = {
      text: `
        SELECT 
          s.id,
          s.name as seccion,
          g.name as grade_name,
          t.name as teacher_name,
          t."lastName" as teacher_lastName
        FROM "section" s
        LEFT JOIN "grade" g ON s."gradeID" = g.id
        LEFT JOIN "teacher" t ON s."teacherID" = t.id
        ORDER BY g.id, s.name
      `,
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getDocenteGrados:", error)
    throw error
  }
}

export const MatriculaModel = {
  create,
  findAll,
  findById,
  findByEstudianteId,
  findByPeriodoEscolar,
  checkExistingMatricula,
  update,
  remove,
  getGrados,
  getDocenteGrados,
}
