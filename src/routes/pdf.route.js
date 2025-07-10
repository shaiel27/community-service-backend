// src/routes/pdf.route.js
import express from "express"
import { PdfController } from "../controllers/pdf.controller.js"
//import { verifyToken, verifyAdminOrReadOnly } from "../middleware/jwt.middleware.js"

const router = express.Router()

// Ruta para generar el PDF de listado de brigadas y docentes
router.get("/brigades/list" /*, verifyToken, verifyAdminOrReadOnly*/, PdfController.generateBrigadeListPdf)

// Ruta para generar el PDF de los integrantes de una brigada específica y sus datos
router.get("/brigades/:id/details" /*, verifyToken, verifyAdminOrReadOnly*/, PdfController.generateBrigadeDetailsPdf)

// Ruta para generar el PDF de listado de docentes 
router.get("/personal/teachers/list" /*, verifyToken, verifyAdminOrReadOnly*/, PdfController.generateTeacherListPdf)

// Ruta para generar el PDF de los datos extensos de un docente específico 
router.get("/personal/teacher/:id/details" /*, verifyToken, verifyAdminOrReadOnly*/, PdfController.generateTeacherDetailsPdf)

//  Ruta para generar el PDF de todos los alumnos con grado y sección
router.get("/students/enrolled/list/all" /*, verifyToken, verifyAdminOrReadOnly*/, PdfController.GenerateAllEnrolledStudentsPdf)

router.get("/students/list/all", /* verifyToken, verifyAdminOrReadOnly, */ PdfController.generateAllStudentsPdf)

//  Ruta para generar el PDF de listado de estudiantes por grado específico
router.get("/students/list/grade/:gradeId" /*, verifyToken, verifyAdminOrReadOnly*/, PdfController.generateStudentsByGradePdf)

//  Ruta para generar el PDF de todos los datos de un alumno específico (buscar por CI)
router.get("/student/:id/details" /*, verifyToken, verifyAdminOrReadOnly*/, PdfController.generateStudentDetailsPdf)

//  Ruta para generar el PDF de listado de todo el personal en la institución
router.get("/personal/list/all" /*, verifyToken, verifyAdminOrReadOnly*/, PdfController.generateAllPersonalListPdf)

//  Ruta para generar el PDF de listado de todo el personal por idRole específico
router.get("/personal/list/role/:roleId" /*, verifyToken, verifyAdminOrReadOnly*/, PdfController.generatePersonalByRolePdf)

//  Ruta para generar el PDF de todos los datos extensivos de un personal específico
router.get("/personal/:id/details" /*, verifyToken, verifyAdminOrReadOnly*/, PdfController.generatePersonalDetailsPdf)

export default router