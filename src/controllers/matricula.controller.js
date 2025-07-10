import { MatriculaModel } from "../models/matricula.model.js"
import { StudentModel } from "../models/student.model.js"

// Centralized error handler
const handleError = (res, error) => {
  console.error(error)
  const status = error.message.includes("no encontrad")
    ? 404
    : error.message.includes("Ya existe")
    ? 400
    : 500
  const message = status === 500 ? "Error interno del servidor" : error.message

  res.status(status).json({
    ok: false,
    msg: message,
  })
}

// Crear inscripción escolar
const createSchoolInscription = async (req, res) => {
  try {
    console.log("📚 Creando inscripción escolar:", req.body)

    const { studentCi, sectionID, ...enrollmentData } = req.body

    // Buscar el estudiante por CI para obtener su ID
    const student = await StudentModel.findStudentForInscription(studentCi) //
    if (!student) {
      return res.status(400).json({
        ok: false,
        msg: "Estudiante no encontrado o no disponible para inscripción",
      })
    }

    // Crear inscripción con el ID del estudiante
    const inscriptionData = {
      studentID: student.id,
      sectionID,
      ...enrollmentData,
    }

    const inscription = await MatriculaModel.createSchoolInscription(inscriptionData) //

    // Actualizar estado del estudiante a inscrito (status_id = 2)
    await StudentModel.updateStudentStatus(student.id, 2) //

    res.status(201).json({
      ok: true,
      msg: "Inscripción escolar creada exitosamente",
      inscription,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Obtener grados disponibles
const getAvailableGrades = async (req, res) => {
  try {
    console.log("📋 Obteniendo grados disponibles")

    const grades = await MatriculaModel.getAvailableGrades()

    res.json({
      ok: true,
      grades,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Obtener secciones por grado
const getSectionsByGrade = async (req, res) => {
  try {
    const { gradeId } = req.params
    console.log("📋 Obteniendo secciones para grado:", gradeId)

    const sections = await MatriculaModel.getSectionsByGrade(gradeId)

    res.json({
      ok: true,
      sections,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Obtener docentes disponibles
const getAvailableTeachers = async (req, res) => {
  try {
    console.log("👨‍🏫 Obteniendo docentes disponibles")
    const teachers = await MatriculaModel.getAvailableTeachers()
    res.json({
      ok: true,
      teachers,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Asignar docente a sección
const assignTeacherToSection = async (req, res) => {
  try {
    const { sectionId, teacherId } = req.body
    console.log("👨‍🏫 Asignando docente a sección:", { sectionId, teacherId })
    const section = await MatriculaModel.assignTeacherToSection(sectionId, teacherId)
    res.json({
      ok: true,
      msg: "Docente asignado a la sección exitosamente",
      section,
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

    const inscriptions = await MatriculaModel.getInscriptionsByGrade(gradeId) //

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

    const inscriptions = await MatriculaModel.getAllInscriptions() //

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
    const inscription = await MatriculaModel.getInscriptionById(id)

    if (!inscription) {
      return res.status(404).json({
        ok: false,
        msg: "Enrollment not found",
      })
    }
    res.json({
      ok: true,
      inscription,
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
  getInscriptionById, // Add the new function here
}