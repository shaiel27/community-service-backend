import { StudentModel } from '../models/student.model.js';
import { RepresentativeModel } from '../models/representative.model.js';

class StudentService {
  /**
   * Crea un nuevo registro de estudiante y su representante.
   * @param {object} studentData - Datos del estudiante.
   * @param {object} representativeData - Datos del representante.
   * @returns {Promise<{student: object, representative: object}>} El estudiante y representante creados.
   * @throws {Error} Si el estudiante o representante ya existen, o faltan campos requeridos.
   */
  async createStudentRegistry(studentData, representativeData) {
    if (!studentData.ci || !studentData.name || !studentData.lastName || !studentData.sex || !studentData.birthday) {
      throw new Error("Faltan campos requeridos del estudiante: CI, nombre, apellido, sexo, fecha de nacimiento");
    }

    // Validar campos requeridos del representante
    if (!representativeData.ci || !representativeData.name || !representativeData.lastName || !representativeData.telephoneNumber) {
      throw new Error("Faltan campos requeridos del representante: CI, nombre, apellido, teléfono");
    }

    // Verificar si el estudiante ya existe
    const existingStudent = await StudentModel.findOneByCi(studentData.ci);
    if (existingStudent) {
      throw new Error("Ya existe un estudiante con esta cédula de identidad");
    }

    // Verificar si el representante ya existe, si no, crearlo
    let representative;
    const existingRepresentative = await RepresentativeModel.findOneByCi(representativeData.ci);
    if (existingRepresentative) {
      representative = existingRepresentative;
      console.log(`Representative with CI ${representativeData.ci} already exists. Using existing.`);
    } else {
      representative = await RepresentativeModel.createRepresentative(representativeData);
    }

    // Asignar el ID del representante al estudiante
    studentData.representativeID = representative.ci; // Asume que representativeID en student es la CI del representante

    // Crear el estudiante
    const newStudent = await StudentModel.createStudentRegistry(studentData);

    return { student: newStudent, representative: representative };
  }

  /**
   * Obtiene todos los estudiantes que están registrados (status_id = 1).
   * @returns {Promise<Array<object>>} Lista de estudiantes registrados.
   */
  async getRegisteredStudents() {
    return StudentModel.getRegisteredStudents();
  }

  /**
   * Busca un estudiante por CI para el proceso de inscripción.
   * @param {string} ci - Cédula de identidad del estudiante.
   * @returns {Promise<object|null>} El estudiante encontrado o null si no existe o ya está inscrito.
   */
  async findStudentForInscription(ci) {
    const student = await StudentModel.findStudentForInscription(ci);
    if (!student) {
      throw new Error("Estudiante no encontrado o ya inscrito");
    }
    return student;
  }

  /**
   * Busca un estudiante por CI (búsqueda general).
   * @param {string} ci - Cédula de identidad del estudiante.
   * @returns {Promise<object|null>} El estudiante encontrado o null si no existe.
   */
  async findStudentByCi(ci) {
    const student = await StudentModel.findStudentByCi(ci);
    if (!student) {
      throw new Error("Estudiante no encontrado");
    }
    return student;
  }

  /**
   * Obtiene todos los estudiantes, sin importar el estado de inscripción.
   * @returns {Promise<Array<object>>} Lista de todos los estudiantes.
   */
  async getAllStudents() {
    return StudentModel.getAllStudents();
  }
}

export const studentService = new StudentService();