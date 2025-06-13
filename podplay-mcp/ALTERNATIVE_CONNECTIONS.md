# 🔗 Alternative MCP Server Connections

Since you're not using Claude Desktop, here are several ways to connect to and use your MCP file transfer server:

## 1. Direct Node.js Usage

### Start the Server
```bash
cd /home/woody/Documents/podplay-mcp
node server.js
```

### Test with MCP Inspector (Recommended)
Install the MCP Inspector for testing and development:
```bash
npm install -g @modelcontextprotocol/inspector
```

Then inspect your server:
```bash
mcp-inspector node server.js
```

This opens a web interface to test your MCP tools directly.

## 2. HTTP Wrapper

Create a simple HTTP wrapper around the MCP server:

### Install Express
```bash
npm install express cors
```

### HTTP Wrapper Script
```javascript
// http-wrapper.js
const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const TRANSFER_DIR = process.env.TRANSFER_DIR || './transfer';

// Send file endpoint
app.post('/api/send-file', async (req, res) => {
  try {
    const { filePath, description } = req.body;
    const fileName = path.basename(filePath);
    const destPath = path.join(TRANSFER_DIR, fileName);
    
    await fs.copyFile(filePath, destPath);
    res.json({ success: true, message: `File ${fileName} sent successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List files endpoint
