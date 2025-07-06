import { MatriculaModel } from "../models/matricula.model.js"

const createMatricula = async (req, res) => {
  try {
    const {
      studentID,
      sectionID,
      registrationDate,
      repeater = false,
      chemiseSize,
      pantsSize,
      shoesSize,
      weight,
      stature,
      diseases,
      observation,
      birthCertificateCheck = false,
      vaccinationCardCheck = false,
      studentPhotosCheck = false,
      representativePhotosCheck = false,
      representativeCopyIDCheck = false,
      representativeRIFCheck = false,
      autorizedCopyIDCheck = false,
    } = req.body

    // Validaciones obligatorias
    if (!studentID || !sectionID || !registrationDate) {
      return res.status(400).json({
        ok: false,
        msg: "Campos obligatorios: studentID, sectionID, registrationDate",
      })
    }

    // Validar que no exista una matrícula para el mismo estudiante en la misma sección
    const existingMatricula = await MatriculaModel.checkExistingMatricula(studentID, sectionID)
    if (existingMatricula) {
      return res.status(400).json({
        ok: false,
        msg: "El estudiante ya tiene una matrícula registrada para esta sección",
      })
    }

    // Validaciones de formato
    if (weight && (weight < 0 || weight > 200)) {
      return res.status(400).json({
        ok: false,
        msg: "El peso debe estar entre 0 y 200 kg",
      })
    }

    if (stature && (stature < 0 || stature > 3)) {
      return res.status(400).json({
        ok: false,
        msg: "La estatura debe estar entre 0 y 3 metros",
      })
    }

    // Validar longitud de campos de texto
    if (diseases && diseases.length > 100) {
      return res.status(400).json({
        ok: false,
        msg: "El campo enfermedades no puede exceder 100 caracteres",
      })
    }

    if (observation && observation.length > 100) {
      return res.status(400).json({
        ok: false,
        msg: "El campo observaciones no puede exceder 100 caracteres",
      })
    }

    if (chemiseSize && chemiseSize.length > 10) {
      return res.status(400).json({
        ok: false,
        msg: "La talla de camisa no puede exceder 10 caracteres",
      })
    }

    if (pantsSize && pantsSize.length > 10) {
      return res.status(400).json({
        ok: false,
        msg: "La talla de pantalón no puede exceder 10 caracteres",
      })
    }

    if (shoesSize && shoesSize.length > 10) {
      return res.status(400).json({
        ok: false,
        msg: "La talla de zapatos no puede exceder 10 caracteres",
      })
    }

    const newMatricula = await MatriculaModel.create({
      studentID,
      sectionID,
      registrationDate,
      repeater,
      chemiseSize,
      pantsSize,
      shoesSize,
      weight,
      stature,
      diseases,
      observation,
      birthCertificateCheck,
      vaccinationCardCheck,
      studentPhotosCheck,
      representativePhotosCheck,
      representativeCopyIDCheck,
      autorizedCopyIDCheck,
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
    const { studentID } = req.params

    const matriculas = await MatriculaModel.findByEstudianteId(studentID)

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

    // Validaciones similares al create
    if (updateData.weight && (updateData.weight < 0 || updateData.weight > 200)) {
      return res.status(400).json({
        ok: false,
        msg: "El peso debe estar entre 0 y 200 kg",
      })
    }

    if (updateData.stature && (updateData.stature < 0 || updateData.stature > 3)) {
      return res.status(400).json({
        ok: false,
        msg: "La estatura debe estar entre 0 y 3 metros",
      })
    }

    if (updateData.diseases && updateData.diseases.length > 100) {
      return res.status(400).json({
        ok: false,
        msg: "El campo enfermedades no puede exceder 100 caracteres",
      })
    }

    if (updateData.observation && updateData.observation.length > 100) {
      return res.status(400).json({
        ok: false,
        msg: "El campo observaciones no puede exceder 100 caracteres",
      })
    }

    if (updateData.chemiseSize && updateData.chemiseSize.length > 10) {
      return res.status(400).json({
        ok: false,
        msg: "La talla de camisa no puede exceder 10 caracteres",
      })
    }

    if (updateData.pantsSize && updateData.pantsSize.length > 10) {
      return res.status(400).json({
        ok: false,
        msg: "La talla de pantalón no puede exceder 10 caracteres",
      })
    }

    if (updateData.shoesSize && updateData.shoesSize.length > 10) {
      return res.status(400).json({
        ok: false,
        msg: "La talla de zapatos no puede exceder 10 caracteres",
      })
    }

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
