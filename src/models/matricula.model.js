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
        INSERT INTO "enrollment" (
          "studentID", "sectionID", "registrationDate", "repeater",
          "chemiseSize", "pantsSize", "shoesSize", "weight", "stature", "diseases",
          "observation", "birthCertificateCheck", "vaccinationCardCheck", "studentPhotosCheck",
          "representativePhotosCheck", "representativeCopyIDCheck", "autorizedCopyIDCheck", "created_at", "updated_at"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `,
      values: [
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
          e.*,
          s."name" as student_name,
          s."lastName" as student_lastName,
          s."ci" as student_school_id,
          s."birthday" as student_birthday,
          s."placeBirth" as student_birthplace_name,
          s."sex" as student_sex,
          s."quantityBrothers" as student_sibling_count,
          s."livesMother" as lives_with_mother,
          s."livesFather" as lives_with_father,
          s."livesBoth" as lives_with_both,
          s."livesRepresentative" as lives_with_representative,
          g."name" as grade_name,
          sec."seccion" as section_name,
          sec."period",
          per."name" as teacher_name,
          per."lastName" as teacher_lastName,
          rep."name" as representative_name,
          rep."lastName" as representative_lastName,
          rep."ci" as representative_ci,
          rep."telephoneNumber" as representative_phoneNumber,
          rep."email" as representative_email,
          rep."roomAdress" as representative_address,
          rep."workPlace" as representative_workplace,
          rep."jobNumber" as representative_work_phone
        FROM "enrollment" e
        LEFT JOIN "student" s ON e."studentID" = s."id"
        LEFT JOIN "section" sec ON e."sectionID" = sec."id"
        LEFT JOIN "grade" g ON sec."gradeID" = g."id"
        LEFT JOIN "personal" per ON sec."teacherCI" = per."id"
        LEFT JOIN "representative" rep ON s."representativeID" = rep."ci"
        ORDER BY e."created_at" DESC
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
          e.*,
          s."name" as student_name,
          s."lastName" as student_lastName,
          s."ci" as student_school_id,
          s."sex" as student_sex,
          s."birthday" as student_birthday,
          s."placeBirth" as student_birthplace_name,
          s."quantityBrothers" as student_sibling_count,
          s."livesMother" as lives_with_mother,
          s."livesFather" as lives_with_father,
          s."livesBoth" as lives_with_both,
          s."livesRepresentative" as lives_with_representative,
          g."name" as grade_name,
          sec."seccion" as section_name,
          sec."period",
          per."name" as teacher_name,
          per."lastName" as teacher_lastName,
          rep."name" as representative_name,
          rep."lastName" as representative_lastName,
          rep."ci" as representative_ci,
          rep."telephoneNumber" as representative_phoneNumber,
          rep."email" as representative_email,
          rep."roomAdress" as representative_address,
          rep."workPlace" as representative_workplace,
          rep."jobNumber" as representative_work_phone
        FROM "enrollment" e
        LEFT JOIN "student" s ON e."studentID" = s."id"
        LEFT JOIN "section" sec ON e."sectionID" = sec."id"
        LEFT JOIN "grade" g ON sec."gradeID" = g."id"
        LEFT JOIN "personal" per ON sec."teacherCI" = per."id"
        LEFT JOIN "representative" rep ON s."representativeID" = rep."ci"
        WHERE e."id" = $1
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
          e.*,
          g."name" as grade_name,
          sec."seccion" as section_name,
          sec."period",
          per."name" as teacher_name,
          per."lastName" as teacher_lastName
        FROM "enrollment" e
        LEFT JOIN "section" sec ON e."sectionID" = sec."id"
        LEFT JOIN "grade" g ON sec."gradeID" = g."id"
        LEFT JOIN "personal" per ON sec."teacherCI" = per."id"
        WHERE e."studentID" = $1
        ORDER BY e."created_at" DESC
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

const findByPeriodoEscolar = async (periodo_escolar) => {
  try {
    const query = {
      text: `
        SELECT
          e.*,
          s."name" as student_name,
          s."lastName" as student_lastName,
          s."ci" as student_school_id,
          g."name" as grade_name,
          sec."seccion" as section_name,
          per."name" as teacher_name,
          per."lastName" as teacher_lastName
        FROM "enrollment" e
        LEFT JOIN "student" s ON e."studentID" = s."id"
        LEFT JOIN "section" sec ON e."sectionID" = sec."id"
        LEFT JOIN "grade" g ON sec."gradeID" = g."id"
        LEFT JOIN "personal" per ON sec."teacherCI" = per."id"
        WHERE sec."period" = $1
        ORDER BY g."name", sec."seccion", s."lastName", s."name"
      `,
      values: [periodo_escolar],
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findByPeriodoEscolar matricula:", error)
    throw error
  }
}

const update = async (id, matriculaData) => {
  try {
    const {
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
        UPDATE "enrollment" SET
          "sectionID" = COALESCE($1, "sectionID"),
          "registrationDate" = COALESCE($2, "registrationDate"),
          "repeater" = COALESCE($3, "repeater"),
          "chemiseSize" = COALESCE($4, "chemiseSize"),
          "pantsSize" = COALESCE($5, "pantsSize"),
          "shoesSize" = COALESCE($6, "shoesSize"),
          "weight" = COALESCE($7, "weight"),
          "stature" = COALESCE($8, "stature"),
          "diseases" = COALESCE($9, "diseases"),
          "observation" = COALESCE($10, "observation"),
          "birthCertificateCheck" = COALESCE($11, "birthCertificateCheck"),
          "vaccinationCardCheck" = COALESCE($12, "vaccinationCardCheck"),
          "studentPhotosCheck" = COALESCE($13, "studentPhotosCheck"),
          "representativePhotosCheck" = COALESCE($14, "representativePhotosCheck"),
          "representativeCopyIDCheck" = COALESCE($15, "representativeCopyIDCheck"),
          "autorizedCopyIDCheck" = COALESCE($16, "autorizedCopyIDCheck"),
          "updated_at" = CURRENT_TIMESTAMP
        WHERE "id" = $17
        RETURNING *
      `,
      values: [
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
        id,
      ],
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
      text: 'DELETE FROM "enrollment" WHERE "id" = $1 RETURNING "id"',
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
      text: `
        SELECT "id", "name"
        FROM "grade"
        ORDER BY "name"
      `,
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
          sec."id",
          sec."seccion",
          g."name" as grade_name,
          per."name" as teacher_name,
          per."lastName" as teacher_lastName,
          sec."period"
        FROM "section" sec
        LEFT JOIN "grade" g ON sec."gradeID" = g."id"
        LEFT JOIN "personal" per ON sec."teacherCI" = per."id"
        ORDER BY g."name", sec."seccion"
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getDocenteGrados (getSectionsWithTeachers):", error)
    throw error
  }
}

const checkExistingMatricula = async (studentID, sectionID) => {
  try {
    const query = {
      text: `
        SELECT "id" FROM "enrollment"
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

export const MatriculaModel = {
  create,
  findAll,
  findById,
  findByEstudianteId,
  findByPeriodoEscolar,
  update,
  remove,
  getGrados,
  getDocenteGrados,
  checkExistingMatricula,
}
