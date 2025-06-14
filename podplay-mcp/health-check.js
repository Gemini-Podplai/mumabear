#!/usr/bin/env node

/**
 * Simple health check script for MCP server
 */

const fs = require('fs');
const path = require('path');

// Check if server.js exists and transfer directory is accessible
const serverFile = path.join(__dirname, 'server.js');
const transferDir = process.env.TRANSFER_DIR || path.join(__dirname, 'transfer');

try {
  // Check if server file exists
  if (!fs.existsSync(serverFile)) {
    console.error('❌ Server file not found');
    process.exit(1);
  }

  // Check if transfer directory exists and is writable
  if (!fs.existsSync(transferDir)) {
    fs.mkdirSync(transferDir, { recursive: true });
  }

  // Test write permissions
  const testFile = path.join(transferDir, '.health-check');
  fs.writeFileSync(testFile, 'health-check');
  fs.unlinkSync(testFile);

  console.log('✅ MCP Server health check passed');
  process.exit(0);
} catch (error) {
  console.error('❌ Health check failed:', error.message);
  process.exit(1);
}
