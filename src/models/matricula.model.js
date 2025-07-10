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

// Obtener secciones por grado con información del docente
const getSectionsByGrade = async (gradeId) => {
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
        WHERE s."gradeID" = $1
        GROUP BY s.id, s."teacherCI", s."gradeID", s.seccion, s.period, s.created_at, s.updated_at, p.name, p."lastName"
        ORDER BY s.seccion
      `,
      values: [gradeId],
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getSectionsByGrade:", error)
    throw error
  }
}

// Obtener docentes disponibles
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

// Asignar docente a sección
const assignTeacherToSection = async (sectionId, teacherId) => {
  try {
    const query = {
      text: `
        UPDATE "section" 
        SET "teacherCI" = $1, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $2 
        RETURNING *
      `,
      values: [teacherId, sectionId],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in assignTeacherToSection:", error)
    throw error
  }
}

// Obtener inscripciones por grado para vista de matrícula
const getInscriptionsByGrade = async (gradeId) => {
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
        WHERE sec."gradeID" = $1
        ORDER BY sec.seccion, s."lastName", s.name
      `,
      values: [gradeId],
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getInscriptionsByGrade:", error)
    throw error
  }
}

// Obtener todas las inscripciones
const getAllInscriptions = async () => {
  try {
    const query = {
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
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getAllInscriptions:", error)
    throw error
  }
}

export const MatriculaModel = {
  createSchoolInscription,
  getAvailableGrades,
  getSectionsByGrade,
  getAvailableTeachers,
  assignTeacherToSection,
  getInscriptionsByGrade,
  getAllInscriptions,
}
