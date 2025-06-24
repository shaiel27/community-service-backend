// src/utils/pdfGenerator.js
import PDFDocument from "pdfkit"
import path from "path"
import fs from "node:fs"
import { fileURLToPath } from "url"

// Para resolver __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const LOGO_PATH = path.join(__dirname, "../assets/SanCristobal-logo.jpg")
const LOGO_SECUNDARIO_PATH = path.join(__dirname, "../assets/JoseGonzaloMendez-logo.png")

/**
 * Dibuja la cabecera estándar del documento.
 * Esta función debe llamarse al inicio de cada nueva página.
 * @param {PDFDocument} doc El objeto del documento PDF.
 * @param {string} title El título principal del documento.
 */
export const drawPageHeader = (doc, title) => {
    // Restaurar el cursor a la parte superior para la cabecera
    doc.x = doc.page.margins.left;
    doc.y = doc.page.margins.top;

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

    doc
        .fillColor("#444444")
        .fontSize(8)
        .font("Helvetica")
        .text("REPUBLICA BOLIVARIANA DE VENEZUELA", 0, 10, { align: "center" })
        .text("MINISTERIO DEL PODER POPULAR PARA LA EDUCACION", 0, 20, { align: "center" })
        .text("ALCALDIA DEL MUNICIPIO SAN CRISTOBAL", 0, 30, { align: "center" })
        .text("ESCUELA MUNICIPAL", 0, 40, { align: "center" })
        .text("\"JOSE GONZALO MENDEZ\"", 0, 50, { align: "center" })
        .text("SAN CRISTOBAL - TACHIRA", 0, 60, { align: "center" })
        .text("CODIGO DEA 0001102023", 0, 70, { align: "center" })
        .text("CODIGO ESTADISTICO 200860", 0, 80, { align: "center" })
        .text("CODIGO DE DEPENDENCIA 004104456", 0, 90, { align: "center" })
        .text("J-31260557-0", 0, 100, { align: "center" })

    doc.moveDown()
    doc
        .fontSize(16)
        .font("Helvetica-Bold")
        .text(title, { align: "center" })
    doc.moveDown(); // Mueve el cursor hacia abajo después de la cabecera y el título.
};

// Eliminamos addPdfFooter y addPageNumbers completamente de este archivo.