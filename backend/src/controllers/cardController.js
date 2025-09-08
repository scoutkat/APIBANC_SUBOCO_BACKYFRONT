const Card = require('../models/Card');

// Generar número de tarjeta
const generarNumeroTarjeta = async (req, res, next) => {
  try {
    const { productId } = req.params;
    
    // Generar número de tarjeta
    const numeroTarjeta = Card.generarNumeroTarjeta(productId);
    
    res.status(200).json({
      success: true,
      message: 'Número de tarjeta generado exitosamente',
      data: {
        productId,
        numeroTarjeta,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Activar tarjeta
const activarTarjeta = async (req, res, next) => {
  try {
    const { numeroTarjeta, nombreTitular } = req.body;
    
    // Verificar si la tarjeta ya existe
    const tarjetaExistente = await Card.findOne({ numeroTarjeta });
    
    if (tarjetaExistente) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una tarjeta con este número'
      });
    }
    
    // Extraer productId de los primeros 6 dígitos
    const productId = numeroTarjeta.substring(0, 6);
    
    // Crear nueva instancia de tarjeta
    const nuevaTarjeta = new Card({
      numeroTarjeta,
      productId,
      nombreTitular,
      fechaVencimiento: new Card().generarFechaVencimiento(),
      activa: false, // Inicialmente inactiva por seguridad
      saldo: 0,
      moneda: 'USD'
    });
    
    // Guardar la tarjeta
    await nuevaTarjeta.save();
    
    // Activar la tarjeta
    await nuevaTarjeta.activar();
    
    res.status(201).json({
      success: true,
      message: 'Tarjeta activada exitosamente',
      data: {
        cardId: nuevaTarjeta.numeroTarjeta,
        productId: nuevaTarjeta.productId,
        nombreTitular: nuevaTarjeta.nombreTitular,
        fechaVencimiento: nuevaTarjeta.fechaVencimiento,
        activa: nuevaTarjeta.activa,
        saldo: nuevaTarjeta.saldo,
        moneda: nuevaTarjeta.moneda,
        fechaActivacion: nuevaTarjeta.fechaActivacion
      }
    });
  } catch (error) {
    next(error);
  }
};

// Bloquear tarjeta
const bloquearTarjeta = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    
    // Buscar la tarjeta
    const tarjeta = await Card.findOne({ numeroTarjeta: cardId });
    
    if (!tarjeta) {
      return res.status(404).json({
        success: false,
        message: 'Tarjeta no encontrada'
      });
    }
    
    // Verificar si ya está bloqueada
    if (tarjeta.bloqueada) {
      return res.status(400).json({
        success: false,
        message: 'La tarjeta ya está bloqueada'
      });
    }
    
    // Bloquear la tarjeta
    await tarjeta.bloquear();
    
    res.status(200).json({
      success: true,
      message: 'Tarjeta bloqueada exitosamente',
      data: {
        cardId: tarjeta.numeroTarjeta,
        bloqueada: tarjeta.bloqueada,
        fechaBloqueo: tarjeta.fechaBloqueo
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtener información de una tarjeta
const obtenerTarjeta = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    
    const tarjeta = await Card.findOne({ numeroTarjeta: cardId });
    
    if (!tarjeta) {
      return res.status(404).json({
        success: false,
        message: 'Tarjeta no encontrada'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        cardId: tarjeta.numeroTarjeta,
        productId: tarjeta.productId,
        nombreTitular: tarjeta.nombreTitular,
        fechaVencimiento: tarjeta.fechaVencimiento,
        activa: tarjeta.activa,
        bloqueada: tarjeta.bloqueada,
        saldo: tarjeta.saldo,
        moneda: tarjeta.moneda,
        fechaCreacion: tarjeta.fechaCreacion,
        fechaActivacion: tarjeta.fechaActivacion,
        fechaBloqueo: tarjeta.fechaBloqueo
      }
    });
  } catch (error) {
    next(error);
  }
};

// Listar todas las tarjetas (para administración)
const listarTarjetas = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, activa, bloqueada } = req.query;
    
    // Construir filtros
    const filtros = {};
    if (activa !== undefined) filtros.activa = activa === 'true';
    if (bloqueada !== undefined) filtros.bloqueada = bloqueada === 'true';
    
    const tarjetas = await Card.find(filtros)
      .select('-__v')
      .sort({ fechaCreacion: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Card.countDocuments(filtros);
    
    res.status(200).json({
      success: true,
      data: {
        tarjetas,
        paginacion: {
          paginaActual: parseInt(page),
          totalPaginas: Math.ceil(total / limit),
          totalRegistros: total,
          registrosPorPagina: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generarNumeroTarjeta,
  activarTarjeta,
  bloquearTarjeta,
  obtenerTarjeta,
  listarTarjetas
};
