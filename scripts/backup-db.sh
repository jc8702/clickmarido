#!/bin/bash
# scripts/backup-db.sh
# Uso: ./backup-db.sh
# Dependências: pg_dump, gzip

set -e

# Configurações (Normalmente providas pelo env)
BACKUP_DIR=${BACKUP_DIR:-"/var/backups/clickmarido"}
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}
DB_USER=${DB_USER:-"postgres"}
DB_NAME=${DB_NAME:-"clickmarido"}
RETENTION_DAYS=${RETENTION_DAYS:-7}

# Senha: Para cron, configure ~/.pgpass ou passe a variável PGPASSWORD
export PGPASSWORD=${DB_PASSWORD}

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="db_backup_${TIMESTAMP}.sql.gz"
FILEPATH="${BACKUP_DIR}/${FILENAME}"

echo "Iniciando backup do banco de dados ${DB_NAME} em ${DB_HOST}..."

# Cria diretório se não existir
mkdir -p "$BACKUP_DIR"

# Executa o dump e comprime diretamente
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" --no-owner --clean | gzip > "$FILEPATH"

echo "✅ Backup finalizado com sucesso: $FILEPATH"

# Rotação de logs
echo "Limpando backups mais antigos que $RETENTION_DAYS dias..."
find "$BACKUP_DIR" -type f -name "db_backup_*.sql.gz" -mtime +$RETENTION_DAYS -exec rm -f {} \;
echo "Limpeza concluída."
