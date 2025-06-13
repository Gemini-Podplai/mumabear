# 🚀 PODPLAY SANCTUARY - QUICK START GUIDE

**World-Class AI Development Platform - Ready in 5 Minutes**

## ⚡ ONE-COMMAND INSTALL

```bash
# Clone and setup everything automatically
git clone [YOUR_REPO_URL]
cd podplay-scout-alpha
chmod +x install.sh
./install.sh
```

## 🎯 MANUAL INSTALL (If Auto-Install Fails)

### 📋 Prerequisites
- **Python 3.9+** (Required)
- **Node.js 18+** (Required)
- **Git** (Required)

### 🔧 Step 1: Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# OR .venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### 🎨 Step 2: Frontend Setup
```bash
cd frontend
npm install
# OR if you prefer:
# bun install
```

### 🔑 Step 3: Environment Setup
```bash
# Copy environment template
cp .env.example .env
# Edit .env with your API keys (optional for demo)
```

### 🚀 Step 4: Launch
```bash
# Terminal 1 - Backend
cd backend
source .venv/bin/activate
python app.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🌟 ACCESS YOUR SANCTUARY

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/api/chat/health

## 🐻 MAMA BEAR FEATURES

✅ **7 AI Variants** - Scout Commander, Research Specialist, Code Review Bear
✅ **67+ AI Models** - GPT, Claude, Gemini, and more
✅ **Express Mode** - 6x faster responses
✅ **Memory System** - Persistent conversations
✅ **Real-time Chat** - WebSocket integration
✅ **Scrapybara Powers** - Web browsing, code execution

## 🆘 TROUBLESHOOTING

**Backend won't start?**
```bash
cd backend
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

**Frontend won't start?**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Can't connect to API?**
- Check backend is running on port 5001
- Verify CORS settings in backend/app.py
- Test: `curl http://localhost:5001/api/chat/health`

## 📞 SUPPORT

If installation fails, check `mama_bear.log` for error details or contact support.

**This platform is production-ready with enterprise-grade AI capabilities!** 🚀
