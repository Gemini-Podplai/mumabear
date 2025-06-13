#!/usr/bin/env python3

"""
🤖 Remote Agent File Sender - Scout.nu Compatible
This is what the scout.nu agent would run to send files to you
"""

import requests
import os
import sys
import json
from pathlib import Path

class RemoteFileSender:
    def __init__(self, server_url="http://localhost:3000"):
        self.server_url = server_url.rstrip('/')
        self.upload_endpoint = f"{self.server_url}/api/send-file"
        self.list_endpoint = f"{self.server_url}/api/list-files"
        
    def send_file(self, file_path, description="File from remote agent"):
        """Send a file to the user's MCP server"""
        
        if not os.path.exists(file_path):
            print(f"❌ File not found: {file_path}")
            return False
            
        file_size = os.path.getsize(file_path)
        print(f"📤 Sending file: {file_path}")
        print(f"   Size: {self._format_size(file_size)}")
        print(f"   To: {self.upload_endpoint}")
        
        try:
            with open(file_path, 'rb') as file:
                files = {'file': (os.path.basename(file_path), file)}
                data = {'description': description}
                
                response = requests.post(
                    self.upload_endpoint, 
                    files=files, 
                    data=data,
                    timeout=30
                )
                
                if response.status_code == 200:
                    result = response.json()
                    print(f"✅ File uploaded successfully!")
                    print(f"   Response: {result.get('message', 'Success')}")
                    return True
                else:
                    print(f"❌ Upload failed: {response.status_code}")
                    print(f"   Error: {response.text}")
                    return False
                    
        except requests.exceptions.RequestException as e:
            print(f"❌ Network error: {e}")
            return False
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            return False
    
    def list_remote_files(self):
        """List files available on the user's server"""
        try:
            response = requests.get(self.list_endpoint, timeout=10)
            if response.status_code == 200:
                files = response.json()
                print(f"📂 Files on remote server ({len(files)} total):")
                for file_info in files:
                    print(f"   • {file_info['name']} ({file_info['size']})")
                return files
            else:
                print(f"❌ Failed to list files: {response.status_code}")
                return []
        except Exception as e:
            print(f"❌ Error listing files: {e}")
            return []
    
    def _format_size(self, bytes_size):
        """Format file size in human readable format"""
        for unit in ['B', 'KB', 'MB', 'GB']:
            if bytes_size < 1024.0:
                return f"{bytes_size:.1f} {unit}"
            bytes_size /= 1024.0
        return f"{bytes_size:.1f} TB"

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 remote_sender.py <server_url> [file1] [file2] ...")
        print("Example: python3 remote_sender.py http://192.168.1.100:3000 project.tar.gz")
        return
    
    server_url = sys.argv[1]
    files_to_send = sys.argv[2:] if len(sys.argv) > 2 else []
    
    sender = RemoteFileSender(server_url)
    
    print(f"🤖 Remote File Sender for Scout.nu")
    print(f"🎯 Target server: {server_url}")
    print("")
    
    # Test connection
    print("🔌 Testing connection...")
    try:
        response = requests.get(f"{server_url}/api/list-files", timeout=5)
        if response.status_code == 200:
            print("✅ Connection successful!")
        else:
            print(f"⚠️  Server responded with status {response.status_code}")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return
    
    print("")
    
    # List existing files
    sender.list_remote_files()
    print("")
    
    # Send files if specified
    if files_to_send:
        print("📤 Sending files...")
        for file_path in files_to_send:
            description = f"File from scout.nu: {os.path.basename(file_path)}"
            sender.send_file(file_path, description)
            print("")
    else:
        # Demo mode - create and send a test file
        print("📝 No files specified, creating demo file...")
        
        demo_content = """🚀 Demo File from Scout.nu Agent

This file was sent from a remote agent to demonstrate the file transfer system.

Agent Details:
- Location: scout.nu
- Purpose: File transfer demonstration
- Protocol: HTTP API

Files that would typically be sent:
- project.tar.gz (main project files)
- backup.tar.gz (backup files)
- logs.zip (system logs)

Ready to receive your actual project files!
"""
        
        demo_file = "demo-from-scoutnu.txt"
        with open(demo_file, 'w') as f:
            f.write(demo_content)
        
        sender.send_file(demo_file, "Demo file from scout.nu agent")
        
        # Clean up demo file
        os.remove(demo_file)
    
    print("🎉 File transfer session complete!")

if __name__ == "__main__":
    main()
