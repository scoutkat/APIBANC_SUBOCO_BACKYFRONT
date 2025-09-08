const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log del error
  console.error('Error:', err);

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      message: `Error de validación: ${message}`,
      statusCode: 400
    };
  }

  // Error de duplicado en MongoDB
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = {
      message: `Ya existe un registro con el valor '${err.keyValue[field]}' en el campo '${field}'`,
      statusCode: 409
    };
  }

  // Error de Cast de Mongoose (ID inválido)
  if (err.name === 'CastError') {
    error = {
      message: 'ID de recurso no válido',
      statusCode: 400
    };
  }

  // Error de Joi (validación de entrada)
  if (err.isJoi) {
    error = {
      message: `Error de validación: ${err.details.map(detail => detail.message).join(', ')}`,
      statusCode: 400
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { errorHandler };
