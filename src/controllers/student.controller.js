import { db } from "../db/connection.database.js"

class StudentController {
  // Crear nuevo estudiante
  static async create(req, res) {
    try {
      console.log("📝 Creando nuevo estudiante...")
      console.log("Datos recibidos:", req.body)

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
      } = req.body

      // Validaciones básicas
      if (!ci || !name || !lastName) {
        return res.status(400).json({
          ok: false,
          msg: "Cédula, nombre y apellido son campos requeridos",
        })
      }

      // Verificar si ya existe un estudiante con esa cédula
      const existingStudent = await db.query({
        text: 'SELECT id FROM "student" WHERE ci = $1',
        values: [ci],
      })

      if (existingStudent.rows.length > 0) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un estudiante registrado con esa cédula",
        })
      }

      // Crear el estudiante
      const query = {
        text: `
          INSERT INTO "student" (
            ci, name, "lastName", sex, birthday, "placeBirth", "parishID", status_id,
            "quantityBrothers", "representativeID", "motherName", "motherCi", "motherTelephone",
            "fatherName", "fatherCi", "fatherTelephone", "livesMother", "livesFather", 
            "livesBoth", "livesRepresentative", "rolRopresentative", created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, 1, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          RETURNING *
        `,
        values: [
          ci,
          name,
          lastName,
          sex,
          birthday || null,
          placeBirth || null,
          parishID || 1,
          quantityBrothers || 0,
          representativeID || null,
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

      const result = await db.query(query)
      const newStudent = result.rows[0]

      console.log("✅ Estudiante creado exitosamente:", newStudent.id)

      res.status(201).json({
        ok: true,
        msg: "Estudiante creado exitosamente",
        student: newStudent,
      })
    } catch (error) {
      console.error("❌ Error creando estudiante:", error)
      res.status(500).json({
        ok: false,
        msg: "Error interno del servidor al crear estudiante",
        error: error.message,
      })
    }
  }

  // Obtener todos los estudiantes
  static async findAll(req, res) {
    try {
      console.log("🔍 Obteniendo todos los estudiantes...")

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

      const result = await db.query(query)

      res.json({
        ok: true,
        students: result.rows,
        total: result.rows.length,
      })
    } catch (error) {
      console.error("❌ Error obteniendo estudiantes:", error)
      res.status(500).json({
        ok: false,
        msg: "Error interno del servidor al obtener estudiantes",
        error: error.message,
      })
    }
  }

  // Obtener estudiante por ID
  static async findById(req, res) {
    try {
      const { id } = req.params
      console.log(`🔍 Obteniendo estudiante ID: ${id}`)

      if (!id || isNaN(id)) {
        return res.status(400).json({
          ok: false,
          msg: "ID de estudiante inválido",
        })
      }

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

      const result = await db.query(query)

      if (result.rows.length === 0) {
        return res.status(404).json({
          ok: false,
          msg: "Estudiante no encontrado",
        })
      }

      res.json({
        ok: true,
        student: result.rows[0],
      })
    } catch (error) {
      console.error("❌ Error obteniendo estudiante:", error)
      res.status(500).json({
        ok: false,
        msg: "Error interno del servidor al obtener estudiante",
        error: error.message,
      })
    }
  }

  // Buscar estudiantes por cédula
  static async search(req, res) {
    try {
      const { ci } = req.query
      console.log(`🔍 Buscando estudiante con CI: ${ci}`)

      if (!ci || ci.trim().length < 2) {
        return res.status(400).json({
          ok: false,
          msg: "La cédula debe tener al menos 2 caracteres",
        })
      }

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
          WHERE s.ci ILIKE $1 AND s.status_id = 1
          ORDER BY s."lastName", s.name
          LIMIT 10
        `,
        values: [`%${ci.trim()}%`],
      }

      const result = await db.query(query)

      res.json({
        ok: true,
        students: result.rows,
        total: result.rows.length,
        searchTerm: ci,
      })
    } catch (error) {
      console.error("❌ Error buscando estudiantes:", error)
      res.status(500).json({
        ok: false,
        msg: "Error interno del servidor al buscar estudiantes",
        error: error.message,
      })
    }
  }

  // Actualizar estudiante
  static async update(req, res) {
    try {
      const { id } = req.params
      console.log(`📝 Actualizando estudiante ID: ${id}`)

      if (!id || isNaN(id)) {
        return res.status(400).json({
          ok: false,
          msg: "ID de estudiante inválido",
        })
      }

      const updateData = req.body

      // Verificar si el estudiante existe
      const existingStudent = await db.query({
        text: 'SELECT id FROM "student" WHERE id = $1',
        values: [id],
      })

      if (existingStudent.rows.length === 0) {
        return res.status(404).json({
          ok: false,
          msg: "Estudiante no encontrado",
        })
      }

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
        return res.status(400).json({
          ok: false,
          msg: "No hay campos para actualizar",
        })
      }

      fields.push(`updated_at = CURRENT_TIMESTAMP`)
      values.push(id)

      const query = {
        text: `UPDATE "student" SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`,
        values: values,
      }

      const result = await db.query(query)

      console.log("✅ Estudiante actualizado exitosamente")

      res.json({
        ok: true,
        msg: "Estudiante actualizado exitosamente",
        student: result.rows[0],
      })
    } catch (error) {
      console.error("❌ Error actualizando estudiante:", error)
      res.status(500).json({
        ok: false,
        msg: "Error interno del servidor al actualizar estudiante",
        error: error.message,
      })
    }
  }

  // Eliminar estudiante (cambiar status)
  static async delete(req, res) {
    try {
      const { id } = req.params
      console.log(`🗑️ Eliminando estudiante ID: ${id}`)

      if (!id || isNaN(id)) {
        return res.status(400).json({
          ok: false,
          msg: "ID de estudiante inválido",
        })
      }

      // Verificar si el estudiante existe
      const existingStudent = await db.query({
        text: 'SELECT id FROM "student" WHERE id = $1',
        values: [id],
      })

      if (existingStudent.rows.length === 0) {
        return res.status(404).json({
          ok: false,
          msg: "Estudiante no encontrado",
        })
      }

      // Cambiar status a inactivo (2)
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

      const result = await db.query(query)

      console.log("✅ Estudiante eliminado exitosamente")

      res.json({
        ok: true,
        msg: "Estudiante eliminado exitosamente",
        student: result.rows[0],
      })
    } catch (error) {
      console.error("❌ Error eliminando estudiante:", error)
      res.status(500).json({
        ok: false,
        msg: "Error interno del servidor al eliminar estudiante",
        error: error.message,
      })
    }
  }
}

export { StudentController }
