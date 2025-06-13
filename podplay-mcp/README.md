# 📁 Podplay File Transfer MCP Server

A Model Context Protocol (MCP) server that enables secure file transfers between AI assistants and local systems. Perfect for sharing files with someone easily and securely.

## 🚀 Quick Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```

3. **Add to Your AI Client** (Claude Desktop, etc.)
   ```json
   {
     "mcpServers": {
       "file-transfer": {
         "command": "node",
         "args": ["/path/to/podplay-mcp/server.js"],
         "env": {
           "TRANSFER_DIR": "/path/to/transfer/folder"
         }
       }
     }
   }
   ```

## 🎯 What This Server Does

- **📤 Send Files**: Upload files to a shared transfer directory
- **📥 Receive Files**: Download files from the transfer directory  
- **📋 List Files**: See all available files in the transfer
- **🗑️ Clean Up**: Remove files after transfer
- **🔒 Secure**: Only accesses designated transfer directory
- **📊 File Info**: Get detailed information about files

## 🛠️ Available Tools

### `send_file`
Upload a file to the transfer directory
```
Parameters:
- file_path: Path to the file you want to send
- description: Optional description of the file
```

### `receive_file` 
Download a file from the transfer directory
```
Parameters:
- filename: Name of the file to receive
- destination: Where to save the file locally
```

### `list_transfer_files`
List all files available in the transfer directory
```
No parameters required
```

### `get_file_info`
Get detailed information about a specific file
```
Parameters:
- filename: Name of the file to inspect
```

### `delete_transfer_file`
Remove a file from the transfer directory
```
Parameters:
- filename: Name of the file to delete
```

## 💡 Example Usage

"Please send the report.pdf file to the transfer folder"
"List all files available for transfer"
"Download presentation.pptx to my Documents folder"
"Get information about the data.csv file"

## 📂 Directory Structure

```
/home/woody/Documents/podplay-mcp/
├── server.js              # Main MCP server
├── package.json           # Dependencies
├── transfer/              # Default transfer directory
├── logs/                  # Server logs
└── README.md             # This file
```

## 🔧 Configuration

Set these environment variables:

- `TRANSFER_DIR`: Directory for file transfers (default: ./transfer)
- `MAX_FILE_SIZE`: Maximum file size in MB (default: 100)
- `LOG_LEVEL`: Logging level (default: info)

## 🚨 Security Notes

- Only accesses the designated transfer directory
- Files are NOT automatically shared - requires explicit commands
- Supports file size limits
- Logs all transfer activities
- No network file sharing - local transfers only

## 🎁 Perfect For

- Sharing files between AI sessions
- Temporary file storage for AI processing
- Safe file transfer workflows
- Development and testing scenarios
- Collaborative AI projects

Ready to make file sharing with AI effortless! 🚀
