# 📡 Instructions for Remote Agent (scout.nu)

The user has set up a file transfer MCP server. Here's how you can send files to them:

## Option 1: HTTP API Upload (Simplest)

If the user's server is accessible, you can upload files directly via HTTP:

```python
import requests
import os

def send_file_to_user(file_path, description="File from scout.nu agent"):
    """Send a file to the user's MCP server via HTTP API"""
    
    # User's server endpoint (they'll provide the actual URL)
    upload_url = "http://[USER_IP]:3000/api/send-file"
    
    try:
        with open(file_path, 'rb') as file:
            files = {'file': file}
            data = {'description': description}
            
            response = requests.post(upload_url, files=files, data=data)
            
            if response.status_code == 200:
                print(f"✅ File uploaded successfully: {file_path}")
                return response.json()
            else:
                print(f"❌ Upload failed: {response.text}")
                return None
                
    except Exception as e:
        print(f"❌ Error uploading file: {e}")
        return None

# Example usage:
send_file_to_user("/home/scrapybara/project.tar.gz", "Scout.nu project files")
send_file_to_user("/home/scrapybara/backup.tar.gz", "Scout.nu backup files")
```

## Option 2: MCP Client Implementation

If you want to use the MCP protocol directly, here's a simple client:

```python
import json
import subprocess
import tempfile
import base64

def create_mcp_client_for_file_transfer():
    """Create MCP client to connect to user's file transfer server"""
    
    mcp_config = {
        "tools": [
            {
                "name": "send_file_to_user",
                "description": "Send a file to the user's transfer directory",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "file_path": {"type": "string"},
                        "description": {"type": "string"}
                    },
                    "required": ["file_path"]
                }
            }
        ]
    }
    
    def send_file_via_mcp(file_path, description="File from scout.nu"):
        """Send file using MCP protocol"""
        
        # Read and encode file
        with open(file_path, 'rb') as f:
            file_data = base64.b64encode(f.read()).decode()
        
        # Create MCP request
        mcp_request = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/call",
            "params": {
                "name": "send_file",
                "arguments": {
                    "file_path": file_path,
                    "description": description
                }
            }
        }
        
        # Send to user's MCP server (user will provide connection details)
        print(f"📤 Sending {file_path} via MCP...")
        return mcp_request
    
    return send_file_via_mcp

# Usage:
mcp_sender = create_mcp_client_for_file_transfer()
mcp_sender("/home/scrapybara/project.tar.gz", "Scout.nu project files")
```

## Option 3: Cloud Upload Helper

If direct connection isn't possible, upload to a temporary service:

```python
import requests
import json

def upload_to_transfer_service(file_path, description=""):
    """Upload file to a temporary file sharing service"""
    
    # Using file.io (temporary file sharing)
    with open(file_path, 'rb') as f:
        files = {'file': f}
        
        response = requests.post('https://file.io', files=files)
        
        if response.status_code == 200:
            result = response.json()
            download_url = result.get('link')
            
            print(f"✅ File uploaded to temporary service:")
            print(f"📎 Download URL: {download_url}")
            print(f"📄 File: {file_path}")
            print(f"📝 Description: {description}")
            
            # Create instructions for user
            instructions = {
                "service": "file.io",
                "download_url": download_url,
                "filename": file_path.split('/')[-1],
                "description": description,
                "instructions": f"curl -o downloaded_file '{download_url}'"
            }
            
            return instructions
        else:
            print(f"❌ Upload failed: {response.text}")
            return None

# Usage:
upload_to_transfer_service("/home/scrapybara/project.tar.gz", "Scout.nu project files")
upload_to_transfer_service("/home/scrapybara/backup.tar.gz", "Scout.nu backup files")
```

## User Instructions

**For the user to receive files:**

1. **Start your MCP server in HTTP mode:**
   ```bash
   cd /home/woody/Documents/podplay-mcp
   npm run start
   ```

2. **Check your local IP address:**
   ```bash
   ip addr show | grep inet
   ```

3. **Provide the remote agent with:**
   - Your IP address (if on same network) 
   - Port 3000 (default)
   - Upload endpoint: `http://[YOUR_IP]:3000/api/send-file`

4. **Receive files:**
   - Files will appear in `/home/woody/Documents/podplay-mcp/transfer/`
   - Check web interface: `http://localhost:3000`
   - List files: `curl http://localhost:3000/api/list-files`

## For Scout.nu Agent

**Choose your preferred method:**
- **HTTP API** (easiest): Use the Python requests example above
- **MCP Protocol** (standard): Use the MCP client example
- **Cloud Upload** (fallback): Use file.io or similar service

**Tell the user which method you're using and they can prepare accordingly!**