app.get('/api/files', async (req, res) => {
  try {
    const files = await fs.readdir(TRANSFER_DIR);
    const fileDetails = await Promise.all(files.map(async (file) => {
      const filePath = path.join(TRANSFER_DIR, file);
      const stats = await fs.stat(filePath);
      return {
        name: file,
        size: stats.size,
        modified: stats.mtime
      };
    }));
    res.json(fileDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download file endpoint
app.get('/api/download/:filename', async (req, res) => {
  try {
    const filePath = path.join(TRANSFER_DIR, req.params.filename);
    res.download(filePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('MCP File Transfer HTTP API running on http://localhost:3001');
});
```

Start the HTTP wrapper:
```bash
node http-wrapper.js
```

## 3. Command Line Interface

Create a CLI tool to interact with your MCP server:

### CLI Script
```javascript
#!/usr/bin/env node
// cli.js
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const TRANSFER_DIR = process.env.TRANSFER_DIR || './transfer';

const commands = {
  send: async (filePath, description = '') => {
    const fileName = path.basename(filePath);
    const destPath = path.join(TRANSFER_DIR, fileName);
    await fs.copyFile(filePath, destPath);
    console.log(`✅ Sent: ${fileName} to transfer directory`);
  },
  
  list: async () => {
    const files = await fs.readdir(TRANSFER_DIR);
    console.log('📁 Files in transfer directory:');
    for (const file of files) {
      const stats = await fs.stat(path.join(TRANSFER_DIR, file));
      console.log(`  ${file} (${stats.size} bytes, ${stats.mtime.toISOString()})`);
    }
  },
  
  receive: async (fileName, destPath) => {
    const sourcePath = path.join(TRANSFER_DIR, fileName);
    await fs.copyFile(sourcePath, destPath);
    console.log(`✅ Received: ${fileName} to ${destPath}`);
  },
  
  info: async (fileName) => {
    const filePath = path.join(TRANSFER_DIR, fileName);
    const stats = await fs.stat(filePath);
    const content = await fs.readFile(filePath);
    const hash = crypto.createHash('md5').update(content).digest('hex');
    
    console.log(`📄 File Info: ${fileName}`);
    console.log(`  Size: ${stats.size} bytes`);
    console.log(`  Modified: ${stats.mtime.toISOString()}`);
    console.log(`  MD5: ${hash}`);
  },
  
  delete: async (fileName) => {
    const filePath = path.join(TRANSFER_DIR, fileName);
    await fs.unlink(filePath);
    console.log(`🗑️ Deleted: ${fileName}`);
  }
};

// Parse command line arguments
const [,, command, ...args] = process.argv;

if (!commands[command]) {
  console.log('Usage: node cli.js <command> [args...]');
  console.log('Commands:');
  console.log('  send <filePath> [description]');
  console.log('  list');
  console.log('  receive <fileName> <destPath>');
  console.log('  info <fileName>');
  console.log('  delete <fileName>');
  process.exit(1);
}

commands[command](...args).catch(console.error);
```

Make it executable:
```bash
chmod +x cli.js
```

Usage examples:
```bash
# Send a file
node cli.js send ./myfile.txt "Important document"

# List files
node cli.js list

# Receive a file
node cli.js receive myfile.txt ./downloads/

# Get file info
node cli.js info myfile.txt

# Delete a file
node cli.js delete myfile.txt
```

## 4. Python Integration

If you prefer Python, create a Python wrapper:

```python
# mcp_client.py
import json
import subprocess
import sys
import shutil
import os
from pathlib import Path

class MCPFileTransfer:
    def __init__(self, transfer_dir="./transfer"):
        self.transfer_dir = Path(transfer_dir)
        self.transfer_dir.mkdir(exist_ok=True)
    
    def send_file(self, file_path, description=""):
        source = Path(file_path)
        dest = self.transfer_dir / source.name
        shutil.copy2(source, dest)
        print(f"✅ Sent: {source.name} to transfer directory")
    
    def list_files(self):
        files = list(self.transfer_dir.glob("*"))
        print("📁 Files in transfer directory:")
        for file in files:
            if file.is_file():
                stat = file.stat()
                print(f"  {file.name} ({stat.st_size} bytes)")
    
    def receive_file(self, filename, dest_path):
        source = self.transfer_dir / filename
        dest = Path(dest_path)
        shutil.copy2(source, dest)
        print(f"✅ Received: {filename} to {dest}")
    
    def delete_file(self, filename):
        file_path = self.transfer_dir / filename
        file_path.unlink()
        print(f"🗑️ Deleted: {filename}")

if __name__ == "__main__":
    client = MCPFileTransfer()
    
    if len(sys.argv) < 2:
        print("Usage: python mcp_client.py <command> [args...]")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "send":
        client.send_file(sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else "")
    elif command == "list":
        client.list_files()
    elif command == "receive":
        client.receive_file(sys.argv[2], sys.argv[3])
    elif command == "delete":
        client.delete_file(sys.argv[2])
```

## 5. Web Interface

Create a simple web interface:

```html
<!DOCTYPE html>
<html>
<head>
    <title>MCP File Transfer</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        button { padding: 10px 15px; margin: 5px; background: #007cba; color: white; border: none; border-radius: 3px; cursor: pointer; }
        button:hover { background: #005a8b; }
        input[type="file"], input[type="text"] { margin: 5px; padding: 8px; width: 300px; }
        #fileList { margin-top: 10px; }
        .file-item { padding: 8px; margin: 5px 0; background: #f5f5f5; border-radius: 3px; }
    </style>
</head>
<body>
    <h1>🚀 MCP File Transfer Interface</h1>
    
    <div class="section">
        <h2>📤 Send Files</h2>
        <input type="file" id="fileInput" multiple>
        <input type="text" id="description" placeholder="Description (optional)">
        <button onclick="sendFiles()">Send Files</button>
    </div>
    
    <div class="section">
        <h2>📁 Transfer Directory</h2>
        <button onclick="listFiles()">Refresh File List</button>
        <div id="fileList"></div>
    </div>
    
    <script>
        // This would connect to your HTTP wrapper API
        // Implementation depends on your chosen backend approach
    </script>
</body>
</html>
```

## 6. Integration with Other Tools

### Integrate with VS Code
Create a VS Code extension that uses your MCP server for file transfers.

### Integrate with Electron App
Build a desktop application using Electron that provides a GUI for file transfers.

### Shell Aliases
Add convenient shell aliases to your `.bashrc` or `.zshrc`:

```bash
alias mcp-send='node /home/woody/Documents/podplay-mcp/cli.js send'
alias mcp-list='node /home/woody/Documents/podplay-mcp/cli.js list'
alias mcp-receive='node /home/woody/Documents/podplay-mcp/cli.js receive'
```

## Testing Your Setup

1. **Start the server**: `node server.js`
2. **Test basic functionality**: Use any of the methods above
3. **Check logs**: Monitor `./logs/combined.log` for activity
4. **Verify transfers**: Check files appear in `./transfer/` directory

Choose the approach that best fits your workflow! The MCP Inspector (#1) is probably the easiest to start with for testing.
