import { BrigadaModel } from "../models/brigada.model.js"

/**
 * Crear una nueva brigada
 */
const crearBrigada = async (req, res) => {
  try {
    const { nombre } = req.body

    // Validación de campos obligatorios
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({
        ok: false,
        msg: "El nombre de la brigada es obligatorio",
      })
    }

    // Validar longitud del nombre
    if (nombre.length > 100) {
      return res.status(400).json({
        ok: false,
        msg: `El nombre de la brigada es demasiado largo. Máximo 100 caracteres, actual: ${nombre.length}`,
      })
    }

    const nuevaBrigada = await BrigadaModel.create({ nombre: nombre.trim() })

    return res.status(201).json({
      ok: true,
      msg: "Brigada creada exitosamente",
      brigada: nuevaBrigada,
    })
  } catch (error) {
    console.error("Error in crearBrigada:", error)
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
const obtenerTodasBrigadas = async (req, res) => {
  try {
    const brigadas = await BrigadaModel.findAll()

    return res.json({
      ok: true,
      brigadas,
      total: brigadas.length,
    })
  } catch (error) {
    console.error("Error in obtenerTodasBrigadas:", error)
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
const obtenerBrigadaPorId = async (req, res) => {
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
    console.error("Error in obtenerBrigadaPorId:", error)
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
const obtenerEstudiantesPorBrigada = async (req, res) => {
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

    const estudiantes = await BrigadaModel.getEstudiantesPorBrigada(id)

    return res.json({
      ok: true,
      brigada: {
        id: brigada.id,
        nombre: brigada.nombre,
        encargado: brigada.encargado_nombre
          ? `${brigada.encargado_nombre} ${brigada.encargado_apellido}`
          : "Sin encargado",
      },
      estudiantes,
      total: estudiantes.length,
    })
  } catch (error) {
    console.error("Error in obtenerEstudiantesPorBrigada:", error)
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
const asignarEncargado = async (req, res) => {
  try {
    const { id } = req.params
    const { personal_id, fecha_inicio } = req.body

    // Validaciones
    if (!personal_id) {
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

    const asignacion = await BrigadaModel.asignarEncargado(id, personal_id, fecha_inicio)

    return res.json({
      ok: true,
      msg: "Encargado asignado exitosamente",
      asignacion,
    })
  } catch (error) {
    console.error("Error in asignarEncargado:", error)
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
const inscribirEstudiantes = async (req, res) => {
  try {
    const { id } = req.params
    const { estudiante_ids } = req.body

    // Validaciones
    if (!estudiante_ids || !Array.isArray(estudiante_ids) || estudiante_ids.length === 0) {
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

    if (!brigada.brigada_docente_fecha_id) {
      return res.status(400).json({
        ok: false,
        msg: "La brigada debe tener un encargado asignado antes de inscribir estudiantes",
      })
    }

    const resultado = await BrigadaModel.inscribirEstudiantes(estudiante_ids, brigada.brigada_docente_fecha_id)

    return res.json({
      ok: true,
      msg: `${resultado.estudiantesInscritos} estudiantes inscritos exitosamente`,
      resultado,
    })
  } catch (error) {
    console.error("Error in inscribirEstudiantes:", error)
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
const limpiarBrigada = async (req, res) => {
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

    const resultado = await BrigadaModel.limpiarBrigada(id)

    return res.json({
      ok: true,
      msg: "Brigada limpiada exitosamente",
      resultado,
    })
  } catch (error) {
    console.error("Error in limpiarBrigada:", error)
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
const eliminarBrigada = async (req, res) => {
  try {
    const { id } = req.params

    // Verificar que la brigada existe
    const brigadaExistente = await BrigadaModel.findById(id)
    if (!brigadaExistente) {
      return res.status(404).json({
        ok: false,
        msg: "Brigada no encontrada",
      })
    }

    const resultado = await BrigadaModel.remove(id)

    return res.json({
      ok: true,
      msg: "Brigada eliminada exitosamente",
      brigada: resultado,
    })
  } catch (error) {
    console.error("Error in eliminarBrigada:", error)
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
const obtenerEstudiantesDisponibles = async (req, res) => {
  try {
    const estudiantes = await BrigadaModel.getEstudiantesDisponibles()

    return res.json({
      ok: true,
      estudiantes,
      total: estudiantes.length,
    })
  } catch (error) {
    console.error("Error in obtenerEstudiantesDisponibles:", error)
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
const obtenerDocentesDisponibles = async (req, res) => {
  try {
    const docentes = await BrigadaModel.getDocentesDisponibles()

    return res.json({
      ok: true,
      docentes,
      total: docentes.length,
    })
  } catch (error) {
    console.error("Error in obtenerDocentesDisponibles:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

export const BrigadaController = {
  crearBrigada,
  obtenerTodasBrigadas,
  obtenerBrigadaPorId,
  obtenerEstudiantesPorBrigada,
  asignarEncargado,
  inscribirEstudiantes,
  limpiarBrigada,
  eliminarBrigada,
  obtenerEstudiantesDisponibles,
  obtenerDocentesDisponibles,
}
