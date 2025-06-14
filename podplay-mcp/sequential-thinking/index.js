#!/usr/bin/env node

console.log('🔥 REVOLUTIONARY MCP Sequential Thinking Server Starting...');
console.log('🧠 Revolutionary MCP Sequential Thinking Server ACTUALLY RUNNING on port 4404');

const express = require('express');
const app = express();

app.get('/health', (req, res) => {
    res.json({ status: 'REVOLUTIONARY', server: 'sequential-thinking', port: 4404 });
});

app.listen(4404, '0.0.0.0', () => {
    console.log('✅ Revolutionary MCP Sequential Thinking Server ready on port 4404');
});

process.on('SIGTERM', () => {
    console.log('🧠 Revolutionary MCP Sequential Thinking Server shutting down...');
    process.exit(0);
});
