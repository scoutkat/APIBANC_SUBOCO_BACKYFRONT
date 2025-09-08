# Ejemplos de Uso de la API

## Configuración Inicial

### Opción 1: Con Docker (Recomendado)

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp env.example .env
   ```

3. **Iniciar MongoDB con Docker:**
   ```bash
   # Asegúrate de que Docker Desktop esté corriendo
   docker-compose up -d mongodb
   ```

4. **Verificar que MongoDB esté funcionando:**
   ```bash
   docker ps
   ```

5. **Ejecutar la aplicación:**
   ```bash
   npm run dev
   ```

### Opción 2: MongoDB Local

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp env.example .env
   ```

3. **Iniciar MongoDB localmente:**
   ```bash
   # En Windows
   mongod

   # En Linux/Mac
   sudo systemctl start mongod
   ```

4. **Ejecutar la aplicación:**
   ```bash
   npm run dev
   ```

### Opción 3: MongoDB Atlas (Cloud)

1. **Crear cuenta gratuita** en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Crear un cluster** gratuito
3. **Obtener la URI de conexión**
4. **Configurar en el archivo `.env`:**
   ```env
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/banco_inc_cards?retryWrites=true&w=majority
   ```
5. **Ejecutar la aplicación:**
   ```bash
   npm run dev
   ```

## Ejemplos de Uso

### 1. Generar Número de Tarjeta

```bash
curl -X GET http://localhost:3000/api/card/102030/number
```

**Respuesta:**
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

```bash
curl -X POST http://localhost:3000/api/card/enroll \
  -H "Content-Type: application/json" \
  -d '{
    "numeroTarjeta": "1020301234567801",
    "nombreTitular": "Juan Pérez"
  }'
```

**Respuesta:**
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

```bash
curl -X DELETE http://localhost:3000/api/card/1020301234567801
```

**Respuesta:**
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

```bash
curl -X GET http://localhost:3000/api/card/1020301234567801
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "cardId": "1020301234567801",
    "productId": "102030",
    "nombreTitular": "Juan Pérez",
    "fechaVencimiento": "01/2027",
    "activa": true,
    "bloqueada": false,
    "saldo": 0,
    "moneda": "USD",
    "fechaCreacion": "2024-01-15T10:30:00.000Z",
    "fechaActivacion": "2024-01-15T10:30:00.000Z",
    "fechaBloqueo": null
  }
}
```

### 5. Listar Todas las Tarjetas

```bash
curl -X GET "http://localhost:3000/api/cards?page=1&limit=10"
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "tarjetas": [
      {
        "cardId": "1020301234567801",
        "productId": "102030",
        "nombreTitular": "Juan Pérez",
        "fechaVencimiento": "01/2027",
        "activa": true,
        "bloqueada": false,
        "saldo": 0,
        "moneda": "USD",
        "fechaCreacion": "2024-01-15T10:30:00.000Z",
        "fechaActivacion": "2024-01-15T10:30:00.000Z",
        "fechaBloqueo": null
      }
    ],
    "paginacion": {
      "paginaActual": 1,
      "totalPaginas": 1,
      "totalRegistros": 1,
      "registrosPorPagina": 10
    }
  }
}
```

### 6. Filtrar Tarjetas por Estado

```bash
# Solo tarjetas activas
curl -X GET "http://localhost:3000/api/cards?activa=true"

# Solo tarjetas bloqueadas
curl -X GET "http://localhost:3000/api/cards?bloqueada=true"

# Tarjetas activas y no bloqueadas
curl -X GET "http://localhost:3000/api/cards?activa=true&bloqueada=false"
```

## Solución de Errores Comunes

### Error: Docker Desktop no está corriendo

**Error:**
```
unable to get image 'mongo:6.0': error during connect: Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/v1.51/images/mongo:6.0/json": open //./pipe/dockerDesktopLinuxEngine: El sistema no puede encontrar el archivo especificado.
```

**Solución:**
1. Abrir Docker Desktop
2. Esperar a que esté completamente iniciado
3. Ejecutar: `docker-compose up -d mongodb`

