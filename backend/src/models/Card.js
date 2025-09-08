const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  numeroTarjeta: {
    type: String,
    required: true,
    unique: true,
    length: 16,
    validate: {
      validator: function(v) {
        return /^\d{16}$/.test(v);
      },
      message: 'El número de tarjeta debe tener exactamente 16 dígitos'
    }
  },
  productId: {
    type: String,
    required: true,
    length: 6,
    validate: {
      validator: function(v) {
        return /^\d{6}$/.test(v);
      },
      message: 'El ID del producto debe tener exactamente 6 dígitos'
    }
  },
  nombreTitular: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  fechaVencimiento: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(0[1-9]|1[0-2])\/\d{4}$/.test(v);
      },
      message: 'La fecha de vencimiento debe tener el formato MM/YYYY'
    }
  },
  activa: {
    type: Boolean,
    default: false
  },
  bloqueada: {
    type: Boolean,
    default: false
  },
  saldo: {
    type: Number,
    default: 0,
    min: 0
  },
  moneda: {
    type: String,
    default: 'USD',
    enum: ['USD']
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaActivacion: {
    type: Date,
    default: null
  },
  fechaBloqueo: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  versionKey: false
});

// Índices para optimizar consultas
// Nota: numeroTarjeta ya tiene índice único por la propiedad unique: true
cardSchema.index({ productId: 1 });
cardSchema.index({ activa: 1, bloqueada: 1 });

// Método para generar fecha de vencimiento (3 años después de la creación)
cardSchema.methods.generarFechaVencimiento = function() {
  const fechaCreacion = new Date();
  const fechaVencimiento = new Date(fechaCreacion);
  fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 3);
  
  const mes = String(fechaVencimiento.getMonth() + 1).padStart(2, '0');
  const año = fechaVencimiento.getFullYear();
  
  return `${mes}/${año}`;
};

// Método para activar la tarjeta
cardSchema.methods.activar = function() {
  this.activa = true;
  this.fechaActivacion = new Date();
  return this.save();
};

// Método para bloquear la tarjeta
cardSchema.methods.bloquear = function() {
  this.bloqueada = true;
  this.fechaBloqueo = new Date();
  return this.save();
};

// Método estático para generar número de tarjeta
cardSchema.statics.generarNumeroTarjeta = function(productId) {
  if (!/^\d{6}$/.test(productId)) {
    throw new Error('El ID del producto debe tener exactamente 6 dígitos');
  }
  
  // Generar 10 dígitos aleatorios
  let digitosAleatorios = '';
  for (let i = 0; i < 10; i++) {
    digitosAleatorios += Math.floor(Math.random() * 10);
  }
  
  return productId + digitosAleatorios;
};

module.exports = mongoose.model('Card', cardSchema);
