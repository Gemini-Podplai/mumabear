#!/bin/bash

# 🚀 Revolutionary Workspace Launcher
# Starts both backend MCP API and frontend React app

echo "🚀 Starting Revolutionary Workspace System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${RED}Port $1 is already in use${NC}"
        return 1
    else
        return 0
    fi
}

# Kill any existing processes on our ports
echo -e "${BLUE}🧹 Cleaning up existing processes...${NC}"
pkill -f "uvicorn.*mcp_api_server" 2>/dev/null || true
pkill -f "vite.*frontend" 2>/dev/null || true
sleep 2

# Start Backend API Server
echo -e "${PURPLE}🧠 Starting MCP + Agentic RAG Backend API...${NC}"
cd backend

# Install Python dependencies if needed
if [ ! -f ".venv/bin/activate" ]; then
    echo -e "${BLUE}Creating Python virtual environment...${NC}"
    python3 -m venv .venv
fi

source .venv/bin/activate

# Install dependencies
pip install -q fastapi uvicorn pydantic python-multipart

# Start the API server in background
echo -e "${GREEN}🚀 Launching backend on http://localhost:8000${NC}"
cd api
python -m uvicorn mcp_api_server:app --host 0.0.0.0 --port 8000 --reload > ../backend_mcp.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
echo -e "${BLUE}⏳ Waiting for backend to initialize...${NC}"
sleep 5

# Check if backend started successfully
if check_port 8000; then
    echo -e "${RED}❌ Backend failed to start on port 8000${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Backend API running on http://localhost:8000${NC}"
fi

# Start Frontend React App
cd ../../frontend
echo -e "${PURPLE}🎨 Starting Revolutionary Workspace Frontend...${NC}"

# Install Node dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Installing Node.js dependencies...${NC}"
    npm install
fi

# Start the frontend
echo -e "${GREEN}🚀 Launching frontend on http://localhost:5173${NC}"
npm run dev > ../frontend_dev.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start
echo -e "${BLUE}⏳ Waiting for frontend to initialize...${NC}"
sleep 8

# Check if frontend started successfully
if check_port 5173; then
    echo -e "${RED}❌ Frontend failed to start on port 5173${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
else
    echo -e "${GREEN}✅ Frontend running on http://localhost:5173${NC}"
fi

echo ""
echo -e "${PURPLE}🎉 REVOLUTIONARY WORKSPACE IS READY! 🎉${NC}"
echo ""
echo -e "${GREEN}🌐 Frontend: http://localhost:5173${NC}"
echo -e "${GREEN}🧠 Backend API: http://localhost:8000${NC}"
echo -e "${GREEN}📊 API Docs: http://localhost:8000/docs${NC}"
echo ""
echo -e "${BLUE}Features Available:${NC}"
echo "  • 🧩 Draggable puzzle-piece panels"
echo "  • 🧠 MCP + Agentic RAG with 5 intelligence levels"
echo "  • 🚀 Monaco Editor integration"
echo "  • 🌐 MCP Browser tools"
echo "  • 🎨 AI-powered media creation"
echo "  • 🔍 Enhanced web search"
echo "  • 💡 Autonomous context retrieval"
echo "  • 🎯 Cross-session learning"
echo ""
echo -e "${PURPLE}Press Ctrl+C to stop all services${NC}"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${BLUE}🛑 Shutting down Revolutionary Workspace...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    pkill -f "uvicorn.*mcp_api_server" 2>/dev/null || true
    pkill -f "vite.*frontend" 2>/dev/null || true
    echo -e "${GREEN}✅ All services stopped${NC}"
    exit 0
}

# Set trap to cleanup on Ctrl+C
trap cleanup SIGINT SIGTERM

# Keep script running and show logs
echo -e "${BLUE}📋 Showing live logs (Ctrl+C to stop):${NC}"
echo ""

# Wait for user interrupt
while true; do
    sleep 1
done
