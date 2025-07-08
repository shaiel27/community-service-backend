import { BrigadaModel } from "../models/brigada.model.js";
import { PersonalModel } from "../models/personal.model.js";
// import { StudentModel } from "../models/student.model.js";

export class BrigadaService {
  static async crearBrigada({ name }) {
    if (!name || name.trim() === "") {
      throw new Error("El nombre de la brigada es obligatorio");
    }
    if (name.length > 100) {
      throw new Error("El nombre de la brigada es demasiado largo (máximo 100 caracteres)");
    }
    return await BrigadaModel.create({ name });
  }

  static async obtenerTodasBrigadas() {
    return await BrigadaModel.findAll();
  }

  static async obtenerBrigadaPorId(id) {
    const brigada = await BrigadaModel.findById(id);
    if (!brigada) {
      throw new Error("Brigada no encontrada");
    }
    return brigada;
  }

  static async actualizarBrigada(id, { name }) {
    if (name && name.length > 100) {
      throw new Error("El nombre de la brigada es demasiado largo (máximo 100 caracteres)");
    }
    
    const brigada = await BrigadaModel.update(id, { name });
    if (!brigada) {
      throw new Error("Brigada no encontrada");
    }
    return brigada;
  }

  static async obtenerEstudiantesPorBrigada(id) {
    const brigada = await this.obtenerBrigadaPorId(id);
    return await BrigadaModel.getStudentsByBrigade(id);
  }

  static async asignarDocente(brigadeId, personalId, startDate = null) {
    // Verificar que el personal existe y tiene un rol válido
    const personal = await PersonalModel.findOneById(personalId);
    if (!personal) {
      throw new Error("Personal no encontrado");
    }
    
    // Roles permitidos: 1 (Docente), 2 (Administrador), 3 (Mantenimiento)
    const rolesPermitidos = [1, 2, 3];
    if (!rolesPermitidos.includes(Number(personal.idRole))) {
      throw new Error("El personal asignado no tiene un rol válido para ser encargado de brigada");
    }

    // Verificar que no está asignado a otra brigada activa
    const asignacionActiva = await BrigadaModel.checkTeacherAssignment(personalId);
    if (asignacionActiva) {
      throw new Error("El docente ya está asignado a otra brigada activa");
    }

    return await BrigadaModel.assignTeacher(brigadeId, personalId, startDate);
  }

  static async inscribirEstudiantes(brigadeId, studentIds) {
    // Verificar que la brigada existe y tiene docente asignado
    const brigada = await BrigadaModel.findById(brigadeId);
    if (!brigada) {
      throw new Error("Brigada no encontrada");
    }
    if (!brigada.brigade_teacher_date_id) {
      throw new Error("La brigada no tiene un docente asignado");
    }

    // Verificar que los estudiantes existen y no están asignados
    const estudiantes = await StudentModel.findByIds(studentIds);
    if (estudiantes.length !== studentIds.length) {
      const encontrados = estudiantes.map(e => e.id);
      const noEncontrados = studentIds.filter(id => !encontrados.includes(id));
      throw new Error(`Estudiantes no encontrados: ${noEncontrados.join(', ')}`);
    }

    const estudiantesConBrigada = estudiantes.filter(e => e.brigade_teacher_date_id);
    if (estudiantesConBrigada.length > 0) {
      const ids = estudiantesConBrigada.map(e => e.id);
      throw new Error(`Estudiantes ya asignados a otra brigada: ${ids.join(', ')}`);
    }

    return await BrigadaModel.enrollStudents(studentIds, brigada.brigade_teacher_date_id);
  }

  static async limpiarBrigada(brigadeId) {
    const brigada = await this.obtenerBrigadaPorId(brigadeId);
    return await BrigadaModel.clearBrigade(brigadeId);
  }

  static async eliminarBrigada(id) {
    const brigada = await this.obtenerBrigadaPorId(id);
    return await BrigadaModel.remove(id);
  }

  static async obtenerEstudiantesDisponibles() {
    return await BrigadaModel.getAvailableStudents();
  }

  static async obtenerDocentesDisponibles() {
    return await BrigadaModel.getAvailableTeachers();
  }

  static async buscarBrigadasPorNombre(name) {
    if (!name || name.trim().length < 3) {
      throw new Error("El término de búsqueda debe tener al menos 3 caracteres");
    }
    return await BrigadaModel.searchByName(name);
  }
}