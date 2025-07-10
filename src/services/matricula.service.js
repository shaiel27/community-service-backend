import { MatriculaModel } from "../models/matricula.model.js"
import { StudentModel } from "../models/student.model.js"
import { RepresentativeModel } from "../models/representative.model.js"

class MatriculaService {
  async crearMatriculaCompleta(matriculaData) {
    try {
      console.log("📝 Iniciando creación de matrícula completa...")

      const {
        studentData,
        representativeData,
        sectionID,
        registrationDate,
        repeater,
        chemiseSize,
        pantsSize,
        shoesSize,
        weight,
        stature,
        diseases,
        observation,
        documents = {},
      } = matriculaData

      // 1. Crear o verificar representante
      let representative = null
      if (representativeData && representativeData.ci) {
        representative = await RepresentativeModel.findByCi(representativeData.ci)
        if (!representative) {
          console.log("👤 Creando nuevo representante...")
          representative = await RepresentativeModel.create(representativeData)
        }
      }

      // 2. Crear estudiante
      console.log("🎓 Creando nuevo estudiante...")
      const studentToCreate = {
        ...studentData,
        representativeID: representative?.ci || null,
        parishID: studentData.parishID || 1,
      }

      const student = await StudentModel.create(studentToCreate)
      console.log("✅ Estudiante creado con ID:", student.id)

      // 3. Crear matrícula
      console.log("📋 Creando matrícula...")
      const matriculaToCreate = {
        studentID: student.id,
        sectionID: sectionID || 1,
        registrationDate,
        repeater: repeater || false,
        chemiseSize,
        pantsSize,
        shoesSize,
        weight,
        stature,
        diseases,
        observation,
        birthCertificateCheck: documents.birthCertificate || false,
        vaccinationCardCheck: documents.vaccinationCard || false,
        studentPhotosCheck: documents.studentPhotos || false,
        representativePhotosCheck: documents.representativePhotos || false,
        representativeCopyIDCheck: documents.representativeCopyID || false,
        autorizedCopyIDCheck: documents.autorizedCopyID || false,
      }

      const matricula = await MatriculaModel.create(matriculaToCreate)
      console.log("✅ Matrícula creada exitosamente")

      return {
        matricula,
        student,
        representative,
      }
    } catch (error) {
      console.error("❌ Error en crearMatriculaCompleta:", error)
      throw error
    }
  }

  async crearMatricula(matriculaData) {
    const { studentID, sectionID } = matriculaData
    const existing = await MatriculaModel.checkExistingMatricula(studentID, sectionID)
    if (existing) {
      throw new Error("El estudiante ya está matriculado en esta sección")
    }

    const documents = matriculaData.documents || {}

    return MatriculaModel.create({
      ...matriculaData,
      birthCertificateCheck: documents.birthCertificate || false,
      vaccinationCardCheck: documents.vaccinationCard || false,
      studentPhotosCheck: documents.studentPhotos || false,
      representativePhotosCheck: documents.representativePhotos || false,
      representativeCopyIDCheck: documents.representativeCopyID || false,
      autorizedCopyIDCheck: documents.autorizedCopyID || false,
    })
  }

  async obtenerTodas() {
    return MatriculaModel.findAll()
  }

  async obtenerPorId(id) {
    const matricula = await MatriculaModel.findById(id)
    if (!matricula) throw new Error("Matrícula no encontrada")
    return matricula
  }

  async obtenerPorEstudiante(studentID) {
    return MatriculaModel.findByEstudianteId(studentID)
  }

  async obtenerPorPeriodo(periodo) {
    return MatriculaModel.findByPeriodoEscolar(periodo)
  }

  // Nuevo método para actualizar matrícula
  async actualizarMatricula(id, updateData) {
    console.log(`🔄 Actualizando inscripción con ID: ${id}`, updateData)

    const existingInscription = await MatriculaModel.getInscriptionById(id)
    if (!existingInscription) {
      throw new Error(`Inscripción con ID ${id} no encontrada.`)
    }

    const dataForModel = { ...updateData };

    if (updateData.documents) {
      dataForModel.birthCertificateCheck = updateData.documents.birthCertificate || false;
      dataForModel.vaccinationCardCheck = updateData.documents.vaccinationCard || false;
      dataForModel.studentPhotosCheck = updateData.documents.studentPhotos || false;
      dataForModel.representativePhotosCheck = updateData.documents.representativePhotos || false;
      dataForModel.representativeCopyIDCheck = updateData.documents.representativeCopyID || false;
      dataForModel.representativeRIFCheck = updateData.documents.representativeRIF || false;
      dataForModel.autorizedCopyIDCheck = updateData.documents.autorizedCopyID || false;
      delete dataForModel.documents; // Eliminar el objeto documents
    }

    return MatriculaModel.updateSchoolInscription(id, dataForModel)
  }

  // Método para eliminar matrícula
  async eliminarMatricula(id) {
    console.log(`🗑️ Eliminando inscripción con ID: ${id}`)
    const inscriptionToDelete = await MatriculaModel.getInscriptionById(id);
    if (!inscriptionToDelete) {
        throw new Error(`Inscripción con ID ${id} no encontrada.`);
    }

    const deletedInscription = await MatriculaModel.deleteSchoolInscription(id);

    await StudentModel.updateStudentStatus(inscriptionToDelete.studentID, 1);
    console.log(`✅ Estado del estudiante con ID ${inscriptionToDelete.studentID} actualizado a 'no inscrito'`);

    return deletedInscription;
  }

  async obtenerGrados() {
    return MatriculaModel.getGrados()
  }

  async obtenerSeccionesDocentes() {
    return MatriculaModel.getDocenteGrados()
  }
}

export default new MatriculaService()
