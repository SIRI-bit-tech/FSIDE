#!/bin/bash

# FSIDE Pro Monitoring Script

echo "📊 FSIDE Pro System Monitor"
echo "=========================="

# Check Docker containers status
echo "🐳 Container Status:"
docker-compose ps

echo ""
echo "💾 Resource Usage:"

# Memory usage
echo "Memory Usage:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"

echo ""
echo "💿 Disk Usage:"
df -h | grep -E "(Filesystem|/dev/)"

echo ""
echo "🌐 Network Connectivity:"

# Check if services are responding
services=(
    "http://localhost:3000|Frontend"
    "http://localhost:8000|Backend API"
    "http://localhost:8000/admin|Django Admin"
)

for service in "${services[@]}"; do
    url=$(echo $service | cut -d'|' -f1)
    name=$(echo $service | cut -d'|' -f2)
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|302"; then
        echo "✅ $name ($url) - OK"
    else
        echo "❌ $name ($url) - FAILED"
    fi
done

echo ""
echo "📋 Recent Logs (last 10 lines):"
echo "Frontend:"
docker-compose logs --tail=10 frontend

echo ""
echo "Backend:"
docker-compose logs --tail=10 backend

echo ""
echo "🔄 To view live logs: docker-compose logs -f [service_name]"
