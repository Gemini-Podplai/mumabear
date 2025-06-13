"""
🐻 Podplay Sanctuary - Enhanced Mama Bear Flask Application
Neurodivergent-friendly development sanctuary with 7 Mama Bear variants,
3 sensory-friendly themes, and instant cloud development environments
"""

import os
import logging
import asyncio
from datetime import datetime
from typing import Dict, Any, Optional

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import json

# Initialize logging first
logging.basicConfig(
    level=getattr(logging, os.getenv('LOG_LEVEL', 'INFO')),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.getenv('LOG_FILE', 'mama_bear.log')),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("PodplaySanctuary")

# Import our sanctuary services
from config.settings import get_settings
from services import (
    initialize_all_services,
    shutdown_all_services,
    get_mama_bear_agent,
    get_memory_manager,
    get_scrapybara_manager,
    get_theme_manager,
    get_service_status
)

# Import API blueprints
from services.mama_bear_orchestration_api import integrate_orchestration_with_app
from api.mama_bear_scrapybara_api import integrate_mama_bear_scrapybara_api
from api.multi_model_api import register_multi_model_api

# Import new Live API Studio routes
from routes.memory import memory_bp
from routes.chat import chat_bp
from routes.scrape import scrape_bp

# Import Gemini Orchestra
try:
    from backend.api.gemini_orchestra_api import gemini_orchestra_bp, init_gemini_orchestra
    GEMINI_ORCHESTRA_AVAILABLE = True
    logger.info("✅ Gemini Orchestra API integration available")
except ImportError as e:
    logger.warning(f"Gemini Orchestra API integration not available: {e}")
    GEMINI_ORCHESTRA_AVAILABLE = False
    gemini_orchestra_bp = None
    init_gemini_orchestra = None

# Import Enhanced Scout Workflow
try:
    from backend.api.scout_workflow_api import scout_workflow_bp, init_scout_workflow
    SCOUT_WORKFLOW_AVAILABLE = True
    logger.info("✅ Enhanced Scout Workflow API integration available")
except ImportError as e:
    logger.warning(f"Enhanced Scout Workflow API integration not available: {e}")
    SCOUT_WORKFLOW_AVAILABLE = False
    scout_workflow_bp = None
    init_scout_workflow = None

# Import Express Mode + Vertex AI Supercharger
try:
    from backend.api.express_mode_vertex_api import express_mode_vertex_bp, init_express_mode_vertex
    EXPRESS_MODE_VERTEX_AVAILABLE = True
    logger.info("✅ Express Mode + Vertex AI Supercharger integration available")
except ImportError as e:
    logger.warning(f"Express Mode + Vertex AI Supercharger integration not available: {e}")
    EXPRESS_MODE_VERTEX_AVAILABLE = False
    express_mode_vertex_bp = None
    init_express_mode_vertex = None

# Import Multimodal Chat API
try:
    from backend.api.multimodal_chat_api import multimodal_chat_bp, init_multimodal_chat
    MULTIMODAL_CHAT_AVAILABLE = True
    logger.info("✅ Multimodal Chat API integration available - ALL models accessible!")
except ImportError as e:
    logger.warning(f"Multimodal Chat API integration not available: {e}")
    MULTIMODAL_CHAT_AVAILABLE = False
    multimodal_chat_bp = None
    init_multimodal_chat = None

# Import Mama Bear Agentic Superpowers V3.0
try:
    from backend.api.agentic_superpowers_api import agentic_superpowers_bp, init_agentic_superpowers
    AGENTIC_SUPERPOWERS_AVAILABLE = True
    logger.info("✅ 🐻 Mama Bear Agentic Superpowers V3.0 integration available!")
except ImportError as e:
    logger.warning(f"Mama Bear Agentic Superpowers V3.0 integration not available: {e}")
    AGENTIC_SUPERPOWERS_AVAILABLE = False
    agentic_superpowers_bp = None
    init_agentic_superpowers = None

# Import Supercharged Collaborative Workspaces V3.0
try:
    from backend.api.collaborative_workspaces_api import collaborative_workspaces_bp, init_collaborative_workspaces
    COLLABORATIVE_WORKSPACES_AVAILABLE = True
    logger.info("✅ 🚀 Supercharged Collaborative Workspaces V3.0 integration available!")
except ImportError as e:
    logger.warning(f"Supercharged Collaborative Workspaces V3.0 integration not available: {e}")
    COLLABORATIVE_WORKSPACES_AVAILABLE = False
    collaborative_workspaces_bp = None
    init_collaborative_workspaces = None

# Import Pipedream Integration Service
try:
    from backend.api.pipedream_api import pipedream_bp, init_pipedream_integration
    PIPEDREAM_INTEGRATION_AVAILABLE = True
    logger.info("✅ 🔗 Pipedream Integration Service available - Autonomous workflow automation ready!")
except ImportError as e:
    logger.warning(f"Pipedream Integration Service not available: {e}")
    PIPEDREAM_INTEGRATION_AVAILABLE = False
    pipedream_bp = None
    init_pipedream_integration = None

# Import Deep Research Center (Library)
try:
    from backend.api.library_api import library_bp, init_library
    LIBRARY_AVAILABLE = True
    logger.info("✅ Deep Research Center (Library) integration available")
except ImportError as e:
    logger.warning(f"Deep Research Center (Library) integration not available: {e}")
    LIBRARY_AVAILABLE = False
    library_bp = None
    init_library = None