### Error: Puerto 3000 en uso

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solución:**
```bash
# Encontrar el proceso que usa el puerto
netstat -ano | findstr :3000

# Terminar el proceso (reemplazar PID con el número encontrado)
taskkill /PID [PID] /F

# O cambiar el puerto en el archivo .env
PORT=3001
```

### Error: MongoDB no conecta

**Error:**
```
MongooseServerSelectionError: connect ECONNREFUSED ::1:27017, connect ECONNREFUSED 127.0.0.1:27017
```

**Solución:**
1. **Con Docker:**
   ```bash
   docker-compose up -d mongodb
   docker ps  # Verificar que esté corriendo
   ```

2. **MongoDB local:**
   ```bash
   # Windows
   mongod
   
   # Linux/Mac
   sudo systemctl start mongod
   ```

3. **MongoDB Atlas:**
   - Configurar URI en archivo `.env`

### Error: Autenticación MongoDB

**Error:**
```
MongoServerError: command find requires authentication
```

**Solución:**
1. **Sin autenticación (recomendado para desarrollo):**
   ```yaml
   # docker-compose.yml
   mongodb:
     image: mongo:6.0
     ports:
       - "27017:27017"
     volumes:
       - mongodb_data:/data/db
   ```

2. **Con autenticación:**
   ```javascript
   // src/app.js
   mongoose.connect('mongodb://admin:password123@localhost:27017/banco_inc_cards?authSource=admin')
   ```

### Error: Más de 6 dígitos en productId

**Error:**
```
curl -X GET http://localhost:3000/api/card/1234567/number
```

**Respuesta (controlada):**
```json
{
  "success": false,
  "message": "El ID del producto debe tener exactamente 6 dígitos. Recibido: 7 dígitos. Use solo los primeros 6 dígitos: 123456"
}
```

**Solución:** Usar exactamente 6 dígitos o seguir la sugerencia del mensaje.

### Error: Menos de 6 dígitos en productId

**Error:**
```bash
curl -X GET http://localhost:3000/api/card/12345/number
```

**Respuesta:**
```json
{
  "success": false,
  "message": "El ID del producto debe tener exactamente 6 dígitos. Recibido: 5 dígitos"
}
```

### Error: Tarjeta No Encontrada

```bash
curl -X DELETE http://localhost:3000/api/card/9999999999999999
```

**Respuesta:**
```json
{
  "success": false,
  "message": "Tarjeta no encontrada"
}
```

### Error: Tarjeta Duplicada

```bash
# Primera activación
curl -X POST http://localhost:3000/api/card/enroll \
  -H "Content-Type: application/json" \
  -d '{"numeroTarjeta":"1020301234567801","nombreTitular":"Juan Pérez"}'

# Segunda activación (mismo número)
curl -X POST http://localhost:3000/api/card/enroll \
  -H "Content-Type: application/json" \
  -d '{"numeroTarjeta":"1020301234567801","nombreTitular":"María García"}'
```

**Respuesta:**
```json
{
  "success": false,
  "message": "Ya existe una tarjeta con este número"
}
```

### Error: JSON malformado en Windows

**Error:**
```
curl: (3) URL rejected: Port number was not a decimal number between 0 and 65535
```

**Solución:**
1. **Crear archivo JSON temporal:**
   ```bash
   # Crear archivo test-data.json
   echo {"numeroTarjeta":"1020301234567801","nombreTitular":"Juan Perez"} > test-data.json
   
   # Usar el archivo
   curl -X POST http://localhost:3000/api/card/enroll -H "Content-Type: application/json" -d @test-data.json
   ```

2. **Usar PowerShell:**
   ```powershell
   $body = @{
       numeroTarjeta = "1020301234567801"
       nombreTitular = "Juan Perez"
   } | ConvertTo-Json
   
   Invoke-RestMethod -Uri "http://localhost:3000/api/card/enroll" -Method POST -Body $body -ContentType "application/json"
   ```

## Comandos Docker Útiles

### Gestión de Contenedores

