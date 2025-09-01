# FSIDE Pro - Full Stack Integrated Development Environment

FSIDE Pro is an AI-powered orchestration platform that synergizes React and Django development through intelligent automation and real-time synchronization.

## 🚀 Features

- **AI-Powered Code Generation**: Generate React components and Django models from natural language descriptions
- **Real-time Collaboration**: Live editing with multiple developers, cursor tracking, and chat
- **3D API Visualization**: Interactive 3D visualization of API relationships and dependencies
- **Intelligent Debugging**: AI-powered error tracking and automated solution suggestions
- **Monaco Editor Integration**: Full-featured code editor with syntax highlighting and IntelliSense
- **Docker Deployment**: Production-ready containerized deployment with orchestration
- **Admin Dashboard**: Comprehensive system administration and monitoring

## 🏗️ Architecture

### Frontend (Next.js)
- React 18 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Monaco Editor for code editing
- Three.js for 3D visualizations
- Framer Motion for animations

### Backend (Django)
- Django REST Framework for APIs
- WebSocket support with Django Channels
- Celery for background tasks
- Redis for caching and task queues
- PostgreSQL for data persistence
- Hugging Face integration for AI features

### Infrastructure
- Docker containerization
- Nginx reverse proxy
- Kubernetes manifests for cloud deployment
- Automated backup and monitoring scripts

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for development)
- Python 3.11+ (for development)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/SIRI-bit-tech/FSIDE.git
   cd FSIDE
   \`\`\`

2. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

3. **Deploy with Docker**
   \`\`\`bash
   # Development
   make start

   # Production
   make start-prod
   \`\`\`

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Django Admin: http://localhost:8000/admin
   - API Dashboard: http://localhost:3000/api-dashboard
   - IDE: http://localhost:3000/ide
   - Admin Panel: http://localhost:3000/admin

### Default Credentials
- Username: `admin`
- Password: `admin123`

## 📖 Usage

### IDE Environment
Navigate to `/ide` to access the full development environment with:
- File explorer and project management
- Monaco code editor with syntax highlighting
- AI assistant for code generation and suggestions
- Integrated terminal
- Real-time collaboration features

### API Dashboard
Visit `/api-dashboard` to visualize and monitor your APIs:
- 3D visualization of API relationships
- Real-time performance metrics
- Endpoint monitoring and health checks
- Interactive API exploration

### Admin Panel
Access `/admin` for system administration:
- User management and permissions
- Project oversight and analytics
- System health monitoring
- Activity logs and audit trails

## 🛠️ Development

### Local Development Setup

1. **Frontend Development**
   \`\`\`bash
   npm install
   npm run dev
   \`\`\`

2. **Backend Development**
   \`\`\`bash
   cd backend
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   \`\`\`

### Available Commands

\`\`\`bash
# Build and deployment
make build          # Build all containers
make start          # Start development environment
make start-prod     # Start production environment
make stop           # Stop all services
make restart        # Restart all services

# Maintenance
make backup         # Create system backup
make restore        # Restore from backup
make monitor        # System monitoring
make clean          # Clean up containers and volumes

# Development
make migrate        # Run database migrations
make shell          # Open Django shell
make superuser      # Create Django superuser
make test           # Run tests
\`\`\`

## 🔧 Configuration

### Environment Variables

Key environment variables in `.env`:

\`\`\`env
# Database
POSTGRES_DB=fside_pro
POSTGRES_USER=fside_user
POSTGRES_PASSWORD=your_secure_password

# Django
DJANGO_SECRET_KEY=your_django_secret_key
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com

# AI Integration
HUGGINGFACE_API_KEY=your_huggingface_api_key

# URLs
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
\`\`\`

### Docker Configuration

The application uses multi-stage Docker builds and docker-compose for orchestration:
- `docker-compose.yml` - Development configuration
- `docker-compose.prod.yml` - Production overrides
- `kubernetes/` - Kubernetes manifests for cloud deployment

## 🚀 Deployment

### Docker Deployment
\`\`\`bash
# Development
./scripts/deploy.sh development

# Production
./scripts/deploy.sh production
\`\`\`

### Kubernetes Deployment
\`\`\`bash
kubectl apply -f kubernetes/
\`\`\`

### Manual Deployment
1. Build and push Docker images
2. Set up PostgreSQL and Redis
3. Configure environment variables
4. Run database migrations
5. Start services with proper orchestration

## 📊 Monitoring

### Health Checks
- Frontend: `GET /api/health`
- Backend: `GET /health/`
- System monitoring: `make monitor`

### Logging
- Application logs: `docker-compose logs -f [service]`
- System logs: Available in admin panel
- Error tracking: Integrated with AI debugging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- Documentation: [docs.fside.pro](https://docs.fside.pro)
- Issues: [GitHub Issues](https://https://github.com/SIRI-bit-tech/FSIDE/issues)
- Community: [Discord](https://discord.gg/fside-pro)
- Email: onovwionaemuesiri@gmail.com

## 🙏 Acknowledgments

- Monaco Editor for the code editing experience
- Three.js for 3D visualizations
- Hugging Face for AI model integration
- Django and Next.js communities for excellent frameworks
