#!/bin/bash

# 🚀 Podplay File Transfer - Setup for Remote Agent

echo "🌐 Setting up file transfer for remote agent..."
echo ""

# Start the server
echo "📡 Starting file transfer server..."

# Kill any existing server on port 3000
pkill -f "node.*server.*3000" 2>/dev/null || true

# Start server in background
cd /home/woody/Documents/podplay-mcp
nohup node server-dual.js --http > server.log 2>&1 &
SERVER_PID=$!

sleep 2

# Check if server started
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Server started successfully (PID: $SERVER_PID)"
else
    echo "❌ Failed to start server. Check server.log for errors"
    exit 1
fi

echo ""
echo "🌍 Network Information:"
echo "===================="

# Get local IP addresses
echo "📍 Local IP addresses:"
ip addr show | grep "inet " | grep -v "127.0.0.1" | awk '{print "   " $2}' | cut -d'/' -f1

echo ""
echo "🔗 Connection Details for Remote Agent:"
echo "======================================"

# Get the main IP (usually the first non-localhost)
LOCAL_IP=$(ip route get 1.1.1.1 | grep -oP 'src \K\S+' 2>/dev/null || echo "localhost")

echo "Server URL: http://$LOCAL_IP:3000"
echo "Upload API: http://$LOCAL_IP:3000/api/send-file"
echo "List API:   http://$LOCAL_IP:3000/api/list-files"
echo "Download:   http://$LOCAL_IP:3000/api/download/[filename]"

echo ""
echo "📋 Instructions for Scout.nu Agent:"
echo "=================================="
echo "Send this information to your remote agent:"
echo ""
echo "Upload Command:"
echo "curl -X POST http://$LOCAL_IP:3000/api/send-file \\"
echo "     -F \"file=@/home/scrapybara/project.tar.gz\" \\"
echo "     -F \"description=Scout.nu project files\""
echo ""
echo "Or use the Python script in AGENT_INSTRUCTIONS.md"

echo ""
echo "📂 Transfer Directory: /home/woody/Documents/podplay-mcp/transfer/"
echo "🌐 Web Interface: http://localhost:3000"
echo "📊 Server Logs: /home/woody/Documents/podplay-mcp/server.log"

echo ""
echo "🚀 Ready to receive files from scout.nu agent!"
echo ""
echo "Commands:"
echo "  Stop server: pkill -f 'node.*server.*3000'"
echo "  View logs:   tail -f /home/woody/Documents/podplay-mcp/server.log"
echo "  List files:  ls -la /home/woody/Documents/podplay-mcp/transfer/"

# Test the server
echo ""
echo "🧪 Testing server..."
TEST_RESPONSE=$(curl -s http://localhost:3000/api/list-files)
if [[ $? -eq 0 ]]; then
    echo "✅ Server is responding correctly"
else
    echo "❌ Server test failed"
fi

echo ""
echo "📋 Copy this information to send to the scout.nu agent:"
echo "======================================================"
echo "SERVER_URL=http://$LOCAL_IP:3000"
echo "UPLOAD_ENDPOINT=http://$LOCAL_IP:3000/api/send-file"
