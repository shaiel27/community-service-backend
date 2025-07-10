import { db } from "../db/connection.database.js"

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
      ],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in createStudentRegistry:", error)
    throw error
  }
}

// Buscar estudiante registrado (status_id = 1)
const findRegisteredStudents = async () => {
  try {
    const query = {
      text: `
        SELECT 
          s.*,
          r.name as representative_name,
          r."lastName" as representative_lastName,
          r.ci as representative_ci,
          r."telephoneNumber" as representative_phone
        FROM "student" s
        JOIN "representative" r ON s."representativeID" = r.ci
        WHERE s.status_id = 1
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

// Buscar estudiante para inscripción (status_id = 1)
const findStudentForInscription = async (ci) => {
  try {
    const query = {
      text: `
        SELECT 
          s.*,
          r.name as representative_name,
          r."lastName" as representative_lastName,
          r.ci as representative_ci,
          r."telephoneNumber" as representative_phone
        FROM "student" s
        JOIN "representative" r ON s."representativeID" = r.ci
        WHERE s.ci = $1 AND s.status_id = 1
      `,
      values: [ci],
    }
    const { rows } = await db.query(query)
    return rows[0] // Retorna el primer estudiante encontrado o undefined
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
    if (rows.length === 0) {
      throw new Error(`Estudiante con ID ${studentId} no encontrado.`)
    }
    return rows[0]
  } catch (error) {
    console.error("Error in updateStudentStatus:", error)
    throw error
  }
}

// Obtener todos los estudiantes, sin importar el estado de inscripción
const getAllStudents = async () => {
  try {
    const query = {
      text: `
        SELECT 
          s.*,
          r.name AS representative_name,
          r."lastName" AS "representative_lastName",
          r."telephoneNumber" AS representative_phone,
          ss.descripcion AS status_description,
          CASE 
            WHEN e."studentID" IS NOT NULL THEN TRUE
            ELSE FALSE
          END AS is_enrolled
        FROM "student" s
        LEFT JOIN "representative" r ON s."representativeID" = r.ci
        LEFT JOIN "status_student" ss ON s.status_id = ss.id
        LEFT JOIN "enrollment" e ON s.id = e."studentID"
        ORDER BY s.created_at DESC
      `,
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getAllStudents:", error)
    throw error
  }
}

// Obtener un estudiante por ID
const findOneById = async (id) => {
  try {
    const query = {
      text: `SELECT * FROM "student" WHERE id = $1`,
      values: [id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findOneById (student.model):", error)
    throw error
  }
}

// Actualizar datos del estudiante
const updateStudent = async (id, updateData) => {
  try {
    const setClauses = []
    const values = []
    let paramIndex = 1

    for (const key in updateData) {
      if (updateData.hasOwnProperty(key)) {
        setClauses.push(`"${key}" = $${paramIndex}`)
        values.push(updateData[key])
        paramIndex++
      }
    }

    if (setClauses.length === 0) {
      return null // No hay datos para actualizar
    }

    setClauses.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(id) // El ID es el último valor

    const query = {
      text: `
        UPDATE "student"
        SET ${setClauses.join(", ")}
        WHERE id = $${paramIndex}
        RETURNING *
      `,
      values: values,
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in updateStudent (student.model):", error)
    throw error
  }
}

// Eliminar estudiante (eliminación lógica o física, dependiendo de la política)
const deleteStudent = async (id) => {
  try {
    // Aquí se puede elegir entre eliminación física o lógica
    // Eliminación física:
    const query = {
      text: `DELETE FROM "student" WHERE id = $1 RETURNING *`,
      values: [id],
    }
    
    // Si se opta por eliminación lógica, se actualizaría un campo 'isActive' o 'deleted_at'
    // Ejemplo de eliminación lógica:
    // const query = {
    //   text: `UPDATE "student" SET status_id = 5, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`, // Suponiendo status_id = 5 para "eliminado"
    //   values: [id],
    // };

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in deleteStudent (student.model):", error)
    throw error
  }
}


export const StudentModel = {
  createStudentRegistry,
  findRegisteredStudents,
  findStudentForInscription,
  findStudentByCi,
  updateStudentStatus,
  getAllStudents,
  findOneById,
  updateStudent,
  deleteStudent,
}