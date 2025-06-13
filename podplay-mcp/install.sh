#!/bin/bash

# 🚀 Podplay File Transfer MCP Server Quick Install Script

echo "🚀 Installing Podplay File Transfer MCP Server..."

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Create required directories
echo "📁 Creating directories..."
mkdir -p transfer logs

# Make server executable
chmod +x server.js

echo ""
echo "✅ Installation Complete!"
echo ""
echo "🎯 Next Steps:"
echo "1. Start the server: npm start"
echo "2. Add to your AI client configuration:"
echo ""
echo '{
  "mcpServers": {
    "file-transfer": {
      "command": "node",
      "args": ["'$(pwd)'/server.js"],
      "env": {
        "TRANSFER_DIR": "'$(pwd)'/transfer"
      }
    }
  }
}'
echo ""
echo "3. Start sharing files with AI! 🎉"
echo ""
echo "📚 Examples:"
echo "• 'Send the report.pdf file to transfer'"
echo "• 'List all transfer files'"
echo "• 'Download data.csv to my Downloads folder'"
echo ""
echo "🔧 Configuration:"
echo "• Transfer Directory: $(pwd)/transfer"
echo "• Logs Directory: $(pwd)/logs"
echo "• Max File Size: 100MB (configurable)"
echo ""
