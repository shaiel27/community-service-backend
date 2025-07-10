import { StudentModel } from "../models/student.model.js"
import { RepresentativeModel } from "../models/representative.model.js"

// Centralized error handler (if not already present, add it)
const handleError = (res, error) => {
  console.error("❌ Error:", error)
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

// Crear registro estudiantil (estudiante + representante)
const createStudentRegistry = async (req, res) => {
  try {
    console.log("📝 Creando registro estudiantil:", req.body)

    const { student, representative } = req.body

    // Validar que se envíen ambos objetos
    if (!student || !representative) {
      return res.status(400).json({
        ok: false,
        msg: "Se requiere información del estudiante y del representante",
      })
    }

    // Validar campos requeridos del estudiante
    if (!student.ci || !student.name || !student.lastName || !student.sex || !student.birthday) {
      return res.status(400).json({
        ok: false,
        msg: "Faltan campos requeridos del estudiante: CI, nombre, apellido, sexo, fecha de nacimiento",
      })
    }

    // Validar campos requeridos del representante
    if (!representative.ci || !representative.name || !representative.lastName || !representative.telephoneNumber) {
      return res.status(400).json({
        ok: false,
        msg: "Faltan campos requeridos del representante: CI, nombre, apellido, teléfono",
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

    // Verificar que el representante no exista
    const existingRepresentative = await RepresentativeModel.getRepresentativeByCi(representative.ci)
    if (existingRepresentative) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe un representante registrado con esta cédula",
      })
    }

    // Crear representante primero
    const newRepresentative = await RepresentativeModel.createRepresentative(representative)
    console.log("✅ Representante creado:", newRepresentative)

    // Crear estudiante con referencia al representante
    const studentData = {
      ...student,
      representativeID: representative.ci,
    }
    const newStudent = await StudentModel.createStudentRegistry(studentData)
    console.log("✅ Estudiante creado:", newStudent)

    res.status(201).json({
      ok: true,
      msg: "Registro estudiantil creado exitosamente",
      data: {
        student: newStudent,
        representative: newRepresentative,
      },
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Obtener estudiantes registrados (disponibles para inscripción)
const getRegisteredStudents = async (req, res) => {
  try {
    console.log("📋 Obteniendo estudiantes registrados")
    const students = await StudentModel.getRegisteredStudents()
    res.json({
      ok: true,
      students,
      total: students.length,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Buscar estudiante para inscripción
const findStudentForInscription = async (req, res) => {
  try {
    const { ci } = req.params
    console.log("🔍 Buscando estudiante para inscripción:", ci)

    const student = await StudentModel.findStudentForInscription(ci)

    if (!student) {
      return res.status(404).json({
        ok: false,
        msg: "Estudiante no encontrado o ya inscrito",
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

// NUEVA FUNCIÓN: Obtener todos los estudiantes
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

export const StudentController = {
  createStudentRegistry,
  getRegisteredStudents,
  findStudentForInscription,
  findStudentByCi,
  getAllStudents, // Export the new function
}