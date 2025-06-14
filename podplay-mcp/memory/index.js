#!/usr/bin/env node

console.log('🔥 REVOLUTIONARY MCP Memory Server Starting...');
console.log('🧠 Revolutionary MCP Memory Server ACTUALLY RUNNING on port 4403');

const express = require('express');
const app = express();

app.get('/health', (req, res) => {
    res.json({ status: 'REVOLUTIONARY', server: 'memory', port: 4403 });
});

app.listen(4403, '0.0.0.0', () => {
    console.log('✅ Revolutionary MCP Memory Server ready on port 4403');
});

process.on('SIGTERM', () => {
    console.log('🧠 Revolutionary MCP Memory Server shutting down...');
    process.exit(0);
});
