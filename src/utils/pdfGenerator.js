// src/utils/pdfGenerator.js
import PDFDocument from "pdfkit"
import path from "path"
import fs from "node:fs"
import { fileURLToPath } from "url"

// Para resolver __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Rutas a los logos (asumiendo que los pondrás en una carpeta 'assets' dentro de 'src')
// Por favor, ajusta estas rutas y asegúrate de tener los logos.
// Por ejemplo: src/assets/logo_institucion.png
const LOGO_PATH = path.join(__dirname, "../assets/SanCristobal-logo.jpg")
const LOGO_SECUNDARIO_PATH = path.join(__dirname, "../assets/JoseGonzaloMendez-logo.png") // Opcional, si tienes un segundo logo

export const createPdfBase = (doc, title) => {
    const headerHeight = 100;
    if (fs.existsSync(LOGO_PATH)) {
        doc.image(LOGO_PATH, 50, 10, { width: 60 })
    } else {
        console.warn(`Advertencia: Logo principal no encontrado en ${LOGO_PATH}`)
    }
    if (fs.existsSync(LOGO_SECUNDARIO_PATH)) {
        doc.image(LOGO_SECUNDARIO_PATH, doc.page.width - 100, 10, { width: 70 })
    } else {
        console.warn(`Advertencia: Logo secundario no encontrado en ${LOGO_SECUNDARIO_PATH}`)
    }

// Información de la institución en la cabecera
doc
.fillColor("#444444")
.fontSize(8)
.font("Helvetica")
.text("REPUBLICA BOLIVARIANA DE VENEZUELA", 0, 10, { align: "center" })
.text("MINISTERIO DEL PODER POPULAR PARA LA EDUCACION", 0, 20, { align: "center" })
.text("ALCALDIA DEL MUNICIPIO SAN CRISTOBAL", 0, 30, { align: "center" })
.text("ESCUELA MUNICIPAL", 0, 40, { align: "center", })
.text("\"JOSE GONZALO MENDEZ\"", 0, 50, { align: "center", })
.text("SAN CRISTOBAL - TACHIRA", 0, 60, { align: "center", })
.text("CODIGO DEA 0001102023", 0, 70, { align: "center", })
.text("CODIGO ESTADISTICO 200860", 0, 80, { align: "center", })
.text("CODIGO DE DEPENDENCIA 004104456", 0, 90, { align: "center", })
.text("J-31260557-0", 0, 100, { align: "center", })

// Añadir un título al documento
doc.moveDown() // Mueve el cursor hacia abajo después de la cabecera
doc
.fontSize(16)
.font("Helvetica-Bold")
.text(title, { align: "center" })
doc.moveDown()
}
export const addPdfFooter = (doc) => {
    const bottomMargin = 50 // Margen inferior
    const footerY = doc.page.height - bottomMargin // Posición Y del pie de página
    doc
    .fontSize(8)
    .fillColor("gray")
    .text(`Generado el: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}`, 50, footerY, { align: "left" })
    .text(`Página ${doc.page.number} de ${doc.bufferedPageRange().count}`, doc.page.width - 100, footerY, { align: "right" })
    .text("Sistema de Gestión de Matrícula", 0, footerY + 15, { align: "center" })
}

export const addPageNumbers = (doc) => {
    let pages = doc.bufferedPageRange(); // Obtiene el rango de páginas actuales
    for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        addPdfFooter(doc); // Añade el footer a cada página
    }
};