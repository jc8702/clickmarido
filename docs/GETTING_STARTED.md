# Getting Started

## Prerequisites

- Node.js >= 20
- npm >= 10
- PostgreSQL 15+ (or Supabase account)
- Docker (optional, for local DB)

## Local Setup

### 1. Clone & Install

```bash
git clone https://github.com/jc8702/clickmarido.git
cd clickmarido

# Install all dependencies
cd frontend && npm install && cd ../backend && npm install && cd ..
```

### 2. Environment Variables

**Backend** (`backend/.env`):

```env
DATABASE_URL=postgresql://user:password@localhost:5432/clickmarido
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
```

**Frontend** (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Database

```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

### 4. Run

```bash
# Terminal 1 - Backend
cd backend && npm run start:dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:3001
Swagger: http://localhost:3001/api
