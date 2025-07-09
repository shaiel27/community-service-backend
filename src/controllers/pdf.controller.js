import PDFDocument from "pdfkit"
import { BrigadaModel } from "../models/brigada.model.js"
import { MatriculaModel } from "../models/matricula.model.js"
import { PersonalModel } from "../models/personal.model.js"
import { drawPageHeader } from "../utils/pdfGenerator.js"

const PdfController = {
  // Generar PDF con listado general de brigadas y docentes
  generateBrigadeListPdf: async (req, res) => {
    try {
      console.log("📄 Generando PDF de listado de brigadas...")

      const brigades = await BrigadaModel.findAll()

      if (!brigades || brigades.length === 0) {
        return res.status(404).json({
          ok: false,
          msg: "No hay brigadas registradas para generar el reporte",
        })
      }

      const doc = new PDFDocument({ margin: 50 })

      // Headers para descarga
      res.setHeader("Content-Type", "application/pdf")
      res.setHeader("Content-Disposition", 'attachment; filename="listado_brigadas_docentes.pdf"')

      doc.pipe(res)

      // Cabecera del documento
      drawPageHeader(doc, "LISTADO DE BRIGADAS Y DOCENTES ENCARGADOS")

      doc.moveDown(2)
      doc.fontSize(12).text(`Fecha de generación: ${new Date().toLocaleDateString("es-ES")}`)
      doc.text(`Total de brigadas: ${brigades.length}`)
      doc.moveDown()

      // Tabla de brigadas
      let yPosition = doc.y
      const tableTop = yPosition
      const itemHeight = 25

      // Headers de tabla
      doc.fontSize(10).font("Helvetica-Bold")
      doc.text("BRIGADA", 50, yPosition, { width: 150 })
      doc.text("DOCENTE ENCARGADO", 200, yPosition, { width: 150 })
      doc.text("CÉDULA", 350, yPosition, { width: 80 })
      doc.text("ESTUDIANTES", 430, yPosition, { width: 80 })
      doc.text("FECHA INICIO", 510, yPosition, { width: 80 })

      yPosition += itemHeight

      // Línea separadora
      doc
        .moveTo(50, yPosition - 5)
        .lineTo(590, yPosition - 5)
        .stroke()

      // Datos de brigadas
      doc.font("Helvetica").fontSize(9)

      brigades.forEach((brigade, index) => {
        // Verificar si necesitamos nueva página
        if (yPosition > 700) {
          doc.addPage()
          drawPageHeader(doc, "LISTADO DE BRIGADAS Y DOCENTES ENCARGADOS")
          yPosition = doc.y + 50

          // Repetir headers
          doc.fontSize(10).font("Helvetica-Bold")
          doc.text("BRIGADA", 50, yPosition, { width: 150 })
          doc.text("DOCENTE ENCARGADO", 200, yPosition, { width: 150 })
          doc.text("CÉDULA", 350, yPosition, { width: 80 })
          doc.text("ESTUDIANTES", 430, yPosition, { width: 80 })
          doc.text("FECHA INICIO", 510, yPosition, { width: 80 })
          yPosition += itemHeight
          doc
            .moveTo(50, yPosition - 5)
            .lineTo(590, yPosition - 5)
            .stroke()
          doc.font("Helvetica").fontSize(9)
        }

        const brigadeName = brigade.name || "Sin nombre"
        const teacherName =
          brigade.encargado_name && brigade.encargado_lastName
            ? `${brigade.encargado_name} ${brigade.encargado_lastName}`
            : "Sin asignar"
        const teacherCI = brigade.encargado_ci || "N/A"
        const studentCount = brigade.studentCount || 0
        const startDate = brigade.fecha_inicio ? new Date(brigade.fecha_inicio).toLocaleDateString("es-ES") : "N/A"

        doc.text(brigadeName, 50, yPosition, { width: 150 })
        doc.text(teacherName, 200, yPosition, { width: 150 })
        doc.text(teacherCI, 350, yPosition, { width: 80 })
        doc.text(studentCount.toString(), 430, yPosition, { width: 80 })
        doc.text(startDate, 510, yPosition, { width: 80 })

        yPosition += itemHeight

        // Línea separadora cada 5 filas
        if ((index + 1) % 5 === 0) {
          doc
            .moveTo(50, yPosition - 5)
            .lineTo(590, yPosition - 5)
            .stroke()
        }
      })

      // Resumen final
      doc.moveDown(2)
      doc.fontSize(10).font("Helvetica-Bold")
      doc.text("RESUMEN:", 50)
      doc.font("Helvetica").fontSize(9)
      doc.text(`• Total de brigadas: ${brigades.length}`)
      doc.text(`• Brigadas con docente asignado: ${brigades.filter((b) => b.encargado_name).length}`)
      doc.text(`• Brigadas sin docente: ${brigades.filter((b) => !b.encargado_name).length}`)
      doc.text(`• Total de estudiantes en brigadas: ${brigades.reduce((sum, b) => sum + (b.studentCount || 0), 0)}`)

      doc.end()
      console.log("✅ PDF de listado de brigadas generado exitosamente")
    } catch (error) {
      console.error("❌ Error generando PDF de listado de brigadas:", error)
      res.status(500).json({
        ok: false,
        msg: "Error interno del servidor al generar PDF",
        error: error.message,
      })
    }
  },

  // Generar PDF con detalles específicos de una brigada
  generateBrigadeDetailsPdf: async (req, res) => {
    try {
      const brigadeId = req.params.id
      console.log(`🔍 Iniciando generación de PDF para brigada ID: ${brigadeId}`)

      // Validación mejorada del ID
      if (!brigadeId) {
        console.log("❌ ID de brigada no proporcionado")
        return res.status(400).json({
          ok: false,
          msg: "ID de brigada es requerido para generar el PDF.",
        })
      }

      // Validar que el ID sea un número válido
      const numericBrigadeId = Number.parseInt(brigadeId, 10)
      if (isNaN(numericBrigadeId) || numericBrigadeId <= 0) {
        console.log(`❌ ID de brigada inválido: ${brigadeId}`)
        return res.status(400).json({
          ok: false,
          msg: "ID de brigada debe ser un número válido y mayor a 0.",
        })
      }

      console.log(`🔄 Obteniendo detalles de brigada...`)
      const brigadeDetails = await BrigadaModel.findById(numericBrigadeId)

      if (!brigadeDetails) {
        console.log(`❌ Brigada no encontrada para ID: ${brigadeId}`)
        return res.status(404).json({
          ok: false,
          msg: "Brigada no encontrada.",
        })
      }

      console.log(`✅ Brigada encontrada:`, {
        id: brigadeDetails.id,
        name: brigadeDetails.name,
        encargado: brigadeDetails.encargado_name,
      })

      console.log(`🔄 Obteniendo estudiantes de la brigada...`)
      // Usar getStudentsByBrigade en lugar de getStudentsInBrigade para mayor compatibilidad
      const studentsInBrigade = await BrigadaModel.getStudentsByBrigade(numericBrigadeId)
      console.log(`✅ Estudiantes encontrados: ${studentsInBrigade.length}`)

      const doc = new PDFDocument({ margin: 50, autoFirstPage: false })

      // Configurar headers de respuesta
      res.setHeader("Content-Type", "application/pdf")
      res.setHeader("Content-Disposition", `attachment; filename="detalle_brigada_${brigadeId}.pdf"`)

      // Manejar errores del documento PDF
      doc.on("error", (err) => {
        console.error("❌ Error en la stream del PDF (generateBrigadeDetailsPdf):", err)
        if (!res.headersSent) {
          res.status(500).json({ ok: false, msg: "Error interno al generar el PDF de detalles de brigada" })
        }
        if (!doc.ended) {
          doc.end()
        }
      })

      // Conectar el documento a la respuesta
      doc.pipe(res)
      doc.addPage()

      // VALIDACIÓN SEGURA DEL NOMBRE DE LA BRIGADA
      const brigadeName =
        brigadeDetails.name && typeof brigadeDetails.name === "string"
          ? brigadeDetails.name.trim()
          : "BRIGADA SIN NOMBRE"

      console.log(`📄 Generando PDF para: "${brigadeName}"`)

      // Dibujar cabecera del documento
      drawPageHeader(doc, `DETALLE DE BRIGADA: ${brigadeName.toUpperCase()}`)

      // Información de la brigada
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Información de la Brigada:", 50, doc.y + 20)
      doc.font("Helvetica").fontSize(10)
      doc.text(`Nombre de Brigada: ${brigadeName}`, 50, doc.y + 10)

      // VALIDACIÓN SEGURA DE NOMBRES DEL ENCARGADO
      let teacherName = "N/A"
      if (brigadeDetails.encargado_name || brigadeDetails.encargado_lastName) {
        const firstName = (brigadeDetails.encargado_name || "").trim()
        const lastName = (brigadeDetails.encargado_lastName || "").trim()

        if (firstName && lastName) {
          teacherName = `${firstName} ${lastName}`
        } else if (firstName) {
          teacherName = firstName
        } else if (lastName) {
          teacherName = lastName
        }
      }

      doc.text(`Docente Encargado: ${teacherName}`, 50, doc.y + 10)
      doc.text(`C.I. Docente: ${brigadeDetails.encargado_ci || "N/A"}`, 50, doc.y + 10)

      // Formatear fecha de inicio
      let fechaInicio = "N/A"
      if (brigadeDetails.fecha_inicio) {
        try {
          fechaInicio = new Date(brigadeDetails.fecha_inicio).toLocaleDateString("es-ES")
        } catch (error) {
          console.warn("⚠️ Error formateando fecha de inicio:", error)
          fechaInicio = "Fecha inválida"
        }
      }
      doc.text(`Fecha de Inicio: ${fechaInicio}`, 50, doc.y + 10)

      // Listado de estudiantes
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Listado de Estudiantes:", 50, doc.y + 20)

      if (studentsInBrigade.length === 0) {
        doc.fontSize(10).text("No hay estudiantes asignados a esta brigada.", { align: "center" })
      } else {
        // Cabecera de la tabla
        doc.font("Helvetica-Bold").fontSize(10)
        let yPos = doc.y + 10
        doc.text("C.I. Estudiante", 50, yPos, { width: 100 })
        doc.text("Nombre Completo", 160, yPos, { width: 200 })
        doc.text("Fecha de Nacimiento", 370, yPos, { width: 150 })
        doc
          .lineWidth(0.5)
          .moveTo(50, yPos + 15)
          .lineTo(doc.page.width - 50, yPos + 15)
          .stroke()
        yPos += 20

        // Datos de estudiantes
        doc.font("Helvetica").fontSize(10)
        studentsInBrigade.forEach((student, index) => {
          // Verificar si necesitamos una nueva página
          if (doc.y + 20 > doc.page.height - doc.page.margins.bottom - 50) {
            doc.addPage()
            drawPageHeader(doc, `DETALLE DE BRIGADA: ${brigadeName.toUpperCase()} (Continuación)`)
            yPos = doc.y + 10

            // Redibujar cabecera de tabla
            doc.font("Helvetica-Bold").fontSize(10)
            doc.text("C.I. Estudiante", 50, yPos, { width: 100 })
            doc.text("Nombre Completo", 160, yPos, { width: 200 })
            doc.text("Fecha de Nacimiento", 370, yPos, { width: 150 })
            doc
              .lineWidth(0.5)
              .moveTo(50, yPos + 15)
              .lineTo(doc.page.width - 50, yPos + 15)
              .stroke()
            yPos += 20
            doc.font("Helvetica").fontSize(10)
          }

          // VALIDACIÓN SEGURA DE DATOS DEL ESTUDIANTE
          const studentCi = student.ci || "N/A"

          let studentFullName = "N/A"
          if (student.name || student.lastName) {
            const firstName = (student.name || "").trim()
            const lastName = (student.lastName || "").trim()

            if (firstName && lastName) {
              studentFullName = `${firstName} ${lastName}`
            } else if (firstName) {
              studentFullName = firstName
            } else if (lastName) {
              studentFullName = lastName
            }
          }

          let studentBirthday = "N/A"
          if (student.birthday) {
            try {
              studentBirthday = new Date(student.birthday).toLocaleDateString("es-ES")
            } catch (error) {
              console.warn(`⚠️ Error formateando fecha de nacimiento para estudiante ${student.id}:`, error)
              studentBirthday = "Fecha inválida"
            }
          }

          // Escribir datos del estudiante
          doc.text(studentCi, 50, yPos, { width: 100 })
          doc.text(studentFullName, 160, yPos, { width: 200 })
          doc.text(studentBirthday, 370, yPos, { width: 150 })
          yPos += 20
        })
      }

      console.log(`✅ PDF generado exitosamente para brigada: "${brigadeName}"`)
      doc.end()
    } catch (error) {
      console.error("❌ Error al generar PDF de detalles de brigada:", error)
      console.error("Stack trace:", error.stack)

      if (!res.headersSent) {
        res.status(500).json({
          ok: false,
          msg: "Error al generar el PDF de detalles de brigada",
          error: error.message,
          details: process.env.NODE_ENV === "development" ? error.stack : undefined,
        })
      }
    }
  },

  // Generar PDF con listado general de estudiantes
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

      doc.addPage()
      drawPageHeader(doc, "LISTADO DE ESTUDIANTES")

      // --- Contenido del PDF: Listado de Estudiantes ---
      // Usar el modelo de Matrícula para obtener la lista de estudiantes
      // El modelo MatriculaModel.findAll ya trae student, section, grade y personal data
      const enrollments = await MatriculaModel.findAll()

      // Adaptar los datos para el formato esperado por el PDF
      const students = enrollments.map((enrollment) => ({
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
        doc
          .lineWidth(0.5)
          .moveTo(50, yPos + 20)
          .lineTo(doc.page.width - 50, yPos + 20)
          .stroke()
        yPos += 25

        doc.font("Helvetica").fontSize(10)
        students.forEach((student) => {
          if (doc.y + 20 > doc.page.height - doc.page.margins.bottom - 50) {
            doc.addPage()
            drawPageHeader(doc, "LISTADO DE ESTUDIANTES (Continuación)")
            yPos = doc.y + 10
            doc.font("Helvetica-Bold").fontSize(10)
            doc.text("Cédula", 50, yPos, { width: 100 })
            doc.text("Nombre Completo", 150, yPos, { width: 200 })
            doc.text("Grado", 350, yPos, { width: 100 })
            doc.text("Sección", 450, yPos, { width: 100 })
            doc
              .lineWidth(0.5)
              .moveTo(50, yPos + 15)
              .lineTo(doc.page.width - 50, yPos + 15)
              .stroke()
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
        res
          .status(500)
          .json({ ok: false, msg: "Error al generar el PDF de listado de estudiantes", error: error.message })
      }
    }
  },

  // Generar PDF con detalles específicos de una matrícula
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

      // Configurar headers de respuesta
      res.setHeader("Content-Type", "application/pdf")
      res.setHeader("Content-Disposition", `attachment; filename="ficha_matricula_${student.id}.pdf"`)

      // Manejar errores del documento PDF
      doc.on("error", (err) => {
        console.error("Error en la stream del PDF (generateEnrollmentFormPdf):", err)
        if (!res.headersSent) {
          res.status(500).json({ ok: false, msg: "Error interno al generar el PDF de ficha de matrícula" })
        }
        if (!doc.ended) {
          doc.end()
        }
      })

      // Conectar el documento a la respuesta
      doc.pipe(res)
      doc.addPage()

      // VALIDACIÓN SEGURA DEL NOMBRE DE LA BRIGADA
      const brigadeName =
        student.brigada_name && typeof student.brigada_name === "string"
          ? student.brigada_name.trim()
          : "BRIGADA SIN NOMBRE"

      console.log(`📄 Generando PDF para: "${brigadeName}"`)

      // Dibujar cabecera del documento
      drawPageHeader(doc, "FICHA DE MATRÍCULA DEL ESTUDIANTE")

      // Información de la brigada
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Información de la Brigada:", 50, doc.y + 20)
      doc.font("Helvetica").fontSize(10)
      doc.text(`Nombre de Brigada: ${brigadeName}`, 50, doc.y + 10)

      // VALIDACIÓN SEGURA DE NOMBRES DEL ENCARGADO
      let teacherName = "N/A"
      if (student.teacher_name || student.teacher_lastName) {
        const firstName = (student.teacher_name || "").trim()
        const lastName = (student.teacher_lastName || "").trim()

        if (firstName && lastName) {
          teacherName = `${firstName} ${lastName}`
        } else if (firstName) {
          teacherName = firstName
        } else if (lastName) {
          teacherName = lastName
        }
      }

      doc.text(`Docente Encargado: ${teacherName}`, 50, doc.y + 10)
      doc.text(`C.I. Docente: ${student.teacher_ci || "N/A"}`, 50, doc.y + 10)

      // Formatear fecha de inicio
      let fechaInicio = "N/A"
      if (student.brigada_fecha_inicio) {
        try {
          fechaInicio = new Date(student.brigada_fecha_inicio).toLocaleDateString("es-ES")
        } catch (error) {
          console.warn("⚠️ Error formateando fecha de inicio:", error)
          fechaInicio = "Fecha inválida"
        }
      }
      doc.text(`Fecha de Inicio: ${fechaInicio}`, 50, doc.y + 10)

      // Listado de estudiantes
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Listado de Estudiantes:", 50, doc.y + 20)

      if (student.students.length === 0) {
        doc.fontSize(10).text("No hay estudiantes asignados a esta brigada.", { align: "center" })
      } else {
        // Cabecera de la tabla
        doc.font("Helvetica-Bold").fontSize(10)
        let yPos = doc.y + 10
        doc.text("C.I. Estudiante", 50, yPos, { width: 100 })
        doc.text("Nombre Completo", 160, yPos, { width: 200 })
        doc.text("Fecha de Nacimiento", 370, yPos, { width: 150 })
        doc
          .lineWidth(0.5)
          .moveTo(50, yPos + 15)
          .lineTo(doc.page.width - 50, yPos + 15)
          .stroke()
        yPos += 20

        // Datos de estudiantes
        doc.font("Helvetica").fontSize(10)
        student.students.forEach((student, index) => {
          // Verificar si necesitamos una nueva página
          if (doc.y + 20 > doc.page.height - doc.page.margins.bottom - 50) {
            doc.addPage()
            drawPageHeader(doc, `DETALLE DE BRIGADA: ${brigadeName.toUpperCase()} (Continuación)`)
            yPos = doc.y + 10

            // Redibujar cabecera de tabla
            doc.font("Helvetica-Bold").fontSize(10)
            doc.text("C.I. Estudiante", 50, yPos, { width: 100 })
            doc.text("Nombre Completo", 160, yPos, { width: 200 })
            doc.text("Fecha de Nacimiento", 370, yPos, { width: 150 })
            doc
              .lineWidth(0.5)
              .moveTo(50, yPos + 15)
              .lineTo(doc.page.width - 50, yPos + 15)
              .stroke()
            yPos += 20
            doc.font("Helvetica").fontSize(10)
          }

          // VALIDACIÓN SEGURA DE DATOS DEL ESTUDIANTE
          const studentCi = student.ci || "N/A"

          let studentFullName = "N/A"
          if (student.name || student.lastName) {
            const firstName = (student.name || "").trim()
            const lastName = (student.lastName || "").trim()

            if (firstName && lastName) {
              studentFullName = `${firstName} ${lastName}`
            } else if (firstName) {
              studentFullName = firstName
            } else if (lastName) {
              studentFullName = lastName
            }
          }

          let studentBirthday = "N/A"
          if (student.birthday) {
            try {
              studentBirthday = new Date(student.birthday).toLocaleDateString("es-ES")
            } catch (error) {
              console.warn(`⚠️ Error formateando fecha de nacimiento para estudiante ${student.id}:`, error)
              studentBirthday = "Fecha inválida"
            }
          }

          // Escribir datos del estudiante
          doc.text(studentCi, 50, yPos, { width: 100 })
          doc.text(studentFullName, 160, yPos, { width: 200 })
          doc.text(studentBirthday, 370, yPos, { width: 150 })
          yPos += 20
        })
      }

      console.log(`✅ PDF generado exitosamente para brigada: "${brigadeName}"`)
      doc.end()
    } catch (error) {
      console.error("❌ Error al generar PDF de detalles de brigada:", error)
      console.error("Stack trace:", error.stack)

      if (!res.headersSent) {
        res.status(500).json({
          ok: false,
          msg: "Error al generar el PDF de detalles de brigada",
          error: error.message,
          details: process.env.NODE_ENV === "development" ? error.stack : undefined,
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
        doc
          .lineWidth(0.5)
          .moveTo(50, yPos + 20)
          .lineTo(doc.page.width - 50, yPos + 20)
          .stroke()
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
            doc
              .lineWidth(0.5)
              .moveTo(50, yPos + 15)
              .lineTo(doc.page.width - 50, yPos + 15)
              .stroke()
            yPos += 20
            doc.font("Helvetica").fontSize(10)
          }

          // === LÓGICA DE CONSTRUCCIÓN DE teacherName ===
          const firstName = brigade.encargado_name || ""
          const lastName = brigade.encargado_lastName || ""

          let teacherName = ""
          if (firstName && lastName) {
            teacherName = `${firstName} ${lastName}`
          } else if (firstName) {
            teacherName = firstName
          } else if (lastName) {
            teacherName = lastName
          } else {
            teacherName = "N/A"
          }

          const teacherCi = brigade.encargado_ci || "N/A"
          const studentCount = String(brigade.studentCount ?? 0)
          doc.text(brigade.name || "N/A", 50, yPos, { width: 150 })
          doc.text(teacherName, 210, yPos, { width: 150 })
          doc.text(teacherCi, 370, yPos, { width: 80 })
          doc.text(studentCount, 460, yPos, { width: 100, align: "center" })
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

  // Generar PDF con listado de estudiantes por grado
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
          res
            .status(500)
            .json({ ok: false, msg: "Error interno al generar el PDF de listado de estudiantes por grado" })
        }
        if (!doc.ended) {
          doc.end()
        }
      })

      doc.pipe(res)
      doc.addPage()

      const enrollments = await MatriculaModel.findByGrade(gradeId)

      let gradeName = "Desconocido"
      if (enrollments.length > 0) {
        gradeName = enrollments[0].grade_name
      }

      drawPageHeader(doc, `LISTADO DE ESTUDIANTES - ${gradeName}`)

      const students = enrollments.map((enrollment) => ({
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
        doc
          .lineWidth(0.5)
          .moveTo(50, yPos + 15)
          .lineTo(doc.page.width - 50, yPos + 15)
          .stroke()
        yPos += 20

        doc.font("Helvetica").fontSize(10)
        students.forEach((student) => {
          if (doc.y + 20 > doc.page.height - doc.page.margins.bottom - 50) {
            doc.addPage()
            drawPageHeader(doc, `LISTADO DE ESTUDIANTES - ${gradeName} (Continuación)`)
            yPos = doc.y + 10
            doc.font("Helvetica-Bold").fontSize(10)
            doc.text("Cédula", 50, yPos, { width: 100 })
            doc.text("Nombre Completo", 150, yPos, { width: 200 })
            doc.text("Sección", 360, yPos, { width: 100 })
            doc
              .lineWidth(0.5)
              .moveTo(50, yPos + 15)
              .lineTo(doc.page.width - 50, yPos + 15)
              .stroke()
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
        res
          .status(500)
          .json({ ok: false, msg: "Error al generar el PDF de listado de estudiantes por grado", error: error.message })
      }
    }
  },

  // Generar PDF con listado general de docentes
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
      drawPageHeader(doc, "LISTADO DE DOCENTES")

      const teachers = await PersonalModel.findTeachers()

      if (teachers.length === 0) {
        doc.fontSize(12).text("No hay docentes registrados.", { align: "center" })
      } else {
        doc.font("Helvetica-Bold").fontSize(10)
        let yPos = doc.y + 10
        doc.text("C.I.", 50, yPos, { width: 80 })
        doc.text("Nombre Completo", 140, yPos, { width: 200 })
        doc.text("Email", 350, yPos, { width: 150 })
        doc.text("Teléfono", 510, yPos, { width: 80 })
        doc
          .lineWidth(0.5)
          .moveTo(50, yPos + 15)
          .lineTo(doc.page.width - 50, yPos + 15)
          .stroke()
        yPos += 20

        doc.font("Helvetica").fontSize(10)
        teachers.forEach((teacher) => {
          if (doc.y + 20 > doc.page.height - doc.page.margins.bottom - 50) {
            doc.addPage()
            drawPageHeader(doc, "LISTADO DE DOCENTES (Continuación)")
            yPos = doc.y + 10
            doc.font("Helvetica-Bold").fontSize(10)
            doc.text("C.I.", 50, yPos, { width: 80 })
            doc.text("Nombre Completo", 140, yPos, { width: 200 })
            doc.text("Email", 350, yPos, { width: 150 })
            doc.text("Teléfono", 510, yPos, { width: 80 })
            doc
              .lineWidth(0.5)
              .moveTo(50, yPos + 15)
              .lineTo(doc.page.width - 50, yPos + 15)
              .stroke()
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

  // Generar PDF con detalles específicos de un docente
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
      if (!teacherDetails || teacherDetails.idRole !== "1") {
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
      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Información Personal", 50, doc.y + 20)
      doc.font("Helvetica").fontSize(11)
      doc.text(`Nombre Completo: ${teacherDetails.name || "N/A"} ${teacherDetails.lastName || ""}`, 50, doc.y + 10)
      doc.text(`Cédula de Identidad: ${teacherDetails.ci || "N/A"}`, 50, doc.y + 10)
      doc.text(`Email: ${teacherDetails.email || "N/A"}`, 50, doc.y + 10)
      doc.text(`Teléfono: ${teacherDetails.telephoneNumber || "N/A"}`, 50, doc.y + 10)
      doc.text(
        `Fecha de Nacimiento: ${teacherDetails.birthday ? new Date(teacherDetails.birthday).toLocaleDateString() : "N/A"}`,
        50,
        doc.y + 10,
      )
      doc.text(`Género: ${teacherDetails.gender || "N/A"}`, 50, doc.y + 10)
      doc.text(`Dirección: ${teacherDetails.direction || "N/A"}`, 50, doc.y + 10)
      doc.text(`Parroquia: ${teacherDetails.parroquia_nombre || "N/A"}`, 50, doc.y + 10)

      // Información de rol (ya que PersonalModel.findOneById incluye el rol)
      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Información de Rol", 50, doc.y + 20)
      doc.font("Helvetica").fontSize(11)
      doc.text(`Rol: ${teacherDetails.rol_nombre || "N/A"}`, 50, doc.y + 10)
      doc.text(`Descripción del Rol: ${teacherDetails.rol_descripcion || "N/A"}`, 50, doc.y + 10)

      doc.end()
    } catch (error) {
      console.error("Error al generar PDF de detalles de docente:", error)
      if (!res.headersSent) {
        res.status(500).json({ ok: false, msg: "Error al generar el PDF de detalles de docente", error: error.message })
      }
    }
  },
}

export { PdfController }
