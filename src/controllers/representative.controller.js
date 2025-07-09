import { db } from "../db/connection.database.js"

class RepresentativeController {
  // Crear nuevo representante
  static async create(req, res) {
    try {
      console.log("📝 Creando nuevo representante...")
      console.log("Datos recibidos:", req.body)

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
      } = req.body

      // Validaciones básicas
      if (!ci || !name || !lastName) {
        return res.status(400).json({
          ok: false,
          msg: "Cédula, nombre y apellido son campos requeridos",
        })
      }

      // Verificar si ya existe un representante con esa cédula
      const existingRepresentative = await db.query({
        text: 'SELECT ci FROM "representative" WHERE ci = $1',
        values: [ci],
      })

      if (existingRepresentative.rows.length > 0) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un representante registrado con esa cédula",
        })
      }

      // Crear el representante
      const query = {
        text: `
          INSERT INTO "representative" (
            ci, name, "lastName", "telephoneNumber", email, "maritalStat", 
            profesion, birthday, "telephoneHouse", "roomAdress", "workPlace", 
            "jobNumber", created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          RETURNING *
        `,
        values: [
          ci,
          name,
          lastName,
          telephoneNumber || null,
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

      const result = await db.query(query)
      const newRepresentative = result.rows[0]

      console.log("✅ Representante creado exitosamente:", newRepresentative.ci)

      res.status(201).json({
        ok: true,
        msg: "Representante creado exitosamente",
        representative: newRepresentative,
      })
    } catch (error) {
      console.error("❌ Error creando representante:", error)
      res.status(500).json({
        ok: false,
        msg: "Error interno del servidor al crear representante",
        error: error.message,
      })
    }
  }

  // Obtener todos los representantes
  static async findAll(req, res) {
    try {
      console.log("🔍 Obteniendo todos los representantes...")

      const query = {
        text: `
          SELECT *
          FROM "representative"
          ORDER BY "lastName", name
        `,
      }

      const result = await db.query(query)

      res.json({
        ok: true,
        representatives: result.rows,
        total: result.rows.length,
      })
    } catch (error) {
      console.error("❌ Error obteniendo representantes:", error)
      res.status(500).json({
        ok: false,
        msg: "Error interno del servidor al obtener representantes",
        error: error.message,
      })
    }
  }

  // Obtener representante por CI
  static async findByCi(req, res) {
    try {
      const { ci } = req.params
      console.log(`🔍 Obteniendo representante CI: ${ci}`)

      if (!ci) {
        return res.status(400).json({
          ok: false,
          msg: "CI de representante requerido",
        })
      }

      const query = {
        text: `SELECT * FROM "representative" WHERE ci = $1`,
        values: [ci],
      }

      const result = await db.query(query)

      if (result.rows.length === 0) {
        return res.status(404).json({
          ok: false,
          msg: "Representante no encontrado",
        })
      }

      res.json({
        ok: true,
        representative: result.rows[0],
      })
    } catch (error) {
      console.error("❌ Error obteniendo representante:", error)
      res.status(500).json({
        ok: false,
        msg: "Error interno del servidor al obtener representante",
        error: error.message,
      })
    }
  }

  // Buscar representantes
  static async search(req, res) {
    try {
      const { term } = req.query
      console.log(`🔍 Buscando representantes con término: ${term}`)

      if (!term || term.trim().length < 2) {
        return res.status(400).json({
          ok: false,
          msg: "El término de búsqueda debe tener al menos 2 caracteres",
        })
      }

      const query = {
        text: `
          SELECT *
          FROM "representative"
          WHERE (
            ci ILIKE $1 OR 
            name ILIKE $1 OR 
            "lastName" ILIKE $1 OR
            CONCAT(name, ' ', "lastName") ILIKE $1
          )
          ORDER BY "lastName", name
          LIMIT 50
        `,
        values: [`%${term.trim()}%`],
      }

      const result = await db.query(query)

      res.json({
        ok: true,
        representatives: result.rows,
        total: result.rows.length,
        searchTerm: term,
      })
    } catch (error) {
      console.error("❌ Error buscando representantes:", error)
      res.status(500).json({
        ok: false,
        msg: "Error interno del servidor al buscar representantes",
        error: error.message,
      })
    }
  }

  // Actualizar representante
  static async update(req, res) {
    try {
      const { ci } = req.params
      console.log(`📝 Actualizando representante CI: ${ci}`)

      if (!ci) {
        return res.status(400).json({
          ok: false,
          msg: "CI de representante requerido",
        })
      }

      const updateData = req.body

      // Verificar si el representante existe
      const existingRepresentative = await db.query({
        text: 'SELECT ci FROM "representative" WHERE ci = $1',
        values: [ci],
      })

      if (existingRepresentative.rows.length === 0) {
        return res.status(404).json({
          ok: false,
          msg: "Representante no encontrado",
        })
      }

      // Construir query dinámicamente
      const fields = []
      const values = []
      let paramCount = 1

      Object.keys(updateData).forEach((key) => {
        if (updateData[key] !== undefined && key !== "ci") {
          fields.push(`"${key}" = $${paramCount}`)
          values.push(updateData[key])
          paramCount++
        }
      })

      if (fields.length === 0) {
        return res.status(400).json({
          ok: false,
          msg: "No hay campos para actualizar",
        })
      }

      fields.push(`updated_at = CURRENT_TIMESTAMP`)
      values.push(ci)

      const query = {
        text: `UPDATE "representative" SET ${fields.join(", ")} WHERE ci = $${paramCount} RETURNING *`,
        values: values,
      }

      const result = await db.query(query)

      console.log("✅ Representante actualizado exitosamente")

      res.json({
        ok: true,
        msg: "Representante actualizado exitosamente",
        representative: result.rows[0],
      })
    } catch (error) {
      console.error("❌ Error actualizando representante:", error)
      res.status(500).json({
        ok: false,
        msg: "Error interno del servidor al actualizar representante",
        error: error.message,
      })
    }
  }

  // Eliminar representante
  static async delete(req, res) {
    try {
      const { ci } = req.params
      console.log(`🗑️ Eliminando representante CI: ${ci}`)

      if (!ci) {
        return res.status(400).json({
          ok: false,
          msg: "CI de representante requerido",
        })
      }

      // Verificar si tiene estudiantes asociados
      const studentsCount = await db.query({
        text: 'SELECT COUNT(*) as count FROM "student" WHERE "representativeID" = $1',
        values: [ci],
      })

      if (Number.parseInt(studentsCount.rows[0].count) > 0) {
        return res.status(400).json({
          ok: false,
          msg: "No se puede eliminar el representante porque tiene estudiantes asociados",
        })
      }

      // Eliminar representante
      const query = {
        text: 'DELETE FROM "representative" WHERE ci = $1 RETURNING *',
        values: [ci],
      }

      const result = await db.query(query)

      if (result.rows.length === 0) {
        return res.status(404).json({
          ok: false,
          msg: "Representante no encontrado",
        })
      }

      console.log("✅ Representante eliminado exitosamente")

      res.json({
        ok: true,
        msg: "Representante eliminado exitosamente",
        representative: result.rows[0],
      })
    } catch (error) {
      console.error("❌ Error eliminando representante:", error)
      res.status(500).json({
        ok: false,
        msg: "Error interno del servidor al eliminar representante",
        error: error.message,
      })
    }
  }
}

export { RepresentativeController }
