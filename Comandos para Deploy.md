# Comandos para Deploy

Guia completo para fazer deploy do projeto Click Marido em diferentes plataformas.

## 1. Deploy do Frontend (Next.js / React)

### Opções além do Vercel:

#### **Render (frontend ou backend)**
```bash
npm run build
render upload ./out
```

#### **Docker (Containerização)**
```bash
docker build -t clickmarido-frontend:latest .
docker push seu-usuario/clickmarido-frontend:latest
docker run -d -p 3000:3000 seu-usuario/clickmarido-frontend:latest
```

#### **Custom Web Server**
```bash
npm run start --prod
```

## 2. Deploy do Backend (Node.js / Prisma / Supabase)

#### **Build e Deploy via CLI**
```bash
npm run build
render deploy
```

#### **Docker (Containerização)**
```bash
docker build -t clickmarido-backend:latest .
docker push seu-usuario/clickmarido-backend:latest
docker run -d -p 5000:5000 --name clickmarido-backend seu-usuario/clickmarido-backend:latest
```

#### **Migrações com Prisma (Atualização do BD)**
```bash
npx prisma migrate dev --name "update-database" --preview --preview-lock-file
```

## 3. Deploy do Banco de Dados

### **Supabase**
- Painel: https://supabase.com
- Migrações com Supabase CLI:
```bash
supabase dev
```

### **PostgreSQL**
```bash
docker run -e POSTGRES_DB=seu_banco -e POSTGRES_USER=usuario -e POSTGRES_PASSWORD=senha postgres:latest
```

## 4. CI/CD (GitHub Actions / GitLab CI)

### Exemplo de pipeline - `.github/workflows/deploy.yml`
```yaml
name: Deploy Full Stack

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Setup Node
      uses: actions/setup-node@v4
      with:
        node-version: 20

    - name: Build Frontend
      run: |
        cd frontend
        npm install
        npm run build

    - name: Deploy Frontend to Vercel
      uses: vercel/actions@v1
      with:
        args: --prod
        working-directory: frontend
      env:
        VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}

    - name: Build Backend
      run: |
        cd backend
        npm install
        npm run build

    - name: Apply Prisma Migrations
      run: |
        cd backend
        npx prisma migrate deploy
      env:
        DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## 5. Ferramentas Recomendadas

| Tecnologia | Comando/Abordagem |
|-----------|-------------------|
| Vercel | `vercel --prod` |
| Render | `render deploy` |
| Docker | `docker build`, `docker run` |
| Supabase | `supabase dash` |
| Prisma | `npx prisma migrate dev` |

## 6. Deploy Rápido (Sem Docker)

### Frontend
```bash
cd frontend
npm install
npm run build
vercel --prod
```

### Backend
```bash
cd backend
npm install
npm run build
# Configure no Render ou Railway via dashboard
```

## 7. Verificação Pós-Deploy

### Testar Endpoints
```bash
curl -X GET https://seu-dominio.com/api/health
```

### Verificar Logs
```bash
vercel logs https://seu-dominio.com
```

### Status do Banco
```bash
npx prisma studio
```

---

📝 **Nota**: Sempre verifique as variáveis de ambiente (`NEXT_PUBLIC_API_URL`, `DATABASE_URL`) antes de fazer o deploy em produção.