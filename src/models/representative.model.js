import { db } from "../db/connection.database.js"

const create = async (representativeData) => {
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
        email,
        maritalStat,
        profesion,
        birthday,
        telephoneHouse,
        roomAdress,
        workPlace,
        jobNumber,
      ],
    }

    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in create representative:", error)
    throw error
  }
}

const findByCi = async (ci) => {
  try {
    const query = {
      text: `SELECT * FROM "representative" WHERE ci = $1`,
      values: [ci],
    }
    const { rows } = await db.query(query)
    return rows[0]
  } catch (error) {
    console.error("Error in findByCi representative:", error)
    throw error
  }
}

export const RepresentativeModel = {
  create,
  findByCi,
}
