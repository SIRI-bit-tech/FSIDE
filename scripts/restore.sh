#!/bin/bash

# FSIDE Pro Restore Script
set -e

if [ -z "$1" ]; then
    echo "❌ Usage: $0 <backup_name>"
    echo "Available backups:"
    ls -1 ./backups/ | grep "_manifest.txt" | sed 's/_manifest.txt//'
    exit 1
fi

BACKUP_NAME=$1
BACKUP_DIR="./backups"

echo "🔄 Starting FSIDE Pro restore from backup: $BACKUP_NAME"

# Check if backup files exist
if [ ! -f "$BACKUP_DIR/${BACKUP_NAME}_database.sql" ]; then
    echo "❌ Database backup file not found: ${BACKUP_NAME}_database.sql"
    exit 1
fi

# Stop services
echo "🛑 Stopping services..."
docker-compose down

# Restore configuration
if [ -f "$BACKUP_DIR/${BACKUP_NAME}_config.tar.gz" ]; then
    echo "⚙️  Restoring configuration..."
    tar -xzf "$BACKUP_DIR/${BACKUP_NAME}_config.tar.gz"
fi

# Start database service
echo "🗄️  Starting database service..."
docker-compose up -d db
sleep 10

# Restore database
echo "📥 Restoring database..."
docker-compose exec -T db psql -U fside_user fside_pro < "$BACKUP_DIR/${BACKUP_NAME}_database.sql"

# Start all services
echo "🚀 Starting all services..."
docker-compose up -d

# Wait for services
sleep 30

# Restore media files
if [ -f "$BACKUP_DIR/${BACKUP_NAME}_media.tar.gz" ]; then
    echo "📁 Restoring media files..."
    docker-compose exec -T backend tar -xzf - -C / < "$BACKUP_DIR/${BACKUP_NAME}_media.tar.gz"
fi

echo "✅ Restore completed successfully!"
