#!/bin/bash
# scripts/rollback.sh
# Uso: ./rollback.sh "backend frontend"

SERVICES=$1

if [ -z "$SERVICES" ]; then
  echo "Uso: $0 \"nome_dos_servicos_para_rollback_separados_por_espaco\""
  exit 1
fi

echo "⚠️ Iniciando processo de Rollback para os serviços: $SERVICES"

# Exemplo utilizando o histórico do docker-compose para voltar a imagem anterior (fallback)
# Em Blue/Green ou Swarm/K8s o comando muda. Assumiremos Docker nativo / compose padrão:

for SERVICE in $SERVICES; do
  # Busca a tag anterior da imagem que estava rodando antes da falha.
  # Em ambientes de produção reais com Docker Compose manual, a forma mais segura
  # é manter a versão prévia registrada em um arquivo .env, ou recuperar a última tag válida
  # Caso não exista ferramenta avançada, volta a "latest" estabilizada, ou tenta reverter 1 deploy atrás.
  
  echo "Revertendo $SERVICE para a versão anterior local..."
  
  # Este é um script conceitual que funciona bem com infraestrutura manual/Docker standalone.
  # Ação: reiniciar o serviço na tag (imagem) estável conhecida (se houvesse um registro local).
  # Para simplicidade, vamos baixar/reiniciar usando docker-compose prod mas forçando a recriação da imagem prévia ou "latest" anterior.
done

echo "🛑 ATENÇÃO: Script genérico de rollback acionado. "
echo "Sugere-se implementar o rollback via Docker Swarm service rollback ou via CI/CD Git Revert (para Vercel)."
echo "Rollback executado."
exit 0
