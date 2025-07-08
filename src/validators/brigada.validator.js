import Joi from 'joi';

// Esquema base para brigadas
const brigadeBaseSchema = {
  name: Joi.string()
    .trim()
    .required()
    .max(100)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\d]+$/)
    .messages({
      'string.empty': 'El nombre de la brigada es obligatorio',
      'any.required': 'El nombre de la brigada es obligatorio',
      'string.max': 'El nombre no puede exceder los {#limit} caracteres',
      'string.pattern.base': 'El nombre contiene caracteres inválidos'
    })
};

// Crear brigada
export const createBrigadeSchema = Joi.object({
  ...brigadeBaseSchema
});

// Actualizar brigada
export const updateBrigadeSchema = Joi.object({
  name: brigadeBaseSchema.name.optional()
});

// Asignar docente
export const assignTeacherSchema = Joi.object({
  personalId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'El ID del personal es obligatorio',
      'number.base': 'El ID debe ser un número válido'
    }),
  startDate: Joi.date()
    .iso()
    .default(new Date())
});

// Inscribir estudiantes
export const enrollStudentsSchema = Joi.object({
    studentIds: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .required()
    .messages({
        'array.min': 'Debe seleccionar al menos un estudiante',
        'any.required': 'Los IDs de estudiantes son obligatorios'
    })
});

// Buscar brigadas
export const searchBrigadesSchema = Joi.object({
name: Joi.string()
    .trim()
    .required()
    .min(3)
    .messages({
    'string.min': 'La búsqueda requiere al menos 3 caracteres',
    'any.required': 'El parámetro de búsqueda es obligatorio'
    })
});