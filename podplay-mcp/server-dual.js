#!/usr/bin/env node

/**
 * 🚀 Podplay File Transfer Server
 * Supports both MCP protocol and HTTP API for easy file sharing
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const express = require('express');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const mime = require('mime-types');

// Configuration
const CONFIG = {
  transferDir: process.env.TRANSFER_DIR || path.join(__dirname, 'transfer'),
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 100, // MB
  port: parseInt(process.env.PORT) || 3000,
  serverName: 'podplay-file-transfer',
  version: '1.0.0'
};

// Ensure required directories exist
async function initializeDirectories() {
  try {
    await fs.ensureDir(CONFIG.transferDir);
    await fs.ensureDir(path.join(__dirname, 'logs'));
    console.log('📁 Directories initialized');
  } catch (error) {
    console.error('❌ Failed to initialize directories:', error);
    process.exit(1);
  }
}

// Utility functions
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Check if we should run as HTTP server or MCP server
const runAsHttp = process.argv.includes('--http') || process.env.HTTP_MODE === 'true';

if (runAsHttp) {
  // HTTP Server Mode
  startHttpServer();
} else {
  // MCP Server Mode
  startMcpServer();
}

async function startHttpServer() {
  await initializeDirectories();
  
  const app = express();
  
  // Configure multer for file uploads
  const upload = multer({
    dest: path.join(__dirname, 'temp'),
    limits: {
      fileSize: CONFIG.maxFileSize * 1024 * 1024 // Convert MB to bytes
    }
  });
  
  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));
  
  // Serve web interface
  app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Podplay File Transfer</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .upload-area { border: 2px dashed #ccc; padding: 20px; text-align: center; margin: 20px 0; }
        .upload-area.dragover { border-color: #007cba; background-color: #f0f8ff; }
        .file-list { margin: 20px 0; }
        .file-item { display: flex; justify-content: space-between; align-items: center; padding: 10px; border: 1px solid #eee; margin: 5px 0; }
        button { padding: 8px 16px; margin: 0 5px; cursor: pointer; }
        .download { background: #007cba; color: white; border: none; }
        .delete { background: #dc3545; color: white; border: none; }
        input[type="file"] { margin: 10px 0; }
    </style>
</head>
<body>
    <h1>🚀 Podplay File Transfer</h1>
    <p>Easy file sharing via drag & drop, upload, or API</p>
    
    <div class="upload-area" id="uploadArea">
        <p>Drag & drop files here or click to upload</p>
        <input type="file" id="fileInput" multiple style="display: none;">
        <button onclick="document.getElementById('fileInput').click()">Choose Files</button>
    </div>
    
    <div class="file-list">
        <h3>Available Files</h3>
        <div id="filesList"></div>
        <button onclick="loadFiles()">Refresh List</button>
    </div>
    
    <div>
        <h3>API Examples</h3>
        <pre>
# Upload a file
curl -X POST http://localhost:${CONFIG.port}/api/send-file -F "file=@yourfile.txt"

# List files  
curl http://localhost:${CONFIG.port}/api/list-files

# Download a file
curl http://localhost:${CONFIG.port}/api/download/filename.txt -o downloaded.txt

# Delete a file
curl -X DELETE http://localhost:${CONFIG.port}/api/delete/filename.txt
        </pre>
    </div>
    
    <script>
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            uploadFiles(files);
        });
        
        fileInput.addEventListener('change', (e) => {
            uploadFiles(e.target.files);
        });
        
        async function uploadFiles(files) {
            for (let file of files) {
                const formData = new FormData();
                formData.append('file', file);
                
                try {
                    const response = await fetch('/api/send-file', {
                        method: 'POST',
                        body: formData
                    });
                    
                    if (response.ok) {
                        console.log('Uploaded:', file.name);
                        loadFiles();
                    } else {
                        console.error('Upload failed:', await response.text());
                    }
                } catch (error) {
                    console.error('Upload error:', error);
                }
            }
        }
        
        async function loadFiles() {
            try {
                const response = await fetch('/api/list-files');
                const files = await response.json();
                
                const filesList = document.getElementById('filesList');
                filesList.innerHTML = files.map(file => \`
                    <div class="file-item">
                        <span>\${file.name} (\${file.size})</span>
                        <div>
                            <button class="download" onclick="downloadFile('\${file.name}')">Download</button>
                            <button class="delete" onclick="deleteFile('\${file.name}')">Delete</button>
                        </div>
                    </div>
                \`).join('');
            } catch (error) {
                console.error('Failed to load files:', error);
            }
        }
        
        function downloadFile(filename) {
            window.open('/api/download/' + encodeURIComponent(filename));
        }
        
        async function deleteFile(filename) {
            if (confirm('Delete ' + filename + '?')) {
                try {
                    await fetch('/api/delete/' + encodeURIComponent(filename), { method: 'DELETE' });
                    loadFiles();
                } catch (error) {
                    console.error('Delete failed:', error);
                }
            }
        }
        
        // Load files on page load
        loadFiles();
    </script>
</body>
</html>
    `);
  });
  
  // API Routes
  app.post('/api/send-file', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      const filename = req.file.originalname;
      const tempPath = req.file.path;
      const finalPath = path.join(CONFIG.transferDir, filename);
      
      // Move file to transfer directory
      await fs.move(tempPath, finalPath);
      
      const stats = await fs.stat(finalPath);
      
      console.log('📤 File uploaded via HTTP:', filename);
      
      res.json({
        success: true,
        filename,
        size: formatFileSize(stats.size),
        message: 'File uploaded successfully'
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get('/api/list-files', async (req, res) => {
    try {
      const files = await fs.readdir(CONFIG.transferDir);
      
      const fileInfos = await Promise.all(
        files.map(async (filename) => {
          const filePath = path.join(CONFIG.transferDir, filename);
          const stats = await fs.stat(filePath);
          
          return {
            name: filename,
            size: formatFileSize(stats.size),
            modified: stats.mtime.toISOString(),
            type: mime.lookup(filename) || 'application/octet-stream',
          };
        })
      );
      
      res.json(fileInfos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get('/api/download/:filename', async (req, res) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join(CONFIG.transferDir, filename);
      
      if (!await fs.pathExists(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }
      
      console.log('📥 File downloaded via HTTP:', filename);
      res.download(filePath, filename);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.delete('/api/delete/:filename', async (req, res) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join(CONFIG.transferDir, filename);
      
      if (!await fs.pathExists(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }
      
      await fs.remove(filePath);
      
      console.log('🗑️ File deleted via HTTP:', filename);
      res.json({ success: true, message: 'File deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get('/api/file-info/:filename', async (req, res) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join(CONFIG.transferDir, filename);
      
      if (!await fs.pathExists(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }
      
      const stats = await fs.stat(filePath);
      
      res.json({
        name: filename,
        size: formatFileSize(stats.size),
        sizeBytes: stats.size,
        type: mime.lookup(filename) || 'application/octet-stream',
        created: stats.birthtime.toISOString(),
        modified: stats.mtime.toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.listen(CONFIG.port, () => {
    console.log(`🚀 Podplay File Transfer HTTP Server running!`);
    console.log(`🌐 Web Interface: http://localhost:${CONFIG.port}`);
    console.log(`📡 API Base URL: http://localhost:${CONFIG.port}/api`);
    console.log(`📁 Transfer Directory: ${CONFIG.transferDir}`);
    console.log(`📏 Max File Size: ${CONFIG.maxFileSize}MB`);
  });
}

async function startMcpServer() {
  await initializeDirectories();
  
  // MCP Server Setup (original implementation)
  const server = new Server(
    {
      name: CONFIG.serverName,
      version: CONFIG.version,
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );
  
  // Tool Definitions
  const TOOLS = {
    send_file: {
      name: 'send_file',
      description: 'Upload a file to the transfer directory for sharing',
      inputSchema: {
        type: 'object',
        properties: {
          file_path: {
            type: 'string',
            description: 'Full path to the file you want to send',
          },
          description: {
            type: 'string',
            description: 'Optional description of the file contents',
          },
        },
        required: ['file_path'],
      },
    },
    
    receive_file: {
      name: 'receive_file',
      description: 'Download a file from the transfer directory to your local system',
      inputSchema: {
        type: 'object',
        properties: {
          filename: {
            type: 'string',
            description: 'Name of the file in the transfer directory',
          },
          destination: {
            type: 'string',
            description: 'Where to save the file locally (directory or full path)',
          },
        },
        required: ['filename', 'destination'],
      },
    },
    
    list_transfer_files: {
      name: 'list_transfer_files',
      description: 'List all files currently available in the transfer directory',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    
    get_file_info: {
      name: 'get_file_info',
      description: 'Get detailed information about a specific file in the transfer directory',
      inputSchema: {
        type: 'object',
        properties: {
          filename: {
            type: 'string',
            description: 'Name of the file to inspect',
          },
        },
        required: ['filename'],
      },
    },
    
    delete_transfer_file: {
      name: 'delete_transfer_file',
      description: 'Remove a file from the transfer directory',
      inputSchema: {
        type: 'object',
        properties: {
          filename: {
            type: 'string',
            description: 'Name of the file to delete',
          },
        },
        required: ['filename'],
      },
    },
  };
  
  // List Tools Handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: Object.values(TOOLS),
    };
  });
  
  // Call Tool Handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      console.log(`🔧 Tool called: ${name}`);
      
      switch (name) {
        case 'send_file':
          return await handleSendFile(args);
        case 'receive_file':
          return await handleReceiveFile(args);
        case 'list_transfer_files':
          return await handleListFiles(args);
        case 'get_file_info':
          return await handleGetFileInfo(args);
        case 'delete_transfer_file':
          return await handleDeleteFile(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      console.error(`❌ Tool error: ${name}`, error);
      return {
        content: [
          {
            type: 'text',
            text: `❌ Error: ${error.message}`,
          },
        ],
      };
    }
  });
  
  // Tool Implementations
  async function handleSendFile(args) {
    const { file_path, description = '' } = args;
    
    if (!await fs.pathExists(file_path)) {
      throw new Error(`Source file not found: ${file_path}`);
    }
    
    const filename = path.basename(file_path);
    const destinationPath = path.join(CONFIG.transferDir, filename);
    
    if (await fs.pathExists(destinationPath)) {
      throw new Error(`File '${filename}' already exists in transfer directory`);
    }
    
    await fs.copy(file_path, destinationPath);
    
    const stats = await fs.stat(destinationPath);
    
    console.log('📤 File sent:', filename);
    
    return {
      content: [
        {
          type: 'text',
          text: `✅ File sent successfully!

📁 **File Details:**
• Name: ${filename}
• Size: ${formatFileSize(stats.size)}
• Description: ${description || 'No description provided'}

The file is now available in the transfer directory.`,
        },
      ],
    };
  }
  
  async function handleReceiveFile(args) {
    const { filename, destination } = args;
    
    const sourcePath = path.join(CONFIG.transferDir, filename);
    
    if (!await fs.pathExists(sourcePath)) {
      throw new Error(`File '${filename}' not found in transfer directory`);
    }
    
    let destinationPath;
    const destStats = await fs.stat(destination).catch(() => null);
    
    if (destStats && destStats.isDirectory()) {
      destinationPath = path.join(destination, filename);
    } else {
      destinationPath = destination;
    }
    
    await fs.ensureDir(path.dirname(destinationPath));
    await fs.copy(sourcePath, destinationPath);
    
    const stats = await fs.stat(destinationPath);
    
    console.log('📥 File received:', filename);
    
    return {
      content: [
        {
          type: 'text',
          text: `✅ File received successfully!

📁 **Transfer Details:**
• File: ${filename}
• Saved to: ${destinationPath}
• Size: ${formatFileSize(stats.size)}`,
        },
      ],
    };
  }
  
  async function handleListFiles(args) {
    const files = await fs.readdir(CONFIG.transferDir);
    
    if (files.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: '📂 Transfer directory is empty',
          },
        ],
      };
    }
    
    const fileInfos = await Promise.all(
      files.map(async (filename) => {
        const filePath = path.join(CONFIG.transferDir, filename);
        const stats = await fs.stat(filePath);
        
        return {
          name: filename,
          size: formatFileSize(stats.size),
        };
      })
    );
    
    const fileList = fileInfos
      .map(file => `• ${file.name} (${file.size})`)
      .join('\n');
    
    return {
      content: [
        {
          type: 'text',
          text: `📂 Available Transfer Files (${files.length} total)

${fileList}`,
        },
      ],
    };
  }
  
  async function handleGetFileInfo(args) {
    const { filename } = args;
    
    const filePath = path.join(CONFIG.transferDir, filename);
    
    if (!await fs.pathExists(filePath)) {
      throw new Error(`File '${filename}' not found in transfer directory`);
    }
    
    const stats = await fs.stat(filePath);
    const mimeType = mime.lookup(filename) || 'application/octet-stream';
    
    return {
      content: [
        {
          type: 'text',
          text: `📊 **File Information: ${filename}**

• Size: ${formatFileSize(stats.size)}
• Type: ${mimeType}
• Modified: ${stats.mtime.toISOString()}`,
        },
      ],
    };
  }
  
  async function handleDeleteFile(args) {
    const { filename } = args;
    
    const filePath = path.join(CONFIG.transferDir, filename);
    
    if (!await fs.pathExists(filePath)) {
      throw new Error(`File '${filename}' not found in transfer directory`);
    }
    
    const stats = await fs.stat(filePath);
    await fs.remove(filePath);
    
    console.log('🗑️ File deleted:', filename);
    
    return {
      content: [
        {
          type: 'text',
          text: `🗑️ **File Deleted Successfully**

• File: ${filename}
• Size: ${formatFileSize(stats.size)}`,
        },
      ],
    };
  }
  
  // Start MCP server
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.log('🚀 Podplay MCP Server started!');
  console.log(`📁 Transfer Directory: ${CONFIG.transferDir}`);
}
