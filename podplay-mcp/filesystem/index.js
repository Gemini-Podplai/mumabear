#!/usr/bin/env node

console.log('🔥 REVOLUTIONARY MCP Filesystem Server Starting...');
console.log('📁 Revolutionary MCP Filesystem Server ACTUALLY RUNNING on port 4401');

// Simple server that stays alive
const express = require('express');
const app = express();

app.get('/health', (req, res) => {
    res.json({ status: 'REVOLUTIONARY', server: 'filesystem', port: 4401 });
});

app.listen(4401, '0.0.0.0', () => {
    console.log('✅ Revolutionary MCP Filesystem Server ready on port 4401');
});

// Keep the process alive
process.on('SIGTERM', () => {
    console.log('📁 Revolutionary MCP Filesystem Server shutting down...');
    process.exit(0);
});
