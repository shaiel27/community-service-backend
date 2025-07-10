import { db } from "../db/connection.database.js"

const create = async (matriculaData) => {
  try {
    const {
      studentID,
      sectionID,
      brigadeTeacherDateID,
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
      representativeRIFCheck,
      autorizedCopyIDCheck,
    } = matriculaData

    const query = {
      text: `
        INSERT INTO "enrollment" (
          "studentID", "sectionID", "brigadeTeacherDateID", "registrationDate", 
          "repeater", "chemiseSize", "pantsSize", "shoesSize", "weight", "stature", 
          "diseases", "observation", "birthCertificateCheck", "vaccinationCardCheck", 
          "studentPhotosCheck", "representativePhotosCheck", "representativeCopyIDCheck", 
          "representativeRIFCheck", "autorizedCopyIDCheck", "created_at", "updated_at"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `,
      values: [
        studentID,
        sectionID,
        brigadeTeacherDateID || null,
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
        representativeRIFCheck || false,
        autorizedCopyIDCheck || false,
      ],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in create enrollment:", error)
    throw error
  }
}

const findAll = async () => {
  try {
    const query = {
      text: `
        SELECT 
          e.*,
          s.name as student_name,
          s."lastName" as student_lastName,
          s.ci as student_ci,
          s.birthday as student_birthday,
          s.sex as student_sex,
          sec.seccion as section_name,
          g.name as grade_name,
          p.name as teacher_name,
          p."lastName" as teacher_lastName,
          r.name as representative_name,
          r."lastName" as representative_lastName,
          r."telephoneNumber" as representative_phone
        FROM "enrollment" e
        LEFT JOIN "student" s ON e."studentID" = s.id
        LEFT JOIN "section" sec ON e."sectionID" = sec.id
        LEFT JOIN "grade" g ON sec."gradeID" = g.id
        LEFT JOIN "personal" p ON sec."teacherCI" = p.id
        LEFT JOIN "representative" r ON s."representativeID" = r.ci
        ORDER BY e.created_at DESC
      `,
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findAll enrollments:", error)
    throw error
  }
}

const findById = async (id) => {
  try {
    const query = {
      text: `
        SELECT 
          e.*,
          s.name as student_name,
          s."lastName" as student_lastName,
          s.ci as student_ci,
          s.birthday as student_birthday,
          s.sex as student_sex,
          s."placeBirth" as student_birthPlace,
          s.address as student_address,
          sec.seccion as section_name,
          g.name as grade_name,
          p.name as teacher_name,
          p."lastName" as teacher_lastName,
          r.name as representative_name,
          r."lastName" as representative_lastName,
          r."telephoneNumber" as representative_phone,
          r.email as representative_email,
          r.address as representative_address,
          r.workplace as representative_workplace,
          r."workTelephone" as representative_work_phone,
          r."telephoneHouse" as representative_telephoneHouse,
          r.profesion as representative_profesion,
          r."maritalStat" as representative_maritalStat,
          r.birthday as representative_birthday,
          r.ci as representative_ci
        FROM "enrollment" e
        LEFT JOIN "student" s ON e."studentID" = s.id
        LEFT JOIN "section" sec ON e."sectionID" = sec.id
        LEFT JOIN "grade" g ON sec."gradeID" = g.id
        LEFT JOIN "personal" p ON sec."teacherCI" = p.id
        LEFT JOIN "representative" r ON s."representativeID" = r.ci
        WHERE e.id = $1
      `,
      values: [id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findById enrollment:", error)
    throw error
  }
}

const findByEstudianteId = async (studentID) => {
  try {
    const query = {
      text: `
        SELECT 
          e.*,
          sec.seccion as section_name,
          g.name as grade_name,
          p.name as teacher_name,
          p."lastName" as teacher_lastName
        FROM "enrollment" e
        LEFT JOIN "section" sec ON e."sectionID" = sec.id
        LEFT JOIN "grade" g ON sec."gradeID" = g.id
        LEFT JOIN "personal" p ON sec."teacherCI" = p.id
        WHERE e."studentID" = $1
        ORDER BY e.created_at DESC
      `,
      values: [studentID],
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findByEstudianteId enrollment:", error)
    throw error
  }
}

const findByPeriodoEscolar = async (periodo) => {
  try {
    const query = {
      text: `
        SELECT 
          e.*,
          s.name as student_name,
          s."lastName" as student_lastName,
          s.ci as student_ci,
          s.sex as student_sex,
          s.birthday as student_birthday,
          sec.seccion as section_name,
          g.name as grade_name,
          p.name as teacher_name,
          p."lastName" as teacher_lastName,
          r.name as representative_name,
          r."lastName" as representative_lastName,
          r."telephoneNumber" as representative_phone
        FROM "enrollment" e
        LEFT JOIN "student" s ON e."studentID" = s.id
        LEFT JOIN "section" sec ON e."sectionID" = sec.id
        LEFT JOIN "grade" g ON sec."gradeID" = g.id
        LEFT JOIN "personal" p ON sec."teacherCI" = p.id
        LEFT JOIN "representative" r ON s."representativeID" = r.ci
        WHERE EXTRACT(YEAR FROM e."registrationDate") = $1
        ORDER BY g.id, sec.seccion, s."lastName", s.name
      `,
      values: [periodo],
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findByPeriodoEscolar enrollment:", error)
    throw error
  }
}

const checkExistingMatricula = async (studentID, sectionID) => {
  try {
    const query = {
      text: `
        SELECT id FROM "enrollment" 
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
      text: `UPDATE "enrollment" SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`,
      values: values,
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in update enrollment:", error)
    throw error
  }
}

const remove = async (id) => {
  try {
    const query = {
      text: 'DELETE FROM "enrollment" WHERE id = $1 RETURNING *',
      values: [id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in remove enrollment:", error)
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
          s.seccion,
          g.name as grade_name,
          p.name as teacher_name,
          p."lastName" as teacher_lastName
        FROM "section" s
        LEFT JOIN "grade" g ON s."gradeID" = g.id
        LEFT JOIN "personal" p ON s."teacherCI" = p.id
        ORDER BY g.id, s.seccion
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
