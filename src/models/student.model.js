import { db } from "../db/connection.database.js"

// Crear registro básico de estudiante (sin inscripción)
const createStudentRegistry = async (studentData) => {
  try {
    const {
      ci,
      name,
      lastName,
      sex,
      birthday,
      placeBirth,
      parishID,
      quantityBrothers,
      representativeID,
      motherName,
      motherCi,
      motherTelephone,
      fatherName,
      fatherCi,
      fatherTelephone,
      livesMother,
      livesFather,
      livesBoth,
      livesRepresentative,
      rolRopresentative,
    } = studentData

    console.log("📝 Datos del estudiante a insertar:", studentData)

    // Validar campos requeridos
    if (!ci || !name || !lastName || !sex || !birthday || !representativeID) {
      throw new Error("Campos requeridos: CI, nombre, apellido, sexo, fecha de nacimiento y representante")
    }

    const query = {
      text: `
        INSERT INTO "student" (
          ci, name, "lastName", sex, birthday, "placeBirth", "parishID",
          status_id, "quantityBrothers", "representativeID", "motherName", 
          "motherCi", "motherTelephone", "fatherName", "fatherCi", "fatherTelephone",
          "livesMother", "livesFather", "livesBoth", "livesRepresentative", 
          "rolRopresentative", created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, 1, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `,
      values: [
        ci,
        name,
        lastName,
        sex,
        birthday,
        placeBirth || null,
        parishID || null,
        quantityBrothers || 0,
        representativeID,
        motherName || null,
        motherCi || null,
        motherTelephone || null,
        fatherName || null,
        fatherCi || null,
        fatherTelephone || null,
        livesMother || false,
        livesFather || false,
        livesBoth || false,
        livesRepresentative || false,
        rolRopresentative || null,
      ],
    }

    console.log("🔍 Query a ejecutar:", query)
    const { rows } = await db.query(query)
    console.log("✅ Estudiante insertado:", rows[0])
    return rows[0]
  } catch (error) {
    console.error("❌ Error in createStudentRegistry:", error)
    throw error
  }
}

// Obtener estudiantes registrados (sin inscribir) - status_id = 1 (Activo pero sin inscripción)
const getRegisteredStudents = async () => {
  try {
    const query = {
      text: `
        SELECT 
          s.*,
          r.name as representative_name,
          r."lastName" as representative_lastName,
          r."telephoneNumber" as representative_phone,
          r."maritalStat" as relationship,
          ss.descripcion as status_description
        FROM "student" s
        LEFT JOIN "representative" r ON s."representativeID" = r.ci
        LEFT JOIN "status_student" ss ON s.status_id = ss.id
        WHERE s.status_id = 1 AND s.id NOT IN (
          SELECT DISTINCT "studentID" FROM "enrollment" WHERE "studentID" IS NOT NULL
        )
        ORDER BY s.created_at DESC
      `,
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getRegisteredStudents:", error)
    throw error
  }
}

const findOneById = async (id) => {
  try {
    const query = {
      text: `
        SELECT 
          s.*,
          r.name as representative_name,
          r."lastName" as representative_lastName,
          r.ci as representative_ci,
          r."telephoneNumber" as representative_phone,
          ss.descripcion as status_description,
          p.name as parish_name
        FROM "student" s
        LEFT JOIN "representative" r ON s."representativeID" = r.ci
        LEFT JOIN "status_student" ss ON s.status_id = ss.id
        LEFT JOIN "parish" p ON s."parishID" = p.id
        WHERE s.id = $1
      `,
      values: [id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findOneById student:", error)
    throw error
  }
}

// Buscar estudiante por CI para inscripción
const findStudentForInscription = async (ci) => {
  try {
    const query = {
      text: `
        SELECT 
          s.*,
          r.name as representative_name,
          r."lastName" as representative_lastName,
          r."telephoneNumber" as representative_phone,
          r.email as representative_email,
          r."roomAdress" as representative_address,
          r."maritalStat" as relationship,
          r.profesion as occupation,
          ss.descripcion as status_description
        FROM "student" s
        LEFT JOIN "representative" r ON s."representativeID" = r.ci
        LEFT JOIN "status_student" ss ON s.status_id = ss.id
        WHERE s.ci = $1 AND s.status_id = 1 AND s.id NOT IN (
          SELECT DISTINCT "studentID" FROM "enrollment" WHERE "studentID" IS NOT NULL
        )
      `,
      values: [ci],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findStudentForInscription:", error)
    throw error
  }
}

// Buscar estudiante por CI (general)
const findStudentByCi = async (ci) => {
  try {
    const query = {
      text: `
        SELECT 
          s.*,
          r.name as representative_name,
          r."lastName" as representative_lastName,
          r."telephoneNumber" as representative_phone,
          ss.descripcion as status_description
        FROM "student" s
        LEFT JOIN "representative" r ON s."representativeID" = r.ci
        LEFT JOIN "status_student" ss ON s.status_id = ss.id
        WHERE s.ci = $1
      `,
      values: [ci],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findStudentByCi:", error)
    throw error
  }
}

// Actualizar estado del estudiante
const updateStudentStatus = async (studentId, statusId) => {
  try {
    const query = {
      text: `
        UPDATE "student" 
        SET status_id = $1, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $2 
        RETURNING *
      `,
      values: [statusId, studentId],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in updateStudentStatus:", error)
    throw error
  }
}

export const StudentModel = {
  createStudentRegistry,
  getRegisteredStudents,
  findOneById,
  findStudentForInscription,
  findStudentByCi,
  updateStudentStatus,
}
