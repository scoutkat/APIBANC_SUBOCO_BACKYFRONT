### Monorepo: Backend + Frontend (Banco Inc)

Repo: https://github.com/scoutkat/APIBANC_SUBOCO_BACKYFRONT.git

### Requisitos
- Docker Desktop
- Git
- Node.js 18+ (solo si ejecutarás en modo local)

### Estructura
- backend/  (Node.js + Express + MongoDB)
- frontend/ (Angular)

### Clonar
```bash
git clone https://github.com/scoutkat/APIBANC_SUBOCO_BACKYFRONT.git
cd APIBANC_SUBOCO_BACKYFRONT
```

### Variables de entorno (backend/.env)
Crea backend/.env:
```bash
MONGODB_URI=mongodb://localhost:27017/banco_inc_cards
PORT=3000
NODE_ENV=development
```

### Base de datos (MongoDB con Docker)
```bash
docker run -d --name banco-inc-mongo -p 27017:27017 mongo:6.0
# Verifica: docker ps
# Logs: docker logs banco-inc-mongo
# Detener: docker stop banco-inc-mongo
# Iniciar: docker start banco-inc-mongo
```

### Backend
- Opción A: Docker
```bash
cd backend
docker build -t banco-inc-backend .
docker run -d --name banco-inc-backend --env-file .env -p 3000:3000 --link banco-inc-mongo:mongo banco-inc-backend
```

- Opción B: Local (desarrollo)
```bash
cd backend
npm install
npm run dev
```

- Verificación:
  - Health: http://localhost:3000/health
  - Swagger (si aplica): http://localhost:3000/api/docs

### Frontend
- Opción A: Docker (sirviendo build en 80)
```bash
cd frontend
docker build -t banco-inc-frontend .
docker run -d --name banco-inc-frontend -p 4300:80 banco-inc-frontend
# Si tu Dockerfile expone 4300 (dev server), usa: -p 4300:4300
```

- Opción B: Local (desarrollo)
```bash
cd frontend
npm install
npm run start -- --port 4300
```

- App: http://localhost:4300

### Endpoints principales (Backend)
- Generar número: GET /api/card/{productId}/number
- Activar tarjeta: POST /api/card/enroll
- Consultar tarjeta: GET /api/card/{cardId}
- Bloquear tarjeta: DELETE /api/card/{cardId}
- Listar tarjetas: GET /api/cards

### Flujo rápido (local + Mongo en Docker)
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

### Troubleshooting
- Puerto 3000 ocupado (Windows):
  - Ver PID: netstat -ano | findstr :3000
  - Matar: taskkill /PID <PID> /F
- Puerto 4200/4300 ocupado:
  - netstat -ano | findstr :4200 / :4300
  - taskkill /PID <PID> /F
- Mongo no responde:
  - docker ps, docker logs banco-inc-mongo
- Angular SSR fetch warning:
  - Agregar withFetch() a provideHttpClient() en frontend/src/app/app.config.ts
