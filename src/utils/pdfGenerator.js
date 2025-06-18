// src/utils/pdfGenerator.js
import PDFDocument from "pdfkit"
import path from "path"
import { fileURLToPath } from "url"

// Para resolver __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Rutas a los logos (asumiendo que los pondrás en una carpeta 'assets' dentro de 'src')
// Por favor, ajusta estas rutas y asegúrate de tener los logos.
// Por ejemplo: src/assets/logo_institucion.png
const LOGO_PATH = path.join(__dirname, "../assets/logo_institucion.png")
const LOGO_SECUNDARIO_PATH = path.join(__dirname, "../assets/logo_secundario.png") // Opcional, si tienes un segundo logo

export const createPdfBase = (doc, title) => {
// Configuración de la cabecera
const headerHeight = 80 // Altura para la cabecera

// Dibuja un rectángulo para el fondo de la cabecera (opcional, para un fondo de color)
doc.rect(0, 0, doc.page.width, headerHeight).fill("#F0F0F0") // Un gris claro, por ejemplo

// Posiciona los logos
// Asegúrate de que los archivos de logo existan en las rutas especificadas
if (path.existsSync(LOGO_PATH)) {
    doc.image(LOGO_PATH, 50, 10, { width: 50 }) // x, y, options
} else {
    console.warn(`Advertencia: Logo principal no encontrado en ${LOGO_PATH}`)
}
if (path.existsSync(LOGO_SECUNDARIO_PATH)) {
    doc.image(LOGO_SECUNDARIO_PATH, doc.page.width - 100, 10, { width: 50 })
} else {
    console.warn(`Advertencia: Logo secundario no encontrado en ${LOGO_SECUNDARIO_PATH}`)
}

// Información de la institución en la cabecera
doc
.fillColor("#444444")
.fontSize(12)
.font("Helvetica-Bold")
.text("Nombre de la Institución", 0, 20, { align: "center" })
.fontSize(10)
.font("Helvetica")
.text("R.I.F. J-XXXXXXXX-X", 0, 35, { align: "center" })
.text("Dirección de la Institución, Ciudad, Estado", 0, 50, { align: "center" })
.text("Teléfono: (000) 123-4567 | Email: info@institucion.edu.ve", 0, 65, {
    align: "center",
})

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