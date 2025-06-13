# 🚀 Podplay File Transfer Server - HTTP API Mode

A simple file transfer server for easy file sharing. Use it via HTTP API or command line tools.

## Quick Start

1. **Install & Start**
   ```bash
   npm install
   node server.js
   ```

2. **Server runs on port 3000** (or set PORT environment variable)

## 📡 HTTP API Usage

### Send a File
```bash
curl -X POST http://localhost:3000/api/send-file \
  -F "file=@/path/to/your/file.txt" \
  -F "description=My important file"
```

### List Available Files
```bash
curl http://localhost:3000/api/list-files
```

### Download a File
```bash
curl http://localhost:3000/api/download/filename.txt -o downloaded-file.txt
```

### Get File Info
```bash
curl http://localhost:3000/api/file-info/filename.txt
```

### Delete a File
```bash
curl -X DELETE http://localhost:3000/api/delete/filename.txt
```

## 🖥️ Web Interface

Open http://localhost:3000 in your browser for a simple web interface to:
- Upload files by dragging and dropping
- Browse available files
- Download files with one click
- View file details

## 🛠️ Command Line Tools

### Send Files
```bash
# Simple upload
npm run send-file /path/to/file.txt

# With description
npm run send-file /path/to/file.txt "Project documentation"
```

### List Files
```bash
npm run list-files
```

### Download Files
```bash
npm run download filename.txt ./downloads/
```

## 📁 How It Works

1. **Start the server** - Files are stored in `./transfer/` directory
2. **Upload files** - Use web interface, API, or CLI
3. **Share the filename** - Tell someone what file to download
4. **They download** - Using any of the methods above
5. **Clean up** - Delete files when done

## 🔧 Configuration

Create a `.env` file:
```
PORT=3000
TRANSFER_DIR=./transfer
MAX_FILE_SIZE=100
LOG_LEVEL=info
```

## 💡 Perfect For

- Quick file sharing between computers
- Temporary file storage
- Simple file transfer without cloud services
- Local network file sharing
- Development and testing

## 📂 File Structure

```
transfer/           # Your uploaded files go here
logs/              # Server activity logs
server.js          # Main server
package.json       # Dependencies
```

Ready to transfer files easily! 🚀
