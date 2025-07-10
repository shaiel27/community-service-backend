// src/controllers/matricula.controller.js
import matriculaService from "../services/matricula.service.js" // Importa el servicio

// Manejador centralizado de errores
const handleError = (res, error) => {
  console.error("❌ Error:", error)
  const status = error.message.includes("no encontrad")
    ? 404
    : error.message.includes("Ya existe") || error.message.includes("Faltan campos")
    ? 400
    : 500
  const message = status === 500 ? "Error interno del servidor" : error.message

  res.status(status).json({
    ok: false,
    msg: message,
  })
}

// Crear inscripción escolar (refactorizado para usar el servicio)
const createSchoolInscription = async (req, res) => {
  try {
    console.log("📚 Creando inscripción escolar:", req.body)

    // Asumimos que req.body ahora contiene todos los datos necesarios para el servicio
    // incluyendo studentData, representativeData, sectionID, etc.
    const result = await matriculaService.crearMatriculaCompleta(req.body)

    res.status(201).json({
      ok: true,
      msg: "Inscripción escolar y registro de estudiante/representante completado exitosamente",
      inscription: result.inscription,
      student: result.student,
      representative: result.representative,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Obtener grados disponibles (para la vista de inscripción)
const getAvailableGrades = async (req, res) => {
  try {
    console.log("🏫 Obteniendo grados disponibles...")
    const grades = await matriculaService.obtenerGradosDisponibles()
    res.json({
      ok: true,
      grades,
      total: grades.length,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Obtener secciones por grado (para la vista de inscripción)
const getSectionsByGrade = async (req, res) => {
  try {
    const { gradeId } = req.params
    console.log("📚 Obteniendo secciones para el grado:", gradeId)
    const sections = await matriculaService.obtenerSeccionesPorGrado(gradeId)
    res.json({
      ok: true,
      sections,
      total: sections.length,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Obtener docentes disponibles (para asignar a sección)
const getAvailableTeachers = async (req, res) => {
  try {
    console.log("👨‍🏫 Obteniendo docentes disponibles...")
    const teachers = await matriculaService.obtenerDocentesDisponibles()
    res.json({
      ok: true,
      teachers,
      total: teachers.length,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Asignar docente a sección
const assignTeacherToSection = async (req, res) => {
  try {
    const { sectionId, teacherCi } = req.body
    console.log(`🔗 Asignando docente ${teacherCi} a sección ${sectionId}`)

    const assignment = await matriculaService.asignarDocenteASeccion(sectionId, teacherCi)

    res.status(200).json({
      ok: true,
      msg: "Docente asignado a la sección exitosamente",
      assignment,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Obtener inscripciones por grado (para vista de matrícula)
const getInscriptionsByGrade = async (req, res) => {
  try {
    const { gradeId } = req.params
    console.log("📋 Obteniendo inscripciones para grado:", gradeId)

    const inscriptions = await matriculaService.obtenerInscripcionesPorGrado(gradeId)

    res.json({
      ok: true,
      inscriptions,
      total: inscriptions.length,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Obtener todas las inscripciones
const getAllInscriptions = async (req, res) => {
  try {
    console.log("📋 Obteniendo todas las inscripciones")

    const inscriptions = await matriculaService.obtenerTodasLasInscripciones()

    res.json({
      ok: true,
      inscriptions,
      total: inscriptions.length,
    })
  } catch (error) {
    handleError(res, error)
  }
}

/**
 * @route GET /api/matricula/:id
 * @desc Get enrollment by ID
 * @access Private (Admin, Academic Management, ReadOnly)
 */
const getInscriptionById = async (req, res) => {
  try {
    const { id } = req.params
    const inscription = await matriculaService.obtenerInscripcionPorId(id)

    res.json({
      ok: true,
      inscription,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Nuevo método para actualizar inscripción
const updateSchoolInscription = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body // Asegúrate de que `req.body` contenga los datos a actualizar

    console.log(`🔄 Actualizando inscripción ID ${id} con datos:`, updateData)

    const updatedInscription = await matriculaService.actualizarMatricula(id, updateData)

    res.status(200).json({
      ok: true,
      msg: "Inscripción actualizada exitosamente",
      inscription: updatedInscription,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Nuevo método para eliminar inscripción
const deleteSchoolInscription = async (req, res) => {
  try {
    const { id } = req.params
    console.log(`🗑️ Eliminando inscripción ID: ${id}`)

    const deletedInscription = await matriculaService.eliminarMatricula(id)

    res.status(200).json({
      ok: true,
      msg: "Inscripción eliminada exitosamente",
      inscription: deletedInscription,
    })
  } catch (error) {
    handleError(res, error)
  }
}


export const MatriculaController = {
  createSchoolInscription,
  getAvailableGrades,
  getSectionsByGrade,
  getAvailableTeachers,
  assignTeacherToSection,
  getInscriptionsByGrade,
  getAllInscriptions,
  getInscriptionById,
  updateSchoolInscription, 
  deleteSchoolInscription, 
}