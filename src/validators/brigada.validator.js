const validateBrigadeData = (req, res, next) => {
  const { name } = req.body

  if (!name || typeof name !== "string") {
    return res.status(400).json({
      ok: false,
      msg: "El nombre de la brigada es requerido",
    })
  }

  if (name.trim().length < 3) {
    return res.status(400).json({
      ok: false,
      msg: "El nombre debe tener al menos 3 caracteres",
    })
  }

  if (name.length > 100) {
    return res.status(400).json({
      ok: false,
      msg: "El nombre es demasiado largo (máximo 100 caracteres)",
    })
  }

  req.body.name = name.trim()
  next()
}

const validateTeacherAssignment = (req, res, next) => {
  const { personalId, startDate } = req.body

  if (!personalId) {
    return res.status(400).json({
      ok: false,
      msg: "El ID del personal es requerido",
    })
  }

  if (isNaN(Number.parseInt(personalId)) || personalId <= 0) {
    return res.status(400).json({
      ok: false,
      msg: "El ID del personal debe ser un número válido",
    })
  }

  if (startDate && isNaN(Date.parse(startDate))) {
    return res.status(400).json({
      ok: false,
      msg: "La fecha de inicio debe ser válida",
    })
  }

  next()
}

const validateStudentEnrollment = (req, res, next) => {
  const { studentIds } = req.body

  if (!studentIds || !Array.isArray(studentIds)) {
    return res.status(400).json({
      ok: false,
      msg: "Debe proporcionar una lista de IDs de estudiantes",
    })
  }

  if (studentIds.length === 0) {
    return res.status(400).json({
      ok: false,
      msg: "Debe seleccionar al menos un estudiante",
    })
  }

  if (studentIds.length > 50) {
    return res.status(400).json({
      ok: false,
      msg: "No puede inscribir más de 50 estudiantes a la vez",
    })
  }

  const invalidIds = studentIds.filter((id) => isNaN(Number.parseInt(id)) || id <= 0)
  if (invalidIds.length > 0) {
    return res.status(400).json({
      ok: false,
      msg: "Todos los IDs de estudiantes deben ser números válidos",
    })
  }

  next()
}

export const BrigadaValidator = {
  validateBrigadeData,
  validateTeacherAssignment,
  validateStudentEnrollment,
}
