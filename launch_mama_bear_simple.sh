#!/bin/bash

# 🐻 SIMPLE MAMA BEAR LAUNCHER - NO DOCKER COMPLICATIONS
echo "🚀 Starting Mama Bear SIMPLE - No Docker needed!"

# Kill any existing processes
pkill -f "python app.py" 2>/dev/null
pkill -f "code-server" 2>/dev/null

# Start Mama Bear backend
echo "🐻 Starting Mama Bear backend..."
cd /home/woody/CascadeProjects/podplay-scout-alpha/backend
source .venv/bin/activate
python app.py &
BACKEND_PID=$!

echo "⏳ Waiting for Mama Bear to initialize..."
sleep 5

# Install code-server if not installed
if ! command -v code-server &> /dev/null; then
    echo "📦 Installing code-server..."
    curl -fsSL https://code-server.dev/install.sh | sh
fi

# Start code-server with current workspace
echo "🔨 Starting Mama Bear VS Code..."
cd /home/woody/CascadeProjects/podplay-scout-alpha
code-server --bind-addr 0.0.0.0:8080 --auth none . &
CODE_SERVER_PID=$!

echo ""
echo "🎉 MAMA BEAR READY - SIMPLE MODE!"
echo ""
echo "📍 Access Points:"
echo "   🐻 Mama Bear VS Code: http://localhost:8080"
echo "   🔧 Mama Bear Backend: http://localhost:5001"
echo ""
echo "🐻 Mama Bear has full access to your codebase!"
echo "   No Docker complications - just pure AI power!"
echo ""

# Cleanup function
cleanup() {
    echo "🛑 Stopping Mama Bear..."
    kill $BACKEND_PID $CODE_SERVER_PID 2>/dev/null
    echo "✅ Stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "🐻 Press Ctrl+C to stop Mama Bear"
wait
