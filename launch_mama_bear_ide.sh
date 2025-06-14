#!/bin/bash

# 🐻 MAMA BEAR VS CODE ENVIRONMENT LAUNCHER
echo "🚀 Starting Mama Bear Powered VS Code Environment..."

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
docker-compose -f docker-compose.mama-bear.yml down
pkill -f "python app.py"

# Start Mama Bear backend first
echo "🐻 Starting Mama Bear backend..."
cd backend && python app.py &
BACKEND_PID=$!

# Wait for backend to initialize
echo "⏳ Waiting for Mama Bear backend to initialize..."
sleep 10

# Start Docker Compose for Mama Bear IDE
echo "🔨 Building and starting Mama Bear VS Code environment..."
docker-compose -f docker-compose.mama-bear.yml up --build -d

echo ""
echo "🎉 MAMA BEAR VS CODE ENVIRONMENT READY!"
echo ""
echo "📍 Access Points:"
echo "   🐻 Mama Bear VS Code IDE: http://localhost:8080"
echo "   🔧 Mama Bear Backend API: http://localhost:5001"
echo "   🔗 MCP Bridge: localhost:8811"
echo ""
echo "🔥 MAMA BEAR SUPERPOWERS ENABLED:"
echo "   ✅ Full VS Code environment with AI integration"
echo "   ✅ Direct connection to all your models (Claude, Gemini, GPT)"
echo "   ✅ MCP client with Docker toolkit access"
echo "   ✅ GitHub integration for autonomous commits"
echo "   ✅ RAG system with all your documentation"
echo "   ✅ Autonomous building and testing capabilities"
echo "   ✅ Full control over the entire codebase"
echo ""
echo "🐻 Mama Bear now has FULL CONTROL to build your $100M app!"
echo "   She remembers EVERYTHING and won't forget like I do!"
echo ""

# Function to stop everything
cleanup() {
    echo "🛑 Stopping Mama Bear environment..."
    docker-compose -f docker-compose.mama-bear.yml down
    kill $BACKEND_PID 2>/dev/null
    echo "✅ Mama Bear environment stopped"
    exit 0
}

# Trap cleanup on script exit
trap cleanup SIGINT SIGTERM

# Keep script running
echo "🐻 Mama Bear is now in control! Press Ctrl+C to stop."
wait
