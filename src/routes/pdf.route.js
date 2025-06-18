// src/routes/pdf.route.js
import express from "express"
import { PdfController } from "../controllers/pdf.controller.js"
//import { verifyToken, verifyAdminOrReadOnly } from "../middleware/jwt.middleware.js"

const router = express.Router()

// Ruta para generar el PDF de listado de estudiantes
router.get("/students/list"/*, verifyToken, verifyAdminOrReadOnly*/, PdfController.generateStudentListPdf)

// Ruta para generar la ficha de matrícula de un estudiante específico
// Se requiere el ID del estudiante como parámetro en la URL
router.get("/enrollment/student/:id"/*, verifyToken, verifyAdminOrReadOnly*/, PdfController.generateEnrollmentFormPdf)

export default router