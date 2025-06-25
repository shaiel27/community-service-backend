import { MatriculaModel } from "../models/matricula.model.js"

const createMatricula = async (req, res) => {
  try {
    const {
      estudiante_id,
      section_id, // Cambiado de docente_grado_id a section_id
      fecha_inscripcion,
      // periodo_escolar ya no es necesario aquí, se obtiene de la sección
      repitiente = false,
      talla_camisa,
      talla_pantalon,
      talla_zapatos,
      peso,
      estatura,
      enfermedades,
      observaciones,
      acta_nacimiento_check = false,
      tarjeta_vacunas_check = false,
      fotos_estudiante_check = false,
      fotos_representante_check = false,
      copia_cedula_representante_check = false,
      rif_representante = false,
      copia_cedula_autorizados_check = false,
    } = req.body

    // Validaciones obligatorias: ahora section_id es clave
    if (!estudiante_id || !section_id || !fecha_inscripcion) {
      return res.status(400).json({
        ok: false,
        msg: "Campos obligatorios: estudiante_id, section_id, fecha_inscripcion",
      })
    }

    // Validar que no exista una matrícula para el mismo estudiante en la misma sección
    // El modelo MatriculaModel.checkExistingMatricula ahora espera section_id
    const existingMatricula = await MatriculaModel.checkExistingMatricula(estudiante_id, section_id)
    if (existingMatricula) {
      return res.status(400).json({
        ok: false,
        msg: "El estudiante ya tiene una matrícula registrada para esta sección",
      })
    }

    // Validaciones de formato
    if (peso && (peso < 0 || peso > 200)) {
      return res.status(400).json({
        ok: false,
        msg: "El peso debe estar entre 0 y 200 kg",
      })
    }

    if (estatura && (estatura < 0 || estatura > 3)) {
      return res.status(400).json({
        ok: false,
        msg: "La estatura debe estar entre 0 y 3 metros",
      })
    }

    // Validar longitud de campos de texto
    if (enfermedades && enfermedades.length > 100) {
      return res.status(400).json({
        ok: false,
        msg: "El campo enfermedades no puede exceder 100 caracteres",
      })
    }

    if (observaciones && observaciones.length > 100) {
      return res.status(400).json({
        ok: false,
        msg: "El campo observaciones no puede exceder 100 caracteres",
      })
    }

    if (talla_camisa && talla_camisa.length > 10) {
      return res.status(400).json({
        ok: false,
        msg: "La talla de camisa no puede exceder 10 caracteres",
      })
    }

    if (talla_pantalon && talla_pantalon.length > 10) {
      return res.status(400).json({
        ok: false,
        msg: "La talla de pantalón no puede exceder 10 caracteres",
      })
    }

    if (talla_zapatos && talla_zapatos.length > 10) {
      return res.status(400).json({
        ok: false,
        msg: "La talla de zapatos no puede exceder 10 caracteres",
      })
    }

    const newMatricula = await MatriculaModel.create({
      estudiante_id,
      section_id, // Pasamos section_id al modelo
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
      rif_representante,
      copia_cedula_autorizados_check,
    })

    return res.status(201).json({
      ok: true,
      msg: "Matrícula creada exitosamente",
      matricula: newMatricula,
    })
  } catch (error) {
    console.error("Error in createMatricula:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

const getAllMatriculas = async (req, res) => {
  try {
    const matriculas = await MatriculaModel.findAll()

    return res.json({
      ok: true,
      matriculas,
      total: matriculas.length,
    })
  } catch (error) {
    console.error("Error in getAllMatriculas:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

const getMatriculaById = async (req, res) => {
  try {
    const { id } = req.params

    const matricula = await MatriculaModel.findById(id)

    if (!matricula) {
      return res.status(404).json({
        ok: false,
        msg: "Matrícula no encontrada",
      })
    }

    return res.json({
      ok: true,
      matricula,
    })
  } catch (error) {
    console.error("Error in getMatriculaById:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

const getMatriculasByEstudiante = async (req, res) => {
  try {
    const { estudiante_id } = req.params

    const matriculas = await MatriculaModel.findByEstudianteId(estudiante_id)

    return res.json({
      ok: true,
      matriculas,
      total: matriculas.length,
    })
  } catch (error) {
    console.error("Error in getMatriculasByEstudiante:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

const getMatriculasByPeriodo = async (req, res) => {
  try {
    const { periodo_escolar } = req.params

    const matriculas = await MatriculaModel.findByPeriodoEscolar(periodo_escolar)

    return res.json({
      ok: true,
      matriculas,
      total: matriculas.length,
      periodo_escolar,
    })
  } catch (error) {
    console.error("Error in getMatriculasByPeriodo:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

const updateMatricula = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Verificar que la matrícula existe
    const existingMatricula = await MatriculaModel.findById(id)
    if (!existingMatricula) {
      return res.status(404).json({
        ok: false,
        msg: "Matrícula no encontrada",
      })
    }

    // Validaciones similares al create (solo peso y estatura como ejemplo)
    // Asegúrate de que todas las validaciones de longitud de texto también se repliquen aquí si son editables
    if (updateData.peso && (updateData.peso < 0 || updateData.peso > 200)) {
      return res.status(400).json({
        ok: false,
        msg: "El peso debe estar entre 0 y 200 kg",
      })
    }

    if (updateData.estatura && (updateData.estatura < 0 || updateData.estatura > 3)) {
      return res.status(400).json({
        ok: false,
        msg: "La estatura debe estar entre 0 y 3 metros",
      })
    }

    if (updateData.enfermedades && updateData.enfermedades.length > 100) {
      return res.status(400).json({
        ok: false,
        msg: "El campo enfermedades no puede exceder 100 caracteres",
      })
    }

    if (updateData.observaciones && updateData.observaciones.length > 100) {
      return res.status(400).json({
        ok: false,
        msg: "El campo observaciones no puede exceder 100 caracteres",
      })
    }

    if (updateData.talla_camisa && updateData.talla_camisa.length > 10) {
      return res.status(400).json({
        ok: false,
        msg: "La talla de camisa no puede exceder 10 caracteres",
      })
    }

    if (updateData.talla_pantalon && updateData.talla_pantalon.length > 10) {
      return res.status(400).json({
        ok: false,
        msg: "La talla de pantalón no puede exceder 10 caracteres",
      })
    }

    if (updateData.talla_zapatos && updateData.talla_zapatos.length > 10) {
      return res.status(400).json({
        ok: false,
        msg: "La talla de zapatos no puede exceder 10 caracteres",
      })
    }
    // Si se permite cambiar la sección de la matrícula, se debe pasar section_id
    // El modelo MatriculaModel.update espera section_id si se proporciona
    const updatedMatricula = await MatriculaModel.update(id, updateData)

    return res.json({
      ok: true,
      msg: "Matrícula actualizada exitosamente",
      matricula: updatedMatricula,
    })
  } catch (error) {
    console.error("Error in updateMatricula:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

const deleteMatricula = async (req, res) => {
  try {
    const { id } = req.params

    // Verificar que la matrícula existe
    const existingMatricula = await MatriculaModel.findById(id)
    if (!existingMatricula) {
      return res.status(404).json({
        ok: false,
        msg: "Matrícula no encontrada",
      })
    }

    const result = await MatriculaModel.remove(id)

    return res.json({
      ok: true,
      msg: "Matrícula eliminada exitosamente",
      id: result.id,
    })
  } catch (error) {
    console.error("Error in deleteMatricula:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

const getGrados = async (req, res) => {
  try {
    const grados = await MatriculaModel.getGrados()

    return res.json({
      ok: true,
      grados,
      total: grados.length,
    })
  } catch (error) {
    console.error("Error in getGrados:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

const getDocenteGrados = async (req, res) => {
  try {
    const docenteGrados = await MatriculaModel.getDocenteGrados()

    return res.json({
      ok: true,
      docente_grados: docenteGrados,
      total: docenteGrados.length,
    })
  } catch (error) {
    console.error("Error in getDocenteGrados:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

export const MatriculaController = {
  createMatricula,
  getAllMatriculas,
  getMatriculaById,
  getMatriculasByEstudiante,
  getMatriculasByPeriodo,
  updateMatricula,
  deleteMatricula,
  getGrados,
  getDocenteGrados,
}