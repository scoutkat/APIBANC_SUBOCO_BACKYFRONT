const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const cardRoutes = require('./routes/cardRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Banco Inc - API de Tarjetas',
      version: '1.0.0',
      description: 'API REST para administración de tarjetas de débito/crédito de Banco Inc',
      contact: {
        name: 'Banco Inc',
        email: 'dev@bancoinc.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Servidor de desarrollo'
      }
    ],
    tags: [
      {
        name: 'Tarjetas',
        description: 'Operaciones relacionadas con tarjetas bancarias'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware de seguridad
app.use(helmet());

// Middleware de logging
app.use(morgan('combined'));

// Middleware CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/banco_inc_cards')
.then(() => {
  console.log(' Conectado a MongoDB exitosamente');
})
.catch((error) => {
  console.error(' Error al conectar con MongoDB:', error.message);
  console.log(' La aplicación continuará ejecutándose, pero las funciones de base de datos no estarán disponibles');
  console.log('Para solucionarlo:');
  console.log('   1. Arranca Docker Desktop y ejecuta: docker-compose up -d mongodb');
  console.log('   2. O instala MongoDB localmente');
  console.log('   3. O configura MongoDB Atlas en el archivo .env');
});

// Rutas de documentación
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de la API
app.use('/api', cardRoutes);

// Ruta de salud del servidor
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
  console.log(` Documentación disponible en http://localhost:${PORT}/api/docs`);
});

module.exports = app;