# Import Virtual Computer API
try:
    from backend.api.virtual_computer_api import virtual_computer_bp, integrate_virtual_computer_api
    VIRTUAL_COMPUTER_AVAILABLE = True
    logger.info("✅ 🖥️ Virtual Computer API integration available - Agent workspaces ready!")
except ImportError as e:
    logger.warning(f"Virtual Computer API integration not available: {e}")
    VIRTUAL_COMPUTER_AVAILABLE = False
    virtual_computer_bp = None
    integrate_virtual_computer_api = None

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure SocketIO
socketio = SocketIO(
    app,
    cors_allowed_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:9000", "http://localhost:9001", "http://localhost:9002", "http://localhost:9003", "http://localhost:9004", "http://localhost:9005", "http://localhost:9006", "http://localhost:9007", "http://localhost:9008", "http://localhost:9009", "http://localhost:9010", "http://localhost:5000"],
    async_mode='threading'
)

# Register blueprints
app.register_blueprint(memory_bp)
app.register_blueprint(chat_bp)
app.register_blueprint(scrape_bp)

logger.info("🔗 Registering API blueprints...")
integrate_orchestration_with_app(app, socketio)
integrate_mama_bear_scrapybara_api(app)
register_multi_model_api(app)

if GEMINI_ORCHESTRA_AVAILABLE:
    app.register_blueprint(gemini_orchestra_bp)
    logger.info("✅ Gemini Orchestra API registered")

if SCOUT_WORKFLOW_AVAILABLE:
    app.register_blueprint(scout_workflow_bp)
    logger.info("✅ Scout API registered")

if EXPRESS_MODE_VERTEX_AVAILABLE:
    app.register_blueprint(express_mode_vertex_bp)
    logger.info("✅ OpenAI Vertex API registered")

if MULTIMODAL_CHAT_AVAILABLE:
    app.register_blueprint(multimodal_chat_bp)
    logger.info("✅ Live API Studio routes registered")

if AGENTIC_SUPERPOWERS_AVAILABLE:
    app.register_blueprint(agentic_superpowers_bp)
    logger.info("✅ Agent Workbench API registered")

if COLLABORATIVE_WORKSPACES_AVAILABLE:
    app.register_blueprint(collaborative_workspaces_bp)
    logger.info("✅ Execution Router API registered")

if PIPEDREAM_INTEGRATION_AVAILABLE:
    app.register_blueprint(pipedream_bp)
    logger.info("✅ Pipedream Integration Service registered")

if LIBRARY_AVAILABLE:
    app.register_blueprint(library_bp)
    logger.info("✅ Library API registered")

if VIRTUAL_COMPUTER_AVAILABLE:
    integrate_virtual_computer_api(app, socketio)
    logger.info("✅ Virtual Computer API registered")

logger.info("✅ API blueprints registered successfully")
logger.info("✅ All sanctuary services initialized successfully")

async def initialize_sanctuary_services():
    """Initializes all core services for the Sanctuary."""
    logger.info("🚀 Initializing Podplay Sanctuary services...")
    await initialize_all_services()
    logger.info("✅ Service initialization completed")

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    logger.info("Health check requested")
    status = get_service_status()
    return jsonify({
        'status': 'healthy',
        'message': 'Podplay Sanctuary Backend is running!',
        'services': status
    })

@app.route('/api/themes')
def get_themes():
    """Endpoint to get available themes"""
    themes = get_theme_manager().get_available_themes()
    return jsonify({'themes': themes})

@app.route('/api/agent-workbench')
def agent_workbench():
    """Agent workbench endpoint"""
    return jsonify({
        'message': 'Welcome to the Agent Workbench!',
        'agent_status': get_mama_bear_agent().get_status()
    })

@app.route('/api/execution-router')
def execution_router():
    """Execution router endpoint"""
    return jsonify({
        'message': 'Execution Router is active!',
        'router_status': 'ready'
    })

@app.route('/api/scout')
def scout_endpoint():
    """Scout endpoint"""
    return jsonify({
        'message': 'Scout is ready for action!',
        'scout_status': 'ready'
    })

@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    logger.info("Client connected")
    emit('connection_established', {
        'status': 'connected',
        'sanctuary_version': '1.0.0',
        'mama_bear_ready': True
    })

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    logger.info("Client disconnected")

# ==============================================================================
# ERROR HANDLERS
# ==============================================================================

@app.errorhandler(404)
def not_found_error(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found',
        'sanctuary_message': '🐻 Mama Bear couldn\'t find that path. Try a different route!'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error',
        'sanctuary_message': '🐻 Mama Bear encountered an issue. She\'s working to fix it!'
    }), 500

# ==============================================================================
# APPLICATION STARTUP
# ==============================================================================

def create_app():
    """Application factory function"""
    # Initialize services when app is created
    import asyncio
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(initialize_sanctuary_services())

    return app

if __name__ == '__main__':
    # Initialize services
    import asyncio

    async def startup():
        """Async startup function"""
        logger.info("🚀 Starting Podplay Sanctuary...")
        await initialize_sanctuary_services()
        logger.info("🐻 Mama Bear is ready to help!")

    # Run startup
    asyncio.run(startup())

    # Start the Sanctuary
    socketio.run(
        app,
        host='0.0.0.0',
        port=int(os.getenv('BACKEND_PORT', 5000)),
        debug=os.getenv('DEBUG', 'False').lower() == 'true',
        allow_unsafe_werkzeug=True
    )
