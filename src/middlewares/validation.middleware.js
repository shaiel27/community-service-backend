export default (schema, options = {}) => {
  return (req, res, next) => {
    const source = options.source || 'body';
    const data = source === 'query' ? req.query : req.body;
    
    const { error, value } = schema.validate(data, {
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
    // Asignar los valores validados a una nueva propiedad
    req.validated = value;
    next();
  };
};