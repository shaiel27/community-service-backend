// src/controllers/pdf.controller.js
import PDFDocument from "pdfkit"
import { drawPageHeader } from "../utils/pdfGenerator.js"
// Importamos los modelos necesarios
import { MatriculaModel } from "../models/matricula.model.js"
import { BrigadaModel } from "../models/brigada.model.js"
import { PersonalModel } from '../models/personal.model.js'

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
      const enrollmentId = req.params.id
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

  // Función para generar el PDF de listado de brigadas y sus docentes
  generateBrigadesAndTeachersPdf: async (req, res) => {
    try {
      const doc = new PDFDocument({
        margin: 50,
        autoFirstPage: false,
      })

      res.setHeader("Content-Type", "application/pdf")
      res.setHeader("Content-Disposition", 'attachment; filename="listado_brigadas_docentes.pdf"')

      doc.on("error", (err) => {
        console.error("Error en la stream del PDF (generateBrigadesAndTeachersPdf):", err)
        if (!res.headersSent) {
          res.status(500).json({ ok: false, msg: "Error interno al generar el PDF de listado de brigadas y docentes" })
        }
        if (!doc.ended) {
          doc.end()
        }
      })

      doc.pipe(res)

      doc.addPage()
      drawPageHeader(doc, "LISTADO DE BRIGADAS Y DOCENTES ASIGNADOS")

      const brigades = await BrigadaModel.findAll()

      if (brigades.length === 0) {
        doc.fontSize(12).text("No hay brigadas registradas.", { align: "center" })
      } else {
        doc.font("Helvetica-Bold").fontSize(10)
        let yPos = doc.y + 10
        doc.text("Nombre de Brigada", 50, yPos, { width: 150 })
        doc.text("Docente Encargado", 210, yPos, { width: 150 })
        doc.text("CI Docente", 370, yPos, { width: 80 })
        doc.text("Cantidad Estudiantes", 460, yPos, { width: 100, align: "center" })
        doc.lineWidth(0.5).moveTo(50, yPos + 20).lineTo(doc.page.width - 50, yPos + 20).stroke()
        yPos += 25

        doc.font("Helvetica").fontSize(10)
        brigades.forEach((brigade) => {
          if (doc.y + 20 > doc.page.height - doc.page.margins.bottom - 50) {
            doc.addPage()
            drawPageHeader(doc, "LISTADO DE BRIGADAS Y DOCENTES ASIGNADOS (Continuación)")
            yPos = doc.y + 10
            doc.font("Helvetica-Bold").fontSize(10)
            doc.text("Nombre de Brigada", 50, yPos, { width: 150 })
            doc.text("Docente Encargado", 210, yPos, { width: 150 })
            doc.text("CI Docente", 370, yPos, { width: 80 })
            doc.text("Cantidad Estudiantes", 460, yPos, { width: 100, align: "center" }) // Reposicionado
            doc.lineWidth(0.5).moveTo(50, yPos + 15).lineTo(doc.page.width - 50, yPos + 15).stroke()
            yPos += 20
            doc.font("Helvetica").fontSize(10)
          }

          // === LÓGICA DE CONSTRUCCIÓN DE teacherName ===
          const firstName = brigade.encargado_name || '';
          console.log(brigade.encargado_lastName);
          const lastName = brigade.encargado_lastName || '';

          let teacherName = '';
          if (firstName && lastName) {
            teacherName = `${firstName} ${lastName}`;
          } else if (firstName) {
            teacherName = firstName;
          } else if (lastName) {
            teacherName = lastName;
          } else {
            teacherName = 'N/A'; 
          }

          const teacherCi = brigade.encargado_ci || "N/A"
          const studentCount = String(brigade.studentCount ?? 0)
          doc.text(brigade.name || "N/A", 50, yPos, { width: 150 })
          doc.text(teacherName, 210, yPos, { width: 150 })
          doc.text(teacherCi, 370, yPos, { width: 80 })
          doc.text(studentCount, 460, yPos, { width: 100, align: 'center' })
          yPos += 20
        })
      }

      doc.end()
    } catch (error) {
      console.error("Error al generar PDF de brigadas y docentes:", error)
      if (!res.headersSent) {
        res.status(500).json({
          ok: false,
          msg: "Error al generar el PDF de listado de brigadas y docentes.",
          error: error.message,
        })
      }
    }
  },
  generateBrigadeDetailsPdf: async (req, res) => {
    try {
      const brigadeId = req.params.id
      if (!brigadeId) {
        return res.status(400).json({ ok: false, msg: "ID de brigada es requerido." })
      }

      const brigadeDetails = await BrigadaModel.findById(brigadeId) //
      if (!brigadeDetails) {
        return res.status(404).json({ ok: false, msg: "Brigada no encontrada." })
      }

      const studentsInBrigade = await BrigadaModel.getStudentsInBrigade(brigadeId) //

      const doc = new PDFDocument({ margin: 50, autoFirstPage: false })
      res.setHeader("Content-Type", "application/pdf")
      res.setHeader("Content-Disposition", `attachment; filename="detalle_brigada_${brigadeId}.pdf"`)

      doc.on("error", (err) => {
        console.error("Error en la stream del PDF (generateBrigadeDetailsPdf):", err)
        if (!res.headersSent) {
          res.status(500).json({ ok: false, msg: "Error interno al generar el PDF de detalles de brigada" })
        }
        if (!doc.ended) {
          doc.end()
        }
      })

      doc.pipe(res)
      doc.addPage()
      drawPageHeader(doc, `DETALLE DE BRIGADA: ${brigadeDetails.name.toUpperCase()}`) //

      doc.fontSize(12).font("Helvetica-Bold").text("Información de la Brigada:", 50, doc.y + 20)
      doc.font("Helvetica").fontSize(10)
      doc.text(`Nombre de Brigada: ${brigadeDetails.name || "N/A"}`, 50, doc.y + 10)
      const teacherName = (brigadeDetails.encargado_name && brigadeDetails.encargado_lastName) ? `${brigadeDetails.encargado_name} ${brigadeDetails.encargado_lastName}` : 'N/A';
      doc.text(`Docente Encargado: ${teacherName}`, 50, doc.y + 10)
      doc.text(`C.I. Docente: ${brigadeDetails.encargado_ci || "N/A"}`, 50, doc.y + 10)
      doc.text(`Fecha de Inicio: ${brigadeDetails.fecha_inicio ? new Date(brigadeDetails.fecha_inicio).toLocaleDateString() : "N/A"}`, 50, doc.y + 10)

      doc.fontSize(12).font("Helvetica-Bold").text("Listado de Estudiantes:", 50, doc.y + 20)
      if (studentsInBrigade.length === 0) {
        doc.fontSize(10).text("No hay estudiantes asignados a esta brigada.", { align: "center" })
      } else {
        doc.font("Helvetica-Bold").fontSize(10)
        let yPos = doc.y + 10
        doc.text("C.I. Estudiante", 50, yPos, { width: 100 })
        doc.text("Nombre Completo", 160, yPos, { width: 200 })
        doc.text("Fecha de Nacimiento", 370, yPos, { width: 150 })
        doc.lineWidth(0.5).moveTo(50, yPos + 15).lineTo(doc.page.width - 50, yPos + 15).stroke()
        yPos += 20

        doc.font("Helvetica").fontSize(10)
        studentsInBrigade.forEach((student) => {
          if (doc.y + 20 > doc.page.height - doc.page.margins.bottom - 50) {
            doc.addPage()
            drawPageHeader(doc, `DETALLE DE BRIGADA: ${brigadeDetails.name.toUpperCase()} (Continuación)`) //
            yPos = doc.y + 10
            doc.font("Helvetica-Bold").fontSize(10)
            doc.text("C.I. Estudiante", 50, yPos, { width: 100 })
            doc.text("Nombre Completo", 160, yPos, { width: 200 })
            doc.text("Fecha de Nacimiento", 370, yPos, { width: 150 })
            doc.lineWidth(0.5).moveTo(50, yPos + 15).lineTo(doc.page.width - 50, yPos + 15).stroke()
            yPos += 20
            doc.font("Helvetica").fontSize(10)
          }
          doc.text(student.student_ci || "N/A", 50, yPos, { width: 100 })
          doc.text(`${student.student_name} ${student.student_lastName}`, 160, yPos, { width: 200 })
          doc.text(student.student_birthday ? new Date(student.student_birthday).toLocaleDateString() : "N/A", 370, yPos, { width: 150 })
          yPos += 20
        })
      }
      doc.end()
    } catch (error) {
      console.error("Error al generar PDF de detalles de brigada:", error)
      if (!res.headersSent) {
        res.status(500).json({ ok: false, msg: "Error al generar el PDF de detalles de brigada", error: error.message })
      }
    }
  },
  generateStudentListByGradePdf: async (req, res) => {
    try {
      const gradeId = req.params.gradeId
      if (!gradeId) {
        return res.status(400).json({ ok: false, msg: "ID de grado es requerido." })
      }

      const doc = new PDFDocument({ margin: 50, autoFirstPage: false })
      res.setHeader("Content-Type", "application/pdf")
      res.setHeader("Content-Disposition", `attachment; filename="listado_estudiantes_grado_${gradeId}.pdf"`)

      doc.on("error", (err) => {
        console.error("Error en la stream del PDF (generateStudentListByGradePdf):", err)
        if (!res.headersSent) {
          res.status(500).json({ ok: false, msg: "Error interno al generar el PDF de listado de estudiantes por grado" })
        }
        if (!doc.ended) {
          doc.end()
        }
      })

      doc.pipe(res)
      doc.addPage()
      
      const enrollments = await MatriculaModel.findByGrade(gradeId) //

      let gradeName = "Desconocido";
      if (enrollments.length > 0) {
        gradeName = enrollments[0].grade_name;
      }

      drawPageHeader(doc, `LISTADO DE ESTUDIANTES - ${gradeName}`) //

      const students = enrollments.map(enrollment => ({
        cedula_escolar: enrollment.student_school_id,
        nombre: enrollment.student_name,
        apellido: enrollment.student_lastName,
        seccion_nombre: enrollment.section_name,
      }))

      if (students.length === 0) {
        doc.fontSize(12).text(`No hay estudiantes registrados para el grado ${gradeName}.`, { align: "center" })
      } else {
        doc.font("Helvetica-Bold").fontSize(10)
        let yPos = doc.y + 10
        doc.text("Cédula", 50, yPos, { width: 100 })
        doc.text("Nombre Completo", 150, yPos, { width: 200 })
        doc.text("Sección", 360, yPos, { width: 100 })
        doc.lineWidth(0.5).moveTo(50, yPos + 15).lineTo(doc.page.width - 50, yPos + 15).stroke()
        yPos += 20

        doc.font("Helvetica").fontSize(10)
        students.forEach((student) => {
          if (doc.y + 20 > doc.page.height - doc.page.margins.bottom - 50) {
            doc.addPage()
            drawPageHeader(doc, `LISTADO DE ESTUDIANTES - ${gradeName} (Continuación)`) //
            yPos = doc.y + 10
            doc.font("Helvetica-Bold").fontSize(10)
            doc.text("Cédula", 50, yPos, { width: 100 })
            doc.text("Nombre Completo", 150, yPos, { width: 200 })
            doc.text("Sección", 360, yPos, { width: 100 })
            doc.lineWidth(0.5).moveTo(50, yPos + 15).lineTo(doc.page.width - 50, yPos + 15).stroke()
            yPos += 20
            doc.font("Helvetica").fontSize(10)
          }
          doc.text(student.cedula_escolar || "N/A", 50, yPos, { width: 100 })
          doc.text(`${student.nombre} ${student.apellido}`, 150, yPos, { width: 200 })
          doc.text(student.seccion_nombre || "N/A", 360, yPos, { width: 100 })
          yPos += 20
        })
      }
      doc.end()
    } catch (error) {
      console.error("Error al generar PDF de listado de estudiantes por grado:", error)
      if (!res.headersSent) {
        res.status(500).json({ ok: false, msg: "Error al generar el PDF de listado de estudiantes por grado", error: error.message })
      }
    }
  },
  generateTeacherListPdf: async (req, res) => {
    try {
      const doc = new PDFDocument({ margin: 50, autoFirstPage: false })
      res.setHeader("Content-Type", "application/pdf")
      res.setHeader("Content-Disposition", 'attachment; filename="listado_docentes.pdf"')

      doc.on("error", (err) => {
        console.error("Error en la stream del PDF (generateTeacherListPdf):", err)
        if (!res.headersSent) {
          res.status(500).json({ ok: false, msg: "Error interno al generar el PDF de listado de docentes" })
        }
        if (!doc.ended) {
          doc.end()
        }
      })

      doc.pipe(res)
      doc.addPage()
      drawPageHeader(doc, "LISTADO DE DOCENTES") //

      const teachers = await PersonalModel.findTeachers() //

      if (teachers.length === 0) {
        doc.fontSize(12).text("No hay docentes registrados.", { align: "center" })
      } else {
        doc.font("Helvetica-Bold").fontSize(10)
        let yPos = doc.y + 10
        doc.text("C.I.", 50, yPos, { width: 80 })
        doc.text("Nombre Completo", 140, yPos, { width: 200 })
        doc.text("Email", 350, yPos, { width: 150 })
        doc.text("Teléfono", 510, yPos, { width: 80 })
        doc.lineWidth(0.5).moveTo(50, yPos + 15).lineTo(doc.page.width - 50, yPos + 15).stroke()
        yPos += 20

        doc.font("Helvetica").fontSize(10)
        teachers.forEach((teacher) => {
          if (doc.y + 20 > doc.page.height - doc.page.margins.bottom - 50) {
            doc.addPage()
            drawPageHeader(doc, "LISTADO DE DOCENTES (Continuación)") //
            yPos = doc.y + 10
            doc.font("Helvetica-Bold").fontSize(10)
            doc.text("C.I.", 50, yPos, { width: 80 })
            doc.text("Nombre Completo", 140, yPos, { width: 200 })
            doc.text("Email", 350, yPos, { width: 150 })
            doc.text("Teléfono", 510, yPos, { width: 80 })
            doc.lineWidth(0.5).moveTo(50, yPos + 15).lineTo(doc.page.width - 50, yPos + 15).stroke()
            yPos += 20
            doc.font("Helvetica").fontSize(10)
          }
          doc.text(teacher.ci || "N/A", 50, yPos, { width: 80 })
          doc.text(`${teacher.name} ${teacher.lastName}`, 140, yPos, { width: 200 })
          doc.text(teacher.email || "N/A", 350, yPos, { width: 150 })
          doc.text(teacher.telephoneNumber || "N/A", 510, yPos, { width: 80 })
          yPos += 20
        })
      }
      doc.end()
    } catch (error) {
      console.error("Error al generar PDF de listado de docentes:", error)
      if (!res.headersSent) {
        res.status(500).json({ ok: false, msg: "Error al generar el PDF de listado de docentes", error: error.message })
      }
    }
  },
  generateTeacherDetailsPdf: async (req, res) => {
    try {
      const personalId = req.params.id // Obtener el ID del personal de los parámetros de la URL
      if (!personalId) {
        return res.status(400).json({ ok: false, msg: "ID de personal es requerido." })
      }

      // Obtener los datos extensos del docente usando findOneById
      const result = await PersonalModel.findOneById(personalId)
      const teacherDetails = result ? result : null
      // Verificar si el personal existe y si es un docente
      if (!teacherDetails || teacherDetails.idRole !== '1') {
        return res.status(404).json({ ok: false, msg: "Docente no encontrado o el ID no corresponde a un docente." })
      }

      const doc = new PDFDocument({ margin: 50, autoFirstPage: false })
      res.setHeader("Content-Type", "application/pdf")
      res.setHeader("Content-Disposition", `attachment; filename="detalle_docente_${personalId}.pdf"`)

      doc.on("error", (err) => {
        console.error("Error en la stream del PDF (generateTeacherDetailsPdf):", err)
        if (!res.headersSent) {
          res.status(500).json({ ok: false, msg: "Error interno al generar el PDF de detalles de docente" })
        }
        if (!doc.ended) {
          doc.end()
        }
      })

      doc.pipe(res)
      doc.addPage()
      drawPageHeader(doc, "FICHA DE DATOS DEL DOCENTE") // Título del PDF

      // Información personal del docente
      doc.fontSize(14).font("Helvetica-Bold").text("Información Personal", 50, doc.y + 20)
      doc.font("Helvetica").fontSize(11)
      doc.text(`Nombre Completo: ${teacherDetails.name || "N/A"} ${teacherDetails.lastName || ""}`, 50, doc.y + 10)
      doc.text(`Cédula de Identidad: ${teacherDetails.ci || "N/A"}`, 50, doc.y + 10)
      doc.text(`Email: ${teacherDetails.email || "N/A"}`, 50, doc.y + 10)
      doc.text(`Teléfono: ${teacherDetails.telephoneNumber || "N/A"}`, 50, doc.y + 10)
      doc.text(`Fecha de Nacimiento: ${teacherDetails.birthday ? new Date(teacherDetails.birthday).toLocaleDateString() : "N/A"}`, 50, doc.y + 10)
      doc.text(`Género: ${teacherDetails.gender || "N/A"}`, 50, doc.y + 10)
      doc.text(`Dirección: ${teacherDetails.direction || "N/A"}`, 50, doc.y + 10)
      doc.text(`Parroquia: ${teacherDetails.parroquia_nombre || "N/A"}`, 50, doc.y + 10)

      // Información de rol (ya que PersonalModel.findOneById incluye el rol)
      doc.fontSize(14).font("Helvetica-Bold").text("Información de Rol", 50, doc.y + 20)
      doc.font("Helvetica").fontSize(11)
      doc.text(`Rol: ${teacherDetails.rol_nombre || "N/A"}`, 50, doc.y + 10)
      doc.text(`Descripción del Rol: ${teacherDetails.rol_descripcion || "N/A"}`, 50, doc.y + 10)

      // Puedes añadir más información relevante para un docente si tu modelo la tiene, por ejemplo:
      // - Historial académico (si lo gestionas)
      // - Brigadas asignadas (sería una consulta adicional similar a BrigadaModel.getStudentsInBrigade)
      // - Secciones o grados a cargo (si los obtienes a través del modelo de personal o de matrícula)

      doc.end()
    } catch (error) {
      console.error("Error al generar PDF de detalles de docente:", error)
      if (!res.headersSent) {
        res.status(500).json({ ok: false, msg: "Error al generar el PDF de detalles de docente", error: error.message })
      }
    }
  },
}