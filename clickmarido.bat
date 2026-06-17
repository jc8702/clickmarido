@echo off
:: ==========================================================
::   PREPARAÇÃO PARA DEPLOY - CLICK MARIDO
:: ==========================================================
echo ==========================================================
echo    PREPARAÇÃO PARA DEPLOY - CLICK MARIDO
echo ==========================================================
timeout /t 2 /nobreak >nul
echo.
echo [1/6] Instalando ferramentas necessárias...
echo -------------------------------------------
npm install -g vercel
npm install -g render-cli
echo Ferramentas instaladas com sucesso!
timeout /t 3 /nobreak >nul
echo.
echo [2/6] Configurando variáveis de ambiente...
echo -------------------------------------------
echo NEXT_PUBLIC_API_URL="https://clickmarido.onrender.com" > frontend\.env.local
echo Configure manualmente DATABASE_URL no arquivo backend/.env
echo Variáveis configuradas!
timeout /t 2 /nobreak >nul
echo.
echo [3/6] Instalando dependências do frontend...
echo -------------------------------------------
cd frontend
npm install
echo Dependências do frontend instaladas!
timeout /t 2 /nobreak >nul
echo.
echo [4/6] Instalando dependências do backend...
echo -------------------------------------------
cd ..\backend
npm install
echo Dependências do backend instaladas!
timeout /t 2 /nobreak >nubr
echo.
echo [5/6] Fazendo build do frontend...
echo -------------------------------------------
cd ..\frontend
npm run build
echo Build do frontend concluído!
timeout /t 3 /nobreak >nul
echo.
echo [5/6] Deploy do frontend no Vercel...
echo -------------------------------------------
vercel --prod
echo Deploy do frontend concluído!
timeout /t 5 /nobreak >nul
echo.
echo [6/6] Fazendo deploy do backend no Render...
echo -------------------------------------------
cd ..\backend
render deploy
echo Deploy do backend concluído!
timeout /t 5 /nobreak >nul
echo.
echo ==========================================================
echo    DEPLOY FINALIZADO COM SUCESSO!
echo    Frontend (Vercel): https://clickmarido.vercel.app
echo    Backend (Render) : https://seu-projeto.onrender.com
echo ==========================================================
pause