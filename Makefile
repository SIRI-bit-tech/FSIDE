.PHONY: help build start stop restart logs clean backup restore monitor test

# Default target
help:
	@echo "FSIDE Pro - Available Commands:"
	@echo "================================"
	@echo "build          - Build all Docker containers"
	@echo "start          - Start all services (development)"
	@echo "start-prod     - Start all services (production)"
	@echo "stop           - Stop all services"
	@echo "restart        - Restart all services"
	@echo "logs           - Show logs for all services"
	@echo "logs-f         - Follow logs for all services"
	@echo "clean          - Clean up containers and volumes"
	@echo "backup         - Create system backup"
	@echo "restore        - Restore from backup (usage: make restore BACKUP=backup_name)"
	@echo "monitor        - Show system status and monitoring"
	@echo "test           - Run tests"
	@echo "migrate        - Run database migrations"
	@echo "shell          - Open Django shell"
	@echo "superuser      - Create Django superuser"

# Build containers
build:
	docker-compose build --no-cache

# Start services
start:
	chmod +x scripts/deploy.sh
	./scripts/deploy.sh development

start-prod:
	chmod +x scripts/deploy.sh
	./scripts/deploy.sh production

# Stop services
stop:
	docker-compose down

# Restart services
restart: stop start

# Show logs
logs:
	docker-compose logs

logs-f:
	docker-compose logs -f

# Clean up
clean:
	docker-compose down -v
	docker system prune -f
	docker volume prune -f

# Backup
backup:
	chmod +x scripts/backup.sh
	./scripts/backup.sh

# Restore
restore:
	@if [ -z "$(BACKUP)" ]; then \
		echo "Usage: make restore BACKUP=backup_name"; \
		exit 1; \
	fi
	chmod +x scripts/restore.sh
	./scripts/restore.sh $(BACKUP)

# Monitor
monitor:
	chmod +x scripts/monitor.sh
	./scripts/monitor.sh

# Run tests
test:
	docker-compose exec backend python manage.py test
	docker-compose exec frontend npm test

# Database operations
migrate:
	docker-compose exec backend python manage.py migrate

shell:
	docker-compose exec backend python manage.py shell

superuser:
	docker-compose exec backend python manage.py createsuperuser

# Development helpers
dev-setup:
	cp .env.example .env
	@echo "Please edit .env file with your configuration"

dev-reset: clean dev-setup build start migrate superuser
	@echo "Development environment reset complete!"
