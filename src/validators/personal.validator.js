import Joi from 'joi';

// Validación de cédula venezolana
const venezuelanCI = Joi.string()
  .pattern(/^[VE]\d{5,8}$/)
  .message('La cédula debe tener formato V/E seguido de 5-8 dígitos');

// Validación de teléfono venezolano
const venezuelanPhone = Joi.string()
  .pattern(/^04\d{9}$/)
  .message('El teléfono debe comenzar con 04 y tener 11 dígitos');

// Esquema base para personal
const personalBaseSchema = {
  ci: venezuelanCI.required().messages({
    'any.required': 'La cédula es obligatoria',
    'string.pattern.base': 'Formato de cédula inválido. Use V/E seguido de 5-8 dígitos'
  }),
  name: Joi.string()
    .trim()
    .required()
    .max(100)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      'string.empty': 'El nombre es obligatorio',
      'string.max': 'El nombre no puede exceder los {#limit} caracteres',
      'string.pattern.base': 'El nombre solo puede contener letras y espacios'
    }),
  lastName: Joi.string()
    .trim()
    .required()
    .max(100)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      'string.empty': 'El apellido es obligatorio',
      'string.max': 'El apellido no puede exceder los {#limit} caracteres',
      'string.pattern.base': 'El apellido solo puede contener letras y espacios'
    }),
  idRole: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'El rol es obligatorio',
      'number.base': 'El rol debe ser un número válido',
      'number.positive': 'El ID de rol debe ser positivo'
    }),
  telephoneNumber: venezuelanPhone.allow('', null).messages({
    'string.pattern.base': 'Formato de teléfono inválido. Use 04 seguido de 9 dígitos'
  }),
  email: Joi.string()
    .email()
    .max(100)
    .messages({
      'string.email': 'Debe ser un email válido',
      'string.max': 'El email no puede exceder los {#limit} caracteres'
    }),
  birthday: Joi.date()
    .max('now')
    .iso()
    .messages({
      'date.max': 'La fecha de nacimiento no puede ser futura',
      'date.format': 'Debe tener formato ISO (YYYY-MM-DD)'
    }),
  direction: Joi.string()
    .max(30)
    .messages({
      'string.max': 'La dirección no puede exceder los {#limit} caracteres'
    }),
  parishID: Joi.number()
    .integer()
    .positive()
    .messages({
      'number.base': 'La parroquia debe ser un ID válido',
      'number.positive': 'El ID de parroquia debe ser positivo'
    })
};

// Esquema para creación
export const createPersonalSchema = Joi.object(personalBaseSchema);

// Esquema para actualización
export const updatePersonalSchema = Joi.object({
  ...personalBaseSchema,
  ci: venezuelanCI.optional()
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
});

// Esquemas para búsqueda
export const searchByNameSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .required()
    .messages({
      'string.min': 'La búsqueda requiere al menos 3 caracteres',
      'any.required': 'El parámetro de búsqueda es obligatorio'
    })
});

export const searchByCiSchema = Joi.object({
  ci: Joi.string()
    .trim()
    .min(3)
    .required()
    .messages({
      'string.min': 'La búsqueda requiere al menos 3 caracteres',
      'any.required': 'El parámetro de búsqueda es obligatorio'
    })
});