# Banco Inc - Frontend Angular

Frontend desarrollado en Angular para consumir la API REST de administración de tarjetas bancarias.

## 🚀 Características

- **Consumo de API REST** - Integración completa con el backend Node.js
- **Generación de tarjetas** - Interfaz para generar números de tarjeta
- **Activación de tarjetas** - Formulario para activar tarjetas emitidas
- **Manejo de errores** - Gestión robusta de errores con logging detallado
- **Logging en consola** - Respuestas del servidor visibles en DevTools
- **Validaciones** - Validación de datos de entrada en tiempo real
- **UI Responsiva** - Diseño moderno y adaptable

## 📋 Requerimientos

- Node.js (versión 18 o superior)
- npm o yarn
- Backend API corriendo en `http://localhost:3000`

## 🛠️ Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Verificar que el backend esté corriendo:**
   ```bash
   # En otra terminal, desde el directorio del backend
   npm run dev
   ```

3. **Ejecutar la aplicación:**
   ```bash
   ng serve
   ```

4. **Abrir en el navegador:**
   ```
   http://localhost:4200
   ```

## 🎯 Funcionalidades

### 1. Generar Número de Tarjeta
- Ingresa un ID de producto de 6 dígitos
- Genera un número de tarjeta de 16 dígitos
- Muestra la respuesta del servidor en la consola

### 2. Activar Tarjeta
- Usa el número generado o ingresa uno manual
- Proporciona el nombre del titular
- Activa la tarjeta en el sistema
- Muestra información completa de la tarjeta activada

### 3. Acciones Adicionales
- **Ver Información** - Consulta datos completos de la tarjeta
- **Bloquear Tarjeta** - Bloquea la tarjeta por inconsistencia
- **Verificar Servidor** - Comprueba el estado del backend

## 📊 Logging y Debugging

### Ver Logs en el Navegador:
1. Abre las **Herramientas de Desarrollador** (F12)
2. Ve a la pestaña **Console**
3. Realiza las acciones en la aplicación
4. Observa los logs detallados:

```
🔄 Generando número de tarjeta para productId: 102030
✅ Respuesta del servidor (Generar tarjeta): {success: true, data: {...}}
🎯 Número de tarjeta generado: 1020301234567801
```

### Tipos de Logs:
- **🔄** - Inicio de operaciones
- **✅** - Respuestas exitosas del servidor
- **❌** - Errores detallados
- **🎯** - Información importante
- **💥** - Errores críticos

## 🧪 Pruebas

### Casos de Prueba:

1. **Generar tarjeta válida:**
   - Product ID: `102030`
   - Resultado: Número de 16 dígitos generado

2. **Generar tarjeta inválida:**
   - Product ID: `12345` (menos de 6 dígitos)
   - Resultado: Error de validación

3. **Activar tarjeta:**
   - Número: `1020301234567801`
   - Titular: `Juan Pérez`
   - Resultado: Tarjeta activada exitosamente

4. **Error de tarjeta duplicada:**
   - Intentar activar la misma tarjeta dos veces
   - Resultado: Error de duplicado

## 🔧 Configuración

### URL del Backend:
Por defecto, la aplicación se conecta a:
```
http://localhost:3000/api
```

Para cambiar la URL, edita el archivo:
```typescript
// src/app/services/card.service.ts
private readonly API_BASE_URL = 'http://localhost:3000/api';
```

### CORS:
Asegúrate de que el backend tenga CORS habilitado para `http://localhost:4200`.

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop** - Experiencia completa
- **Tablet** - Adaptación de layout
- **Mobile** - Interfaz táctil optimizada

## 🚀 Scripts Disponibles

```bash
# Desarrollo
ng serve

# Construcción para producción
ng build

# Ejecutar pruebas
ng test

# Linting
ng lint
```

## 🏗️ Arquitectura

```
src/
├── app/
│   ├── components/
│   │   └── card-generator.component.ts    # Componente principal
│   ├── services/
│   │   └── card.service.ts                # Servicio para API
│   ├── app.ts                             # Componente raíz
│   ├── app.html                           # Template principal
│   ├── app.css                            # Estilos globales
│   └── app.config.ts                      # Configuración de la app
```

## 🔗 Integración con Backend

### Endpoints Consumidos:
- `GET /api/card/{productId}/number` - Generar número
- `POST /api/card/enroll` - Activar tarjeta
- `GET /api/card/{cardId}` - Obtener información
- `DELETE /api/card/{cardId}` - Bloquear tarjeta
- `GET /health` - Verificar servidor

### Manejo de Errores:
- Validación de datos de entrada
- Manejo de errores HTTP
- Logging detallado en consola
- Mensajes de error user-friendly

## 📝 Notas de Desarrollo

- **Standalone Components** - Uso de componentes independientes
- **Reactive Forms** - Validación reactiva de formularios
- **HTTP Interceptors** - Preparado para interceptores
- **TypeScript** - Tipado fuerte para mejor desarrollo
- **Modern Angular** - Uso de las últimas características

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
