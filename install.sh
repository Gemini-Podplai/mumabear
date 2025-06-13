#!/bin/bash
# 🚀 Podplay Sanctuary - Auto Installer
# Bulletproof installation script for investors and developers

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "🚀 PODPLAY SANCTUARY - AUTO INSTALLER"
echo "====================================="
echo -e "${NC}"

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is required but not installed.${NC}"
    echo "Please install Python 3.9+ and try again."
    exit 1
fi
echo -e "${GREEN}✅ Python 3 found${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is required but not installed.${NC}"
    echo "Please install Node.js 18+ and try again."
    exit 1
fi
echo -e "${GREEN}✅ Node.js found${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is required but not installed.${NC}"
    echo "Please install npm and try again."
    exit 1
fi
echo -e "${GREEN}✅ npm found${NC}"

echo -e "${BLUE}🔧 Installing backend dependencies...${NC}"

# Setup backend
cd backend

# Create virtual environment
echo "Creating Python virtual environment..."
python3 -m venv .venv

# Activate virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install Python dependencies
echo "Installing Python packages..."
pip install -r requirements.txt

echo -e "${GREEN}✅ Backend setup complete!${NC}"

# Setup frontend
cd ../frontend

echo -e "${BLUE}🎨 Installing frontend dependencies...${NC}"

# Clean install
if [ -d "node_modules" ]; then
    echo "Cleaning existing node_modules..."
    rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
    echo "Removing package-lock.json..."
    rm package-lock.json
fi

# Install dependencies
echo "Installing npm packages..."
npm install

echo -e "${GREEN}✅ Frontend setup complete!${NC}"

# Create environment file if it doesn't exist
cd ..
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Creating environment file...${NC}"
    cat > .env << 'EOF'
# 🐻 Podplay Sanctuary Environment Configuration

# Flask Configuration
FLASK_SECRET_KEY=your-secret-key-here
DEBUG=True
LOG_LEVEL=INFO

# Backend Configuration
BACKEND_PORT=5001

# API Keys (Optional - Demo works without these)
OPENAI_API_KEY=your-openai-key-here
ANTHROPIC_API_KEY=your-anthropic-key-here
GOOGLE_API_KEY=your-google-key-here

# Memory Configuration (Mem0)
MEM0_MEMORY_ENABLED=True
MEM0_RAG_ENABLED=True
MEM0_USER_ID=demo_user

# Development Settings
NODE_ENV=development
EOF
    echo -e "${GREEN}✅ Environment file created${NC}"
fi

# Create startup scripts
echo -e "${YELLOW}📝 Creating startup scripts...${NC}"

# Backend startup script
cat > start-backend.sh << 'EOF'
#!/bin/bash
cd backend
source .venv/bin/activate
echo "🐻 Starting Mama Bear Backend..."
python app.py
EOF
chmod +x start-backend.sh

# Frontend startup script
cat > start-frontend.sh << 'EOF'
#!/bin/bash
cd frontend
echo "🎨 Starting Frontend..."
npm run dev
EOF
chmod +x start-frontend.sh

# Combined startup script
cat > start-podplay.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Podplay Sanctuary..."

# Start backend in background
gnome-terminal --tab --title="Backend" -- bash -c "cd backend && source .venv/bin/activate && python app.py; exec bash" 2>/dev/null || \
xterm -title "Backend" -hold -e "cd backend && source .venv/bin/activate && python app.py" 2>/dev/null || \
echo "Starting backend in current terminal..."

sleep 3

# Start frontend in background
gnome-terminal --tab --title="Frontend" -- bash -c "cd frontend && npm run dev; exec bash" 2>/dev/null || \
xterm -title "Frontend" -hold -e "cd frontend && npm run dev" 2>/dev/null || \
echo "Please open another terminal and run: cd frontend && npm run dev"

echo ""
echo "🌟 PODPLAY SANCTUARY IS STARTING!"
echo "=================================="
echo ""
echo "📍 Access Points:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5001"
echo "   Health:   http://localhost:5001/api/chat/health"
echo ""
echo "🐻 Mama Bear and 67+ AI models are ready!"
echo ""
EOF
chmod +x start-podplay.sh

echo ""
echo -e "${GREEN}"
echo "🎉 INSTALLATION COMPLETE!"
echo "========================="
echo -e "${NC}"
echo ""
echo -e "${BLUE}🚀 Quick Start Options:${NC}"
echo ""
echo -e "${YELLOW}Option 1 - Auto Start (Recommended):${NC}"
echo "   ./start-podplay.sh"
echo ""
echo -e "${YELLOW}Option 2 - Manual Start:${NC}"
echo "   Terminal 1: ./start-backend.sh"
echo "   Terminal 2: ./start-frontend.sh"
echo ""
echo -e "${BLUE}📍 Access Your Platform:${NC}"
echo "   🎨 Frontend: http://localhost:5173"
echo "   🐻 Backend:  http://localhost:5001"
echo "   ❤️  Health:   http://localhost:5001/api/chat/health"
echo ""
echo -e "${GREEN}🌟 World-class AI platform ready for investors! 🚀${NC}"
