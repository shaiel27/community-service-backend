import { BrigadaModel } from "../models/brigada.model.js"

/**
 * Crear una nueva brigada
 */
const createBrigade = async (req, res) => {
  try {
    const { name } = req.body

    // Validación de campos obligatorios
    if (!name || name.trim() === "") {
      return res.status(400).json({
        ok: false,
        msg: "El nombre de la brigada es obligatorio",
      })
    }

    // Validar longitud del nombre
    if (name.length > 100) {
      return res.status(400).json({
        ok: false,
        msg: `El nombre de la brigada es demasiado largo. Máximo 100 caracteres, actual: ${name.length}`,
      })
    }

    const newBrigade = await BrigadaModel.create({ name: name.trim() })

    return res.status(201).json({
      ok: true,
      msg: "Brigada creada exitosamente",
      brigade: newBrigade,
    })
  } catch (error) {
    console.error("Error in createBrigade:", error)

    if (error.message.includes("demasiado largo")) {
      return res.status(400).json({
        ok: false,
        msg: error.message,
      })
    }

    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Obtener todas las brigadas
 */
const getAllBrigades = async (req, res) => {
  try {
    const brigades = await BrigadaModel.findAll()

    return res.json({
      ok: true,
      brigades,
      total: brigades.length,
    })
  } catch (error) {
    console.error("Error in getAllBrigades:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Obtener una brigada por ID
 */
const getBrigadeById = async (req, res) => {
  try {
    const { id } = req.params

    const brigade = await BrigadaModel.findById(id)

    if (!brigade) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    return res.json({
      ok: true,
      brigade,
    })
  } catch (error) {
    console.error("Error in getBrigadeById:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Actualizar una brigada
 */
const updateBrigade = async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body

    // Verificar que la brigada existe
    const existingBrigade = await BrigadaModel.findById(id)
    if (!existingBrigade) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    // Validar longitud del nombre si se proporciona
    if (name && name.length > 100) {
      return res.status(400).json({
        ok: false,
        msg: `El nombre de la brigada es demasiado largo. Máximo 100 caracteres, actual: ${name.length}`,
      })
    }

    const updatedBrigade = await BrigadaModel.update(id, { name })

    return res.json({
      ok: true,
      msg: "Brigada actualizada exitosamente",
      brigade: updatedBrigade,
    })
  } catch (error) {
    console.error("Error in updateBrigade:", error)

    if (error.message.includes("demasiado largo")) {
      return res.status(400).json({
        ok: false,
        msg: error.message,
      })
    }

    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Obtener estudiantes de una brigada
 */
const getStudentsByBrigade = async (req, res) => {
  try {
    const { id } = req.params

    // Verificar que la brigada existe
    const brigade = await BrigadaModel.findById(id)
    if (!brigade) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    const students = await BrigadaModel.getStudentsByBrigade(id)

    return res.json({
      ok: true,
      brigade: {
        id: brigade.id,
        name: brigade.name,
        teacher: brigade.encargado_name ? `${brigade.encargado_name} ${brigade.encargado_lastName}` : "Sin encargado",
      },
      students,
      total: students.length,
    })
  } catch (error) {
    console.error("Error in getStudentsByBrigade:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Asignar encargado a una brigada
 */
const assignTeacher = async (req, res) => {
  try {
    const { id } = req.params
    const { personalId, startDate } = req.body

    // Validaciones
    if (!personalId) {
      return res.status(400).json({
        ok: false,
        msg: "El ID del personal es obligatorio",
      })
    }

    // Verificar que la brigada existe
    const brigade = await BrigadaModel.findById(id)
    if (!brigade) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    // Verificar si ya tiene encargado
    if (brigade.encargado_name) {
      return res.status(400).json({
        ok: false,
        msg: "La brigada ya tiene un encargado asignado. Debe limpiar la brigada primero.",
      })
    }

    const assignment = await BrigadaModel.assignTeacher(id, personalId, startDate)

    return res.json({
      ok: true,
      msg: "Encargado asignado exitosamente",
      assignment,
    })
  } catch (error) {
    console.error("Error in assignTeacher:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Inscribir estudiantes en una brigada
 */
const enrollStudents = async (req, res) => {
  try {
    const { id } = req.params
    const { studentIds } = req.body

    // Validaciones
    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        ok: false,
        msg: "Debe proporcionar al menos un ID de estudiante",
      })
    }

    // Verificar que la brigada existe y tiene encargado
    const brigade = await BrigadaModel.findById(id)
    if (!brigade) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    if (!brigade.brigade_teacher_date_id) {
      return res.status(400).json({
        ok: false,
        msg: "La brigada debe tener un encargado asignado antes de inscribir estudiantes",
      })
    }

    const result = await BrigadaModel.enrollStudents(studentIds, brigade.brigade_teacher_date_id)

    return res.json({
      ok: true,
      msg: `${result.studentsEnrolled} estudiantes inscritos exitosamente`,
      result,
    })
  } catch (error) {
    console.error("Error in enrollStudents:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Limpiar una brigada (quitar encargado y estudiantes)
 */
const clearBrigade = async (req, res) => {
  try {
    const { id } = req.params

    // Verificar que la brigada existe
    const brigade = await BrigadaModel.findById(id)
    if (!brigade) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    const result = await BrigadaModel.clearBrigade(id)

    return res.json({
      ok: true,
      msg: "Brigada limpiada exitosamente",
      result,
    })
  } catch (error) {
    console.error("Error in clearBrigade:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Eliminar una brigada
 */
const deleteBrigade = async (req, res) => {
  try {
    const { id } = req.params

    // Verificar que la brigada existe
    const existingBrigade = await BrigadaModel.findById(id)
    if (!existingBrigade) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    const result = await BrigadaModel.remove(id)

    return res.json({
      ok: true,
      msg: "Brigada eliminada exitosamente",
      brigade: result,
    })
  } catch (error) {
    console.error("Error in deleteBrigade:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Obtener estudiantes disponibles para inscribir en brigadas
 */
const getAvailableStudents = async (req, res) => {
  try {
    const students = await BrigadaModel.getAvailableStudents()

    return res.json({
      ok: true,
      students,
      total: students.length,
    })
  } catch (error) {
    console.error("Error in getAvailableStudents:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Obtener personal disponible para ser encargado
 */
const getAvailableTeachers = async (req, res) => {
  try {
    const teachers = await BrigadaModel.getAvailableTeachers()

    return res.json({
      ok: true,
      teachers,
      total: teachers.length,
    })
  } catch (error) {
    console.error("Error in getAvailableTeachers:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Buscar brigadas por nombre
 */
const searchBrigades = async (req, res) => {
  try {
    const { name } = req.query

    if (!name) {
      return res.status(400).json({
        ok: false,
        msg: "El parámetro 'name' es requerido",
      })
    }

    const brigades = await BrigadaModel.searchByName(name)

    return res.json({
      ok: true,
      brigades,
      total: brigades.length,
    })
  } catch (error) {
    console.error("Error in searchBrigades:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

export const BrigadaController = {
  createBrigade,
  getAllBrigades,
  getBrigadeById,
  updateBrigade,
  getStudentsByBrigade,
  assignTeacher,
  enrollStudents,
  clearBrigade,
  deleteBrigade,
  getAvailableStudents,
  getAvailableTeachers,
  searchBrigades,
}
