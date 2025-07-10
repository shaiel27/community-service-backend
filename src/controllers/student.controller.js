// src/controllers/student.controller.js
import { studentService } from "../services/student.service.js"

// Centralized error handler
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

    const newStudent = await studentService.createStudentRegistry(student, representative)

    res.status(201).json({
      ok: true,
      msg: "Registro estudiantil creado exitosamente",
      student: result.student,
      representative: result.representative,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Obtener estudiantes registrados (status_id = 1)
const getRegisteredStudents = async (req, res) => {
  try {
    console.log("📋 Obteniendo estudiantes registrados")

    const students = await studentService.getRegisteredStudents()

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

    const student = await studentService.findStudentForInscription(ci)

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

    const student = await studentService.findStudentByCi(ci)

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
    const students = await studentService.getAllStudents()
    res.json({
      ok: true,
      students,
      total: students.length,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Actualizar estudiante
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.validated; // Data validated by Joi middleware

    console.log(`🔄 Actualizando estudiante con ID: ${id}`, updateData);

    const updatedStudent = await studentService.updateStudent(id, updateData);

    res.json({
      ok: true,
      msg: "Estudiante actualizado exitosamente",
      student: updatedStudent,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Eliminar estudiante
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`🗑️ Eliminando estudiante con ID: ${id}`);

    const deletedStudent = await studentService.deleteStudent(id);

    res.json({
      ok: true,
      msg: "Estudiante eliminado exitosamente",
      student: deletedStudent,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const StudentController = {
  createStudentRegistry,
  getRegisteredStudents,
  findStudentForInscription,
  findStudentByCi,
  getAllStudents,
  updateStudent, 
  deleteStudent,
}