import Joi from "joi"

// Esquema para validar datos de brigada
const brigadeSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.empty": "El nombre de la brigada es requerido",
    "string.min": "El nombre debe tener al menos 3 caracteres",
    "string.max": "El nombre no puede exceder 100 caracteres",
    "any.required": "El nombre de la brigada es requerido",
  }),
})

// Esquema para validar asignación de docente
const teacherAssignmentSchema = Joi.object({
  personalId: Joi.number().integer().positive().required().messages({
    "number.base": "El ID del personal debe ser un número",
    "number.integer": "El ID del personal debe ser un número entero",
    "number.positive": "El ID del personal debe ser positivo",
    "any.required": "El ID del personal es requerido",
  }),
  startDate: Joi.date().optional().messages({
    "date.base": "La fecha de inicio debe ser válida",
  }),
})

// Esquema para validar inscripción de estudiantes
const studentEnrollmentSchema = Joi.object({
  studentIds: Joi.array()
    .items(
      Joi.number().integer().positive().messages({
        "number.base": "Cada ID de estudiante debe ser un número",
        "number.integer": "Cada ID de estudiante debe ser un número entero",
        "number.positive": "Cada ID de estudiante debe ser positivo",
      }),
    )
    .min(1)
    .max(50)
    .required()
    .messages({
      "array.base": "Los IDs de estudiantes deben ser un arreglo",
      "array.min": "Debe seleccionar al menos un estudiante",
      "array.max": "No puede inscribir más de 50 estudiantes a la vez",
      "any.required": "Los IDs de estudiantes son requeridos",
    }),
})

// Middleware de validación para datos de brigada
export const validateBrigadeData = (req, res, next) => {
  const { error } = brigadeSchema.validate(req.body)
  if (error) {
    return res.status(400).json({
      ok: false,
      msg: error.details[0].message,
      errors: error.details,
    })
  }
  next()
}

// Middleware de validación para asignación de docente
export const validateTeacherAssignment = (req, res, next) => {
  const { error } = teacherAssignmentSchema.validate(req.body)
  if (error) {
    return res.status(400).json({
      ok: false,
      msg: error.details[0].message,
      errors: error.details,
    })
  }
  next()
}

// Middleware de validación para inscripción de estudiantes
export const validateStudentEnrollment = (req, res, next) => {
  const { error } = studentEnrollmentSchema.validate(req.body)
  if (error) {
    return res.status(400).json({
      ok: false,
      msg: error.details[0].message,
      errors: error.details,
    })
  }
  next()
}

export const BrigadaValidator = {
  validateBrigadeData,
  validateTeacherAssignment,
  validateStudentEnrollment,
}
