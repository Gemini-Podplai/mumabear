#!/bin/bash

# 🤖💬 AI Instant Messenger Demo Script
# Launches the world's first AI instant messenger interface

echo "🚀 Launching AI Instant Messenger Demo"
echo "======================================"
echo "✨ World's First Complete AI Messenger"
echo "🤖 52 AI Models as Individual Contacts"
echo "💬 WhatsApp/Telegram-Style Interface"
echo "⚡ Express Mode & Real-time Chat"
echo ""

cd /home/woody/CascadeProjects/podplay-scout-alpha/frontend

echo "📦 Installing dependencies..."
if command -v bun &> /dev/null; then
    bun install
elif command -v npm &> /dev/null; then
    npm install
else
    echo "❌ Neither bun nor npm found. Please install Node.js first."
    exit 1
fi

echo ""
echo "🌟 Starting AI Instant Messenger..."
echo "📱 Opening on http://localhost:5173"
echo ""
echo "🎯 Features Available:"
echo "   • 52 AI Models with unique personalities"
echo "   • Real-time chat with typing indicators"
echo "   • Model filtering by tier and capabilities"
echo "   • WhatsApp-style interface design"
echo "   • Express Mode for <200ms responses"
echo "   • Multimodal support (text, images, code)"
echo ""
echo "🚀 Ready to revolutionize AI interaction!"
echo ""

# Start the development server
if command -v bun &> /dev/null; then
    bun run dev
else
    npm run dev
fi
