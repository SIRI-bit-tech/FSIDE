# FSIDE Pro Setup Guide

## Complete Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+ and pip
- Docker and Docker Compose
- Git

### Frontend Setup

1. **Clone the repository:**
\`\`\`bash
git clone https://github.com/your-repo/fside-pro.git
cd fside-pro
\`\`\`

2. **Install frontend dependencies:**
\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables:**
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your configuration:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
HUGGINGFACE_API_TOKEN=your_huggingface_token_here
\`\`\`

4. **Start the frontend development server:**
\`\`\`bash
npm run dev
\`\`\`

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. **Navigate to backend directory:**
\`\`\`bash
cd backend
\`\`\`

2. **Create Python virtual environment:**
\`\`\`bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
\`\`\`

3. **Install Python dependencies:**
\`\`\`bash
pip install -r requirements.txt
\`\`\`

4. **Set up Django environment variables:**
\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` with your configuration:
\`\`\`env
DEBUG=True
SECRET_KEY=your_secret_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/fside_pro
REDIS_URL=redis://localhost:6379
HUGGINGFACE_API_TOKEN=your_huggingface_token_here
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
\`\`\`

5. **Run database migrations:**
\`\`\`bash
python manage.py migrate
\`\`\`

6. **Create superuser (optional):**
\`\`\`bash
python manage.py createsuperuser
\`\`\`

7. **Start the Django development server:**
\`\`\`bash
python manage.py runserver
\`\`\`

The backend API will be available at `http://localhost:8000`

### Docker Setup (Recommended for Production)

1. **Build and start all services:**
\`\`\`bash
make setup
make dev
\`\`\`

Or manually:
\`\`\`bash
docker-compose up --build
\`\`\`

2. **For production deployment:**
\`\`\`bash
docker-compose -f docker-compose.prod.yml up --build -d
\`\`\`

### Hugging Face Configuration

1. **Get your Hugging Face API token:**
   - Visit https://huggingface.co/settings/tokens
   - Create a new token with read permissions
   - Copy the token

2. **Add the token to your environment files:**
   - Frontend: `HUGGINGFACE_API_TOKEN` in `.env.local`
   - Backend: `HUGGINGFACE_API_TOKEN` in `backend/.env`

### Database Setup

For development, you can use SQLite (default) or PostgreSQL:

**PostgreSQL Setup:**
\`\`\`bash
# Install PostgreSQL
# Create database
createdb fside_pro

# Update DATABASE_URL in backend/.env
DATABASE_URL=postgresql://username:password@localhost:5432/fside_pro
\`\`\`

### Redis Setup (for real-time features)

**Install Redis:**
\`\`\`bash
# macOS
brew install redis
redis-server

# Ubuntu
sudo apt install redis-server
sudo systemctl start redis

# Docker
docker run -d -p 6379:6379 redis:alpine
\`\`\`

### Running the Complete System

1. **Start all services with Docker:**
\`\`\`bash
make dev
\`\`\`

2. **Or start services individually:**

Terminal 1 (Frontend):
\`\`\`bash
npm run dev
\`\`\`

Terminal 2 (Backend):
\`\`\`bash
cd backend
source venv/bin/activate
python manage.py runserver
\`\`\`

Terminal 3 (Redis - if not using Docker):
\`\`\`bash
redis-server
\`\`\`

Terminal 4 (Celery - for background tasks):
\`\`\`bash
cd backend
source venv/bin/activate
celery -A fside_backend worker -l info
\`\`\`

### Access Points

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Admin Panel:** http://localhost:3000/admin/auth
- **API Documentation:** http://localhost:8000/api/docs/
- **Django Admin:** http://localhost:8000/admin/

### Creating Admin Account

1. **Visit:** http://localhost:3000/admin/auth
2. **Click "Create Admin Account"**
3. **Fill in your details and create account**
4. **Login with your credentials**

### Troubleshooting

**Common Issues:**

1. **Port conflicts:** Change ports in docker-compose.yml or .env files
2. **Permission errors:** Ensure Docker has proper permissions
3. **Database connection:** Verify PostgreSQL is running and credentials are correct
4. **Hugging Face API:** Ensure your token is valid and has proper permissions

**Useful Commands:**

\`\`\`bash
# View logs
make logs

# Restart services
make restart

# Clean up
make clean

# Run tests
make test

# Backup database
make backup

# Restore database
make restore
\`\`\`

### Production Deployment

1. **Set up environment variables for production**
2. **Use docker-compose.prod.yml for production deployment**
3. **Configure SSL certificates**
4. **Set up monitoring and logging**
5. **Configure backup strategies**

For detailed production deployment instructions, see the deployment documentation.
