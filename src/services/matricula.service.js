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

  async actualizarMatricula(id, updateData) {
    delete updateData.studentID

    if (updateData.documents) {
      const documents = updateData.documents
      updateData = {
        ...updateData,
        birthCertificateCheck: documents.birthCertificate,
        vaccinationCardCheck: documents.vaccinationCard,
        studentPhotosCheck: documents.studentPhotos,
        representativePhotosCheck: documents.representativePhotos,
        representativeCopyIDCheck: documents.representativeCopyID,
        autorizedCopyIDCheck: documents.autorizedCopyID,
      }
      delete updateData.documents
    }

    return MatriculaModel.update(id, updateData)
  }

  async eliminarMatricula(id) {
    const matricula = await this.obtenerPorId(id)
    return MatriculaModel.remove(id)
  }

  async obtenerGrados() {
    return MatriculaModel.getGrados()
  }

  async obtenerSeccionesDocentes() {
    return MatriculaModel.getDocenteGrados()
  }
}

export default new MatriculaService()
