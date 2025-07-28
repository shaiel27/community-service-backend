import { db } from "../db/connection.database.js"

// Crear representante usando la estructura existente
const createRepresentative = async (representativeData) => {
  try {
    const {
      ci,
      name,
      lastName,
      telephoneNumber,
      email,
      maritalStat,
      profesion,
      birthday,
      telephoneHouse,
      roomAdress,
      workPlace,
      jobNumber,
    } = representativeData

    console.log("👤 Datos del representante a insertar:", representativeData)

    // Validar campos requeridos
    if (!ci || !name || !lastName || !telephoneNumber) {
      throw new Error("Campos requeridos: CI, nombre, apellido y teléfono")
    }

    const query = {
      text: `
        INSERT INTO "representative" (
          ci, name, "lastName", "telephoneNumber", email, "maritalStat",
          profesion, birthday, "telephoneHouse", "roomAdress", "workPlace",
          "jobNumber", created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `,
      values: [
        ci,
        name,
        lastName,
        telephoneNumber,
        email || null,
        maritalStat || null,
        profesion || null,
        birthday || null,
        telephoneHouse || null,
        roomAdress || null,
        workPlace || null,
        jobNumber || null,
      ],
    }

    console.log("🔍 Query representante a ejecutar:", query)
    const { rows } = await db.query(query)
    console.log("✅ Representante insertado:", rows[0])
    return rows[0]
  } catch (error) {
    console.error("❌ Error in createRepresentative:", error)
    throw error
  }
}

// Obtener representante por CI
const getRepresentativeByCi = async (ci) => {
  try {
    const query = {
      text: `SELECT * FROM "representative" WHERE ci = $1`,
      values: [ci],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) { 
    console.error("Error in getRepresentativeByCi:", error)
    throw error
  }
}

// Obtener todos los representantes
const getAllRepresentatives = async () => {
  try {
    const query = {
      text: `
        SELECT 
          r.*,
          COUNT(s.id) as students_count
        FROM "representative" r
        LEFT JOIN "student" s ON r.ci = s."representativeID"
        GROUP BY r.ci, r.name, r."lastName", r."telephoneNumber", r.email, 
                 r."maritalStat", r.profesion, r.birthday, r."telephoneHouse", 
                 r."roomAdress", r."workPlace", r."jobNumber", r.created_at, r.updated_at
        ORDER BY r.created_at DESC
      `,
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getAllRepresentatives:", error)
    throw error
  }
}

// Actualizar representante
const updateRepresentative = async (ci, representativeData) => {
  try {
    const {
      name,
      lastName,
      telephoneNumber,
      email,
      maritalStat,
      profesion,
      birthday,
      telephoneHouse,
      roomAdress,
      workPlace,
      jobNumber,
    } = representativeData

    const query = {
      text: `
        UPDATE "representative" 
        SET name = $1, "lastName" = $2, "telephoneNumber" = $3, email = $4,
            "maritalStat" = $5, profesion = $6, birthday = $7, "telephoneHouse" = $8,
            "roomAdress" = $9, "workPlace" = $10, "jobNumber" = $11, updated_at = CURRENT_TIMESTAMP
        WHERE ci = $12
        RETURNING *
      `,
      values: [
        name,
        lastName,
        telephoneNumber,
        email,
        maritalStat,
        profesion,
        birthday,
        telephoneHouse,
        roomAdress,
        workPlace,
        jobNumber,
        ci,
      ],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in updateRepresentative:", error)
    throw error
  }
}

export const RepresentativeModel = {
  createRepresentative,
  getRepresentativeByCi,
  getAllRepresentatives,
  updateRepresentative,
}
