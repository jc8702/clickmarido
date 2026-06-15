# Guia de Integração e Entrega Contínua (CI/CD) - ClickMarido

A arquitetura de DevOps do ClickMarido está dividida em duas grandes frentes acionadas pelo GitHub Actions: A **Integração Contínua (CI)** e o **Deployment Contínuo (CD)**.

## 🚀 Fluxo de Trabalho (Workflow)

1. **Pull Requests e Push nas branches `main` e `develop`**:
   - Dispara a pipeline de **CI**.
   - É realizado um _checkout_, _setup_ de Node, instalam-se as dependências utilizando o sistema de cache e é gerado o Prisma Client.
   - Ocorre o passo de **Lint & Format** (ESLint, Prettier, TypeScript Strict Mode).
   - Ocorre o passo de **Test** (Jest, Vitest e E2E, incluindo upload para o Codecov).
   - Ao final, é feito o **Build** da aplicação (Next.js e NestJS) e a simulação de construção das imagens Docker.
   - Se o PR passar neste crivo, o código é aceitável.

2. **Merge na branch `main`**:
   - Aciona o **CD Pipeline** (através do gatilho `workflow_run`).
   - Ocorre o **Security Scan** (Dependabot, SonarCloud, Trivy).
   - As imagens oficiais do Docker (frontend e backend) são construídas (`Build & Push`) enviando as tags com o *SHA* do commit para o GitHub Container Registry (`ghcr.io`).
   - É feito o **Deploy Automático no ambiente de Staging** conectando-se ao VPS via SSH, efetuando o pull das imagens via `docker-compose.staging.yml` e checando a saúde (*Health Check*).
   - Um **Approval Gate** (Environment) no GitHub segura a promoção para a produção. Alguém deve aprovar manualmente a transição.
   - Após aprovado, o **Deploy em Produção** inicia, realizando Blue-Green Deployment, rodando os scripts de *Health Check* e ativando um *Rollback Automático* caso haja queda do endpoint.

## 🔑 Secrets Requeridos

Para que toda essa arquitetura funcione, é obrigatório registrar as seguintes variáveis na área de Secrets do repositório no GitHub:

| Secret Name | Descrição |
| ----------- | --------- |
| `CODECOV_TOKEN` | Token do Codecov para relatórios de testes. |
| `SONAR_TOKEN` | Token do SonarCloud para análise de segurança e débitos técnicos. |
| `STAGING_HOST`, `STAGING_USER`, `STAGING_SSH_KEY` | Credenciais SSH da máquina VPS de Staging. |
| `PROD_HOST`, `PROD_USER`, `PROD_SSH_KEY` | Credenciais SSH da máquina VPS de Produção. |
| `SLACK_WEBHOOK_URL` | URL de Webhook do Slack para enviar as notificações de Status (Sucesso, Esperando Aprovação ou Falha). |
| `NEXT_PUBLIC_API_URL` | A URL de acesso ao backend que deve ser linkada ao Build do Frontend. |

## 🛡️ Environments do GitHub
Configuramos dois ambientes (Environments) na aba "Settings > Environments" do seu repositório:
- **`staging`**: Não exige aprovação.
- **`production`**: Exige *Required Reviewers* antes de deixar a pipeline do Actions prosseguir da fase de Staging para Prod.

## ⏪ Rollback

Em caso de deploy defeituoso que quebre o endpoint da aplicação de Produção, a ação *Deploy to Production* irá falhar durante o passo `Health Check`.
Quando essa etapa falha, o gatilho "Rollback on Failure" irá executar o script contido em `scripts/rollback.sh` no servidor.
Caso ocorra uma falha irreversível não detectável pelo health check, um administrador pode acessar o servidor SSH e restaurar o sistema localizando uma tag docker estável no GitHub Packages (`ghcr.io`).
