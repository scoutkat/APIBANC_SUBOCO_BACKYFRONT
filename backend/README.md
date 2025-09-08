# Banco Inc - API de Administración de Tarjetas

## Descripción

API REST desarrollada en Node.js con Express para la administración de tarjetas de débito/crédito de Banco Inc. El sistema permite generar números de tarjeta, activar tarjetas y bloquearlas cuando sea necesario.

## Características de las Tarjetas

- **Longitud**: 16 dígitos (6 primeros = ID del producto, 10 restantes = aleatorios)
- **Titular**: Nombre del titular de la cuenta
- **Vencimiento**: 3 años posterior a la fecha de creación (formato MM/YYYY)
- **Moneda**: Únicamente dólares (USD)
- **Estado inicial**: Inactiva por controles de seguridad
- **Saldo inicial**: $0 USD

## Requisitos del Sistema

- Node.js (versión 14 o superior)
- MongoDB (versión 4.4 o superior)
- npm o yarn

## Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd banco-inc-cards-api
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env
   ```
   
   Editar el archivo `.env` con la configuración de tu base de datos:
   ```env
   MONGODB_URI=mongodb://localhost:27017/banco_inc_cards
   PORT=3000
   NODE_ENV=development
   ```

4. **Iniciar MongoDB**
   Asegúrate de que MongoDB esté ejecutándose en tu sistema.

5. **Ejecutar la aplicación**
   ```bash
   # Modo desarrollo (con nodemon)
   npm run dev
   
   # Modo producción
   npm start
   ```

## Endpoints de la API

### 1. Generar Número de Tarjeta
- **Método**: `GET`
- **Ruta**: `/api/card/{productId}/number`
- **Descripción**: Genera un número de tarjeta de 16 dígitos
- **Parámetros**:
  - `productId` (string): ID del producto de 6 dígitos

**Ejemplo de solicitud:**
```bash
GET /api/card/102030/number
```

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "message": "Número de tarjeta generado exitosamente",
  "data": {
    "productId": "102030",
    "numeroTarjeta": "1020301234567801",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Activar Tarjeta
- **Método**: `POST`
- **Ruta**: `/api/card/enroll`
- **Descripción**: Activa una tarjeta emitida pero inactiva

**Ejemplo de solicitud:**
```bash
POST /api/card/enroll
Content-Type: application/json

