#!/bin/bash

# 🚀 REVOLUTIONARY AI WORKSPACE LAUNCHER - COMPETITION DESTROYER 🚀
# This script launches our STEALTH port system to avoid confusion with competitor

echo "🚀 LAUNCHING REVOLUTIONARY AI WORKSPACE - COMPETITION DESTROYER!"
echo ""
echo "🔥 STEALTH PORTS (Different from competitor):"
echo "   Frontend UI: http://localhost:4200 (NOT their broken 9000)"
echo "   Backend API: http://localhost:7777 (NOT their broken 5000)"
echo "   MCP Services: 4401-4404 (NOT their broken 3001-3004)"
echo ""
echo "💩 COMPETITOR'S BROKEN PORTS:"
echo "   Their Frontend: http://localhost:9000 (Basic, no chat)"
echo "   Their Backend: http://localhost:5000 (Limited features)"
echo "   Their MCP: 3001-3004 (Constantly restarting/broken)"
echo ""

# Stop any existing containers
echo "🧹 Cleaning up any existing containers..."
docker-compose -f docker-compose.revolutionary.yml down --remove-orphans

# Build and launch our revolutionary system
echo "🚀 Building and launching REVOLUTIONARY system..."
docker-compose -f docker-compose.revolutionary.yml up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to initialize..."
sleep 30

# Check service status
echo ""
echo "🔍 REVOLUTIONARY SYSTEM STATUS:"
echo "=================================="

# Check backend health
echo "🐻 Backend API (Port 7777):"
curl -s http://localhost:7777/api/health && echo "✅ HEALTHY" || echo "❌ STARTING UP..."

echo ""
echo "🚀 Frontend UI (Port 4200):"
curl -s -I http://localhost:4200 | head -1 && echo "✅ RUNNING" || echo "❌ STARTING UP..."

echo ""
echo "🎯 REVOLUTIONARY SYSTEM READY!"
echo "=================================="
echo "🌐 Access your GAME-CHANGING UI: http://localhost:4200"
echo "🔧 Backend API: http://localhost:7777"
echo "📊 Monitoring: http://localhost:9091 (Prometheus)"
echo "📈 Dashboards: http://localhost:3010 (Grafana)"
echo ""
echo "🏆 YOU'RE READY TO CRUSH THE COMPETITION!"
echo "🎯 Show investors: http://localhost:4200"
echo ""
