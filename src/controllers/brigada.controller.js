import { BrigadaModel } from "../models/brigada.model.js"
import BrigadaService from "../services/brigada.service.js"

const getAllBrigades = async (req, res) => {
  try {
    const { academicPeriodId } = req.query // Get academicPeriodId from query parameters

    console.log("🔄 Obteniendo todas las brigadas...")

    const brigades = await BrigadaModel.findAll(academicPeriodId ? Number.parseInt(academicPeriodId) : null)

    console.log(`✅ ${brigades.length} brigadas obtenidas exitosamente`)

    const formattedBrigades = BrigadaService.formatBrigadeList(brigades)

    return res.status(200).json({
      ok: true,
      msg: "Brigadas obtenidas exitosamente",
      brigades: formattedBrigades,
      total: formattedBrigades.length,
    })
  } catch (error) {
    console.error("❌ Error en getAllBrigades:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor al obtener brigadas",
      error: error.message,
    })
  }
}

const getBrigadeById = async (req, res) => {
  try {
    const { id } = req.params
    const { academicPeriodId } = req.query // Get academicPeriodId from query parameters

    if (!id || isNaN(Number.parseInt(id))) {
      return res.status(400).json({
        ok: false,
        msg: "ID de brigada inválido",
      })
    }

    console.log(`🔍 Buscando brigada con ID: ${id}`)

    const brigade = await BrigadaModel.findById(Number.parseInt(id), academicPeriodId ? Number.parseInt(academicPeriodId) : null)

    if (!brigade) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    console.log("✅ Brigada encontrada exitosamente")

    const formattedBrigade = BrigadaService.formatBrigadeData(brigade)

    return res.status(200).json({
      ok: true,
      msg: "Brigada obtenida exitosamente",
      brigade: formattedBrigade,
    })
  } catch (error) {
    console.error("❌ Error en getBrigadeById:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor al obtener brigada",
      error: error.message,
    })
  }
}

const createBrigade = async (req, res) => {
  try {
    const { name } = req.body

    console.log(`➕ Creando nueva brigada: ${name}`)

    const newBrigade = await BrigadaModel.create({ name: name.trim() })

    console.log("✅ Brigada creada exitosamente")

    return res.status(201).json({
      ok: true,
      msg: "Brigada creada exitosamente",
      brigade: newBrigade,
    })
  } catch (error) {
    console.error("❌ Error en createBrigade:", error)

    if (error.code === "23505") {
      return res.status(409).json({
        ok: false,
        msg: "Ya existe una brigada con ese nombre",
      })
    }

    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor al crear brigada",
      error: error.message,
    })
  }
}

const updateBrigade = async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body

    if (!id || isNaN(Number.parseInt(id))) {
      return res.status(400).json({
        ok: false,
        msg: "ID de brigada inválido",
      })
    }

    console.log(`✏️ Actualizando brigada ID: ${id}`)

    // Verificar que la brigada existe
    const existingBrigade = await BrigadaModel.findById(Number.parseInt(id)) // No need for academicPeriodId here, just check existence
    if (!existingBrigade) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    const updatedBrigade = await BrigadaModel.update(Number.parseInt(id), { name: name.trim() })

    console.log("✅ Brigada actualizada exitosamente")

    return res.status(200).json({
      ok: true,
      msg: "Brigada actualizada exitosamente",
      brigade: updatedBrigade,
    })
  } catch (error) {
    console.error("❌ Error en updateBrigade:", error)

    if (error.code === "23505") {
      return res.status(409).json({
        ok: false,
        msg: "Ya existe una brigada con ese nombre",
      })
    }

    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor al actualizar brigada",
      error: error.message,
    })
  }
}

const deleteBrigade = async (req, res) => {
  try {
    const { id } = req.params

    if (!id || isNaN(Number.parseInt(id))) {
      return res.status(400).json({
        ok: false,
        msg: "ID de brigada inválido",
      })
    }

    console.log(`🗑️ Eliminando brigada ID: ${id}`)

    // Verificar que la brigada existe
    const existingBrigade = await BrigadaModel.findById(Number.parseInt(id)) // No need for academicPeriodId here, just check existence
    if (!existingBrigade) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    await BrigadaModel.remove(Number.parseInt(id))

    console.log("✅ Brigada eliminada exitosamente")

    return res.status(200).json({
      ok: true,
      msg: "Brigada eliminada exitosamente",
    })
  } catch (error) {
    console.error("❌ Error en deleteBrigade:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor al eliminar brigada",
      error: error.message,
    })
  }
}

const searchBrigades = async (req, res) => {
  try {
    const { name, academicPeriodId } = req.query // Get academicPeriodId from query parameters

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        ok: false,
        msg: "Parámetro de búsqueda 'name' es requerido",
      })
    }

    console.log(`🔍 Buscando brigadas con nombre: ${name}`)

    const brigades = await BrigadaModel.searchByName(name.trim(), academicPeriodId ? Number.parseInt(academicPeriodId) : null)

    console.log(`✅ ${brigades.length} brigadas encontradas`)

    return res.status(200).json({
      ok: true,
      msg: "Búsqueda completada exitosamente",
      brigades: brigades,
      total: brigades.length,
    })
  } catch (error) {
    console.error("❌ Error en searchBrigades:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor al buscar brigadas",
      error: error.message,
    })
  }
}

