#!/bin/bash
# 🧪 Installation Test Script
# Tests the complete installation process to ensure it works for investors

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "🧪 TESTING PODPLAY SANCTUARY INSTALLATION"
echo "========================================="
echo -e "${NC}"

# Create test directory
TEST_DIR="/tmp/podplay-test-$(date +%s)"
echo -e "${YELLOW}📁 Creating test directory: $TEST_DIR${NC}"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

# Copy project files
echo -e "${YELLOW}📋 Copying project files...${NC}"
cp -r /home/woody/CascadeProjects/podplay-scout-alpha/* .

echo -e "${BLUE}🔧 Testing installation process...${NC}"

# Test installation
chmod +x install.sh
timeout 300 ./install.sh || {
    echo -e "${RED}❌ Installation failed or timed out${NC}"
    exit 1
}

echo -e "${GREEN}✅ Installation completed successfully${NC}"

# Test backend startup
echo -e "${BLUE}🐻 Testing backend startup...${NC}"
cd backend
source .venv/bin/activate

# Test Python dependencies
python -c "import flask; print('Flask OK')" || {
    echo -e "${RED}❌ Flask import failed${NC}"
    exit 1
}

python -c "import flask_cors; print('CORS OK')" || {
    echo -e "${RED}❌ Flask-CORS import failed${NC}"
    exit 1
}

echo -e "${GREEN}✅ Backend dependencies OK${NC}"

# Start backend in background
python app.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 10

# Test backend health
echo -e "${BLUE}❤️  Testing backend health...${NC}"
HEALTH_RESPONSE=$(curl -s http://localhost:5001/api/chat/health || echo "FAILED")

if [[ "$HEALTH_RESPONSE" == *"success"* ]]; then
    echo -e "${GREEN}✅ Backend health check passed${NC}"
else
    echo -e "${RED}❌ Backend health check failed${NC}"
    echo "Response: $HEALTH_RESPONSE"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Kill backend
kill $BACKEND_PID 2>/dev/null || true

# Test frontend
echo -e "${BLUE}🎨 Testing frontend setup...${NC}"
cd ../frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${RED}❌ Frontend dependencies not installed${NC}"
    exit 1
fi

# Check if build works
npm run build || {
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
}

echo -e "${GREEN}✅ Frontend build successful${NC}"

# Cleanup
cd /
rm -rf "$TEST_DIR"

echo ""
echo -e "${GREEN}"
echo "🎉 INSTALLATION TEST PASSED!"
echo "============================"
echo -e "${NC}"
echo ""
echo -e "${BLUE}✅ All systems verified:${NC}"
echo "   🐻 Backend startup"
echo "   ❤️  Health endpoints"
echo "   🎨 Frontend build"
echo "   📦 Dependencies"
echo ""
echo -e "${GREEN}🚀 Ready for investor deployment!${NC}"
