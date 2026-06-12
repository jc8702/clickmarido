# Guia de Deploy Click Marido (Produção) 🚀

Este guia detalha o passo-a-passo para colocar o ecossistema **Click Marido** em produção usando o **Coolify** e **Docker Compose**.

---

## 🏗️ Requisitos do Servidor
1. Uma VPS limpa (ex: Ubuntu 22.04 LTS, mínimo 2 Cores CPU, 4GB RAM) para suportar os containers e monitoramento.
2. **Coolify** instalado no servidor. Instale executando o comando oficial na VPS:
   ```bash
   curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
   ```

---

## ⚡ Passo 1: Configuração no Repositório Git
Mantenha os arquivos `Dockerfile` em `./backend` e `./frontend` e o arquivo `docker-compose.prod.yml` na raiz do seu repositório git. O Coolify lerá diretamente essa estrutura.

---

## 🛠️ Passo 2: Criando o Projeto no Coolify
1. Acesse o painel do seu Coolify (`http://<ip-do-servidor>:8000`).
2. Clique em **Projects** → **Add New Project**.
3. Crie um novo Environment (ex: `production`).
4. Clique em **Add New Resource** → **Docker Compose**.
5. Conecte sua conta do GitHub/Gitlab e escolha o repositório `clickmarido`.
6. Defina a branch (ex: `main`) e o caminho para o arquivo Compose: `docker-compose.prod.yml`.
7. Clique em **Save**.

---

## 🔑 Passo 3: Variáveis de Ambiente (Secrets)
No painel do Coolify, acesse a aba **Environment Variables** do recurso Docker Compose que você criou e preencha as seguintes chaves de produção:

| Variável | Valor Recomendado / Descrição |
| :--- | :--- |
| `POSTGRES_USER` | Usuário do banco de dados (ex: `clickmarido_prod`) |
| `POSTGRES_PASSWORD` | Senha forte gerada para o banco de dados |
| `POSTGRES_DB` | Nome da base de dados (ex: `clickmarido_db`) |
| `JWT_SECRET` | Chave de segurança para criptografia dos tokens de sessão |
| `JWT_EXPIRES_IN` | Tempo de expiração da sessão (ex: `1d`) |
| `GEMINI_API_KEY` | Sua chave de produção obtida do Google AI Studio |
| `EVOLUTION_API_URL` | URL de produção da Evolution API (WhatsApp gateway) |
| `EVOLUTION_API_KEY` | Chave global da sua Evolution API |
| `NEXT_PUBLIC_API_URL` | URL pública de saída do backend (ex: `https://api.clickmarido.com.br`) |

*O Coolify irá expor automaticamente os serviços do Next.js (porta 3000) e do NestJS (porta 3001) criando proxies reversos de forma segura com SSL automatizado (Let's Encrypt).*

---

## 💾 Passo 4: Backup do Banco de Dados
Mapeamos dois sistemas de segurança para backups automáticos:

### Opção A: Container db-backup (Integrado no Compose)
O container `clickmarido-db-backup` é inicializado automaticamente e executa a rotina `@daily` (meia-noite). Ele gera dumps compactados em `.sql.gz` e armazena no volume `postgres_backups` retendo apenas os últimos 7 dias de backups para evitar estouro de disco.

### Opção B: Cron Job no Host
Para salvar backups fora da rede do Docker (segurança extra), você pode agendar o script `scripts/backup-db.sh` no crontab da VPS:
1. Copie o script para o servidor.
2. Dê permissão de execução: `chmod +x backup-db.sh`.
3. Abra o crontab: `crontab -e`.
4. Adicione a linha para rodar todo dia às 03:00 da manhã:
   ```bash
   0 3 * * * /caminho/para/backup-db.sh >> /var/log/clickmarido-backup.log 2>&1
   ```

---

## 📊 Passo 5: Monitoramento e Logs

### Logs Centralizados
Todos os containers foram configurados no `docker-compose.prod.yml` com limitação rígida de logs:
```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```
Isso garante que cada container grave no máximo 3 arquivos de 10MB de logs, impedindo que logs velhos ocupem todo o armazenamento do servidor.

### Painel Grafana
1. Mapeamos o Grafana para a porta `3002` do host da VPS. Acesse `http://<ip-do-servidor>:3002`.
2. O usuário padrão é `admin` / `admin` (mude no primeiro login).
3. Adicione o Prometheus como Data Source (`http://prometheus:9090`).
4. Importe o painel do cAdvisor (ID do dashboard comum: `14282`) para monitorar o consumo de CPU, Memória RAM e Rede de cada container em tempo real.
