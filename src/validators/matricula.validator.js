import Joi from 'joi';

// Esquema para documentos
const documentsSchema = Joi.object({
  birthCertificate: Joi.boolean().default(false),
  vaccinationCard: Joi.boolean().default(false),
  studentPhotos: Joi.boolean().default(false),
  representativePhotos: Joi.boolean().default(false),
  representativeCopyID: Joi.boolean().default(false),
  autorizedCopyID: Joi.boolean().default(false)
});

// Esquema base para matrícula
export const matriculaSchema = Joi.object({
  studentID: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'El ID del estudiante es obligatorio',
      'number.base': 'El ID del estudiante debe ser un número válido'
    }),
  
  sectionID: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'El ID de la sección es obligatorio',
      'number.base': 'El ID de la sección debe ser un número válido'
    }),
  
  registrationDate: Joi.date()
    .iso()
    .required()
    .messages({
      'date.base': 'La fecha de registro debe ser una fecha válida',
      'date.format': 'La fecha debe estar en formato ISO (YYYY-MM-DD)'
    }),
  
  repeater: Joi.boolean()
    .default(false),
  
  chemiseSize: Joi.string()
    .max(10)
    .messages({
      'string.max': 'La talla de camisa no puede exceder los 10 caracteres'
    }),
  
  pantsSize: Joi.string()
    .max(10)
    .messages({
      'string.max': 'La talla de pantalón no puede exceder los 10 caracteres'
    }),
  
  shoesSize: Joi.string()
    .max(10)
    .messages({
      'string.max': 'La talla de zapatos no puede exceder los 10 caracteres'
    }),
  
  weight: Joi.number()
    .min(0)
    .max(200)
    .messages({
      'number.min': 'El peso no puede ser menor a 0 kg',
      'number.max': 'El peso no puede exceder los 200 kg'
    }),
  
  stature: Joi.number()
    .min(0)
    .max(3)
    .messages({
      'number.min': 'La estatura no puede ser menor a 0 metros',
      'number.max': 'La estatura no puede exceder los 3 metros'
    }),
  
  diseases: Joi.string()
    .max(100)
    .messages({
      'string.max': 'Las enfermedades no pueden exceder los 100 caracteres'
    }),
  
  observation: Joi.string()
    .max(100)
    .messages({
      'string.max': 'Las observaciones no pueden exceder los 100 caracteres'
    }),
  
  documents: documentsSchema
});

// Esquema para creación
export const createMatriculaSchema = matriculaSchema;

// Esquema para actualización
export const updateMatriculaSchema = matriculaSchema.keys({
  studentID: Joi.forbidden().messages({
    'any.unknown': 'No se puede modificar el estudiante de una matrícula existente'
  }),
  sectionID: Joi.optional()
});

// Esquema para búsqueda por período
export const periodoEscolarSchema = Joi.object({
  periodo: Joi.string()
    .required()
    .pattern(/^\d{4}-\d{4}$/)
    .messages({
      'string.pattern.base': 'El período escolar debe tener formato AAAA-AAAA',
      'any.required': 'El parámetro periodo es requerido'
    })
});