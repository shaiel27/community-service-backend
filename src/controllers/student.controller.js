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

// Crear estudiante (requiere un representante existente)
const createStudent = async (req, res) => {
  try {
    const { student } = req.body

    // Validar campos requeridos
    if (!student || !student.ci || !student.name || !student.lastName || !student.sex || !student.birthday || !student.representativeID) {
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
    console.log("📋 Obteniendo estudiantes registrados")
    const students = await StudentModel.getRegisteredNotEnrolledStudents ()
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
    const student = findStudentByCi(req, res);
    if (student.status_id !== 1) {
      return res.status(401).json({
        ok: false,
        msg: 'Estudiante no disponible para inscripción',
        message: student.status_description,
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
// Controlador para actualizar un estudiante**
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params // ID del estudiante a actualizar
    const studentData = req.body // Datos a actualizar

    const updatedStudent = await StudentModel.updateStudent(id, studentData)
    res.status(200).json({ message: "Estudiante actualizado exitosamente", student: updatedStudent })
  } catch (error) {
    console.error("Error updating student:", error)
    res.status(400).json({ error: error.message })
  }
}

// Controlador para eliminar un estudiante**
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params // ID del estudiante a eliminar

    const deletedStudent = await StudentModel.deleteStudent(id)
    res.status(200).json({ message: "Estudiante eliminado exitosamente", student: deletedStudent })
  } catch (error) {
    console.error("Error deleting student:", error)
    res.status(400).json({ error: error.message })
  }
}

// Crear historial académico
const addAcademicHistory = async (req, res) => {
  try {
    const historyData = req.body;
    const newHistory = await StudentModel.createAcademicHistory(historyData);
    res.status(201).json({ ok: true, history: newHistory });
  } catch (error) {
    handleError(res, error);
  }
};

// Obtener historial académico de un estudiante
const getHistoryByStudent = async (req, res) => {
  try {
    const { studentID } = req.params;
    const history = await StudentModel.getAcademicHistoryByStudent(studentID);
    res.json({ ok: true, history });
  } catch (error) {
    handleError(res, error);
  }
};

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