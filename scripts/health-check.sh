#!/bin/bash
# scripts/health-check.sh
# Uso: ./health-check.sh "https://api.domain.com/health"

URL=$1
MAX_RETRIES=12
RETRY_INTERVAL=5

if [ -z "$URL" ]; then
  echo "Uso: $0 <URL_DO_HEALTH_CHECK>"
  exit 1
fi

echo "Iniciando Health Check para $URL..."

for i in $(seq 1 $MAX_RETRIES); do
  # Tenta obter o status HTTP (suprime saída normal, apenas pega o código)
  HTTP_STATUS=$(curl -o /dev/null -s -w "%{http_code}\n" "$URL")
  
  if [ "$HTTP_STATUS" -eq 200 ] || [ "$HTTP_STATUS" -eq 204 ]; then
    echo "✅ Health check passou! (Status: $HTTP_STATUS)"
    exit 0
  else
    echo "⚠️ Tentativa $i de $MAX_RETRIES: Status $HTTP_STATUS. Retentando em $RETRY_INTERVAL segundos..."
    sleep $RETRY_INTERVAL
  fi
done

echo "❌ Falha no health check após $MAX_RETRIES tentativas. A aplicação não respondeu com sucesso na porta/URL."
exit 1
