import Joi from 'joi';

// Schema for creating a student registry
export const createStudentRegistrySchema = Joi.object({
  student: Joi.object({
    ci: Joi.string().max(20).required().messages({
      'string.empty': 'La cédula del estudiante es requerida.',
      'string.max': 'La cédula del estudiante no debe exceder los 20 caracteres.',
      'any.required': 'La cédula del estudiante es requerida.'
    }),
    name: Joi.string().max(100).required().messages({
      'string.empty': 'El nombre del estudiante es requerido.',
      'string.max': 'El nombre del estudiante no debe exceder los 100 caracteres.',
      'any.required': 'El nombre del estudiante es requerido.'
    }),
    lastName: Joi.string().max(100).required().messages({
      'string.empty': 'El apellido del estudiante es requerido.',
      'string.max': 'El apellido del estudiante no debe exceder los 100 caracteres.',
      'any.required': 'El apellido del estudiante es requerido.'
    }),
    sex: Joi.string().valid('M', 'F').required().messages({
      'string.empty': 'El sexo del estudiante es requerido.',
      'any.only': 'El sexo del estudiante debe ser "M" o "F".',
      'any.required': 'El sexo del estudiante es requerido.'
    }),
    birthday: Joi.date().iso().required().messages({
      'date.base': 'La fecha de nacimiento del estudiante debe ser una fecha válida.',
      'date.format': 'La fecha de nacimiento del estudiante debe estar en formato ISO (YYYY-MM-DD).',
      'any.required': 'La fecha de nacimiento del estudiante es requerida.'
    }),
    placeBirth: Joi.string().max(100).optional().allow(null, '').messages({
      'string.max': 'El lugar de nacimiento del estudiante no debe exceder los 100 caracteres.'
    }),
    parishID: Joi.number().integer().positive().optional().messages({
      'number.base': 'El ID de la parroquia debe ser un número.',
      'number.integer': 'El ID de la parroquia debe ser un número entero.',
      'number.positive': 'El ID de la parroquia debe ser un número positivo.'
    }),
    quantityBrothers: Joi.number().integer().min(0).optional().messages({
      'number.base': 'La cantidad de hermanos debe ser un número.',
      'number.integer': 'La cantidad de hermanos debe ser un número entero.',
      'number.min': 'La cantidad de hermanos no puede ser negativa.'
    }),
    // representativeID is set by the service, not directly by the user in this schema
    motherName: Joi.string().max(100).optional().allow(null, '').messages({
      'string.max': 'El nombre de la madre no debe exceder los 100 caracteres.'
    }),
    motherCi: Joi.string().max(20).optional().allow(null, '').messages({
      'string.max': 'La cédula de la madre no debe exceder los 20 caracteres.'
    }),
    motherTelephone: Joi.string().max(20).optional().allow(null, '').messages({
      'string.max': 'El teléfono de la madre no debe exceder los 20 caracteres.'
    }),
    fatherName: Joi.string().max(100).optional().allow(null, '').messages({
      'string.max': 'El nombre del padre no debe exceder los 100 caracteres.'
    }),
    fatherCi: Joi.string().max(20).optional().allow(null, '').messages({
      'string.max': 'La cédula del padre no debe exceder los 20 caracteres.'
    }),
    fatherTelephone: Joi.string().max(20).optional().allow(null, '').messages({
      'string.max': 'El teléfono del padre no debe exceder los 20 caracteres.'
    }),
    livesMother: Joi.boolean().optional(),
    livesFather: Joi.boolean().optional(),
    livesBoth: Joi.boolean().optional(),
    livesRepresentative: Joi.boolean().optional(),
    rolRopresentative: Joi.string().max(50).optional().allow(null, '').messages({
      'string.max': 'El rol del representante no debe exceder los 50 caracteres.'
    }),
  }).required().messages({
    'object.base': 'La información del estudiante es requerida.'
  }),
  representative: Joi.object({
    ci: Joi.string().max(20).required().messages({
      'string.empty': 'La cédula del representante es requerida.',
      'string.max': 'La cédula del representante no debe exceder los 20 caracteres.',
      'any.required': 'La cédula del representante es requerida.'
    }),
    name: Joi.string().max(100).required().messages({
      'string.empty': 'El nombre del representante es requerido.',
      'string.max': 'El nombre del representante no debe exceder los 100 caracteres.',
      'any.required': 'El nombre del representante es requerido.'
    }),
    lastName: Joi.string().max(100).required().messages({
      'string.empty': 'El apellido del representante es requerido.',
      'string.max': 'El apellido del representante no debe exceder los 100 caracteres.',
      'any.required': 'El apellido del representante es requerido.'
    }),
    telephoneNumber: Joi.string().max(20).required().messages({
      'string.empty': 'El número de teléfono del representante es requerido.',
      'string.max': 'El número de teléfono del representante no debe exceder los 20 caracteres.',
      'any.required': 'El número de teléfono del representante es requerido.'
    }),
    email: Joi.string().email().max(100).optional().allow(null, '').messages({
      'string.email': 'El email del representante debe ser una dirección de correo válida.',
      'string.max': 'El email del representante no debe exceder los 100 caracteres.'
    }),
    address: Joi.string().max(255).optional().allow(null, '').messages({
      'string.max': 'La dirección del representante no debe exceder los 255 caracteres.'
    }),
    parishID: Joi.number().integer().positive().optional().messages({
      'number.base': 'El ID de la parroquia del representante debe ser un número.',
      'number.integer': 'El ID de la parroquia del representante debe ser un número entero.',
      'number.positive': 'El ID de la parroquia del representante debe ser un número positivo.'
    }),
  }).required().messages({
    'object.base': 'La información del representante es requerida.'
  }),
});

