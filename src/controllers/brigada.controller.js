import { BrigadaModel } from "../models/brigada.model.js"

/**
 * Crear una nueva brigada
 */
const createBrigada = async (req, res) => {
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

    const newBrigada = await BrigadaModel.create({ name: name.trim() })

    return res.status(201).json({
      ok: true,
      msg: "Brigada creada exitosamente",
      brigada: newBrigada,
    })
  } catch (error) {
    console.error("Error in createBrigada:", error)
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
const getAllBrigadas = async (req, res) => {
  try {
    const brigadas = await BrigadaModel.findAll()

    return res.json({
      ok: true,
      brigadas,
      total: brigadas.length,
    })
  } catch (error) {
    console.error("Error in getAllBrigadas:", error)
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
const getBrigadaById = async (req, res) => {
  try {
    const { id } = req.params

    const brigada = await BrigadaModel.findById(id)

    if (!brigada) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    return res.json({
      ok: true,
      brigada,
    })
  } catch (error) {
    console.error("Error in getBrigadaById:", error)
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
    const brigada = await BrigadaModel.findById(id)
    if (!brigada) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    const students = await BrigadaModel.getStudentsByBrigade(id)

    return res.json({
      ok: true,
      brigada: {
        id: brigada.id,
        name: brigada.name,
        encargado: brigada.encargado_nombre
          ? `${brigada.encargado_nombre} ${brigada.encargado_apellido}`
          : "Sin encargado",
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
    const { personalId, dateI } = req.body

    // Validaciones
    if (!personalId) {
      return res.status(400).json({
        ok: false,
        msg: "El ID del personal es obligatorio",
      })
    }

    // Verificar que la brigada existe
    const brigada = await BrigadaModel.findById(id)
    if (!brigada) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    // Verificar si ya tiene encargado
    if (brigada.encargado_nombre) {
      return res.status(400).json({
        ok: false,
        msg: "La brigada ya tiene un encargado asignado. Debe limpiar la brigada primero.",
      })
    }

    const assignment = await BrigadaModel.assignTeacher(id, personalId, dateI)

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
    const brigada = await BrigadaModel.findById(id)
    if (!brigada) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    if (!brigada.brigade_teacher_date_id) {
      return res.status(400).json({
        ok: false,
        msg: "La brigada debe tener un encargado asignado antes de inscribir estudiantes",
      })
    }

    const result = await BrigadaModel.enrollStudents(studentIds, brigada.brigade_teacher_date_id)

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
    const brigada = await BrigadaModel.findById(id)
    if (!brigada) {
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
const deleteBrigada = async (req, res) => {
  try {
    const { id } = req.params

    // Verificar que la brigada existe
    const existingBrigada = await BrigadaModel.findById(id)
    if (!existingBrigada) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    const result = await BrigadaModel.remove(id)

    return res.json({
      ok: true,
      msg: "Brigada eliminada exitosamente",
      brigada: result,
    })
  } catch (error) {
    console.error("Error in deleteBrigada:", error)
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

export const BrigadaController = {
  createBrigada,
  getAllBrigadas,
  getBrigadaById,
  getStudentsByBrigade,
  assignTeacher,
  enrollStudents,
  clearBrigade,
  deleteBrigada,
  getAvailableStudents,
  getAvailableTeachers,
}
