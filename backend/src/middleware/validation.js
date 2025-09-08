
const Joi = require('joi');

// Validación para el ID del producto
const validateProductId = (req, res, next) => {
  const productId = req.params.productId;
  
  // Validación personalizada para dar mensajes más claros
  if (!productId) {
    return res.status(400).json({
      success: false,
      message: 'El ID del producto es requerido'
    });
  }
  
  if (!/^\d+$/.test(productId)) {
    return res.status(400).json({
      success: false,
      message: 'El ID del producto debe contener solo números'
    });
  }
  
  if (productId.length < 6) {
    return res.status(400).json({
      success: false,
      message: `El ID del producto debe tener exactamente 6 dígitos. Recibido: ${productId.length} dígitos`
    });
  }
  
  if (productId.length > 6) {
    return res.status(400).json({
      success: false,
      message: `El ID del producto debe tener exactamente 6 dígitos. Recibido: ${productId.length} dígitos. Use solo los primeros 6 dígitos: ${productId.substring(0, 6)}`
    });
  }
  
  next();
};

// Validación para el ID de la tarjeta
const validateCardId = (req, res, next) => {
  const schema = Joi.object({
    cardId: Joi.string()
      .pattern(/^\d{16}$/)
      .required()
      .messages({
        'string.pattern.base': 'El ID de la tarjeta debe tener exactamente 16 dígitos',
        'any.required': 'El ID de la tarjeta es requerido'
      })
  });

  const { error } = schema.validate({ cardId: req.params.cardId });
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  
  next();
};

// Validación para la activación de tarjeta
const validateCardEnrollment = (req, res, next) => {
  const schema = Joi.object({
    numeroTarjeta: Joi.string()
      .pattern(/^\d{16}$/)
      .required()
      .messages({
        'string.pattern.base': 'El número de tarjeta debe tener exactamente 16 dígitos',
        'any.required': 'El número de tarjeta es requerido'
      }),
    nombreTitular: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'El nombre del titular debe tener al menos 2 caracteres',
        'string.max': 'El nombre del titular no puede exceder 100 caracteres',
        'any.required': 'El nombre del titular es requerido'
      })
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  
  next();
};

module.exports = {
  validateProductId,
  validateCardId,
  validateCardEnrollment
};
