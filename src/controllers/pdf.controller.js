// src/controllers/pdf.controller.js
import PDFDocument from "pdfkit"
import { drawPageHeader } from "../utils/pdfGenerator.js"
// Importamos los modelos necesarios
import { MatriculaModel } from "../models/matricula.model.js"
// Ya no necesitamos 'db' directamente aquí porque usamos los modelos

export const PdfController = {
  generateStudentListPdf: async (req, res) => {
    try {
      const doc = new PDFDocument({
        margin: 50,
        autoFirstPage: false,
      })

      res.setHeader("Content-Type", "application/pdf")
      res.setHeader("Content-Disposition", 'attachment; filename="listado_estudiantes.pdf"')

      doc.on("error", (err) => {
        console.error("Error en la stream del PDF (generateStudentListPdf):", err)
        if (!res.headersSent) {
          res.status(500).json({ ok: false, msg: "Error interno al generar el PDF de listado de estudiantes" })
        }
        if (!doc.ended) {
          doc.end()
        }
      })

      doc.pipe(res)

      // Añadir la primera página y dibujar la cabecera
      doc.addPage()
      drawPageHeader(doc, "LISTADO DE ESTUDIANTES")

      // --- Contenido del PDF: Listado de Estudiantes ---
      // Usar el modelo de Matrícula para obtener la lista de estudiantes
      // El modelo MatriculaModel.findAll ya trae student, section, grade y personal data
      const enrollments = await MatriculaModel.findAll()

      // Adaptar los datos para el formato esperado por el PDF
      const students = enrollments.map(enrollment => ({
        id: enrollment.student_id,
        nombre: enrollment.student_name,
        apellido: enrollment.student_lastName,
        cedula_escolar: enrollment.student_school_id, // Asumiendo que existe este campo en el modelo o se puede adaptar
        grado_nombre: enrollment.grade_name,
        seccion_nombre: enrollment.section_name,
      }))

      if (students.length === 0) {
        doc.fontSize(12).text("No hay estudiantes registrados.", { align: "center" })
      } else {
        doc.font("Helvetica-Bold").fontSize(10)
        let yPos = doc.y + 10
        doc.text("Cédula", 50, yPos, { width: 100 })
        doc.text("Nombre Completo", 150, yPos, { width: 200 })
        doc.text("Grado", 350, yPos, { width: 100 })
        doc.text("Sección", 450, yPos, { width: 100 })
        doc.lineWidth(0.5).moveTo(50, yPos + 15).lineTo(doc.page.width - 50, yPos + 15).stroke()
        yPos += 20

        doc.font("Helvetica").fontSize(10)
        students.forEach((student) => {
          // Si el contenido excede el espacio en la página, añade una nueva página y su cabecera
          if (doc.y + 20 > doc.page.height - doc.page.margins.bottom - 50) { // Ajusta este valor si es necesario
            doc.addPage()
            drawPageHeader(doc, "LISTADO DE ESTUDIANTES (Continuación)") // Llama a la cabecera para la nueva página
            yPos = doc.y + 10 // Reinicia yPos después de la cabecera
            doc.font("Helvetica-Bold").fontSize(10)
            doc.text("Cédula", 50, yPos, { width: 100 })
            doc.text("Nombre Completo", 150, yPos, { width: 200 })
            doc.text("Grado", 350, yPos, { width: 100 })
            doc.text("Sección", 450, yPos, { width: 100 })
            doc.lineWidth(0.5).moveTo(50, yPos + 15).lineTo(doc.page.width - 50, yPos + 15).stroke()
            yPos += 20
            doc.font("Helvetica").fontSize(10)
          }

          doc.text(student.cedula_escolar || "N/A", 50, yPos, { width: 100 })
          doc.text(`${student.nombre} ${student.apellido}`, 150, yPos, { width: 200 })
          doc.text(student.grado_nombre || "N/A", 350, yPos, { width: 100 })
          doc.text(student.seccion_nombre || "N/A", 450, yPos, { width: 100 })
          yPos += 20
        })
      }

      doc.end()
    } catch (error) {
      console.error("Error al generar PDF de listado de estudiantes:", error)
      if (!res.headersSent) {
        res.status(500).json({
          ok: false,
          msg: "Error al generar el PDF de listado de estudiantes.",
          error: error.message,
        })
      }
    }
  },

  generateEnrollmentFormPdf: async (req, res) => {
    try {
      const enrollmentId = req.params.id // Aquí debería ser el ID de la matrícula, no del estudiante.
                                        // Asumo que se pasa el ID de la tabla "enrollment"
      if (!enrollmentId) {
        return res.status(400).json({
          ok: false,
          msg: "ID de matrícula es requerido para generar la ficha de matrícula.",
        })
      }

      // Usar el modelo MatriculaModel.findById para obtener todos los datos con joins
      const student = await MatriculaModel.findById(enrollmentId) // Renombrado a 'student' para mantener la coherencia con el resto del código

      if (!student) {
        return res.status(404).json({
          ok: false,
          msg: "Matrícula no encontrada para el ID proporcionado.",
        })
      }

      const doc = new PDFDocument({ margin: 50, autoFirstPage: false })

      res.setHeader("Content-Type", "application/pdf")
      res.setHeader("Content-Disposition", `attachment; filename="ficha_matricula_${student.id}.pdf"`) // Usar student.id del resultado del modelo

      doc.on("error", (err) => {
        console.error("Error en la stream del PDF (generateEnrollmentFormPdf):", err)
        if (!res.headersSent) {
          res.status(500).json({ ok: false, msg: "Error interno al generar el PDF de ficha de matrícula" })
        }
        if (!doc.ended) {
          doc.end()
        }
      })

      doc.pipe(res)

      // Añadir la primera página y dibujar la cabecera
      doc.addPage()
      drawPageHeader(doc, "FICHA DE MATRÍCULA DEL ESTUDIANTE")

      doc.moveDown()
      doc.font("Helvetica-Bold").fontSize(14).text("Datos del Estudiante")
      doc.font("Helvetica").fontSize(10)
      // Adaptar los nombres de los campos a los retornados por MatriculaModel.findById
      doc.text(`Nombre: ${student.student_name} ${student.student_lastName}`)
      doc.text(`Cédula Escolar: ${student.student_school_id || 'N/A'}`)
      doc.text(`Fecha de Nacimiento: ${student.student_birthday ? new Date(student.student_birthday).toLocaleDateString('es-ES') : 'N/A'}`)
      doc.text(`Lugar de Nacimiento: ${student.student_birthplace_name || 'N/A'}`) // Asumiendo que el modelo trae el nombre
      doc.text(`Sexo: ${student.student_sex || 'N/A'}`)
      doc.text(`Cantidad de Hermanos: ${student.student_sibling_count !== null ? student.student_sibling_count : 'N/A'}`)
      doc.text(`Vive con la madre: ${student.lives_with_mother ? 'Sí' : 'No'}`)
      doc.text(`Vive con el padre: ${student.lives_with_father ? 'Sí' : 'No'}`)
      doc.text(`Vive con ambos: ${student.lives_with_both ? 'Sí' : 'No'}`)
      doc.text(`Vive con el representante: ${student.lives_with_representative ? 'Sí' : 'No'}`)

      doc.moveDown(2)
      doc.font("Helvetica-Bold").fontSize(14).text("Datos del Representante")
      doc.font("Helvetica").fontSize(10)
      // Adaptar los nombres de los campos a los retornados por MatriculaModel.findById
      doc.text(`Nombre: ${student.representative_name || 'N/A'} ${student.representative_lastName || ''}`)
      doc.text(`Cédula: ${student.representative_ci || 'N/A'}`)
      doc.text(`Teléfono: ${student.representative_phoneNumber || 'N/A'}`)
      doc.text(`Email: ${student.representative_email || 'N/A'}`)
      doc.text(`Dirección: ${student.representative_address || 'N/A'}`)
      doc.text(`Lugar de Trabajo: ${student.representative_workplace || 'N/A'}`)
      doc.text(`Teléfono Trabajo: ${student.representative_work_phone || 'N/A'}`)

      doc.moveDown(2)
      doc.font("Helvetica-Bold").fontSize(14).text("Datos de Matrícula")
      doc.font("Helvetica").fontSize(10)
      // Adaptar los nombres de los campos a los retornados por MatriculaModel.findById
      doc.text(`Fecha de Inscripción: ${student.registration_date ? new Date(student.registration_date).toLocaleDateString('es-ES') : 'N/A'}`)
      doc.text(`Período Escolar: ${student.period || 'N/A'}`) // Asumiendo que el modelo trae 'period'
      doc.text(`Grado: ${student.grade_name || 'N/A'}`)
      doc.text(`Sección: ${student.section_name || 'N/A'}`)
      doc.text(`Repitiente: ${student.repeater ? 'Sí' : 'No'}`)
      doc.text(`Docente de Grado: ${student.teacher_name || 'N/A'} ${student.teacher_lastName || ''}`)

      doc.moveDown(2)
      doc.font("Helvetica-Bold").fontSize(14).text("Información Adicional de Matrícula")
      doc.font("Helvetica").fontSize(10)
      doc.text(`Talla Camisa: ${student.chemiseSize || 'N/A'}`)
      doc.text(`Talla Pantalón: ${student.pantsSize || 'N/A'}`)
      doc.text(`Talla Zapatos: ${student.shoesSize || 'N/A'}`)
      doc.text(`Peso: ${student.weight || 'N/A'} kg`)
      doc.text(`Estatura: ${student.stature || 'N/A'} cm`)
      doc.text(`Enfermedades: ${student.diseases || 'Ninguna'}`)
      doc.text(`Observaciones: ${student.observation || 'Ninguna'}`)

      doc.moveDown(2)
      doc.font("Helvetica-Bold").fontSize(14).text("Documentación Entregada")
      doc.font("Helvetica").fontSize(10)
      doc.text(`Acta de Nacimiento: ${student.birthCertificateCheck ? 'Sí' : 'No'}`)
      doc.text(`Tarjeta de Vacunas: ${student.vaccinationCardCheck ? 'Sí' : 'No'}`)
      doc.text(`Fotos del Estudiante: ${student.studentPhotosCheck ? 'Sí' : 'No'}`)
      doc.text(`Fotos del Representante: ${student.representativePhotosCheck ? 'Sí' : 'No'}`)
      doc.text(`Copia Cédula Representante: ${student.representativeCopyIDCheck ? 'Sí' : 'No'}`)
      doc.text(`Copia Cédula Autorizados: ${student.autorizedCopyIDCheck ? 'Sí' : 'No'}`)


      doc.end()
    } catch (error) {
      console.error("Error al generar PDF de ficha de matrícula:", error)
      if (!res.headersSent) {
        res.status(500).json({
          ok: false,
          msg: "Error al generar el PDF de ficha de matrícula.",
          error: error.message,
        })
      }
    }
  },
}