// Schema for updating a student
export const updateStudentSchema = Joi.object({
  ci: Joi.string().max(20).optional().messages({
    'string.max': 'La cédula del estudiante no debe exceder los 20 caracteres.'
  }),
  name: Joi.string().max(100).optional().messages({
    'string.max': 'El nombre del estudiante no debe exceder los 100 caracteres.'
  }),
  lastName: Joi.string().max(100).optional().messages({
    'string.max': 'El apellido del estudiante no debe exceder los 100 caracteres.'
  }),
  sex: Joi.string().valid('M', 'F').optional().messages({
    'any.only': 'El sexo del estudiante debe ser "M" o "F".'
  }),
  birthday: Joi.date().iso().optional().messages({
    'date.base': 'La fecha de nacimiento del estudiante debe ser una fecha válida.',
    'date.format': 'La fecha de nacimiento del estudiante debe estar en formato ISO (YYYY-MM-DD).'
  }),
  placeBirth: Joi.string().max(100).optional().allow(null, '').messages({
    'string.max': 'El lugar de nacimiento del estudiante no debe exceder los 100 caracteres.'
  }),
  parishID: Joi.number().integer().positive().optional().messages({
    'number.base': 'El ID de la parroquia debe ser un número.',
    'number.integer': 'El ID de la parroquia debe ser un número entero.',
    'number.positive': 'El ID de la parroquia debe ser un número positivo.'
  }),
  quantityBrothers: Joi.number().integer().min(0).optional().messages({
    'number.base': 'La cantidad de hermanos debe ser un número.',
    'number.integer': 'La cantidad de hermanos debe ser un número entero.',
    'number.min': 'La cantidad de hermanos no puede ser negativa.'
  }),
  representativeID: Joi.string().max(20).optional().messages({
    'string.max': 'La cédula del representante no debe exceder los 20 caracteres.'
  }),
  motherName: Joi.string().max(100).optional().allow(null, '').messages({
    'string.max': 'El nombre de la madre no debe exceder los 100 caracteres.'
  }),
  motherCi: Joi.string().max(20).optional().allow(null, '').messages({
    'string.max': 'La cédula de la madre no debe exceder los 20 caracteres.'
  }),
  motherTelephone: Joi.string().max(20).optional().allow(null, '').messages({
    'string.max': 'El teléfono de la madre no debe exceder los 20 caracteres.'
  }),
  fatherName: Joi.string().max(100).optional().allow(null, '').messages({
    'string.max': 'El nombre del padre no debe exceder los 100 caracteres.'
  }),
  fatherCi: Joi.string().max(20).optional().allow(null, '').messages({
    'string.max': 'La cédula del padre no debe exceder los 20 caracteres.'
  }),
  fatherTelephone: Joi.string().max(20).optional().allow(null, '').messages({
    'string.max': 'El teléfono del padre no debe exceder los 20 caracteres.'
  }),
  livesMother: Joi.boolean().optional(),
  livesFather: Joi.boolean().optional(),
  livesBoth: Joi.boolean().optional(),
  livesRepresentative: Joi.boolean().optional(),
  rolRopresentative: Joi.string().max(50).optional().allow(null, '').messages({
    'string.max': 'El rol del representante no debe exceder los 50 caracteres.'
  }),
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar.'
});

// Schema for deleting a student (only requires an ID, which comes from params)
export const deleteStudentSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'number.base': 'El ID del estudiante debe ser un número.',
    'number.integer': 'El ID del estudiante debe ser un número entero.',
    'number.positive': 'El ID del estudiante debe ser un número positivo.',
    'any.required': 'El ID del estudiante es requerido.'
  }),
});