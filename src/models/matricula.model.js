import { db } from "../db/connection.database.js"

const create = async (matriculaData) => {
  try {
    const {
      estudiante_id,
      docente_grado_id,
      fecha_inscripcion,
      periodo_escolar,
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
      rif_representante,
      copia_cedula_autorizados_check,
    } = matriculaData

    const query = {
      text: `
        INSERT INTO matricula (
          estudiante_id, docente_grado_id, fecha_inscripcion, periodo_escolar, repitiente,
          talla_camisa, talla_pantalon, talla_zapatos, peso, estatura, enfermedades,
          observaciones, acta_nacimiento_check, tarjeta_vacunas_check, fotos_estudiante_check,
          fotos_representante_check, copia_cedula_representante_check, rif_representante,
          copia_cedula_autorizados_check, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `,
      values: [
        estudiante_id,
        docente_grado_id,
        fecha_inscripcion,
        periodo_escolar,
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
        rif_representante,
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
          m.*,
          e.nombre as estudiante_nombre,
          e.apellido as estudiante_apellido,
          e.cedula_escolar,
          g.nombre as grado_nombre,
          dg.seccion,
          p.nombre as docente_nombre,
          p.lastname as docente_apellido,
          r.name as representante_nombre,
          r.lastname as representante_apellido,
          r.cedula as representante_cedula,
          r.telephonenomber as representante_telefono
        FROM matricula m
        LEFT JOIN estudiante e ON m.estudiante_id = e.id
        LEFT JOIN docente_grado dg ON m.docente_grado_id = dg.id
        LEFT JOIN grado g ON dg.grado_id = g.id
        LEFT JOIN personal p ON dg.docente_id = p.id
        LEFT JOIN representante r ON e.id = r.estudiante_id
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
          e.nombre as estudiante_nombre,
          e.apellido as estudiante_apellido,
          e.cedula_escolar,
          e.sexo,
          e.lugarnacimiento_id,
          e.cant_hermanos,
          g.nombre as grado_nombre,
          dg.seccion,
          p.nombre as docente_nombre,
          p.lastname as docente_apellido,
          r.name as representante_nombre,
          r.lastname as representante_apellido,
          r.cedula as representante_cedula,
          r.telephonenomber as representante_telefono,
          r.email as representante_email,
          r.direccionhabitacion,
          r.lugar_trabajo,
          r.telefono_trabajo
        FROM matricula m
        LEFT JOIN estudiante e ON m.estudiante_id = e.id
        LEFT JOIN docente_grado dg ON m.docente_grado_id = dg.id
        LEFT JOIN grado g ON dg.grado_id = g.id
        LEFT JOIN personal p ON dg.docente_id = p.id
        LEFT JOIN representante r ON e.id = r.estudiante_id
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

const findByEstudianteId = async (estudiante_id) => {
  try {
    const query = {
      text: `
        SELECT 
          m.*,
          g.nombre as grado_nombre,
          dg.seccion,
          p.nombre as docente_nombre,
          p.lastname as docente_apellido
        FROM matricula m
        LEFT JOIN docente_grado dg ON m.docente_grado_id = dg.id
        LEFT JOIN grado g ON dg.grado_id = g.id
        LEFT JOIN personal p ON dg.docente_id = p.id
        WHERE m.estudiante_id = $1
        ORDER BY m.created_at DESC
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
          m.*,
          e.nombre as estudiante_nombre,
          e.apellido as estudiante_apellido,
          e.cedula_escolar,
          g.nombre as grado_nombre,
          dg.seccion,
          p.nombre as docente_nombre,
          p.lastname as docente_apellido
        FROM matricula m
        LEFT JOIN estudiante e ON m.estudiante_id = e.id
        LEFT JOIN docente_grado dg ON m.docente_grado_id = dg.id
        LEFT JOIN grado g ON dg.grado_id = g.id
        LEFT JOIN personal p ON dg.docente_id = p.id
        WHERE m.periodo_escolar = $1
        ORDER BY g.nombre, dg.seccion, e.apellido, e.nombre
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
      docente_grado_id,
      fecha_inscripcion,
      periodo_escolar,
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
      rif_representante,
      copia_cedula_autorizados_check,
    } = matriculaData

    const query = {
      text: `
        UPDATE matricula SET
          docente_grado_id = COALESCE($1, docente_grado_id),
          fecha_inscripcion = COALESCE($2, fecha_inscripcion),
          periodo_escolar = COALESCE($3, periodo_escolar),
          repitiente = COALESCE($4, repitiente),
          talla_camisa = COALESCE($5, talla_camisa),
          talla_pantalon = COALESCE($6, talla_pantalon),
          talla_zapatos = COALESCE($7, talla_zapatos),
          peso = COALESCE($8, peso),
          estatura = COALESCE($9, estatura),
          enfermedades = COALESCE($10, enfermedades),
          observaciones = COALESCE($11, observaciones),
          acta_nacimiento_check = COALESCE($12, acta_nacimiento_check),
          tarjeta_vacunas_check = COALESCE($13, tarjeta_vacunas_check),
          fotos_estudiante_check = COALESCE($14, fotos_estudiante_check),
          fotos_representante_check = COALESCE($15, fotos_representante_check),
          copia_cedula_representante_check = COALESCE($16, copia_cedula_representante_check),
          rif_representante = COALESCE($17, rif_representante),
          copia_cedula_autorizados_check = COALESCE($18, copia_cedula_autorizados_check),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $19
        RETURNING *
      `,
      values: [
        docente_grado_id,
        fecha_inscripcion,
        periodo_escolar,
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
        rif_representante,
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
      text: "DELETE FROM matricula WHERE id = $1 RETURNING id",
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
        SELECT id, nombre
        FROM grado
        ORDER BY nombre
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
          dg.id,
          dg.seccion,
          g.nombre as grado_nombre,
          p.nombre as docente_nombre,
          p.lastname as docente_apellido
        FROM docente_grado dg
        LEFT JOIN grado g ON dg.grado_id = g.id
        LEFT JOIN personal p ON dg.docente_id = p.id
        ORDER BY g.nombre, dg.seccion
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error("Error in getDocenteGrados:", error)
    throw error
  }
}

const checkExistingMatricula = async (estudiante_id, periodo_escolar) => {
  try {
    const query = {
      text: `
        SELECT id FROM matricula 
        WHERE estudiante_id = $1 AND periodo_escolar = $2
      `,
      values: [estudiante_id, periodo_escolar],
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
