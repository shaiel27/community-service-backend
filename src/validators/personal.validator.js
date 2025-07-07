import Joi from 'joi';

// Validación de cédula venezolana
const venezuelanCI = Joi.string()
  .pattern(/^[VE]\d{5,8}$/)
  .message('La cédula debe tener formato V/E seguido de 5-8 dígitos');

// Validación de teléfono venezolano
const venezuelanPhone = Joi.string()
  .pattern(/^04\d{9}$/)
  .message('El teléfono debe comenzar con 04 y tener 11 dígitos');

export const personalSchema = Joi.object({
  ci: venezuelanCI.required(),
  name: Joi.string()
    .trim()
    .required()
    .max(100)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      'string.pattern.base': 'El nombre solo puede contener letras y espacios'
    }),
  lastName: Joi.string()
    .trim()
    .required()
    .max(100)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      'string.pattern.base': 'El apellido solo puede contener letras y espacios'
    }),
  idRole: Joi.number()
    .integer()
    .positive()
    .required(),
  telephoneNumber: venezuelanPhone,
  email: Joi.string()
    .email()
    .max(100),
  birthday: Joi.date()
    .max('now')
    .iso(),
  direction: Joi.string()
    .max(30),
  parishID: Joi.number()
    .integer()
    .positive()
});

export const createPersonalSchema = personalSchema;
export const updatePersonalSchema = personalSchema.keys({
  ci: venezuelanCI.optional()
});