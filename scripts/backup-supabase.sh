#!/bin/bash
set -euo pipefail

# =====================================================
# Supabase / PostgreSQL Backup Script
# - Dump via pg_dump (direct connection, port 5432)
# - Upload to S3-compatible storage
# - Retention: 30 days
# - CI: Can be triggered via GitHub Actions cron
# =====================================================

# Configuration (override via environment or .env)
BACKUP_DIR="${BACKUP_DIR:-./backups}"
S3_BUCKET="${S3_BUCKET:-clickmarido-db-backups}"
S3_PREFIX="${S3_PREFIX:-daily}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

DB_URL="${DIRECT_URL:-${DATABASE_URL}}"
DB_NAME="clickmarido_db"

DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="${BACKUP_DIR}/clickmarido_${DATE}.sql.gz"
LATEST_LINK="${BACKUP_DIR}/clickmarido_latest.sql.gz"

# S3 paths
S3_PATH="s3://${S3_BUCKET}/${S3_PREFIX}/$(basename ${BACKUP_FILE})"
S3_LATEST_PATH="s3://${S3_BUCKET}/${S3_PREFIX}/clickmarido_latest.sql.gz"

mkdir -p "${BACKUP_DIR}"

echo "[$(date)] Starting Supabase backup..."

if [ -z "${DB_URL}" ]; then
  echo "[$(date)] ERROR: DATABASE_URL or DIRECT_URL not set" >&2
  exit 1
fi

# Dump database
pg_dump "${DB_URL}" \
  --no-owner \
  --no-acl \
  --compress=9 \
  --file="${BACKUP_FILE}"

echo "[$(date)] Backup created: ${BACKUP_FILE} ($(du -h "${BACKUP_FILE}" | cut -f1))"

# Update latest symlink
ln -sf "${BACKUP_FILE}" "${LATEST_LINK}"

# Upload to S3
if command -v aws &>/dev/null && [ -n "${AWS_ACCESS_KEY_ID:-}" ]; then
  echo "[$(date)] Uploading to S3..."
  aws s3 cp "${BACKUP_FILE}" "${S3_PATH}"

  # Upload latest pointer
  aws s3 cp "${BACKUP_FILE}" "${S3_LATEST_PATH}"

  # Clean old backups from S3 (older than RETENTION_DAYS)
  echo "[$(date)] Cleaning S3 backups older than ${RETENTION_DAYS} days..."
  aws s3 ls "s3://${S3_BUCKET}/${S3_PREFIX}/" | while read -r line; do
    file_date=$(echo "$line" | awk '{print $1" "$2}')
    file_name=$(echo "$line" | awk '{print $4}')
    if [ -n "$file_name" ]; then
      file_epoch=$(date -d "$file_date" +%s 2>/dev/null || echo 0)
      cutoff_epoch=$(date -d "-${RETENTION_DAYS} days" +%s)
      if [ "$file_epoch" -lt "$cutoff_epoch" ] 2>/dev/null; then
        aws s3 rm "s3://${S3_BUCKET}/${S3_PREFIX}/${file_name}"
        echo "[$(date)] Deleted old backup: ${file_name}"
      fi
    fi
  done
fi

# Clean local old backups
find "${BACKUP_DIR}" -name "clickmarido_*.sql.gz" -mtime +"${RETENTION_DAYS}" -exec rm {} \;
echo "[$(date)] Local cleanup complete (retention: ${RETENTION_DAYS} days)"

echo "[$(date)] Backup completed successfully"
