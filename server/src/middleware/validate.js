const { z } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    const issues = error.issues || error.errors;
    if (issues && Array.isArray(issues)) {
      const formattedErrors = issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        message: formattedErrors[0]?.message || 'Validation failed',
        errors: formattedErrors,
      });
    }
    next(error);
  }
};

module.exports = validate;
