import { BrigadaModel } from "../models/brigada.model.js"

class BrigadaService {
  // Validar datos de brigada
  static validateBrigadeData(data) {
    const errors = []

    if (!data.name || !data.name.trim()) {
      errors.push("El nombre de la brigada es requerido")
    }

    if (data.name && data.name.length > 100) {
      errors.push("El nombre de la brigada no puede exceder 100 caracteres")
    }

    if (data.name && data.name.length < 3) {
      errors.push("El nombre de la brigada debe tener al menos 3 caracteres")
    }

    return errors
  }

  // Validar asignación de docente
  static validateTeacherAssignment(data) {
    const errors = []

    if (!data.personalId) {
      errors.push("El ID del personal es requerido")
    }

    if (data.personalId && (isNaN(data.personalId) || data.personalId <= 0)) {
      errors.push("El ID del personal debe ser un número válido")
    }

    if (data.startDate && isNaN(Date.parse(data.startDate))) {
      errors.push("La fecha de inicio debe ser válida")
    }

    return errors
  }

  // Validar inscripción de estudiantes
  static validateStudentEnrollment(data) {
    const errors = []

    if (!data.studentIds || !Array.isArray(data.studentIds)) {
      errors.push("Debe proporcionar una lista de IDs de estudiantes")
    }

    if (data.studentIds && data.studentIds.length === 0) {
      errors.push("Debe seleccionar al menos un estudiante")
    }

    if (data.studentIds && data.studentIds.length > 50) {
      errors.push("No puede inscribir más de 50 estudiantes a la vez")
    }

    if (data.studentIds) {
      const invalidIds = data.studentIds.filter((id) => isNaN(id) || id <= 0)
      if (invalidIds.length > 0) {
        errors.push("Todos los IDs de estudiantes deben ser números válidos")
      }
    }

    return errors
  }

  // Procesar datos de brigada para respuesta
  static formatBrigadeData(brigade) {
    return {
      id: brigade.id,
      name: brigade.name,
      encargado_name: brigade.encargado_name || null,
      encargado_lastName: brigade.encargado_lastName || null,
      encargado_ci: brigade.encargado_ci || null,
      fecha_inicio: brigade.fecha_inicio || null,
      studentCount: Number.parseInt(brigade.studentCount) || 0,
      created_at: brigade.created_at || null,
      updated_at: brigade.updated_at || null,
    }
  }

  // Procesar lista de brigadas
  static formatBrigadeList(brigades) {
    return brigades.map(this.formatBrigadeData)
  }

  // Obtener estadísticas de brigada
  static async getBrigadeStatistics(brigadeId) {
    try {
      const brigade = await BrigadaModel.findById(brigadeId)
      if (!brigade) {
        throw new Error("Brigada no encontrada")
      }

      const students = await BrigadaModel.getStudentsByBrigade(brigadeId)

      const stats = {
        totalStudents: students.length,
        maleStudents: students.filter((s) => s.sex === "Masculino").length,
        femaleStudents: students.filter((s) => s.sex === "Femenino").length,
        gradeDistribution: {},
      }

      // Distribución por grado
      students.forEach((student) => {
        const grade = student.grade_name || "Sin grado"
        stats.gradeDistribution[grade] = (stats.gradeDistribution[grade] || 0) + 1
      })

      return {
        brigade,
        statistics: stats,
        students,
      }
    } catch (error) {
      console.error("Error obteniendo estadísticas de brigada:", error)
      throw error
    }
  }

  // Generar reporte de brigada
  static async generateBrigadeReport(brigadeId) {
    try {
      const brigadeData = await this.getBrigadeStatistics(brigadeId)

      const report = {
        brigada: brigadeData.brigade,
        estadisticas: brigadeData.statistics,
        estudiantes: brigadeData.students,
        fechaReporte: new Date().toISOString(),
        resumen: {
          nombre: brigadeData.brigade.name,
          encargado: brigadeData.brigade.encargado_name
            ? `${brigadeData.brigade.encargado_name} ${brigadeData.brigade.encargado_lastName}`
            : "Sin asignar",
          totalEstudiantes: brigadeData.statistics.totalStudents,
          fechaInicio: brigadeData.brigade.fecha_inicio,
        },
      }

      return report
    } catch (error) {
      console.error("Error generando reporte de brigada:", error)
      throw error
    }
  }
}

export default BrigadaService
