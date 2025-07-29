import { MatriculaModel } from "../models/matricula.model.js"
import { StudentModel } from "../models/student.model.js"

// Centralized error handler
const handleError = (res, error) => {
  console.error("❌ Error:", error)
  const status = error.message.includes("no encontrad")
    ? 404
    : error.message.includes("Ya existe") || error.message.includes("asignado")
      ? 400
      : 500
  const message = status === 500 ? "Error interno del servidor" : error.message

  res.status(status).json({
    ok: false,
    msg: message,
  })
}

// Crear sección
const createSection = async (req, res) => {
  try {
    const sectionData = req.body
    console.log("📝 Creando sección:", sectionData)

    const section = await MatriculaModel.createSection(sectionData)
    res.status(201).json({
      ok: true,
      msg: "Sección creada exitosamente",
      section,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Actualizar sección
const updateSection = async (req, res) => {
  try {
    const { id } = req.params
    const sectionData = req.body
    console.log("✏️ Actualizando sección:", id, sectionData)

    const section = await MatriculaModel.updateSection(id, sectionData)
    res.json({
      ok: true,
      msg: "Sección actualizada exitosamente",
      section,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Obtener estudiantes de una sección
const getSectionStudents = async (req, res) => {
  try {
    const { id } = req.params
    console.log("👥 Obteniendo estudiantes de sección:", id)

    const students = await MatriculaModel.getSectionStudents(id)
    res.json({
      ok: true,
      students,
      total: students.length,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Crear inscripción escolar
const createSchoolInscription = async (req, res) => {
  try {
    const { studentCi, sectionID, ...enrollmentData } = req.body
    console.log("📝 Creando inscripción para estudiante CI:", studentCi)

    const student = await StudentModel.findStudentByCi(studentCi)
    if (!student) {
      return res.status(400).json({ ok: false, msg: "Estudiante no encontrado" })
    }

    // Verificar que el estudiante esté en estado activo (1) para inscripción
    if (student.status_id !== 1) {
      return res.status(400).json({
        ok: false,
        msg: "El estudiante no está en estado activo para inscribirse",
        status: student.status_description,
      })
    }

    const inscriptionData = { studentID: student.id, sectionID, ...enrollmentData }
    const inscription = await MatriculaModel.createSchoolInscription(inscriptionData)

    // Actualizar estado del estudiante a "Inscrito" (2)
    await StudentModel.updateStudentStatus(student.id, 2)

    res.status(201).json({
      ok: true,
      msg: "Inscripción escolar creada exitosamente",
      inscription,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Obtener último registro académico del estudiante
const getLastAcademicRecord = async (req, res) => {
  try {
    const { studentID } = req.params
    console.log("📚 Obteniendo último registro académico para estudiante:", studentID)

    const record = await MatriculaModel.getLastAcademicRecord(studentID)
    if (!record) {
      return res.status(404).json({
        ok: false,
        msg: "No hay registro académico para este estudiante",
      })
    }

    console.log("✅ Registro académico encontrado:", record)
    res.json({ ok: true, record })
  } catch (error) {
    handleError(res, error)
  }
}

// Obtener grados disponibles
const getAvailableGrades = async (req, res) => {
  try {
    const grades = await MatriculaModel.getAvailableGrades()
    res.json({ ok: true, grades })
  } catch (error) {
    handleError(res, error)
  }
}

// Obtener secciones por grado y periodo
const getSectionsByGrade = async (req, res) => {
  try {
    const { gradeId } = req.params
    const { periodId } = req.query
    if (!periodId) {
      return res.status(400).json({ ok: false, msg: "Debe indicar el periodo académico" })
    }
    const sections = await MatriculaModel.getSectionsByGradeAndPeriod(gradeId, periodId)
    res.json({ ok: true, sections })
  } catch (error) {
    handleError(res, error)
  }
}

// Obtener docentes disponibles
const getAvailableTeachers = async (req, res) => {
  try {
    const teachers = await MatriculaModel.getAvailableTeachers()
    res.json({ ok: true, teachers })
  } catch (error) {
    handleError(res, error)
  }
}

// Obtener inscripciones por grado y periodo
const getInscriptionsByGrade = async (req, res) => {
  try {
    const { gradeId } = req.params
    const { periodId } = req.query
    if (!periodId) {
      return res.status(400).json({ ok: false, msg: "Debe indicar el periodo académico" })
    }
    const inscriptions = await MatriculaModel.getInscriptionsByGradeAndPeriod(gradeId, periodId)
    res.json({ ok: true, inscriptions, total: inscriptions.length })
  } catch (error) {
    handleError(res, error)
  }
}

// Obtener todas las inscripciones
const getAllInscriptions = async (req, res) => {
  try {
    const { periodId } = req.query
    const inscriptions = await MatriculaModel.getAllInscriptions(periodId)
    res.json({ ok: true, inscriptions, total: inscriptions.length })
  } catch (error) {
    handleError(res, error)
  }
}

// Obtener inscripción por ID
const getInscriptionById = async (req, res) => {
  try {
    const { id } = req.params
    const inscription = await MatriculaModel.getInscriptionById(id)
    if (!inscription) {
      return res.status(404).json({ ok: false, msg: "Matrícula no encontrada" })
    }
    res.json({ ok: true, inscription })
  } catch (error) {
    handleError(res, error)
  }
}

// Actualizar matrícula
const updateMatricula = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body
    const updatedInscription = await MatriculaModel.update(id, updateData)
    res.status(200).json({
      ok: true,
      msg: "Matrícula actualizada exitosamente",
      inscription: updatedInscription,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Eliminar matrícula
const deleteMatricula = async (req, res) => {
  try {
    const { id } = req.params
    const deletedInscription = await MatriculaModel.remove(id)
    res.status(200).json({
      ok: true,
      msg: "Matrícula eliminada exitosamente",
      inscription: deletedInscription,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Obtener periodo académico actual
const getAcademicPeriodCurrent = async (req, res) => {
  try {
    const period = await MatriculaModel.getCurrentAcademicPeriod()
    if (!period) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontró ningún periodo académico actual.",
      })
    }
    res.json({ ok: true, period })
  } catch (error) {
    handleError(res, error)
  }
}

// Obtener todos los periodos académicos
const getAcademicPeriodsAll = async (req, res) => {
  try {
    const periods = await MatriculaModel.getAllAcademicPeriods()
    res.json({ ok: true, periods, total: periods.length })
  } catch (error) {
    handleError(res, error)
  }
}

// Crear nuevo periodo académico
const createAcademicPeriod = async (req, res) => {
  try {
    const result = await MatriculaModel.createNewAcademicPeriod()

    res.status(201).json({
      ok: true,
      msg: "Periodo académico creado exitosamente. Estudiantes inscritos actualizados a estado activo.",
      newPeriod: result.newPeriod,
      studentsUpdated: result.updatedStudentsCount,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Obtener todas las secciones (con filtros)
const getAllSections = async (req, res) => {
  try {
    const { academicPeriodId, gradeId } = req.query
    console.log("🔍 Obteniendo secciones con filtros:", { academicPeriodId, gradeId })

    const sections = await MatriculaModel.getAllSections(academicPeriodId, gradeId)
    res.json({ ok: true, total: sections.length, sections })
  } catch (error) {
    handleError(res, error)
  }
}

// Eliminar una sección
const deleteSection = async (req, res) => {
  try {
    const { id } = req.params
    console.log("🗑️ Eliminando sección:", id)

    const deletedSection = await MatriculaModel.removeSection(id)
    res.json({ ok: true, msg: "Sección eliminada exitosamente.", section: deletedSection })
  } catch (error) {
    handleError(res, error)
  }
}

export const MatriculaController = {
  createSection,
  updateSection,
  getSectionStudents,
  createSchoolInscription,
  getLastAcademicRecord,
  getAvailableGrades,
  getSectionsByGrade,
  getAvailableTeachers,
  getInscriptionsByGrade,
  getAllInscriptions,
  getInscriptionById,
  updateMatricula,
  deleteMatricula,
  getAcademicPeriodCurrent,
  getAcademicPeriodsAll,
  createAcademicPeriod,
  getAllSections,
  deleteSection,
}