{
  "numeroTarjeta": "1020301234567801",
  "nombreTitular": "Juan Pérez"
}
```

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "message": "Tarjeta activada exitosamente",
  "data": {
    "cardId": "1020301234567801",
    "productId": "102030",
    "nombreTitular": "Juan Pérez",
    "fechaVencimiento": "01/2027",
    "activa": true,
    "saldo": 0,
    "moneda": "USD",
    "fechaActivacion": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. Bloquear Tarjeta
- **Método**: `DELETE`
- **Ruta**: `/api/card/{cardId}`
- **Descripción**: Bloquea una tarjeta por inconsistencia

**Ejemplo de solicitud:**
```bash
DELETE /api/card/1020301234567801
```

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "message": "Tarjeta bloqueada exitosamente",
  "data": {
    "cardId": "1020301234567801",
    "bloqueada": true,
    "fechaBloqueo": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Obtener Información de Tarjeta
- **Método**: `GET`
- **Ruta**: `/api/card/{cardId}`
- **Descripción**: Obtiene información completa de una tarjeta

### 5. Listar Tarjetas
- **Método**: `GET`
- **Ruta**: `/api/cards`
- **Descripción**: Lista todas las tarjetas con paginación
- **Parámetros de consulta**:
  - `page` (opcional): Número de página (default: 1)
  - `limit` (opcional): Registros por página (default: 10)
  - `activa` (opcional): Filtrar por estado de activación
  - `bloqueada` (opcional): Filtrar por estado de bloqueo

## Modelo de Base de Datos

### Colección: cards

```javascript
{
  numeroTarjeta: String,        // 16 dígitos, único
  productId: String,            // 6 dígitos
  nombreTitular: String,        // Nombre del titular
  fechaVencimiento: String,     // Formato MM/YYYY
  activa: Boolean,              // Estado de activación
  bloqueada: Boolean,           // Estado de bloqueo
  saldo: Number,                // Saldo en USD (default: 0)
  moneda: String,               // Siempre "USD"
  fechaCreacion: Date,          // Fecha de creación
  fechaActivacion: Date,        // Fecha de activación
  fechaBloqueo: Date,           // Fecha de bloqueo
  createdAt: Date,              // Timestamp de creación
  updatedAt: Date               // Timestamp de actualización
}
```

## Flujo de Datos

1. **Generación de Tarjeta**:
   - Cliente solicita número de tarjeta con productId
   - Sistema genera 10 dígitos aleatorios
   - Se concatena con productId (6 dígitos)
   - Se retorna el número de 16 dígitos

2. **Activación de Tarjeta**:
   - Cliente envía número de tarjeta y nombre del titular
   - Sistema valida que la tarjeta no exista
   - Se crea el registro en la base de datos
   - Se calcula fecha de vencimiento (3 años)
   - Se activa automáticamente la tarjeta

3. **Bloqueo de Tarjeta**:
   - Administrador solicita bloqueo con cardId
   - Sistema busca la tarjeta en la base de datos
   - Se actualiza el estado a bloqueada
   - Se registra la fecha de bloqueo

## Validaciones

- **ProductId**: Debe tener exactamente 6 dígitos
- **Número de Tarjeta**: Debe tener exactamente 16 dígitos
- **Nombre del Titular**: Entre 2 y 100 caracteres
- **Fecha de Vencimiento**: Formato MM/YYYY válido
- **Unicidad**: No se permiten números de tarjeta duplicados

## Manejo de Errores

El API maneja los siguientes tipos de errores:

- **400 Bad Request**: Error de validación de datos
- **404 Not Found**: Recurso no encontrado
- **409 Conflict**: Recurso duplicado
- **500 Internal Server Error**: Error interno del servidor

Todas las respuestas de error siguen el formato:
```json
{
  "success": false,
  "message": "Descripción del error"
}
```

## Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Configuración de Cross-Origin Resource Sharing
- **Validación de entrada**: Validación robusta con Joi
- **Sanitización**: Limpieza de datos de entrada

## Estructura del Proyecto

```
src/
├── app.js                 # Archivo principal de la aplicación
├── controllers/           # Controladores de la lógica de negocio
│   └── cardController.js
├── middleware/            # Middleware personalizado
│   ├── errorHandler.js
│   └── validation.js
├── models/               # Modelos de base de datos
│   └── Card.js
└── routes/               # Definición de rutas
    └── cardRoutes.js
```

## Pruebas

Para probar la API, puedes usar herramientas como:

- **Postman**: Importar la colección de endpoints
- **curl**: Comandos de línea de comandos
- **Thunder Client**: Extensión de VS Code

### Ejemplo con curl:

```bash
# Generar número de tarjeta
curl -X GET http://localhost:3000/api/card/102030/number

# Activar tarjeta
curl -X POST http://localhost:3000/api/card/enroll \
  -H "Content-Type: application/json" \
  -d '{"numeroTarjeta":"1020301234567801","nombreTitular":"Juan Pérez"}'

# Bloquear tarjeta
curl -X DELETE http://localhost:3000/api/card/1020301234567801
```

## Monitoreo

- **Health Check**: `GET /health` - Verifica el estado del servidor
- **Logging**: Morgan para logs de acceso HTTP
- **Manejo de errores**: Logging detallado de errores

## Consideraciones de Producción

1. **Variables de entorno**: Configurar correctamente las variables de producción
2. **Base de datos**: Usar una instancia de MongoDB en producción
3. **Logging**: Implementar sistema de logging robusto
4. **Monitoreo**: Configurar alertas y monitoreo de la aplicación
5. **Backup**: Implementar estrategia de respaldo de la base de datos

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