```bash
# Ver contenedores corriendo
docker ps

# Ver todos los contenedores (incluyendo detenidos)
docker ps -a

# Detener MongoDB
docker-compose down

# Detener solo MongoDB
docker stop banco_inc_mongodb

# Reiniciar MongoDB
docker restart banco_inc_mongodb

# Ver logs de MongoDB
docker logs banco_inc_mongodb

# Entrar al contenedor de MongoDB
docker exec -it banco_inc_mongodb mongosh
```

### Gestión de Volúmenes

```bash
# Ver volúmenes
docker volume ls

# Eliminar volumen de MongoDB (¡CUIDADO! Esto borra todos los datos)
docker volume rm subocol_mongodb_data

# Crear volumen nuevo
docker volume create mongodb_data
```

### Limpieza del Sistema

```bash
# Limpiar contenedores detenidos
docker container prune

# Limpiar imágenes no utilizadas
docker image prune

# Limpiar todo (¡CUIDADO!)
docker system prune -a
```

## Verificar Estado del Servidor

```bash
curl -X GET http://localhost:3000/health
```

**Respuesta:**
```json
{
  "status": "OK",
  "message": "Servidor funcionando correctamente",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Verificar Conexión a MongoDB

```bash
# Desde la aplicación
curl -X GET http://localhost:3000/health

# Desde MongoDB directamente
docker exec -it banco_inc_mongodb mongosh --eval "db.runCommand('ping')"
```

## Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas con cobertura
npm run test -- --coverage

# Ejecutar pruebas en modo watch
npm run test -- --watch
```

## Troubleshooting Avanzado

### Problema: La aplicación no se conecta a MongoDB

**Diagnóstico:**
```bash
# Verificar que MongoDB esté corriendo
docker ps | grep mongo

# Verificar logs de MongoDB
docker logs banco_inc_mongodb

# Probar conexión directa
docker exec -it banco_inc_mongodb mongosh --eval "db.runCommand('ping')"
```

**Soluciones:**
1. **Reiniciar MongoDB:**
   ```bash
   docker-compose down
   docker-compose up -d mongodb
   ```

2. **Verificar configuración de red:**
   ```bash
   docker network ls
   docker network inspect subocol_banco_inc_network
   ```

### Problema: Puerto ocupado

**Diagnóstico:**
```bash
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

**Solución:**
```bash
# Cambiar puerto en .env
echo "PORT=3001" >> .env

# O terminar proceso
taskkill /PID [PID] /F  # Windows
kill -9 [PID]           # Linux/Mac
```

### Problema: Datos no persisten

**Diagnóstico:**
```bash
# Verificar volúmenes
docker volume ls
docker volume inspect subocol_mongodb_data
```

**Solución:**
```bash
# Recrear volumen
docker-compose down -v
docker-compose up -d mongodb
```

### Problema: Errores de validación

**Diagnóstico:**
```bash
# Probar con diferentes valores
curl -X GET http://localhost:3000/api/card/123/number
curl -X GET http://localhost:3000/api/card/1234567/number
curl -X GET http://localhost:3000/api/card/abc123/number
```

**Solución:** Usar exactamente 6 dígitos numéricos.

### Problema: Documentación no carga

**Diagnóstico:**
```bash
# Verificar que Swagger esté instalado
npm list swagger-ui-express swagger-jsdoc

# Verificar logs del servidor
npm run dev
```

**Solución:**
```bash
# Reinstalar dependencias de documentación
npm install swagger-ui-express swagger-jsdoc
```

## Configuración de Producción

### Variables de Entorno Recomendadas

```env
# .env.production
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://usuario:password@host:27017/banco_inc_cards
```

### Docker Compose para Producción

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  mongodb:
    image: mongo:6.0
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    volumes:
      - mongodb_data:/data/db
    networks:
      - app_network

  app:
    build: .
    restart: always
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongodb:27017/banco_inc_cards?authSource=admin
    depends_on:
      - mongodb
    networks:
      - app_network

volumes:
  mongodb_data:

networks:
  app_network:
    driver: bridge
```

### Comandos de Despliegue

```bash
# Construir y desplegar
docker-compose -f docker-compose.prod.yml up -d --build

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Hacer backup de la base de datos
docker exec banco_inc_mongodb mongodump --out /backup
```
