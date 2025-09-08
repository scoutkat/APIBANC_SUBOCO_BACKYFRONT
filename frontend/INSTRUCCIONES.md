# 🚀 Instrucciones para Ejecutar la Aplicación Completa

## 📋 Requisitos Previos

1. **Node.js** (versión 18 o superior)
2. **Docker Desktop** (para MongoDB)
3. **Dos terminales** abiertas

## 🔧 Pasos para Ejecutar

### 1. Iniciar Backend (Terminal 1)

```bash
# Navegar al directorio del backend
cd D:\subocol

# Instalar dependencias (si es necesario)
npm install

# Iniciar MongoDB con Docker
docker-compose up -d mongodb

# Verificar que MongoDB esté corriendo
docker ps

# Iniciar el servidor backend
npm run dev
```

**✅ Verificar que el backend esté funcionando:**
- Deberías ver: `Servidor ejecutándose en puerto 3000`
- Probar: `curl http://localhost:3000/health`

### 2. Iniciar Frontend (Terminal 2)

```bash
# Navegar al directorio del frontend
cd D:\banco-inc-frontend

# Instalar dependencias (si es necesario)
npm install

# Iniciar la aplicación Angular
npx ng serve --open
```

**✅ Verificar que el frontend esté funcionando:**
- Se abrirá automáticamente en: `http://localhost:4200`
- Deberías ver la interfaz de "Banco Inc - Frontend"

## 🧪 Probar la Funcionalidad

### 1. Generar Número de Tarjeta
1. Abre las **Herramientas de Desarrollador** (F12)
2. Ve a la pestaña **Console**
3. En la aplicación, ingresa un Product ID: `102030`
4. Haz clic en **"Generar Número"**
5. Observa los logs en la consola:
   ```
   🔄 Generando número de tarjeta para productId: 102030
   ✅ Respuesta del servidor (Generar tarjeta): {...}
   🎯 Número de tarjeta generado: 1020301234567801
   ```

### 2. Activar Tarjeta
1. El número de tarjeta se auto-completará
2. Ingresa un nombre: `Juan Pérez`
3. Haz clic en **"Activar Tarjeta"**
4. Observa los logs en la consola:
   ```
   🔄 Activando tarjeta: 1020301234567801 para Juan Pérez
   ✅ Respuesta del servidor (Activar tarjeta): {...}
   🎯 Tarjeta activada exitosamente: 1020301234567801
   ```

### 3. Acciones Adicionales
- **Ver Información** - Consulta datos completos
- **Bloquear Tarjeta** - Bloquea la tarjeta
- **Verificar Servidor** - Comprueba el estado del backend

## 🔍 Verificar Logs

### En la Consola del Navegador (F12 → Console):
- **🔄** - Inicio de operaciones
- **✅** - Respuestas exitosas del servidor
- **❌** - Errores detallados
- **🎯** - Información importante

### En la Terminal del Backend:
- Logs de conexión a MongoDB
- Logs de peticiones HTTP
- Errores del servidor

## 🚨 Solución de Problemas

### Backend no inicia:
```bash
# Verificar que el puerto 3000 esté libre
netstat -ano | findstr :3000

# Si está ocupado, terminar el proceso
taskkill /PID [PID] /F
```

### Frontend no inicia:
```bash
# Verificar que el puerto 4200 esté libre
netstat -ano | findstr :4200

# Si está ocupado, usar otro puerto
npx ng serve --port 4200
```

### MongoDB no conecta:
```bash
# Reiniciar MongoDB
docker-compose down
docker-compose up -d mongodb

# Verificar logs
docker logs banco_inc_mongodb
```

### CORS Error:
- Asegúrate de que el backend esté corriendo en puerto 3000
- El frontend debe estar en puerto 4200
- CORS está configurado en el backend

## 📊 URLs Importantes

- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:3000/api
- **Documentación API:** http://localhost:3000/api/docs
- **Health Check:** http://localhost:3000/health

## 🎯 Casos de Prueba

### Caso 1: Flujo Completo Exitoso
1. Product ID: `102030`
2. Generar número
3. Nombre: `Juan Pérez`
4. Activar tarjeta
5. Ver información
6. Bloquear tarjeta

### Caso 2: Validaciones
1. Product ID: `12345` (menos de 6 dígitos) → Error
2. Product ID: `1234567` (más de 6 dígitos) → Error
3. Nombre vacío → Error
4. Número de tarjeta inválido → Error

### Caso 3: Errores del Servidor
1. Detener el backend
2. Intentar generar tarjeta → Error de conexión
3. Reiniciar backend
4. Probar nuevamente → Funciona

## ✅ Verificación Final

La aplicación está funcionando correctamente si:
- ✅ Backend responde en puerto 3000
- ✅ Frontend se abre en puerto 4200
- ✅ Se pueden generar números de tarjeta
- ✅ Se pueden activar tarjetas
- ✅ Los logs aparecen en la consola del navegador
- ✅ Las validaciones funcionan correctamente
- ✅ Los errores se manejan apropiadamente

## 🎉 ¡Listo!

Tu aplicación full-stack está funcionando:
- **Backend:** Node.js + Express + MongoDB
- **Frontend:** Angular con consumo de API
- **Logging:** Respuestas del servidor en consola
- **Validaciones:** Manejo robusto de errores
