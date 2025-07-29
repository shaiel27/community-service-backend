import { StudentModel } from "../models/student.model.js"
import { RepresentativeModel } from "../models/representative.model.js"

// Centralized error handler
const handleError = (res, error) => {
  console.error("❌ Error:", error)
  const status = error.message.includes("no encontrad") ? 404 : error.message.includes("Ya existe") ? 400 : 500
  const message = status === 500 ? "Error interno del servidor" : error.message

  res.status(status).json({
    ok: false,
    msg: message,
  })
}

// Crear estudiante (requiere un representante existente)
const createStudent = async (req, res) => {
  try {
    const { student } = req.body
    console.log("👤 Creando estudiante:", student)

    // Validar campos requeridos
    if (
      !student ||
      !student.ci ||
      !student.name ||
      !student.lastName ||
      !student.sex ||
      !student.birthday ||
      !student.representativeID
    ) {
      return res.status(400).json({
        ok: false,
        msg: "Faltan campos requeridos del estudiante o el ID del representante",
      })
    }

    // Verificar que el estudiante no exista
    const existingStudent = await StudentModel.findStudentByCi(student.ci)
    if (existingStudent) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe un estudiante registrado con esta cédula",
      })
    }

    // Verificar que el representante exista
    const existingRepresentative = await RepresentativeModel.getRepresentativeByCi(student.representativeID)
    if (!existingRepresentative) {
      return res.status(404).json({
        ok: false,
        msg: "El representante no existe",
      })
    }

    // Crear estudiante
    const newStudent = await StudentModel.createStudentRegistry(student)
    res.status(201).json({
      ok: true,
      msg: "Estudiante creado exitosamente",
      student: newStudent,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Obtener estudiantes registrados (disponibles para inscripción)
const getRegisteredNotEnrolledStudents = async (req, res) => {
  try {
    console.log("📋 Obteniendo estudiantes registrados no inscritos")
    const students = await StudentModel.getRegisteredNotEnrolledStudents()
    res.json({
      ok: true,
      students,
      total: students.length,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Buscar estudiante por CI
const findStudentByCi = async (req, res) => {
  try {
    const { ci } = req.params
    console.log("🔍 Buscando estudiante por CI:", ci)

    const student = await StudentModel.findStudentByCi(ci)

    if (!student) {
      return res.status(404).json({
        ok: false,
        msg: "Estudiante no encontrado",
      })
    }

    res.json({
      ok: true,
      student,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Buscar estudiante para inscripción
const findStudentForInscription = async (req, res) => {
  try {
    const { ci } = req.params
    console.log("🎓 Buscando estudiante para inscripción:", ci)

    const student = await StudentModel.findStudentByCi(ci)

    if (!student) {
      return res.status(404).json({
        ok: false,
        msg: "Estudiante no encontrado",
      })
    }

    // Verificar que esté disponible para inscripción (estado activo = 1)
    if (student.status_id !== 1) {
      return res.status(400).json({
        ok: false,
        msg: "Estudiante no disponible para inscripción",
        status: student.status_description,
      })
    }

    res.json({
      ok: true,
      student,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Obtener todos los estudiantes
const getAllStudents = async (req, res) => {
  try {
    console.log("📋 Obteniendo todos los estudiantes")
    const students = await StudentModel.getAllStudents()
    res.json({
      ok: true,
      students,
      total: students.length,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Actualizar un estudiante
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params
    const studentData = req.body
    console.log("✏️ Actualizando estudiante:", id, studentData)

    const updatedStudent = await StudentModel.updateStudent(id, studentData)
    res.status(200).json({
      ok: true,
      msg: "Estudiante actualizado exitosamente",
      student: updatedStudent,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Eliminar un estudiante
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params
    console.log("🗑️ Eliminando estudiante:", id)

    const deletedStudent = await StudentModel.deleteStudent(id)
    res.status(200).json({
      ok: true,
      msg: "Estudiante eliminado exitosamente",
      student: deletedStudent,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Crear historial académico
const addAcademicHistory = async (req, res) => {
  try {
    const historyData = req.body
    console.log("📚 Agregando historial académico:", historyData)

    const newHistory = await StudentModel.createAcademicHistory(historyData)
    res.status(201).json({
      ok: true,
      msg: "Historial académico agregado exitosamente",
      history: newHistory,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Obtener historial académico de un estudiante
const getHistoryByStudent = async (req, res) => {
  try {
    const { studentID } = req.params
    console.log("📖 Obteniendo historial académico del estudiante:", studentID)

    const history = await StudentModel.getAcademicHistoryByStudent(studentID)
    res.json({
      ok: true,
      history,
      total: history.length,
    })
  } catch (error) {
    handleError(res, error)
  }
}

export const StudentController = {
  createStudent,
  getRegisteredNotEnrolledStudents,
  findStudentForInscription,
  findStudentByCi,
  getAllStudents,
  updateStudent,
  deleteStudent,
  addAcademicHistory,
  getHistoryByStudent,
}
