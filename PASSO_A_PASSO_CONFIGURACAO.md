# 🚀 Guia Passo a Passo de Configuração (100% Vercel + Neon)

Este guia foi feito para você configurar toda a infraestrutura do ClickMarido sem precisar tocar em código, usando **apenas Vercel, Neon e GitHub**.

---

## Passo 1: Configurar o Banco de Dados (Neon)

O Neon vai guardar todos os dados do seu sistema (clientes, orçamentos, etc.).

1. Acesse [neon.tech](https://neon.tech) e crie uma conta (pode usar o seu login do Google).
2. Na tela inicial, clique no botão **"New Project"** (Novo Projeto).
3. Dê um nome para o projeto, por exemplo: `clickmarido`.
4. Escolha a região mais próxima de você (ex: `US East` ou `São Paulo`, se disponível).
5. Clique em **"Create Project"**.
6. Na tela seguinte, você verá uma caixa chamada **"Connection Details"**.
7. Nela, haverá um link que começa com `postgresql://...`.
8. Clique no botão de copiar **"Copy"**. Cole isso num bloco de notas, você vai precisar desse texto! 
   *(Esta é a sua **DATABASE_URL** e também a sua **DIRECT_URL**).*

---

## Passo 2: Configurar o "Cérebro" do Sistema (Backend na Vercel)

A Vercel vai hospedar todo o sistema (dividido em 2 partes). Primeiro, a inteligência (API).

1. Acesse [vercel.com](https://vercel.com) e faça login com o seu GitHub.
2. Clique no botão preto **"Add New"** e escolha **"Project"**.
3. Na lista de repositórios do seu GitHub, ache o **ClickMarido** e clique no botão **"Import"**.
4. Na tela de configuração que abrir:
   * **Project Name:** Mude para `clickmarido-backend`.
   * **Framework Preset:** Deixe a Vercel detectar automaticamente (Node.js ou Other).
   * **Root Directory:** Clique no botão "Edit" ao lado, selecione a pasta **`backend`** e clique em "Continue".
5. Abra a seção **"Environment Variables"** (Variáveis de Ambiente) e adicione:
   * Nome: `DATABASE_URL` | Valor: *Cole aquele link do Neon do Passo 1*
   * Nome: `DIRECT_URL` | Valor: *Cole o mesmo link do Neon do Passo 1*
   * Nome: `JWT_SECRET` | Valor: *Escreva qualquer texto longo e aleatório (ex: `SenhaSeguraApi123!@#`)*
6. Clique no botão azul **"Deploy"**.
7. Aguarde terminar. A Vercel vai te dar o link oficial da API (ex: `https://clickmarido-backend.vercel.app`). Guarde esse link no bloco de notas!

---

## Passo 3: Configurar a "Cara" do Sistema (Frontend na Vercel)

Agora vamos configurar a parte visual (o site em si).

1. Volte para o painel principal da [Vercel](https://vercel.com).
2. Novamente, clique no botão preto **"Add New"** e escolha **"Project"**.
3. Escolha o mesmo repositório do **ClickMarido** e clique em **"Import"**.
4. Na tela de configuração que abrir:
   * **Project Name:** Deixe como `clickmarido-frontend` (ou só `clickmarido`).
   * **Framework Preset:** Certifique-se que está como **Next.js**.
   * **Root Directory:** Clique no botão "Edit", selecione a pasta **`frontend`** e clique em "Continue".
5. Abra a seção **"Environment Variables"** (Variáveis de Ambiente) e adicione:
   * Nome: `NEXT_PUBLIC_API_URL` | Valor: `[COLE_AQUI_O_LINK_DO_BACKEND_DO_PASSO_2]/api`
     *(Exemplo: `https://clickmarido-backend.vercel.app/api`. Não esqueça do `/api` no final)*
   * Nome: `NEXTAUTH_SECRET` | Valor: *Escreva outro texto longo e aleatório*
6. Clique no botão azul **"Deploy"**.
7. Aguarde os confetes na tela! Agora você tem o link oficial do seu site!

---

## Passo 4: Conectar o GitHub ao Banco (Para o sistema atualizar sozinho)

Para que toda vez que houver código novo o Banco de Dados se ajuste automaticamente, o GitHub precisa das chaves do Neon.

1. Vá na página do seu repositório do **ClickMarido no GitHub**.
2. Clique na aba **"Settings"** (ícone de engrenagem no topo).
3. No menu lateral esquerdo, desça até **"Security"** -> **"Secrets and variables"** e clique em **"Actions"**.
4. Clique no botão verde **"New repository secret"**.
5. Adicione os links do Neon que você guardou no Passo 1:
   * Nome: `DATABASE_URL` | Valor: *Cole o link do Neon* → Clique em Add Secret.
   * Nome: `DIRECT_URL` | Valor: *Cole o mesmo link do Neon* → Clique em Add Secret.

🎉 **PRONTO!** Seus serviços estão todos interligados em uma única infraestrutura enxuta (Vercel + Neon), exatamente como você pediu. Mãos à obra!
