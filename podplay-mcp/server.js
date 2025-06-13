#!/usr/bin/env node

/**
 * 📁 Podplay File Transfer MCP Server
 * A secure Model Context Protocol server for file transfers
 * Perfect for sharing files between AI assistants and local systems
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const mime = require('mime-types');
const winston = require('winston');

// Configuration
const CONFIG = {
  transferDir: process.env.TRANSFER_DIR || path.join(__dirname, 'transfer'),
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 100, // MB
  logLevel: process.env.LOG_LEVEL || 'info',
  serverName: 'podplay-file-transfer',
  version: '1.0.0'
};

// Setup logging
const logger = winston.createLogger({
  level: CONFIG.logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'file-transfer-mcp' },
  transports: [
    new winston.transports.File({ 
      filename: path.join(__dirname, 'logs', 'error.log'), 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: path.join(__dirname, 'logs', 'combined.log') 
    }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Ensure required directories exist
async function initializeDirectories() {
  try {
    await fs.ensureDir(CONFIG.transferDir);
    await fs.ensureDir(path.join(__dirname, 'logs'));
    logger.info('📁 Directories initialized', { transferDir: CONFIG.transferDir });
  } catch (error) {
    logger.error('❌ Failed to initialize directories', error);
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

function generateFileHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5');
    const stream = fs.createReadStream(filePath);
    
    stream.on('data', data => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

async function validateFile(filePath) {
  try {
    const stats = await fs.stat(filePath);
    const fileSizeMB = stats.size / (1024 * 1024);
    
    if (fileSizeMB > CONFIG.maxFileSize) {
      throw new Error(`File size (${formatFileSize(stats.size)}) exceeds maximum allowed size (${CONFIG.maxFileSize}MB)`);
    }
    
    return { stats, valid: true };
  } catch (error) {
    return { error: error.message, valid: false };
  }
}

// MCP Server Setup
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
    logger.info(`🔧 Tool called: ${name}`, { args });
    
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
    logger.error(`❌ Tool error: ${name}`, error);
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
  
  // Validate source file
  const validation = await validateFile(file_path);
  if (!validation.valid) {
    throw new Error(`Invalid source file: ${validation.error}`);
  }
  
  const filename = path.basename(file_path);
  const destinationPath = path.join(CONFIG.transferDir, filename);
  
  // Check if file already exists
  if (await fs.pathExists(destinationPath)) {
    throw new Error(`File '${filename}' already exists in transfer directory`);
  }
  
  // Copy file to transfer directory
  await fs.copy(file_path, destinationPath);
  
  // Generate file info
  const stats = await fs.stat(destinationPath);
  const hash = await generateFileHash(destinationPath);
  const mimeType = mime.lookup(filename) || 'application/octet-stream';
  
  logger.info('📤 File sent successfully', { 
    filename, 
    size: stats.size, 
    hash,
    description 
  });
  
  return {
    content: [
      {
        type: 'text',
        text: `✅ File sent successfully!

📁 **File Details:**
• Name: ${filename}
• Size: ${formatFileSize(stats.size)}
• Type: ${mimeType}
• Hash: ${hash}
• Description: ${description || 'No description provided'}

The file is now available in the transfer directory for pickup.`,
      },
    ],
  };
}

async function handleReceiveFile(args) {
  const { filename, destination } = args;
  
  const sourcePath = path.join(CONFIG.transferDir, filename);
  
  // Check if source file exists
  if (!await fs.pathExists(sourcePath)) {
    throw new Error(`File '${filename}' not found in transfer directory`);
  }
  
  // Determine destination path
  let destinationPath;
  const destStats = await fs.stat(destination).catch(() => null);
  
  if (destStats && destStats.isDirectory()) {
    destinationPath = path.join(destination, filename);
  } else {
    destinationPath = destination;
  }
  
  // Ensure destination directory exists
  await fs.ensureDir(path.dirname(destinationPath));
  
  // Copy file to destination
  await fs.copy(sourcePath, destinationPath);
  
  const stats = await fs.stat(destinationPath);
  
  logger.info('📥 File received successfully', { 
    filename, 
    destination: destinationPath, 
    size: stats.size 
  });
  
  return {
    content: [
      {
        type: 'text',
        text: `✅ File received successfully!

📁 **Transfer Details:**
• File: ${filename}
• Saved to: ${destinationPath}
• Size: ${formatFileSize(stats.size)}

The file has been copied to your specified location.`,
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
          text: '📂 Transfer directory is empty\n\nNo files are currently available for transfer.',
        },
      ],
    };
  }
  
  const fileInfos = await Promise.all(
    files.map(async (filename) => {
      const filePath = path.join(CONFIG.transferDir, filename);
      const stats = await fs.stat(filePath);
      const mimeType = mime.lookup(filename) || 'application/octet-stream';
      
      return {
        name: filename,
        size: formatFileSize(stats.size),
        modified: stats.mtime.toISOString(),
        type: mimeType,
      };
    })
  );
  
  const fileList = fileInfos
    .map(file => `• **${file.name}** (${file.size}) - ${file.type}`)
    .join('\n');
  
  logger.info('📋 Files listed', { count: files.length });
  
  return {
    content: [
      {
        type: 'text',
        text: `📂 Available Transfer Files (${files.length} total)

${fileList}

Use 'receive_file' to download any of these files or 'get_file_info' for detailed information.`,
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
  const hash = await generateFileHash(filePath);
  const mimeType = mime.lookup(filename) || 'application/octet-stream';
  
  logger.info('📊 File info retrieved', { filename });
  
  return {
    content: [
      {
        type: 'text',
        text: `📊 **File Information: ${filename}**

**Basic Details:**
• Size: ${formatFileSize(stats.size)}
• Type: ${mimeType}
• Created: ${stats.birthtime.toISOString()}
• Modified: ${stats.mtime.toISOString()}

**Security:**
• MD5 Hash: ${hash}

**Permissions:**
• Readable: ${stats.mode & parseInt('444', 8) ? 'Yes' : 'No'}
• Writable: ${stats.mode & parseInt('222', 8) ? 'Yes' : 'No'}

Ready for download with 'receive_file' command.`,
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
  
  logger.info('🗑️ File deleted', { filename, size: stats.size });
  
  return {
    content: [
      {
        type: 'text',
        text: `🗑️ **File Deleted Successfully**

• File: ${filename}
• Size: ${formatFileSize(stats.size)}
• Removed from transfer directory

The file has been permanently deleted from the transfer directory.`,
      },
    ],
  };
}

// Server Startup
async function main() {
  try {
    await initializeDirectories();
    
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    logger.info(`🚀 Podplay File Transfer MCP Server started`, {
      version: CONFIG.version,
      transferDir: CONFIG.transferDir,
      maxFileSize: `${CONFIG.maxFileSize}MB`,
    });
    
    console.error('🚀 Podplay File Transfer MCP Server is running!');
    console.error(`📁 Transfer Directory: ${CONFIG.transferDir}`);
    console.error(`📏 Max File Size: ${CONFIG.maxFileSize}MB`);
    
  } catch (error) {
    logger.error('❌ Failed to start server', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  logger.info('🛑 Server shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('🛑 Server terminated');
  process.exit(0);
});

// Start the server
if (require.main === module) {
  main().catch((error) => {
    logger.error('💥 Unhandled error', error);
    process.exit(1);
  });
}

module.exports = { server, CONFIG };
