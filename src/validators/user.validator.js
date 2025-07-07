import Joi from 'joi';

// Contraseña segura: al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
const passwordSchema = Joi.string()
  .min(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .message('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número');

export const registerSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  password: passwordSchema.required(),
  security_word: Joi.string()
    .min(3)
    .max(50)
    .required(),
  respuesta_de_seguridad: Joi.string()
    .min(2)
    .max(100)
    .required(),
  personal_id: Joi.number()
    .integer()
    .positive()
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .required()
});

export const updateProfileSchema = Joi.object({
  email: Joi.string()
    .email(),
  security_word: Joi.string()
    .min(3)
    .max(50),
  respuesta_de_seguridad: Joi.string()
    .min(2)
    .max(100)
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required(),
  newPassword: passwordSchema.required()
});