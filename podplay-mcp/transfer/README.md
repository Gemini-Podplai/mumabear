# Transfer Directory

This directory is used by the Podplay File Transfer MCP Server to store files during transfer operations.

## How It Works

- **Send Files**: Files are copied here when using the `send_file` tool
- **Receive Files**: Files are copied from here to your specified destination
- **Temporary Storage**: This acts as a secure staging area for file transfers

## Important Notes

⚠️ **Security**: Only files explicitly sent via the MCP server will appear here  
🧹 **Cleanup**: Delete files after transfer to keep the directory clean  
📏 **Size Limits**: Files larger than the configured limit (default 100MB) will be rejected  
🔒 **Permissions**: The MCP server only has access to this specific directory  

## Directory Contents

Files in this directory are managed by the MCP server and should not be modified directly unless necessary.

To see current files, use the `list_transfer_files` tool via your AI assistant.