const getBrigadeStudents = async (req, res) => {
  try {
    const { id } = req.params
    const { academicPeriodId } = req.query // Get academicPeriodId from query parameters

    if (!id || isNaN(Number.parseInt(id))) {
      return res.status(400).json({
        ok: false,
        msg: "ID de brigada inválido",
      })
    }

    console.log(`👥 Obteniendo estudiantes de brigada ID: ${id}`)

    // Verificar que la brigada existe
    const brigade = await BrigadaModel.findById(Number.parseInt(id), academicPeriodId ? Number.parseInt(academicPeriodId) : null)
    if (!brigade) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    const students = await BrigadaModel.getStudentsByBrigade(Number.parseInt(id), academicPeriodId ? Number.parseInt(academicPeriodId) : null)

    console.log(`✅ ${students.length} estudiantes obtenidos`)

    return res.status(200).json({
      ok: true,
      msg: "Estudiantes obtenidos exitosamente",
      students: students,
      total: students.length,
    })
  } catch (error) {
    console.error("❌ Error en getBrigadeStudents:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor al obtener estudiantes",
      error: error.message,
    })
  }
}

const assignTeacher = async (req, res) => {
  try {
    const { id } = req.params
    const { personalId, startDate, academicPeriodId } = req.body // academicPeriodId can be passed in body

    if (!id || isNaN(Number.parseInt(id))) {
      return res.status(400).json({
        ok: false,
        msg: "ID de brigada inválido",
      })
    }

    if (!personalId || isNaN(Number.parseInt(personalId))) {
      return res.status(400).json({
        ok: false,
        msg: "ID de personal inválido",
      })
    }

    console.log(`👨‍🏫 Asignando docente ${personalId} a brigada ${id}`)

    // Verificar que la brigada existe
    const brigade = await BrigadaModel.findById(Number.parseInt(id)) // Check general brigade existence
    if (!brigade) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    const assignment = await BrigadaModel.assignTeacher(
      Number.parseInt(id),
      Number.parseInt(personalId),
      startDate || new Date().toISOString().split("T")[0],
      academicPeriodId ? Number.parseInt(academicPeriodId) : null,
    )

    console.log("✅ Docente asignado exitosamente")

    return res.status(200).json({
      ok: true,
      msg: "Docente asignado exitosamente",
      assignment: assignment,
    })
  } catch (error) {
    console.error("❌ Error en assignTeacher:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor al asignar docente",
      error: error.message,
    })
  }
}

const removeTeacher = async (req, res) => {
  try {
    const { id } = req.params
    const { academicPeriodId } = req.body // academicPeriodId can be passed in body for explicit removal

    if (!id || isNaN(Number.parseInt(id))) {
      return res.status(400).json({
        ok: false,
        msg: "ID de brigada inválido",
      })
    }

    console.log(`👨‍🏫 Removiendo docente de brigada ${id}`)

    // Verificar que la brigada existe
    const brigade = await BrigadaModel.findById(Number.parseInt(id)) // Check general brigade existence
    if (!brigade) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    const result = await BrigadaModel.removeTeacher(Number.parseInt(id), academicPeriodId ? Number.parseInt(academicPeriodId) : null)

    if (!result.removed) {
      return res.status(404).json({
        ok: false,
        msg: "No hay docente asignado a esta brigada para el período especificado o actual",
      })
    }

    console.log("✅ Docente removido exitosamente")

    return res.status(200).json({
      ok: true,
      msg: "Docente removido de la brigada exitosamente",
      result: result,
    })
  } catch (error) {
    console.error("❌ Error en removeTeacher:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor al remover docente",
      error: error.message,
    })
  }
}

const enrollStudents = async (req, res) => {
  try {
    const { id } = req.params
    const { studentIds, academicPeriodId } = req.body // academicPeriodId can be passed in body

    if (!id || isNaN(Number.parseInt(id))) {
      return res.status(400).json({
        ok: false,
        msg: "ID de brigada inválido",
      })
    }

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        ok: false,
        msg: "Debe proporcionar al menos un ID de estudiante",
      })
    }

    // Validar que todos los IDs sean números
    const validIds = studentIds.every((studentId) => !isNaN(Number.parseInt(studentId)))
    if (!validIds) {
      return res.status(400).json({
        ok: false,
        msg: "Todos los IDs de estudiantes deben ser números válidos",
      })
    }

    console.log(`👥 Inscribiendo ${studentIds.length} estudiantes en brigada ${id}`)

    // Verificar que la brigada existe
    const brigade = await BrigadaModel.findById(Number.parseInt(id)) // Check general brigade existence
    if (!brigade) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    const result = await BrigadaModel.enrollStudents(
      Number.parseInt(id),
      studentIds.map((studentId) => Number.parseInt(studentId)),
      academicPeriodId ? Number.parseInt(academicPeriodId) : null,
    )

    console.log(`✅ ${result.studentsEnrolled} estudiantes inscritos exitosamente`)

    return res.status(200).json({
      ok: true,
      msg: `${result.studentsEnrolled} de ${result.totalRequested} estudiantes inscritos exitosamente`,
      result: result,
    })
  } catch (error) {
    console.error("❌ Error en enrollStudents:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor al inscribir estudiantes",
      error: error.message,
    })
  }
}

