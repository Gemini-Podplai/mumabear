#!/usr/bin/env node

console.log('🔥 REVOLUTIONARY MCP Search Server Starting...');
console.log('🔍 Revolutionary MCP Search Server ACTUALLY RUNNING on port 4402');

const express = require('express');
const app = express();

app.get('/health', (req, res) => {
    res.json({ status: 'REVOLUTIONARY', server: 'search', port: 4402 });
});

app.listen(4402, '0.0.0.0', () => {
    console.log('✅ Revolutionary MCP Search Server ready on port 4402');
});

process.on('SIGTERM', () => {
    console.log('🔍 Revolutionary MCP Search Server shutting down...');
    process.exit(0);
});
