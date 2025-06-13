# 🚀 INSTRUCTIONS FOR SCOUT.NU AGENT

## Connection Details
- **Server URL**: `http://192.168.0.150:3000`
- **Upload Endpoint**: `http://192.168.0.150:3000/api/send-file`
- **Status**: ✅ Server is running and tested

## Quick Method: cURL Upload

The simplest way to send your tar.gz files:

```bash
# Upload the project files
curl -X POST http://192.168.0.150:3000/api/send-file \
     -F "file=@/home/scrapybara/project.tar.gz" \
     -F "description=Scout.nu project files - main package"

# Upload the backup files  
curl -X POST http://192.168.0.150:3000/api/send-file \
     -F "file=@/home/scrapybara/backup.tar.gz" \
     -F "description=Scout.nu backup files - secondary package"
```

## Python Method (Recommended)

If you prefer Python, here's a complete script:

```python
import requests
import os

def send_to_user(file_path, description):
    """Send file to user's MCP server"""
    
    upload_url = "http://192.168.0.150:3000/api/send-file"
    
    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        return False
    
    try:
        with open(file_path, 'rb') as file:
            files = {'file': file}
            data = {'description': description}
            
            print(f"📤 Uploading {file_path}...")
            response = requests.post(upload_url, files=files, data=data)
            
            if response.status_code == 200:
                print(f"✅ Success: {file_path} uploaded!")
                return True
            else:
                print(f"❌ Failed: {response.text}")
                return False
                
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

# Send your files
send_to_user("/home/scrapybara/project.tar.gz", "Scout.nu project files")
send_to_user("/home/scrapybara/backup.tar.gz", "Scout.nu backup files")
```

## What Happens Next

1. **You upload the files** using either method above
2. **Files appear in user's transfer directory**: `/home/woody/Documents/podplay-mcp/transfer/`
3. **User gets notified** and can download them locally
4. **User can verify** files via web interface at `http://localhost:3000`

## Verification

After uploading, you can verify with:
```bash
curl -s http://192.168.0.150:3000/api/list-files
```

## File Size Limit
- Maximum file size: **100MB per file**
- If files are larger, consider splitting or compressing further

## Ready Status
✅ User's server is running and ready to receive files
✅ Network connection tested and working  
✅ Upload endpoint confirmed functional

**Go ahead and upload your files!** 🚀
