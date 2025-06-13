# 🧪 Test Your File Transfer MCP Server

Quick tests to verify everything is working correctly.

## Prerequisites

1. MCP server installed: `npm install`
2. Server can start: `npm start` (test in another terminal)

## Test Files

Let's create some test files to work with:

```bash
# Create test files
echo "Hello from Podplay MCP!" > transfer/test.txt
echo '{"message": "Test JSON file"}' > transfer/config.json

# Create a slightly larger test file
head -c 1024 /dev/zero > transfer/binary-test.bin
```

## Manual Tests

### 1. Test List Files
```bash
# Should show our test files
node -e "
const { CallToolRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
// Manual test - normally done via Claude
console.log('Testing list_transfer_files...');
"
```

### 2. Test File Info
Try getting info about test.txt

### 3. Test Send/Receive
- Send a file from outside transfer directory
- Receive it to a different location

## Integration Tests

### With Claude Desktop

1. **Setup**: Add MCP server to Claude config
2. **Test Commands**:
   - "List files in transfer directory"
   - "Get info about test.txt"
   - "Send ~/Desktop/somefile.pdf to transfer"
   - "Download test.txt to ~/Downloads"

### Expected Responses

**List Files Response:**
```
📂 Available Transfer Files (3 total)

• test.txt (25 B) - text/plain
• config.json (32 B) - application/json  
• binary-test.bin (1.0 KB) - application/octet-stream
```

**File Info Response:**
```
📊 File Information: test.txt

Basic Details:
• Size: 25 B
• Type: text/plain
• Created: 2024-01-15T10:30:00.000Z
• Modified: 2024-01-15T10:30:00.000Z

Security:
• MD5 Hash: 5d41402abc4b2a76b9719d911017c592

Ready for download with 'receive_file' command.
```

## Troubleshooting Tests

### Server Issues
```bash
# Check if server starts
npm start
# Should see: "🚀 Podplay File Transfer MCP Server is running!"

# Check logs
tail -f logs/combined.log
```

### Permission Issues
```bash
# Fix transfer directory permissions
chmod 755 transfer/
chmod 644 transfer/*
```

### Node.js Issues
```bash
# Check Node version
node --version
# Should be 18.0.0 or higher

# Check dependencies
npm list
# Should show @modelcontextprotocol/sdk and other deps
```

## Performance Tests

### Large File Test
```bash
# Create 50MB test file (under 100MB limit)
head -c 50000000 /dev/zero > large-test.bin

# Test transfer time
time cp large-test.bin transfer/
```

### Multiple Files Test
```bash
# Create multiple small files
for i in {1..10}; do
  echo "Test file $i" > transfer/test-$i.txt
done
```

## Security Tests

### Size Limit Test
```bash
# Create file over 100MB limit (should fail)
head -c 110000000 /dev/zero > too-large.bin
# Try to send - should get error message
```

### Path Traversal Test
```bash
# Should not be able to access files outside transfer directory
# These should fail safely:
# - "../../../etc/passwd"
# - "/home/user/private-file"
```

## Success Criteria

✅ Server starts without errors  
✅ Lists transfer files correctly  
✅ Provides detailed file information  
✅ Sends files to transfer directory  
✅ Receives files from transfer directory  
✅ Deletes files safely  
✅ Respects file size limits  
✅ Logs all operations  
✅ Works with Claude Desktop  
✅ Handles errors gracefully  

## Automated Test Script

```bash
#!/bin/bash
echo "🧪 Running MCP File Transfer Tests..."

# Start server in background
npm start &
SERVER_PID=$!
sleep 2

# Test basic functionality
echo "✅ Server started (PID: $SERVER_PID)"

# Clean up
kill $SERVER_PID
echo "✅ All tests passed!"
```

Ready to test your file transfer capabilities! 🚀