const clearBrigade = async (req, res) => {
  try {
    const { id } = req.params
    const { academicPeriodId } = req.body // academicPeriodId can be passed in body for explicit clearing

    if (!id || isNaN(Number.parseInt(id))) {
      return res.status(400).json({
        ok: false,
        msg: "ID de brigada inválido",
      })
    }

    console.log(`🧹 Limpiando brigada ID: ${id}`)

    // Verificar que la brigada existe
    const brigade = await BrigadaModel.findById(Number.parseInt(id)) // Check general brigade existence
    if (!brigade) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    const result = await BrigadaModel.clearBrigade(Number.parseInt(id), academicPeriodId ? Number.parseInt(academicPeriodId) : null)

    console.log(`✅ Brigada limpiada: ${result.studentsRemoved} estudiantes removidos`)

    return res.status(200).json({
      ok: true,
      msg: `Brigada limpiada exitosamente. ${result.studentsRemoved} estudiantes removidos.`,
      result: result,
    })
  } catch (error) {
    console.error("❌ Error en clearBrigade:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor al limpiar brigada",
      error: error.message,
    })
  }
}

const getAvailableStudents = async (req, res) => {
  try {
    const { academicPeriodId } = req.query // Get academicPeriodId from query parameters

    console.log("👥 Obteniendo estudiantes disponibles...")

    const students = await BrigadaModel.getAvailableStudents(academicPeriodId ? Number.parseInt(academicPeriodId) : null)

    console.log(`✅ ${students.length} estudiantes disponibles obtenidos`)

    return res.status(200).json({
      ok: true,
      msg: "Estudiantes disponibles obtenidos exitosamente",
      students: students,
      total: students.length,
    })
  } catch (error) {
    console.error("❌ Error en getAvailableStudents:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor al obtener estudiantes disponibles",
      error: error.message,
    })
  }
}

const getAvailableTeachers = async (req, res) => {
  try {
    const { academicPeriodId } = req.query // Get academicPeriodId from query parameters

    console.log("👨‍🏫 Obteniendo docentes disponibles...")

    const teachers = await BrigadaModel.getAvailableTeachers(academicPeriodId ? Number.parseInt(academicPeriodId) : null)

    console.log(`✅ ${teachers.length} docentes disponibles obtenidos`)

    return res.status(200).json({
      ok: true,
      msg: "Docentes disponibles obtenidos exitosamente",
      teachers: teachers,
      total: teachers.length,
    })
  } catch (error) {
    console.error("❌ Error en getAvailableTeachers:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor al obtener docentes disponibles",
      error: error.message,
    })
  }
}

const removeStudentFromBrigade = async (req, res) => {
  try {
    const { id, studentId } = req.params
    const { academicPeriodId } = req.body // academicPeriodId can be passed in body

    if (!id || isNaN(Number.parseInt(id))) {
      return res.status(400).json({
        ok: false,
        msg: "ID de brigada inválido",
      })
    }

    if (!studentId || isNaN(Number.parseInt(studentId))) {
      return res.status(400).json({
        ok: false,
        msg: "ID de estudiante inválido",
      })
    }

    console.log(`👤 Removiendo estudiante ${studentId} de brigada ${id}`)

    const result = await BrigadaModel.removeStudentFromBrigade(Number.parseInt(id), Number.parseInt(studentId), academicPeriodId ? Number.parseInt(academicPeriodId) : null)

    if (!result.removed) {
      return res.status(404).json({
        ok: false,
        msg: "Estudiante no encontrado en la brigada para el período especificado o actual",
      })
    }

    console.log("✅ Estudiante removido exitosamente")

    return res.status(200).json({
      ok: true,
      msg: "Estudiante removido de la brigada exitosamente",
      result: result,
    })
  } catch (error) {
    console.error("❌ Error en removeStudentFromBrigade:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor al remover estudiante",
      error: error.message,
    })
  }
}

export const BrigadaController = {
  getAllBrigades,
  getBrigadeById,
  createBrigade,
  updateBrigade,
  deleteBrigade,
  searchBrigades,
  getBrigadeStudents,
  assignTeacher,
  removeTeacher,
  enrollStudents,
  clearBrigade,
  getAvailableStudents,
  getAvailableTeachers,
  removeStudentFromBrigade,
}