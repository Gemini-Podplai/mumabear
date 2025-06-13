# 🎯 Claude Desktop Configuration

Add this to your Claude Desktop `claude_desktop_config.json` file:

## Location
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

## Configuration

```json
{
  "mcpServers": {
    "file-transfer": {
      "command": "node",
      "args": ["/home/woody/Documents/podplay-mcp/server.js"],
      "env": {
        "TRANSFER_DIR": "/home/woody/Documents/podplay-mcp/transfer",
        "MAX_FILE_SIZE": "100",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

## Usage Examples

Once configured, you can use these commands with Claude:

### Sending Files
- "Please send my resume.pdf to the transfer folder"
- "Upload the data.csv file for sharing"
- "Send the presentation.pptx with description 'Q4 Results'"

### Receiving Files  
- "Download config.json to my Desktop"
- "Get the report.pdf file and save it to ~/Downloads"
- "Receive all files from transfer to ./received-files/"

### Managing Files
- "List all files in the transfer directory"
- "Get information about data.csv"
- "Delete old-file.txt from transfer"

## Security Features

✅ **Sandboxed**: Only accesses designated transfer directory  
✅ **Size Limits**: Configurable maximum file size (default 100MB)  
✅ **Logging**: All operations are logged for security  
✅ **No Network**: Local transfers only, no internet exposure  
✅ **Hash Verification**: MD5 checksums for file integrity  

## Troubleshooting

### Server Won't Start
1. Check Node.js version: `node --version` (requires 18+)
2. Install dependencies: `npm install`
3. Check permissions on transfer directory

### Files Not Found
1. Verify transfer directory path
2. Check file permissions
3. Look at logs in `./logs/combined.log`

### Configuration Issues
1. Restart Claude Desktop after config changes
2. Verify JSON syntax in config file
3. Check environment variables are set correctly

## Advanced Configuration

### Custom Transfer Directory
```json
"env": {
  "TRANSFER_DIR": "/path/to/your/transfer/folder"
}
```

### Larger File Limit
```json
"env": {
  "MAX_FILE_SIZE": "500"
}
```

### Debug Logging
```json
"env": {
  "LOG_LEVEL": "debug"
}
```
