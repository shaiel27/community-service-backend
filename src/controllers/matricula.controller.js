import { MatriculaModel } from "../models/matricula.model.js"
import { StudentModel } from "../models/student.model.js"

// Crear inscripción escolar
const createSchoolInscription = async (req, res) => {
  try {
    console.log("📚 Creando inscripción escolar:", req.body)

    const { studentCi, sectionID, ...enrollmentData } = req.body

    // Buscar el estudiante por CI para obtener su ID
    const student = await StudentModel.findStudentForInscription(studentCi)
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

    const inscription = await MatriculaModel.createSchoolInscription(inscriptionData)

    // Actualizar estado del estudiante a inscrito (status_id = 2)
    await StudentModel.updateStudentStatus(student.id, 2)

    res.status(201).json({
      ok: true,
      msg: "Inscripción escolar creada exitosamente",
      inscription,
    })
  } catch (error) {
    console.error("❌ Error en createSchoolInscription:", error)
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
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
    console.error("❌ Error en getAvailableGrades:", error)
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
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
    console.error("❌ Error en getSectionsByGrade:", error)
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
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
    console.error("❌ Error en getAvailableTeachers:", error)
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
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
      msg: "Docente asignado exitosamente",
      section,
    })
  } catch (error) {
    console.error("❌ Error en assignTeacherToSection:", error)
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

// Obtener inscripciones por grado (para vista de matrícula)
const getInscriptionsByGrade = async (req, res) => {
  try {
    const { gradeId } = req.params
    console.log("📋 Obteniendo inscripciones para grado:", gradeId)

    const inscriptions = await MatriculaModel.getInscriptionsByGrade(gradeId)

    res.json({
      ok: true,
      inscriptions,
      total: inscriptions.length,
    })
  } catch (error) {
    console.error("❌ Error en getInscriptionsByGrade:", error)
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

// Obtener todas las inscripciones
const getAllInscriptions = async (req, res) => {
  try {
    console.log("📋 Obteniendo todas las inscripciones")

    const inscriptions = await MatriculaModel.getAllInscriptions()

    res.json({
      ok: true,
      inscriptions,
      total: inscriptions.length,
    })
  } catch (error) {
    console.error("❌ Error en getAllInscriptions:", error)
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
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
}
