#!/bin/bash
# 🐻💜 Emergency VS Code Performance Fix
# Run this before rebooting to eliminate the freezing issue

echo "🚨 EMERGENCY VS CODE PERFORMANCE FIX"
echo "===================================="

# 1. Kill all VS Code processes immediately
echo "🛑 Killing all VS Code processes..."
pkill -f "code" 2>/dev/null || true
pkill -f "Code" 2>/dev/null || true
sleep 2

# 2. Clear ALL VS Code caches
echo "🧹 Clearing ALL VS Code caches..."
rm -rf ~/.vscode/CachedExtensions 2>/dev/null || true
rm -rf ~/.config/Code/CachedExtensions 2>/dev/null || true
rm -rf ~/.config/Code/CachedData 2>/dev/null || true
rm -rf ~/.config/Code/logs 2>/dev/null || true
rm -rf ~/.config/Code/User/workspaceStorage 2>/dev/null || true

# 3. Remove large files temporarily
echo "📦 Moving large files temporarily..."
cd /home/woody/CascadeProjects/podplay-scout-alpha

# Create temp directory
mkdir -p ../temp_large_files

# Move large JSON files
find . -name "*.json" -size +1M -exec mv {} ../temp_large_files/ \; 2>/dev/null || true

# Move large log files
find . -name "*.log" -size +100k -exec mv {} ../temp_large_files/ \; 2>/dev/null || true

# Move large model files
find . -name "*model*" -size +5M -exec mv {} ../temp_large_files/ \; 2>/dev/null || true

# 4. Create minimal VS Code settings
echo "⚙️ Creating ultra-minimal VS Code settings..."
mkdir -p .vscode
cat > .vscode/settings.json << 'EOF'
{
  "files.watcherExclude": {
    "**/.git/**": true,
    "**/node_modules/**": true,
    "**/.venv/**": true,
    "**/__pycache__/**": true,
    "**/dist/**": true,
    "**/build/**": true,
    "**/*.log": true,
    "**/temp_large_files/**": true
  },
  "search.exclude": {
    "**/.venv": true,
    "**/node_modules": true,
    "**/__pycache__": true,
    "**/temp_large_files": true
  },
  "python.analysis.autoImportCompletions": false,
  "python.analysis.indexing": false,
  "typescript.suggest.autoImports": false,
  "git.enabled": false,
  "extensions.autoUpdate": false,
  "telemetry.telemetryLevel": "off"
}
EOF

# 5. Final cleanup
echo "🔄 Final system cleanup..."
sync
echo 3 | sudo tee /proc/sys/vm/drop_caches > /dev/null 2>&1 || true

echo ""
echo "✅ EMERGENCY FIX COMPLETE!"
echo "========================="
echo "📁 Large files moved to: ../temp_large_files/"
echo "⚙️ Ultra-minimal VS Code settings applied"
echo "🧹 All caches cleared"
echo ""
echo "🚀 Now start VS Code with: code ."
echo "💜 It should be lightning fast now!"
