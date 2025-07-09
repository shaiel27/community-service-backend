import { BrigadaModel } from "../models/brigada.model.js"

// Manejador centralizado de errores
const handleError = (error, res) => {
  console.error("Brigada Controller Error:", error)

  if (error.message.includes("no encontrad")) {
    return res.status(404).json({
      ok: false,
      msg: error.message,
    })
  }

  if (error.message.includes("ya existe") || error.message.includes("duplicado")) {
    return res.status(409).json({
      ok: false,
      msg: error.message,
    })
  }

  if (error.message.includes("no tiene un docente asignado")) {
    return res.status(400).json({
      ok: false,
      msg: error.message,
    })
  }

  res.status(500).json({
    ok: false,
    msg: error.message || "Error interno del servidor",
  })
}

// Obtener todas las brigadas
const getAllBrigades = async (req, res) => {
  try {
    console.log("🔍 Obteniendo todas las brigadas...")
    const brigades = await BrigadaModel.findAll()

    console.log(`✅ Se encontraron ${brigades.length} brigadas`)
    res.json({
      ok: true,
      brigades,
    })
  } catch (error) {
    console.error("❌ Error obteniendo brigadas:", error)
    handleError(error, res)
  }
}

// Obtener brigada por ID
const getBrigadeById = async (req, res) => {
  try {
    const { id } = req.params
    console.log(`🔍 Buscando brigada con ID: ${id}`)

    const brigade = await BrigadaModel.findById(id)

    if (!brigade) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    console.log(`✅ Brigada encontrada: ${brigade.name}`)
    res.json({
      ok: true,
      brigade,
    })
  } catch (error) {
    console.error("❌ Error obteniendo brigada por ID:", error)
    handleError(error, res)
  }
}

// Crear nueva brigada
const createBrigade = async (req, res) => {
  try {
    const { name } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({
        ok: false,
        msg: "El nombre de la brigada es requerido",
      })
    }

    console.log(`➕ Creando nueva brigada: ${name}`)
    const newBrigade = await BrigadaModel.create({ name: name.trim() })

    console.log(`✅ Brigada creada exitosamente: ${newBrigade.name}`)
    res.status(201).json({
      ok: true,
      msg: "Brigada creada exitosamente",
      brigade: newBrigade,
    })
  } catch (error) {
    console.error("❌ Error creando brigada:", error)
    handleError(error, res)
  }
}

// Actualizar brigada
const updateBrigade = async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({
        ok: false,
        msg: "El nombre de la brigada es requerido",
      })
    }

    console.log(`✏️ Actualizando brigada ID ${id} con nombre: ${name}`)

    const brigade = await BrigadaModel.findById(id)
    if (!brigade) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    const updatedBrigade = await BrigadaModel.update(id, { name: name.trim() })

    console.log(`✅ Brigada actualizada exitosamente`)
    res.json({
      ok: true,
      msg: "Brigada actualizada exitosamente",
      brigade: updatedBrigade,
    })
  } catch (error) {
    console.error("❌ Error actualizando brigada:", error)
    handleError(error, res)
  }
}

// Eliminar brigada
const deleteBrigade = async (req, res) => {
  try {
    const { id } = req.params

    console.log(`🗑️ Eliminando brigada ID: ${id}`)

    const brigade = await BrigadaModel.findById(id)
    if (!brigade) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    await BrigadaModel.remove(id)

    console.log(`✅ Brigada eliminada exitosamente`)
    res.json({
      ok: true,
      msg: "Brigada eliminada exitosamente",
    })
  } catch (error) {
    console.error("❌ Error eliminando brigada:", error)
    handleError(error, res)
  }
}

// Buscar brigadas por nombre
const searchBrigades = async (req, res) => {
  try {
    const { name } = req.query

    if (!name || !name.trim()) {
      return res.status(400).json({
        ok: false,
        msg: "El término de búsqueda es requerido",
      })
    }

    console.log(`🔍 Buscando brigadas con término: ${name}`)
    const brigades = await BrigadaModel.searchByName(name.trim())

    console.log(`✅ Se encontraron ${brigades.length} brigadas`)
    res.json({
      ok: true,
      brigades,
    })
  } catch (error) {
    console.error("❌ Error buscando brigadas:", error)
    handleError(error, res)
  }
}

