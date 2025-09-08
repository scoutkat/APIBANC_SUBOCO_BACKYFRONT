const express = require('express');
const router = express.Router();
const {
  generarNumeroTarjeta,
  activarTarjeta,
  bloquearTarjeta,
  obtenerTarjeta,
  listarTarjetas
} = require('../controllers/cardController');
const {
  validateProductId,
  validateCardId,
  validateCardEnrollment
} = require('../middleware/validation');

/**
 * @swagger
 * components:
 *   schemas:
 *     Tarjeta:
 *       type: object
 *       properties:
 *         cardId:
 *           type: string
 *           description: Número de tarjeta de 16 dígitos
 *           example: "1020301234567801"
 *         productId:
 *           type: string
 *           description: ID del producto (6 dígitos)
 *           example: "102030"
 *         nombreTitular:
 *           type: string
 *           description: Nombre del titular de la cuenta
 *           example: "Juan Pérez"
 *         fechaVencimiento:
 *           type: string
 *           description: Fecha de vencimiento en formato MM/YYYY
 *           example: "12/2026"
 *         activa:
 *           type: boolean
 *           description: Estado de activación de la tarjeta
 *           example: true
 *         bloqueada:
 *           type: boolean
 *           description: Estado de bloqueo de la tarjeta
 *           example: false
 *         saldo:
 *           type: number
 *           description: Saldo actual en dólares
 *           example: 0
 *         moneda:
 *           type: string
 *           description: Moneda de la tarjeta
 *           example: "USD"
 */

/**
 * @swagger
 * /api/card/{productId}/number:
 *   get:
 *     summary: Generar número de tarjeta
 *     description: Genera un número de tarjeta de 16 dígitos donde los primeros 6 corresponden al ID del producto
 *     tags: [Tarjetas]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^\d{6}$'
 *         description: ID del producto (6 dígitos)
 *         example: "102030"
 *     responses:
 *       200:
 *         description: Número de tarjeta generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Número de tarjeta generado exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "102030"
 *                     numeroTarjeta:
 *                       type: string
 *                       example: "1020301234567801"
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "El ID del producto debe tener exactamente 6 dígitos"
 */
router.get('/card/:productId/number', validateProductId, generarNumeroTarjeta);

/**
 * @swagger
 * /api/card/enroll:
 *   post:
 *     summary: Activar tarjeta
 *     description: Activa una tarjeta que ha sido emitida pero está inactiva por razones de seguridad
 *     tags: [Tarjetas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numeroTarjeta
 *               - nombreTitular
 *             properties:
 *               numeroTarjeta:
 *                 type: string
 *                 pattern: '^\d{16}$'
 *                 description: Número de tarjeta de 16 dígitos
 *                 example: "1020301234567801"
 *               nombreTitular:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: Nombre del titular de la cuenta
 *                 example: "Juan Pérez"
 *     responses:
 *       201:
 *         description: Tarjeta activada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Tarjeta activada exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Tarjeta'
 *       400:
 *         description: Error de validación
 *       409:
 *         description: Ya existe una tarjeta con este número
 */
router.post('/card/enroll', validateCardEnrollment, activarTarjeta);

/**
 * @swagger
 * /api/card/{cardId}:
 *   delete:
 *     summary: Bloquear tarjet
 *     description: Permite a los administradores del sistema bloquear una tarjeta en caso de encontrar alguna inconsistencia
 *     tags: [Tarjetas]
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^\d{16}$'
 *         description: ID de la tarjeta (16 dígitos)
 *         example: "1020301234567801"
 *     responses:
 *       200:
 *         description: Tarjeta bloqueada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Tarjeta bloqueada exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     cardId:
 *                       type: string
 *                       example: "1020301234567801"
 *                     bloqueada:
 *                       type: boolean
 *                       example: true
 *                     fechaBloqueo:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Error de validación o tarjeta ya bloqueada
 *       404:
 *         description: Tarjeta no encontrada
 */
router.delete('/card/:cardId', validateCardId, bloquearTarjeta);

/**
 * @swagger
 * /api/card/{cardId}:
 *   get:
 *     summary: Obtener información de tarjeta
 *     description: Obtiene la información completa de una tarjeta específica
 *     tags: [Tarjetas]
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^\d{16}$'
 *         description: ID de la tarjeta (16 dígitos)
 *         example: "1020301234567801"
 *     responses:
 *       200:
 *         description: Información de la tarjeta obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Tarjeta'
 *       404:
 *         description: Tarjeta no encontrada
 */
router.get('/card/:cardId', validateCardId, obtenerTarjeta);

/**
 * @swagger
 * /api/cards:
 *   get:
 *     summary: Listar tarjetas
 *     description: Lista todas las tarjetas con paginación y filtros opcionales
 *     tags: [Tarjetas]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Número de registros por página
 *       - in: query
 *         name: activa
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado de activación
 *       - in: query
 *         name: bloqueada
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado de bloqueo
 *     responses:
 *       200:
 *         description: Lista de tarjetas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     tarjetas:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Tarjeta'
 *                     paginacion:
 *                       type: object
 *                       properties:
 *                         paginaActual:
 *                           type: integer
 *                           example: 1
 *                         totalPaginas:
 *                           type: integer
 *                           example: 5
 *                         totalRegistros:
 *                           type: integer
 *                           example: 50
 *                         registrosPorPagina:
 *                           type: integer
 *                           example: 10
 */
router.get('/cards', listarTarjetas);

module.exports = router;
