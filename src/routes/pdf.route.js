// src/routes/pdf.route.js
import express from "express"
import { PdfController } from "../controllers/pdf.controller.js"
//import { verifyToken, verifyAdminOrReadOnly } from "../middleware/jwt.middleware.js"

const router = express.Router()

// Ruta para generar el PDF de listado de todo los estudiantes con su respectivo grado y sección
router.get("/students/list"/*, verifyToken, verifyAdminOrReadOnly*/, PdfController.generateStudentListPdf)

// Ruta para generar la ficha de matrícula de un estudiante específico
router.get("/enrollment/student/:id"/*, verifyToken, verifyAdminOrReadOnly*/, PdfController.generateEnrollmentFormPdf)

// Ruta para generar el PDF de listado de estudiantes por grado
router.get("/students/list/grade/:gradeId"/*, verifyToken, verifyAdminOrReadOnly*/, PdfController.generateStudentListByGradePdf)

// Ruta para generar el PDF de listado de brigadas y docentes
router.get("/brigades/list"/*, verifyToken, verifyAdminOrReadOnly*/, PdfController.generateBrigadesAndTeachersPdf)

// Ruta para generar el PDF de los integrantes de una brigada específica y sus datos
router.get("/brigades/:id/details"/*, verifyToken, verifyAdminOrReadOnly*/, PdfController.generateBrigadeDetailsPdf)

// Nueva ruta para generar el PDF de listado de docentes
router.get("/personal/teachers/list"/*, verifyToken, verifyAdminOrReadOnly*/, PdfController.generateTeacherListPdf)

// Ruta para generar el PDF de los datos extensos de un docente específico
router.get("/personal/teacher/:id/details"/*, verifyToken, verifyAdminOrReadOnly*/, PdfController.generateTeacherDetailsPdf)

export default router