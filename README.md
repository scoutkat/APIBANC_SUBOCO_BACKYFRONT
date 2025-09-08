# Monorepo: Backend + Frontend (Banco Inc)

Repo: https://github.com/scoutkat/APIBANC_SUBOCO_BACKYFRONT.git

## Requisitos
- Docker Desktop
- Git
- Node.js 18+ (solo si ejecutarás en modo local)

## Estructura
- `backend/` (Node.js + Express + MongoDB)
- `frontend/` (Angular)

## Clonar
```bash
git clone https://github.com/scoutkat/APIBANC_SUBOCO_BACKYFRONT.git
cd APIBANC_SUBOCO_BACKYFRONT
```

## Variables de entorno (backend/.env)
Crea `backend/.env`:
```bash
MONGODB_URI=mongodb://localhost:27017/banco_inc_cards
PORT=3000
NODE_ENV=development
```

## Base de datos (MongoDB con Docker)
```bash
docker run -d --name banco-inc-mongo -p 27017:27017 mongo:6.0
# Verifica: docker ps
# Logs: docker logs banco-inc-mongo
# Detener: docker stop banco-inc-mongo
# Iniciar: docker start banco-inc-mongo
```

## Backend
### Opción A: Docker
```bash
cd backend
docker build -t banco-inc-backend .
docker run -d --name banco-inc-backend --env-file .env -p 3000:3000 --link banco-inc-mongo:mongo banco-inc-backend
```

### Opción B: Local (desarrollo)
```bash
cd backend
npm install
npm run dev
```

Verificación:
- Health: http://localhost:3000/health
- Swagger (si aplica): http://localhost:3000/api/docs

## Frontend
### Opción A: Docker (sirviendo build en 80)
```bash
cd frontend
docker build -t banco-inc-frontend .
docker run -d --name banco-inc-frontend -p 4300:80 banco-inc-frontend
# Si tu Dockerfile expone 4300 (dev server), usa: -p 4300:4300
```

### Opción B: Local (desarrollo)
```bash
cd frontend
npm install
npm run start -- --port 4300
```

App: http://localhost:4300

## Endpoints principales (Backend)
- Generar número: `GET /api/card/{productId}/number`
- Activar tarjeta: `POST /api/card/enroll`
- Consultar tarjeta: `GET /api/card/{cardId}`
- Bloquear tarjeta: `DELETE /api/card/{cardId}`
- Listar tarjetas: `GET /api/cards`

## Flujo rápido (local + Mongo en Docker)
```bash
# 1) Mongo
docker start banco-inc-mongo 2>/dev/null || docker run -d --name banco-inc-mongo -p 27017:27017 mongo:6.0

# 2) Backend
cd backend
npm install
npm run dev

# 3) Frontend (otra terminal)
cd ../frontend
npm install
npm run start -- --port 4300
```

## Troubleshooting
- Puerto 3000 ocupado (Windows):
  - Ver PID: `netstat -ano | findstr :3000`
  - Matar: `taskkill /PID <PID> /F`
- Puerto 4200/4300 ocupado:
  - `netstat -ano | findstr :4200` / `:4300` y `taskkill /PID <PID> /F`
- Mongo no responde:
  - `docker ps`, `docker logs banco-inc-mongo`
- Angular SSR fetch warning:
  - Agregar `withFetch()` a `provideHttpClient()` en `frontend/src/app/app.config.ts`

## MongoDB desde cero (Docker)
Si no tienes MongoDB corriendo o quieres iniciar limpio, ejecuta:
```bash
# 0) (Opcional) Eliminar contenedor previo si existiera
docker rm -f banco-inc-mongo 2>/dev/null || true

# 1) Crear volumen persistente (datos sobreviven reinicios)
docker volume create banco-inc-mongo-data

# 2) Descargar e iniciar Mongo 6.0 en puerto 27017
docker pull mongo:6.0
docker run -d \
  --name banco-inc-mongo \
  -p 27017:27017 \
  -v banco-inc-mongo-data:/data/db \
  mongo:6.0

# 3) Verificar que esté arriba
docker ps
# Logs (opcional):
docker logs -f banco-inc-mongo
```
Notas:
- Para reiniciar más adelante: `docker start banco-inc-mongo` / `docker stop banco-inc-mongo`.
- Si cambias el puerto, ajusta `MONGODB_URI` en `backend/.env`.

