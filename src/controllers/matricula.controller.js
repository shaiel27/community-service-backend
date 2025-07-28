import { MatriculaModel } from "../models/matricula.model.js"
import { StudentModel } from "../models/student.model.js"

// Centralized error handler
const handleError = (res, error) => {
  console.error(error)
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

// Crear inscripción escolar
const createSchoolInscription = async (req, res) => {
  try {
    const { studentCi, sectionID, ...enrollmentData } = req.body
    const student = await StudentModel.findStudentByCi(studentCi)
    if (!student) {
      return res.status(400).json({ ok: false, msg: "Estudiante no encontrado" })
    }
    if (student.status_id == 1) {
      const inscriptionData = { studentID: student.id, sectionID, ...enrollmentData }
      const inscription = await MatriculaModel.createSchoolInscription(inscriptionData)
      await StudentModel.updateStudentStatus(student.id, 2)
      res.status(201).json({ ok: true, msg: "Inscripción escolar creada exitosamente", inscription })
    } else {
      return res.status(400).json({
        ok: false,
        msg: "El estudiante no está en estado activo para inscribirse",
        status: student.status_description,
      })
    }
  } catch (error) {
    handleError(res, error)
  }
}

// Obtener último registro académico del estudiante
const getLastAcademicRecord = async (req, res) => {
  try {
    const { studentID } = req.params
    const record = await MatriculaModel.getLastAcademicRecord(studentID)
    if (!record) {
      return res.status(404).json({ ok: false, msg: "No hay registro académico para este estudiante" })
    }
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
    const { periodId } = req.query // El periodo se pasa como query param
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

// Asignar docente a sección por periodo
const assignTeacherToSection = async (req, res) => {
  try {
    const { gradeId, teacherId, periodId } = req.body
    if (!gradeId || !teacherId || !periodId) {
      return res.status(400).json({ ok: false, msg: "Faltan datos para la asignación" })
    }
    const section = await MatriculaModel.assignTeacherToSection(gradeId, teacherId, periodId)
    res.json({ ok: true, msg: "Docente asignado a la sección exitosamente", section })
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

// Obtener todas las inscripciones (opcionalmente por periodo)
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
    res.status(200).json({ ok: true, msg: "Matrícula actualizada exitosamente", inscription: updatedInscription })
  } catch (error) {
    handleError(res, error)
  }
}

// Eliminar matrícula
const deleteMatricula = async (req, res) => {
  try {
    const { id } = req.params
    const deletedInscription = await MatriculaModel.remove(id)
    res.status(200).json({ ok: true, msg: "Matrícula eliminada exitosamente", inscription: deletedInscription })
  } catch (error) {
    handleError(res, error)
  }
}
// Obtener periodo académico actual
const getAcademicPeriodCurrent = async (req, res) => {
  try {
    const period = await MatriculaModel.getCurrentAcademicPeriod()
    if (!period) {
      return res.status(404).json({ ok: false, msg: "No se encontró ningún periodo académico actual." })
    }
    res.json({ ok: true, period })
  } catch (error) {
    handleError(res, error) //
  }
}

// Obtener todos los periodos académicos
const getAcademicPeriodsAll = async (req, res) => {
  try {
    const periods = await MatriculaModel.getAllAcademicPeriods()
    res.json({ ok: true, periods, total: periods.length })
  } catch (error) {
    handleError(res, error) //
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

export const MatriculaController = {
  createSchoolInscription,
  getLastAcademicRecord,
  getAvailableGrades,
  getSectionsByGrade,
  getAvailableTeachers,
  assignTeacherToSection,
  getInscriptionsByGrade,
  getAllInscriptions,
  getInscriptionById,
  updateMatricula,
  deleteMatricula,
  getAcademicPeriodCurrent,
  getAcademicPeriodsAll,
  createAcademicPeriod,
}