// Asignar docente a brigada
const assignTeacher = async (req, res) => {
  try {
    const { id } = req.params
    const { personalId, startDate } = req.body

    if (!personalId) {
      return res.status(400).json({
        ok: false,
        msg: "El ID del personal es requerido",
      })
    }

    console.log(`👨‍🏫 Asignando docente ${personalId} a brigada ${id}`)

    const brigade = await BrigadaModel.findById(id)
    if (!brigade) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    const assignment = await BrigadaModel.assignTeacher(id, personalId, startDate)

    console.log(`✅ Docente asignado exitosamente`)
    res.json({
      ok: true,
      msg: "Docente asignado exitosamente",
      assignment,
    })
  } catch (error) {
    console.error("❌ Error asignando docente:", error)
    handleError(error, res)
  }
}

// Obtener estudiantes de una brigada
const getBrigadeStudents = async (req, res) => {
  try {
    const { id } = req.params

    console.log(`👥 Obteniendo estudiantes de brigada ${id}`)

    const brigade = await BrigadaModel.findById(id)
    if (!brigade) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    const students = await BrigadaModel.getStudentsByBrigade(id)

    console.log(`✅ Se encontraron ${students.length} estudiantes`)
    res.json({
      ok: true,
      students,
    })
  } catch (error) {
    console.error("❌ Error obteniendo estudiantes de brigada:", error)
    handleError(error, res)
  }
}

// Obtener estudiantes disponibles
const getAvailableStudents = async (req, res) => {
  try {
    console.log("👥 Obteniendo estudiantes disponibles...")
    const students = await BrigadaModel.getAvailableStudents()

    console.log(`✅ Se encontraron ${students.length} estudiantes disponibles`)
    res.json({
      ok: true,
      students,
    })
  } catch (error) {
    console.error("❌ Error obteniendo estudiantes disponibles:", error)
    handleError(error, res)
  }
}

// Obtener docentes disponibles
const getAvailableTeachers = async (req, res) => {
  try {
    console.log("👨‍🏫 Obteniendo docentes disponibles...")
    const teachers = await BrigadaModel.getAvailableTeachers()

    console.log(`✅ Se encontraron ${teachers.length} docentes disponibles`)
    res.json({
      ok: true,
      teachers,
    })
  } catch (error) {
    console.error("❌ Error obteniendo docentes disponibles:", error)
    handleError(error, res)
  }
}

// Inscribir estudiantes en brigada
const enrollStudents = async (req, res) => {
  try {
    const { id } = req.params
    const { studentIds } = req.body

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        ok: false,
        msg: "Debe proporcionar al menos un ID de estudiante",
      })
    }

    console.log(`👥 Inscribiendo ${studentIds.length} estudiantes en brigada ${id}`)

    const brigade = await BrigadaModel.findById(id)
    if (!brigade) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    const result = await BrigadaModel.enrollStudents(id, studentIds)

    console.log(`✅ ${result.studentsEnrolled} estudiantes inscritos exitosamente`)
    res.json({
      ok: true,
      msg: `${result.studentsEnrolled} estudiantes inscritos exitosamente`,
      result,
    })
  } catch (error) {
    console.error("❌ Error inscribiendo estudiantes:", error)
    handleError(error, res)
  }
}

// Limpiar brigada
const clearBrigade = async (req, res) => {
  try {
    const { id } = req.params

    console.log(`🧹 Limpiando brigada ${id}`)

    const brigade = await BrigadaModel.findById(id)
    if (!brigade) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    const result = await BrigadaModel.clearBrigade(id)

    console.log(`✅ ${result.studentsRemoved} estudiantes removidos de la brigada`)
    res.json({
      ok: true,
      msg: `${result.studentsRemoved} estudiantes removidos de la brigada`,
      result,
    })
  } catch (error) {
    console.error("❌ Error limpiando brigada:", error)
    handleError(error, res)
  }
}

export const BrigadaController = {
  getAllBrigades,
  getBrigadeById,
  createBrigade,
  updateBrigade,
  deleteBrigade,
  searchBrigades,
  assignTeacher,
  getBrigadeStudents,
  getAvailableStudents,
  getAvailableTeachers,
  enrollStudents,
  clearBrigade,
}
