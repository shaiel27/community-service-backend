import { MatriculaModel } from '../models/matricula.model.js';

class MatriculaService {
  async crearMatricula(matriculaData) {
    const { studentID, sectionID } = matriculaData;
    const existing = await MatriculaModel.checkExistingMatricula(studentID, sectionID);
    if (existing) {
      throw new Error('El estudiante ya está matriculado en esta sección');
    }
    
    // Extraer documentos
    const documents = matriculaData.documents || {};
    const {
      birthCertificate,
      vaccinationCard,
      studentPhotos,
      representativePhotos,
      representativeCopyID,
      autorizedCopyID
    } = documents;
    
    // Crear en base de datos
    return MatriculaModel.create({
      ...matriculaData,
      birthCertificateCheck: birthCertificate,
      vaccinationCardCheck: vaccinationCard,
      studentPhotosCheck: studentPhotos,
      representativePhotosCheck: representativePhotos,
      representativeCopyIDCheck: representativeCopyID,
      autorizedCopyIDCheck: autorizedCopyID
    });
  }

  // Actualizar matrícula
  async actualizarMatricula(id, updateData) {
    // Eliminar campos no actualizables
    delete updateData.studentID;
    
    // Extraer documentos si existen
    if (updateData.documents) {
      const documents = updateData.documents;
      updateData = {
        ...updateData,
        birthCertificateCheck: documents.birthCertificate,
        vaccinationCardCheck: documents.vaccinationCard,
        studentPhotosCheck: documents.studentPhotos,
        representativePhotosCheck: documents.representativePhotos,
        representativeCopyIDCheck: documents.representativeCopyID,
        autorizedCopyIDCheck: documents.autorizedCopyID
      };
      delete updateData.documents;
    }
    
    return MatriculaModel.update(id, updateData);
  }

  // Obtener todas las matrículas
  async obtenerTodas() {
    return MatriculaModel.findAll();
  }

  // Obtener por ID
  async obtenerPorId(id) {
    const matricula = await MatriculaModel.findById(id);
    if (!matricula) throw new Error('Matrícula no encontrada');
    return matricula;
  }

  // Obtener por estudiante
  async obtenerPorEstudiante(studentID) {
    return MatriculaModel.findByEstudianteId(studentID);
  }

  // Obtener por período
  async obtenerPorPeriodo(periodo) {
    return MatriculaModel.findByPeriodoEscolar(periodo);
  }

  // Eliminar matrícula
  async eliminarMatricula(id) {
    const matricula = await this.obtenerPorId(id);
    return MatriculaModel.remove(id);
  }

  // Obtener grados (utils)
  async obtenerGrados() {
    return MatriculaModel.getGrados();
  }

  // Obtener secciones con docentes
  async obtenerSeccionesDocentes() {
    return MatriculaModel.getDocenteGrados();
  }
}

export default new MatriculaService();