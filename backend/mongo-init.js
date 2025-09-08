// Script de inicialización de MongoDB
db = db.getSiblingDB('banco_inc_cards');

// Crear usuario para la aplicación
db.createUser({
  user: 'app_user',
  pwd: 'app_password',
  roles: [
    {
      role: 'readWrite',
      db: 'banco_inc_cards'
    }
  ]
});

// Crear colección de tarjetas
db.createCollection('cards');

// Crear índices para optimizar consultas
db.cards.createIndex({ "numeroTarjeta": 1 }, { unique: true });
db.cards.createIndex({ "productId": 1 });
db.cards.createIndex({ "activa": 1, "bloqueada": 1 });

print('Base de datos inicializada correctamente');
