// src/controllers/pdf.controller.js
import PDFDocument from "pdfkit"
// ¡IMPORTANTE! Ahora solo importamos drawPageHeader
import { drawPageHeader } from "../utils/pdfGenerator.js"
import { db } from "../db/connection.database.js"

export const PdfController = {
  generateStudentListPdf: async (req, res) => {
    try {
      const doc = new PDFDocument({
        margin: 50,
        autoFirstPage: false,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'attachment; filename="listado_estudiantes.pdf"');

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
      const studentsQuery = `
        SELECT E.id, E.nombre, E.apellido, E.cedula_escolar, G.nombre AS grado_nombre, DG.seccion AS seccion_nombre
        FROM estudiante AS E
        LEFT JOIN matricula AS M ON E.id = M.estudiante_id
        LEFT JOIN docente_grado AS DG ON M.docente_grado_id = DG.id
        LEFT JOIN grado AS G ON DG.grado_id = G.id
        ORDER BY g.nombre, dg.seccion, e.apellido, e.nombre;
      `
      const { rows: students } = await db.query(studentsQuery)

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

      // NO SE LLAMA NINGUNA FUNCIÓN DE PIE DE PÁGINA AQUÍ
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
      const studentId = req.params.id
      if (!studentId) {
        return res.status(400).json({
          ok: false,
          msg: "ID del estudiante es requerido para generar la ficha de matrícula.",
        })
      }

      const studentQuery = `
        SELECT
          e.cedula_escolar AS estudiante_cedula, e.apellido AS estudiante_apellido, e.nombre AS estudiante_nombre,
          e.birthday AS estudiante_fecha_nacimiento, e.direccion AS estudiante_direccion,
          e.telephoneNomber AS estudiante_telefono, e.email AS estudiante_email,
          e.lugarNacimiento_id AS estudiante_lugar_nacimiento, e.sexo AS estudiante_sexo, e.cant_hermanos AS estudiante_cant_hermanos,
          e.vive_madre, e.vive_padre, e.vive_ambos, e.vive_representante,
          r.name AS representante_nombre, r.lastName AS representante_apellido, r.Cedula AS representante_cedula,
          r.telephoneNomber AS representante_telefono, r.Email AS representante_email,
          r.direccionHabitacion AS representante_direccion, r.lugar_trabajo AS representante_lugar_trabajo,
          r.telefono_trabajo AS representante_telefono_trabajo,
          m.fecha_inscripcion, m.periodo_escolar, m.repitiente,
          g.nombre AS grado_nombre, dg.seccion AS seccion_nombre,
          p.nombre AS docente_nombre, p.lastName AS docente_apellido
        FROM estudiante AS e
        LEFT JOIN representante r ON e.id = r.estudiante_id
        LEFT JOIN matricula m ON e.id = m.estudiante_id
        LEFT JOIN docente_grado dg ON m.docente_grado_id = dg.id
        LEFT JOIN grado g ON dg.grado_id = g.id
        LEFT JOIN personal p ON dg.docente_id = p.id
        WHERE e.id = $1
      `
      const { rows: studentData } = await db.query(studentQuery, [studentId])

      if (studentData.length === 0) {
        return res.status(404).json({
          ok: false,
          msg: "Estudiante no encontrado.",
        })
      }
      const student = studentData[0]

      const doc = new PDFDocument({ margin: 50, autoFirstPage: false })

      res.setHeader("Content-Type", "application/pdf")
      res.setHeader("Content-Disposition", `attachment; filename="ficha_matricula_${studentId}.pdf"`)

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
      doc.text(`Nombre: ${student.estudiante_nombre} ${student.estudiante_apellido}`)
      doc.text(`Cédula Escolar: ${student.estudiante_cedula}`)
      doc.text(`Fecha de Nacimiento: ${student.estudiante_fecha_nacimiento ? new Date(student.estudiante_fecha_nacimiento).toLocaleDateString('es-ES') : 'N/A'}`)
      doc.text(`Lugar de Nacimiento: ${student.estudiante_lugar_nacimiento || 'N/A'}`)
      doc.text(`Sexo: ${student.estudiante_sexo || 'N/A'}`)
      doc.text(`Cantidad de Hermanos: ${student.estudiante_cant_hermanos !== null ? student.estudiante_cant_hermanos : 'N/A'}`)
      doc.text(`Vive con la madre: ${student.vive_madre ? 'Sí' : 'No'}`)
      doc.text(`Vive con el padre: ${student.vive_padre ? 'Sí' : 'No'}`)
      doc.text(`Vive con ambos: ${student.vive_ambos ? 'Sí' : 'No'}`)
      doc.text(`Vive con el representante: ${student.vive_representante ? 'Sí' : 'No'}`)

      doc.moveDown(2)
      doc.font("Helvetica-Bold").fontSize(14).text("Datos del Representante")
      doc.font("Helvetica").fontSize(10)
      doc.text(`Nombre: ${student.representante_nombre || 'N/A'} ${student.representante_apellido || ''}`)
      doc.text(`Cédula: ${student.representante_cedula || 'N/A'}`)
      doc.text(`Teléfono: ${student.representante_telefono || 'N/A'}`)
      doc.text(`Email: ${student.representante_email || 'N/A'}`)
      doc.text(`Dirección: ${student.representante_direccion || 'N/A'}`)
      doc.text(`Lugar de Trabajo: ${student.representante_lugar_trabajo || 'N/A'}`)
      doc.text(`Teléfono Trabajo: ${student.representante_telefono_trabajo || 'N/A'}`)

      doc.moveDown(2)
      doc.font("Helvetica-Bold").fontSize(14).text("Datos de Matrícula")
      doc.font("Helvetica").fontSize(10)
      doc.text(`Fecha de Inscripción: ${student.fecha_inscripcion ? new Date(student.fecha_inscripcion).toLocaleDateString('es-ES') : 'N/A'}`)
      doc.text(`Período Escolar: ${student.periodo_escolar || 'N/A'}`)
      doc.text(`Grado: ${student.grado_nombre || 'N/A'}`)
      doc.text(`Sección: ${student.seccion_nombre || 'N/A'}`)
      doc.text(`Repitiente: ${student.repitiente ? 'Sí' : 'No'}`)
      doc.text(`Docente de Grado: ${student.docente_nombre || 'N/A'} ${student.docente_apellido || ''}`)

      // NO SE LLAMA NINGUNA FUNCIÓN DE PIE DE PÁGINA AQUÍ
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