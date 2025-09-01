#!/bin/bash

# FSIDE Pro Deployment Script
set -e

echo "🚀 Starting FSIDE Pro deployment..."

# Check if Docker and Docker Compose are installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env file with your configuration before running again."
    exit 1
fi

# Load environment variables
source .env

# Determine deployment type
DEPLOYMENT_TYPE=${1:-development}

echo "📦 Deployment type: $DEPLOYMENT_TYPE"

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start services
if [ "$DEPLOYMENT_TYPE" = "production" ]; then
    echo "🏗️  Building production containers..."
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache
    
    echo "🚀 Starting production services..."
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
else
    echo "🏗️  Building development containers..."
    docker-compose build --no-cache
    
    echo "🚀 Starting development services..."
    docker-compose up -d
fi

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 30

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose exec backend python manage.py migrate

# Create superuser if it doesn't exist
echo "👤 Creating Django superuser..."
docker-compose exec backend python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@fside.pro', 'admin123')
    print('Superuser created: admin/admin123')
else:
    print('Superuser already exists')
"

# Collect static files
echo "📁 Collecting static files..."
docker-compose exec backend python manage.py collectstatic --noinput

# Check service health
echo "🔍 Checking service health..."
services=("frontend" "backend" "db" "redis")

for service in "${services[@]}"; do
    if docker-compose ps $service | grep -q "Up"; then
        echo "✅ $service is running"
    else
        echo "❌ $service is not running"
        docker-compose logs $service
    fi
done

echo "🎉 FSIDE Pro deployment completed!"
echo ""
echo "📋 Service URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   Django Admin: http://localhost:8000/admin"
echo "   API Dashboard: http://localhost:3000/api-dashboard"
echo "   IDE: http://localhost:3000/ide"
echo ""
echo "🔑 Default admin credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "📊 To view logs: docker-compose logs -f [service_name]"
echo "🛑 To stop: docker-compose down"
