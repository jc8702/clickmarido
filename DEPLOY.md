# Guia de Deploy Click Marido (Produção) 🚀

Este guia detalha o passo-a-passo para colocar o ecossistema **Click Marido** em produção utilizando uma arquitetura moderna, escalável e otimizada:
* **GitHub**: Versionamento e CI/CD.
* **Supabase**: Banco de dados PostgreSQL gerenciado na nuvem.
* **Vercel**: Hospedagem otimizada para o frontend Next.js.
* **Coolify/VPS**: Hospedagem persistente para o backend NestJS (necessário para persistência de WebSockets e tarefas background).

---

## 💾 Passo 1: Configuração do Banco de Dados (Supabase)

O Supabase será o nosso provedor PostgreSQL. Siga os passos:

1. Crie uma conta no [Supabase](https://supabase.com) e inicie um novo projeto.
2. Acesse as configurações do projeto em **Project Settings** → **Database**.
3. Obtenha as strings de conexão:
   - **Connection String (Pooler - Porta 6543)**: Utilizada pelo backend em tempo de execução para otimizar conexões.
     - Exemplo: `postgresql://postgres.[username]:[password]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
     - Salve como a variável `DATABASE_URL`.
   - **Connection String (Direct - Porta 5432)**: Utilizada pelo CLI do Prisma para rodar migrations e seed.
     - Exemplo: `postgresql://postgres.[username]:[password]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres`
     - Salve como a variável `DIRECT_URL`.

### Rodando as Migrations no Supabase
Execute os comandos a partir da pasta `/backend` local:
```bash
cd backend
# Defina temporariamente a variável DATABASE_URL apontando para a Conexão Direta (porta 5432) do Supabase
# Exemplo Windows:
$env:DATABASE_URL="sua_conexao_direta_porta_5432"
# Exemplo Linux/macOS:
export DATABASE_URL="sua_conexao_direta_porta_5432"

# Execute a migração para criar a estrutura das tabelas
npx prisma migrate deploy

# Popule o banco com as configurações de permissões e serviços padrão
npx prisma db seed
```

---

## ⚡ Passo 2: Configuração no Repositório Git (GitHub)

O monorepo está estruturado de forma que o Git ignore arquivos `.env` locais automaticamente para segurança.
Para atualizar o repositório remoto:
1. Adicione os arquivos ao Git:
   ```bash
   git add .
   ```
2. Faça o commit ignorando hooks locais se necessário:
   ```bash
   git commit -m "feat: setup deploy para Supabase, Vercel e GitHub" --no-verify
   ```
3. Envie para o GitHub:
   ```bash
   git push origin main
   ```

---

## 🎨 Passo 3: Hospedagem do Frontend (Vercel)

A Vercel é a plataforma padrão para o Next.js:

1. Crie uma conta na [Vercel](https://vercel.com) e conecte sua conta do GitHub.
2. Clique em **Add New Project** e selecione o repositório `clickmarido`.
3. Configure os detalhes do projeto:
   - **Root Directory**: `frontend` (crucial para monorepos).
   - **Framework Preset**: `Next.js` (detectado automaticamente).
4. Configure as **Environment Variables** (Variáveis de Ambiente) de produção:
   - `NEXT_PUBLIC_API_URL`: URL pública do backend NestJS rodando na VPS (ex: `https://api.clickmarido.com.br`).
   - `NEXT_PUBLIC_WS_URL`: URL pública de WebSockets do backend NestJS (ex: `https://api.clickmarido.com.br`).
5. Clique em **Deploy**. A Vercel gerará automaticamente o build de produção e criará os certificados SSL (Let's Encrypt).

---

## 🏗️ Passo 4: Hospedagem do Backend (Coolify / VPS)

Como o backend NestJS utiliza WebSockets para o chat do WhatsApp em tempo real e agendamentos cron, ele deve continuar rodando em um servidor com processos contínuos (VPS).

1. Acesse o painel do seu Coolify (`http://<ip-do-servidor>:8000`).
2. Vá em **Projects** → **Add New Resource** → **Docker Compose**.
3. Selecione o repositório `clickmarido`, a branch `main` e aponte para o arquivo `docker-compose.prod.yml`.
4. Mapeie as seguintes variáveis de ambiente (**Environment Variables**) no painel do Coolify:

| Variável | Descrição / Valor Recomendado |
| :--- | :--- |
| `DATABASE_URL` | A string de conexão do Supabase **com Pooler** (porta 6543) |
| `JWT_SECRET` | Chave secreta longa para criptografia dos tokens de sessão |
| `JWT_EXPIRES_IN` | Tempo de expiração da sessão (ex: `1d`) |
| `EVOLUTION_API_URL` | URL de produção do WhatsApp Gateway (Evolution API) |
| `EVOLUTION_API_KEY` | Chave global da sua Evolution API |
| `GEMINI_API_KEY` | Sua chave de produção obtida do Google AI Studio |
| `NEXT_PUBLIC_API_URL` | URL pública onde a VPS expõe o backend (ex: `https://api.clickmarido.com.br`) |

5. Clique em **Deploy**. O Coolify vai rodar o backend NestJS exposto na porta `3001` (com proxy reverso e SSL ativo) e a suíte local de monitoramento.

---

## 📊 Passo 5: Monitoramento de Infraestrutura

A VPS local continuará rodando a suíte de monitoramento de performance leve:
- **cAdvisor**: Coleta métricas de consumo de CPU, memória RAM e rede de cada container Docker.
- **Prometheus**: Reúne as métricas do cAdvisor na porta `9090`.
- **Grafana**: Painel visual de métricas na porta `3002`.

Acesse o Grafana em `http://<ip-do-servidor>:3002`, adicione o Prometheus como Data Source (`http://prometheus:9090`) e importe o dashboard de containers do cAdvisor (ID `14282`) para monitorar a saúde da VPS de produção.