## MongoDB con Docker Compose
Si prefieres usar Docker Compose en lugar de `docker run` directo:

1) Crea `backend/docker-compose.yml` (si no existe) con este contenido mínimo:
```yaml
services:
  mongodb:
    image: mongo:6.0
    container_name: banco-inc-mongo
    ports:
      - "27017:27017"
    volumes:
      - banco-inc-mongo-data:/data/db
volumes:
  banco-inc-mongo-data:
```

2) Levantar solo MongoDB con Compose:
```bash
cd backend
# Iniciar MongoDB
docker compose up -d mongodb
# Ver estado
docker compose ps
# Ver logs
docker compose logs -f mongodb
```

3) Parar y borrar (opcional):
```bash
docker compose stop mongodb
docker compose rm -f mongodb
```

Nota: Ajusta `MONGODB_URI=mongodb://localhost:27017/banco_inc_cards` en `backend/.env` si usas el puerto por defecto 27017.

## Estructura del proyecto: ¿mismo repo o separados?
Puedes trabajar de dos formas, ambas válidas:

- Misma carpeta (Monorepo) [RECOMENDADO]
  - Estructura:
    - `backend/` → API Node/Express
    - `frontend/` → App Angular
  - Ventajas: un solo remoto Git, versiones coordinadas, onboarding simple.

- Repos separados (dos remotos)
  - `repo-backend` y `repo-frontend` independientes
  - Ventajas: ciclos de release separados, permisos por equipo.

Este README asume monorepo con `backend/` y `frontend/` en la misma raíz.

## Cómo correr ambos servicios a la vez (monorepo)
Abre dos terminales:

- Terminal 1 (Mongo + Backend):
```bash
# En la raíz del repo
cd backend
# 1) Asegura Mongo (Docker Compose o docker run)
docker compose up -d mongodb  # si usas backend/docker-compose.yml
# o: docker start banco-inc-mongo || docker run -d --name banco-inc-mongo -p 27017:27017 mongo:6.0

# 2) Levanta el backend (local)
npm install
npm run dev  # http://localhost:3000/health
```

- Terminal 2 (Frontend):
```bash
cd frontend
npm install
npm run start -- --port 4300  # http://localhost:4300
```

## Correr ambos solo con Docker Compose (opcional)
Si quieres orquestar todo con Compose, puedes crear `docker-compose.yml` en la raíz con algo similar:
```yaml
services:
  mongodb:
    image: mongo:6.0
    ports: ["27017:27017"]
    volumes:
      - banco-inc-mongo-data:/data/db

  backend:
    build: ./backend
    depends_on: [mongodb]
    env_file: ./backend/.env
    ports: ["3000:3000"]

  # Para frontend sirviendo build estático (requiere Dockerfile que haga build y exponga 80)
  frontend:
    build: ./frontend
    depends_on: [backend]
    ports: ["4300:80"]

volumes:
  banco-inc-mongo-data:
```
Comandos:
```bash
# En la raíz del repo
docker compose up -d mongodb backend  # backend (y la DB)
# y si tu Dockerfile del frontend sirve en 80
docker compose up -d frontend

# Ver estado
docker compose ps
# Logs
docker compose logs -f backend
```

## ¿Y si usas repos separados?
- Clona ambos en carpetas hermanas, por ejemplo:
  - `D:/proyectos/banco/backend`
  - `D:/proyectos/banco/frontend`
- Levanta MongoDB como arriba (Docker / Compose)
- Ejecuta backend y frontend en sus propias terminales (igual que en monorepo). Asegúrate de que el frontend apunte a `http://localhost:3000` en sus servicios/API.

## Instalación de dependencias (importante)
Ejecuta la instalación dentro de cada carpeta del proyecto:
```bash
# Backend (desde la raíz del repo)
cd backend
npm install

# Frontend (en otra terminal o luego)
cd ../frontend
npm install
```
Nota: No ejecutes `npm install` en la raíz del monorepo; hazlo dentro de `backend/` y de `frontend/` por separado.
