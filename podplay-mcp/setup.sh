#!/bin/bash

# 🚀 Podplay File Transfer - Quick Setup Script

echo "🚀 Setting up Podplay File Transfer Server..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create directories
echo "📁 Creating directories..."
mkdir -p transfer
mkdir -p logs
mkdir -p temp

# Create simple CLI tools
echo "🛠️ Creating CLI tools..."

# Upload script
cat > upload.sh << 'EOF'
#!/bin/bash
if [ $# -eq 0 ]; then
    echo "Usage: ./upload.sh <file-path> [description]"
    exit 1
fi

FILE_PATH="$1"
DESCRIPTION="${2:-File uploaded via CLI}"

if [ ! -f "$FILE_PATH" ]; then
    echo "❌ File not found: $FILE_PATH"
    exit 1
fi

echo "📤 Uploading $FILE_PATH..."
curl -X POST http://localhost:3000/api/send-file \
     -F "file=@$FILE_PATH" \
     -F "description=$DESCRIPTION" \
     -s | jq

echo "✅ Upload complete!"
EOF

# Download script
cat > download.sh << 'EOF'
#!/bin/bash
if [ $# -eq 0 ]; then
    echo "Usage: ./download.sh <filename> [output-path]"
    exit 1
fi

FILENAME="$1"
OUTPUT_PATH="${2:-./downloaded-$FILENAME}"

echo "📥 Downloading $FILENAME..."
curl -X GET "http://localhost:3000/api/download/$FILENAME" \
     -o "$OUTPUT_PATH" \
     -s --fail

if [ $? -eq 0 ]; then
    echo "✅ Downloaded to: $OUTPUT_PATH"
else
    echo "❌ Download failed - file may not exist"
fi
EOF

# List files script
cat > list.sh << 'EOF'
#!/bin/bash
echo "📂 Available files:"
curl -s http://localhost:3000/api/list-files | jq -r '.[] | "• \(.name) (\(.size)) - \(.type)"'
EOF

# Make scripts executable
chmod +x upload.sh download.sh list.sh

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Quick Start:"
echo "1. Start server:     npm run start"
echo "2. Upload file:      ./upload.sh myfile.txt"
echo "3. List files:       ./list.sh"
echo "4. Download file:    ./download.sh myfile.txt"
echo "5. Web interface:    http://localhost:3000"
echo ""
echo "🚀 Ready to transfer files!"
