import { db } from "../db/connection.database.js"

const create = async (matriculaData) => {
  try {
    const {
      estudiante_id,
      section_id,
      fecha_inscripcion,
      repitiente,
      talla_camisa,
      talla_pantalon,
      talla_zapatos,
      peso,
      estatura,
      enfermedades,
      observaciones,
      acta_nacimiento_check,
      tarjeta_vacunas_check,
      fotos_estudiante_check,
      fotos_representante_check,
      copia_cedula_representante_check,
      copia_cedula_autorizados_check,
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
        estudiante_id,
        section_id,
        fecha_inscripcion,
        repitiente,
        talla_camisa,
        talla_pantalon,
        talla_zapatos,
        peso,
        estatura,
        enfermedades,
        observaciones,
        acta_nacimiento_check,
        tarjeta_vacunas_check,
        fotos_estudiante_check,
        fotos_representante_check,
        copia_cedula_representante_check,
        copia_cedula_autorizados_check,
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
          s."name" as estudiante_nombre,
          s."lastName" as estudiante_apellido,
          s."ci" as estudiante_cedula_escolar,
          g."name" as grado_nombre,
          sec."seccion",
          per."name" as docente_nombre,
          per."lastName" as docente_apellido,
          rep."name" as representante_nombre,
          rep."lastName" as representante_apellido,
          rep."ci" as representante_cedula,
          rep."telephoneNumber" as representante_telefono
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
          s."name" as estudiante_nombre,
          s."lastName" as estudiante_apellido,
          s."ci" as estudiante_cedula_escolar,
          s."sex" as estudiante_sexo,
          s."placeBirth" as estudiante_lugarnacimiento,
          s."quantityBrothers" as estudiante_cant_hermanos,
          g."name" as grado_nombre,
          sec."seccion",
          per."name" as docente_nombre,
          per."lastName" as docente_apellido,
          rep."name" as representante_nombre,
          rep."lastName" as representante_apellido,
          rep."ci" as representante_cedula,
          rep."telephoneNumber" as representante_telefono,
          rep."email" as representante_email,
          rep."roomAdress" as representante_direccionhabitacion,
          rep."workPlace" as representante_lugar_trabajo,
          rep."jobNumber" as representante_telefono_trabajo
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

const findByEstudianteId = async (estudiante_id) => {
  try {
    const query = {
      text: `
        SELECT
          e.*,
          g."name" as grado_nombre,
          sec."seccion",
          per."name" as docente_nombre,
          per."lastName" as docente_apellido
        FROM "enrollment" e
        LEFT JOIN "section" sec ON e."sectionID" = sec."id"
        LEFT JOIN "grade" g ON sec."gradeID" = g."id"
        LEFT JOIN "personal" per ON sec."teacherCI" = per."id"
        WHERE e."studentID" = $1
        ORDER BY e."created_at" DESC
      `,
      values: [estudiante_id],
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
          s."name" as estudiante_nombre,
          s."lastName" as estudiante_apellido,
          s."ci" as estudiante_cedula_escolar,
          g."name" as grado_nombre,
          sec."seccion",
          per."name" as docente_nombre,
          per."lastName" as docente_apellido
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
      section_id,
      fecha_inscripcion,
      repitiente,
      talla_camisa,
      talla_pantalon,
      talla_zapatos,
      peso,
      estatura,
      enfermedades,
      observaciones,
      acta_nacimiento_check,
      tarjeta_vacunas_check,
      fotos_estudiante_check,
      fotos_representante_check,
      copia_cedula_representante_check,
      copia_cedula_autorizados_check,
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
        section_id,
        fecha_inscripcion,
        repitiente,
        talla_camisa,
        talla_pantalon,
        talla_zapatos,
        peso,
        estatura,
        enfermedades,
        observaciones,
        acta_nacimiento_check,
        tarjeta_vacunas_check,
        fotos_estudiante_check,
        fotos_representante_check,
        copia_cedula_representante_check,
        copia_cedula_autorizados_check,
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
          g."name" as grado_nombre,
          per."name" as docente_nombre,
          per."lastName" as docente_apellido,
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

const checkExistingMatricula = async (estudiante_id, section_id) => {
  try {
    const query = {
      text: `
        SELECT "id" FROM "enrollment"
        WHERE "studentID" = $1 AND "sectionID" = $2
      `,
      values: [estudiante_id, section_id],
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