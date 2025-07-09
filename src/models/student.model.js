import { db } from "../db/connection.database.js"

const create = async (studentData) => {
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

    const query = {
      text: `
        INSERT INTO "student" (
          ci, name, "lastName", sex, birthday, "placeBirth", "parishID", status_id,
          "quantityBrothers", "representativeID", "motherName", "motherCi", "motherTelephone",
          "fatherName", "fatherCi", "fatherTelephone", "livesMother", "livesFather", 
          "livesBoth", "livesRepresentative", "rolRopresentative", created_at, updated_at
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
        parishID || 1,
        quantityBrothers || 0,
        representativeID,
        motherName,
        motherCi,
        motherTelephone,
        fatherName,
        fatherCi,
        fatherTelephone,
        livesMother || false,
        livesFather || false,
        livesBoth || false,
        livesRepresentative || false,
        rolRopresentative,
      ],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in create student:", error)
    throw error
  }
}

const findAll = async () => {
  try {
    const query = {
      text: `
        SELECT 
          s.*,
          st.name as status_name,
          r.name as representative_name,
          r."lastName" as representative_lastName
        FROM "student" s
        LEFT JOIN "status" st ON s.status_id = st.id
        LEFT JOIN "representative" r ON s."representativeID" = r.ci
        ORDER BY s."lastName", s.name
      `,
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in findAll students:", error)
    throw error
  }
}

const findById = async (id) => {
  try {
    const query = {
      text: `
        SELECT 
          s.*,
          st.name as status_name,
          r.name as representative_name,
          r."lastName" as representative_lastName,
          r."telephoneNumber" as representative_phone
        FROM "student" s
        LEFT JOIN "status" st ON s.status_id = st.id
        LEFT JOIN "representative" r ON s."representativeID" = r.ci
        WHERE s.id = $1
      `,
      values: [id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findById student:", error)
    throw error
  }
}

const findByCi = async (ci) => {
  try {
    const query = {
      text: `SELECT * FROM "student" WHERE ci = $1`,
      values: [ci],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findByCi student:", error)
    throw error
  }
}

const checkExistingCi = async (ci, excludeId = null) => {
  try {
    let query
    if (excludeId) {
      query = {
        text: 'SELECT id FROM "student" WHERE ci = $1 AND id != $2',
        values: [ci, excludeId],
      }
    } else {
      query = {
        text: 'SELECT id FROM "student" WHERE ci = $1',
        values: [ci],
      }
    }
    const { rows } = await db.query(query)
    return rows.length > 0
  } catch (error) {
    console.error("Error in checkExistingCi student:", error)
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
      text: `UPDATE "student" SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`,
      values: values,
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in update student:", error)
    throw error
  }
}

const remove = async (id) => {
  try {
    // Cambiar status a inactivo (2) en lugar de eliminar físicamente
    const query = {
      text: `
        UPDATE "student" SET
          status_id = 2,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `,
      values: [id],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in remove student:", error)
    throw error
  }
}

const search = async (term) => {
  try {
    const query = {
      text: `
        SELECT 
          s.*,
          st.name as status_name,
          r.name as representative_name,
          r."lastName" as representative_lastName
        FROM "student" s
        LEFT JOIN "status" st ON s.status_id = st.id
        LEFT JOIN "representative" r ON s."representativeID" = r.ci
        WHERE (
          s.ci ILIKE $1 OR 
          s.name ILIKE $1 OR 
          s."lastName" ILIKE $1 OR
          CONCAT(s.name, ' ', s."lastName") ILIKE $1
        )
        AND s.status_id = 1
        ORDER BY s."lastName", s.name
        LIMIT 50
      `,
      values: [`%${term.trim()}%`],
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in search students:", error)
    throw error
  }
}

export const StudentModel = {
  create,
  findAll,
  findById,
  findByCi,
  checkExistingCi,
  update,
  remove,
  search,
}
