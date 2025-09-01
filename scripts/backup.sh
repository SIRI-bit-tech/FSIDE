#!/bin/bash

# FSIDE Pro Backup Script
set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="fside_pro_backup_$TIMESTAMP"

echo "💾 Starting FSIDE Pro backup..."

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
echo "🗄️  Backing up database..."
docker-compose exec -T db pg_dump -U fside_user fside_pro > "$BACKUP_DIR/${BACKUP_NAME}_database.sql"

# Backup media files
echo "📁 Backing up media files..."
docker-compose exec -T backend tar -czf - /app/media > "$BACKUP_DIR/${BACKUP_NAME}_media.tar.gz"

# Backup configuration
echo "⚙️  Backing up configuration..."
tar -czf "$BACKUP_DIR/${BACKUP_NAME}_config.tar.gz" .env docker-compose.yml nginx/

# Create backup manifest
echo "📋 Creating backup manifest..."
cat > "$BACKUP_DIR/${BACKUP_NAME}_manifest.txt" << EOF
FSIDE Pro Backup Manifest
========================
Backup Date: $(date)
Backup Name: $BACKUP_NAME

Files:
- ${BACKUP_NAME}_database.sql (PostgreSQL database dump)
- ${BACKUP_NAME}_media.tar.gz (Media files)
- ${BACKUP_NAME}_config.tar.gz (Configuration files)

Restore Instructions:
1. Stop all services: docker-compose down
2. Restore database: docker-compose exec -T db psql -U fside_user fside_pro < ${BACKUP_NAME}_database.sql
3. Restore media: docker-compose exec -T backend tar -xzf - -C / < ${BACKUP_NAME}_media.tar.gz
4. Restore config: tar -xzf ${BACKUP_NAME}_config.tar.gz
5. Start services: docker-compose up -d
EOF

echo "✅ Backup completed: $BACKUP_DIR/$BACKUP_NAME"
echo "📦 Backup size: $(du -sh $BACKUP_DIR/${BACKUP_NAME}* | awk '{sum+=$1} END {print sum "B"}')"
