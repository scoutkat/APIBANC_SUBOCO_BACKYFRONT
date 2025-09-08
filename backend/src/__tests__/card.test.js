const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Card = require('../models/Card');

describe('API de Tarjetas', () => {
  beforeAll(async () => {
    // Conectar a la base de datos de prueba
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    // Limpiar y cerrar conexión
    await Card.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Limpiar la base de datos antes de cada prueba
    await Card.deleteMany({});
  });

  describe('GET /api/card/:productId/number', () => {
    test('Debería generar un número de tarjeta válido', async () => {
      const productId = '102030';
      const response = await request(app)
        .get(`/api/card/${productId}/number`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.productId).toBe(productId);
      expect(response.body.data.numeroTarjeta).toMatch(/^\d{16}$/);
      expect(response.body.data.numeroTarjeta.startsWith(productId)).toBe(true);
    });

    test('Debería fallar con productId inválido', async () => {
      const response = await request(app)
        .get('/api/card/12345/number')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('6 dígitos');
    });
  });

  describe('POST /api/card/enroll', () => {
    test('Debería activar una tarjeta correctamente', async () => {
      const tarjetaData = {
        numeroTarjeta: '1020301234567801',
        nombreTitular: 'Juan Pérez'
      };

      const response = await request(app)
        .post('/api/card/enroll')
        .send(tarjetaData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.cardId).toBe(tarjetaData.numeroTarjeta);
      expect(response.body.data.nombreTitular).toBe(tarjetaData.nombreTitular);
      expect(response.body.data.activa).toBe(true);
      expect(response.body.data.saldo).toBe(0);
      expect(response.body.data.moneda).toBe('USD');
    });

    test('Debería fallar con datos inválidos', async () => {
      const tarjetaData = {
        numeroTarjeta: '123', // Inválido
        nombreTitular: 'A' // Muy corto
      };

      const response = await request(app)
        .post('/api/card/enroll')
        .send(tarjetaData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('Debería fallar si la tarjeta ya existe', async () => {
      const tarjetaData = {
        numeroTarjeta: '1020301234567801',
        nombreTitular: 'Juan Pérez'
      };

      // Crear la primera tarjeta
      await request(app)
        .post('/api/card/enroll')
        .send(tarjetaData)
        .expect(201);

      // Intentar crear la misma tarjeta
      const response = await request(app)
        .post('/api/card/enroll')
        .send(tarjetaData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Ya existe');
    });
  });

  describe('DELETE /api/card/:cardId', () => {
    test('Debería bloquear una tarjeta existente', async () => {
      // Primero crear una tarjeta
      const tarjetaData = {
        numeroTarjeta: '1020301234567801',
        nombreTitular: 'Juan Pérez'
      };

      await request(app)
        .post('/api/card/enroll')
        .send(tarjetaData)
        .expect(201);

      // Luego bloquearla
      const response = await request(app)
        .delete(`/api/card/${tarjetaData.numeroTarjeta}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bloqueada).toBe(true);
    });

    test('Debería fallar si la tarjeta no existe', async () => {
      const response = await request(app)
        .delete('/api/card/9999999999999999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('no encontrada');
    });

    test('Debería fallar si la tarjeta ya está bloqueada', async () => {
      // Crear y bloquear tarjeta
      const tarjetaData = {
        numeroTarjeta: '1020301234567801',
        nombreTitular: 'Juan Pérez'
      };

      await request(app)
        .post('/api/card/enroll')
        .send(tarjetaData);

      await request(app)
        .delete(`/api/card/${tarjetaData.numeroTarjeta}`);

      // Intentar bloquear nuevamente
      const response = await request(app)
        .delete(`/api/card/${tarjetaData.numeroTarjeta}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('ya está bloqueada');
    });
  });

  describe('GET /api/card/:cardId', () => {
    test('Debería obtener información de una tarjeta', async () => {
      // Crear una tarjeta
      const tarjetaData = {
        numeroTarjeta: '1020301234567801',
        nombreTitular: 'Juan Pérez'
      };

      await request(app)
        .post('/api/card/enroll')
        .send(tarjetaData);

      // Obtener información
      const response = await request(app)
        .get(`/api/card/${tarjetaData.numeroTarjeta}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.cardId).toBe(tarjetaData.numeroTarjeta);
      expect(response.body.data.nombreTitular).toBe(tarjetaData.nombreTitular);
    });
  });
});
