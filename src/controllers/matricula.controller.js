import matriculaService from "../services/matricula.service.js"

const handleError = (res, error) => {
  console.error("❌ Error en controlador:", error)

  const status = error.message.includes("no encontrad") ? 404 : 500
  const message = error.message || "Error interno del servidor"

  res.status(status).json({
    ok: false,
    msg: message,
    error: process.env.NODE_ENV === "development" ? error.stack : undefined,
  })
}

const createMatricula = async (req, res) => {
  try {
    console.log("📥 Datos recibidos para matrícula:", JSON.stringify(req.body, null, 2))

    // Verificar si es una matrícula completa (con datos de estudiante)
    if (req.body.studentData) {
      console.log("🔄 Procesando matrícula completa...")
      const result = await matriculaService.crearMatriculaCompleta(req.body)

      res.status(201).json({
        ok: true,
        msg: "Matrícula creada exitosamente",
        matricula: result.matricula,
        student: result.student,
        representative: result.representative,
      })
    } else {
      // Matrícula simple (estudiante ya existe)
      console.log("🔄 Procesando matrícula simple...")
      const newMatricula = await matriculaService.crearMatricula(req.body)

      res.status(201).json({
        ok: true,
        msg: "Matrícula creada exitosamente",
        matricula: newMatricula,
      })
    }
  } catch (error) {
    handleError(res, error)
  }
}

const getAllMatriculas = async (req, res) => {
  try {
    const matriculas = await matriculaService.obtenerTodas()
    res.json({
      ok: true,
      matriculas,
      total: matriculas.length,
    })
  } catch (error) {
    handleError(res, error)
  }
}

const getMatriculaById = async (req, res) => {
  try {
    const matricula = await matriculaService.obtenerPorId(req.params.id)
    res.json({
      ok: true,
      matricula,
    })
  } catch (error) {
    handleError(res, error)
  }
}

const getMatriculasByEstudiante = async (req, res) => {
  try {
    const matriculas = await matriculaService.obtenerPorEstudiante(req.params.estudiante_id)
    res.json({
      ok: true,
      matriculas,
      total: matriculas.length,
    })
  } catch (error) {
    handleError(res, error)
  }
}

const getMatriculasByPeriodo = async (req, res) => {
  try {
    const matriculas = await matriculaService.obtenerPorPeriodo(req.params.periodo_escolar)
    res.json({
      ok: true,
      matriculas,
      total: matriculas.length,
      periodo_escolar: req.params.periodo_escolar,
    })
  } catch (error) {
    handleError(res, error)
  }
}

const updateMatricula = async (req, res) => {
  try {
    const updatedMatricula = await matriculaService.actualizarMatricula(req.params.id, req.body)
    res.json({
      ok: true,
      msg: "Matrícula actualizada exitosamente",
      matricula: updatedMatricula,
    })
  } catch (error) {
    handleError(res, error)
  }
}

const deleteMatricula = async (req, res) => {
  try {
    const result = await matriculaService.eliminarMatricula(req.params.id)
    res.json({
      ok: true,
      msg: "Matrícula eliminada exitosamente",
      id: result.id,
    })
  } catch (error) {
    handleError(res, error)
  }
}

const getGrados = async (req, res) => {
  try {
    const grados = await matriculaService.obtenerGrados()
    res.json({
      ok: true,
      grados,
      total: grados.length,
    })
  } catch (error) {
    handleError(res, error)
  }
}

const getDocenteGrados = async (req, res) => {
  try {
    const docenteGrados = await matriculaService.obtenerSeccionesDocentes()
    res.json({
      ok: true,
      docente_grados: docenteGrados,
      total: docenteGrados.length,
    })
  } catch (error) {
    handleError(res, error)
  }
}

export const MatriculaController = {
  createMatricula,
  getAllMatriculas,
  getMatriculaById,
  getMatriculasByEstudiante,
  getMatriculasByPeriodo,
  updateMatricula,
  deleteMatricula,
  getGrados,
  getDocenteGrados,
}
