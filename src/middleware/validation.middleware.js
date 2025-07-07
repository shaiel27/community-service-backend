import Joi from 'joi';

export default (schema, options = {}) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[options.source || 'body'], {
      abortEarly: false,
      allowUnknown: options.allowUnknown || false,
      stripUnknown: options.stripUnknown || true
    });
    
    if (error) {
      const formattedErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        ok: false,
        code: 'VALIDATION_ERROR',
        errors: formattedErrors
      });
    }
    
    // Reemplazar datos validados (importante para valores transformados)
    if (options.source) {
      req[options.source] = value;
    } else {
      req.body = value;
    }
    
    next();
  };
};