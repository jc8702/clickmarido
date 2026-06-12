#!/bin/bash

# Configurações do Banco
DB_CONTAINER_NAME="clickmarido-db"
DB_USER="clickmarido_user"
DB_NAME="clickmarido_db"
BACKUP_DIR="./backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="${BACKUP_DIR}/clickmarido_backup_${DATE}.sql.gz"

# Cria diretório de backup se não existir
mkdir -p "${BACKUP_DIR}"

echo "[$(date)] Iniciando Backup do Banco de Dados..."

# Executa o dump comprimido via Docker
docker exec -t "${DB_CONTAINER_NAME}" pg_dump -U "${DB_USER}" "${DB_NAME}" | gzip > "${BACKUP_FILE}"

if [ $? -eq 0 ]; then
  echo "[$(date)] Backup realizado com sucesso: ${BACKUP_FILE}"
else
  echo "[$(date)] ERRO: Falha ao gerar backup." >&2
  exit 1
fi

# Remove backups com mais de 7 dias
find "${BACKUP_DIR}" -name "clickmarido_backup_*.sql.gz" -mtime +7 -exec rm {} \;
echo "[$(date)] Rotatividade de arquivos antigos concluída."
