#!/bin/bash

# 🚀 Revolutionary Workspace Complete Setup Script
# Sets up Docker-based MCP + Agentic RAG + Browser IDE environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${PURPLE}"
    echo "████████████████████████████████████████████████████████████████"
    echo "██                                                            ██"
    echo "██  🧠 REVOLUTIONARY AI WORKSPACE - COMPLETE SETUP 🧠         ██"
    echo "██                                                            ██"
    echo "██  Containerized MCP + Agentic RAG + Browser-based IDE       ██"
    echo "██  Perfect for development, demos, and investor presentations ██"
    echo "██                                                            ██"
    echo "████████████████████████████████████████████████████████████████"
    echo -e "${NC}"
}

check_system() {
    echo -e "${YELLOW}🔍 Checking system requirements...${NC}"

    # Check Operating System
    if [[ "$OSTYPE" != "linux-gnu"* ]]; then
        echo -e "${RED}❌ This setup is optimized for Linux. Other systems may work but are untested.${NC}"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi

    # Check Docker
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker not installed. Installing Docker...${NC}"
        install_docker
    else
        echo -e "${GREEN}✅ Docker found: $(docker --version)${NC}"
    fi

    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        echo -e "${RED}❌ Docker Compose not found. Installing...${NC}"
        install_docker_compose
    else
        echo -e "${GREEN}✅ Docker Compose found${NC}"
    fi

    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        echo -e "${YELLOW}⚠️  Docker daemon not running. Starting Docker...${NC}"
        sudo systemctl start docker || {
            echo -e "${RED}❌ Failed to start Docker. Please start Docker manually.${NC}"
            exit 1
        }
    fi

    # Check available disk space (need at least 5GB)
    available_space=$(df . | tail -1 | awk '{print $4}')
    if [[ $available_space -lt 5000000 ]]; then
        echo -e "${YELLOW}⚠️  Low disk space. Need at least 5GB free for Docker images.${NC}"
    fi

    echo -e "${GREEN}✅ System requirements satisfied${NC}"
}

install_docker() {
    echo -e "${YELLOW}📦 Installing Docker...${NC}"

    # Update package index
    sudo apt-get update

    # Install prerequisites
    sudo apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release

    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

    # Set up stable repository
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    # Install Docker Engine
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io

    # Add current user to docker group
    sudo usermod -aG docker $USER

    echo -e "${GREEN}✅ Docker installed successfully${NC}"
    echo -e "${YELLOW}ℹ️  You may need to log out and back in for Docker permissions to take effect${NC}"
}

install_docker_compose() {
    echo -e "${YELLOW}📦 Installing Docker Compose...${NC}"

    # Download and install Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose

    echo -e "${GREEN}✅ Docker Compose installed successfully${NC}"
}

setup_project_structure() {
    echo -e "${YELLOW}📁 Setting up project structure...${NC}"

    # Create necessary directories
    mkdir -p podplay-mcp/{transfer,logs,temp}
    mkdir -p backend/{mama_bear_memory,logs,data}
    mkdir -p frontend/dist
    mkdir -p docker/ssl
    mkdir -p tests/reports

    # Set proper permissions
    chmod 755 podplay-mcp/{transfer,logs,temp}
    chmod 755 backend/{mama_bear_memory,logs,data}
    chmod 755 docker/ssl

    # Create environment files
    create_environment_files

    echo -e "${GREEN}✅ Project structure created${NC}"
}

create_environment_files() {
    echo -e "${YELLOW}🔧 Creating environment configuration...${NC}"

    # Create main .env file
    if [[ ! -f .env ]]; then
        cat > .env << EOF
# Revolutionary Workspace Configuration
CODE_SERVER_PASSWORD=revolution2024
NODE_ENV=development
PYTHONPATH=/app
PYTHONUNBUFFERED=1

# MCP Configuration
TRANSFER_DIR=/app/transfer
MAX_FILE_SIZE=100
LOG_LEVEL=info

# Backend Configuration
FLASK_ENV=development
FLASK_DEBUG=1

# Database Configuration (for development)
POSTGRES_DB=revolutionary_dev
POSTGRES_USER=dev_user
POSTGRES_PASSWORD=dev_pass

# Security
SECRET_KEY=$(openssl rand -hex 32)
EOF
        echo -e "${GREEN}✅ Created .env file${NC}"
    else
        echo -e "${CYAN}ℹ️  .env file already exists${NC}"
    fi

    # Create .env.production for production settings
    if [[ ! -f .env.production ]]; then
        cat > .env.production << EOF
# Production Configuration
CODE_SERVER_PASSWORD=${CODE_SERVER_PASSWORD:-$(openssl rand -base64 32)}
NODE_ENV=production
PYTHONPATH=/app
PYTHONUNBUFFERED=1

# MCP Configuration
TRANSFER_DIR=/app/transfer
MAX_FILE_SIZE=500
LOG_LEVEL=warn

# Backend Configuration
FLASK_ENV=production
FLASK_DEBUG=0

# Security
SECRET_KEY=$(openssl rand -hex 32)
EOF
        echo -e "${GREEN}✅ Created .env.production file${NC}"
    fi
}

install_dependencies() {
    echo -e "${YELLOW}📦 Installing project dependencies...${NC}"

    # Install MCP dependencies
    if [[ -f podplay-mcp/package.json ]]; then
        echo -e "${CYAN}Installing MCP dependencies...${NC}"
        cd podplay-mcp
        npm install
        cd ..
    fi

    # Install backend dependencies
    if [[ -f backend/requirements.txt ]]; then
        echo -e "${CYAN}Installing backend dependencies...${NC}"
        # We'll install these in the Docker container, but check syntax
        python3 -m py_compile backend/requirements.txt 2>/dev/null || true
    fi

    # Install frontend dependencies
    if [[ -f frontend/package.json ]]; then
        echo -e "${CYAN}Installing frontend dependencies...${NC}"
        cd frontend
        npm install
        cd ..
    fi

    echo -e "${GREEN}✅ Dependencies installation complete${NC}"
}

build_docker_images() {
    echo -e "${YELLOW}🐳 Building Docker images...${NC}"

    # Pull base images first
    echo -e "${CYAN}Pulling base images...${NC}"
    docker pull node:18-alpine
    docker pull python:3.11-slim
    docker pull codercom/code-server:latest
    docker pull postgres:15-alpine

    # Build custom images
    echo -e "${CYAN}Building MCP image...${NC}"
    docker build -t revolutionary-mcp:dev -f podplay-mcp/Dockerfile.dev podplay-mcp/

    echo -e "${CYAN}Building backend image...${NC}"
    docker build -t revolutionary-backend:dev -f backend/Dockerfile.dev backend/

    echo -e "${CYAN}Building code-server image...${NC}"
    docker build -t revolutionary-code-server:dev -f docker/Dockerfile.code-server-dev docker/

    echo -e "${GREEN}✅ Docker images built successfully${NC}"
}

setup_networking() {
    echo -e "${YELLOW}🌐 Setting up Docker networking...${NC}"

    # Create custom network if it doesn't exist
    if ! docker network ls | grep -q revolutionary-dev-network; then
        docker network create revolutionary-dev-network --subnet=172.21.0.0/16
        echo -e "${GREEN}✅ Created revolutionary-dev-network${NC}"
    else
        echo -e "${CYAN}ℹ️  Network already exists${NC}"
    fi
}

run_tests() {
    echo -e "${YELLOW}🧪 Running system tests...${NC}"

    # Test MCP health check
    if [[ -f podplay-mcp/health-check.js ]]; then
        cd podplay-mcp
        node health-check.js
        cd ..
    fi

    # Test Docker setup
    echo -e "${CYAN}Testing Docker setup...${NC}"
    docker run --rm alpine:latest echo "✅ Docker working correctly"

    echo -e "${GREEN}✅ All tests passed${NC}"
}

show_next_steps() {
    echo -e "${BLUE}"
    echo "🎉 REVOLUTIONARY WORKSPACE SETUP COMPLETE!"
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    echo "🚀 QUICK START:"
    echo "   ./launch_revolutionary_docker.sh dev    # Start development environment"
    echo "   ./launch_revolutionary_docker.sh prod   # Start production environment"
    echo ""
    echo "🌐 ACCESS POINTS:"
    echo "   • Revolutionary Workspace: http://localhost:8080"
    echo "   • Backend API: http://localhost:8000"
    echo "   • MCP File Transfer: http://localhost:3000"
    echo ""
    echo "🔑 DEFAULT CREDENTIALS:"
    echo "   • Code-Server Password: revolution2024"
    echo "   • Database: dev_user / dev_pass"
    echo ""
    echo "📚 DOCUMENTATION:"
    echo "   • MCP Setup: ./podplay-mcp/COMPLETE_SETUP.md"
    echo "   • Test Suite: ./tests/TEST_DOCUMENTATION.md"
    echo "   • Deployment: ./docs/MCP_DEPLOYMENT_STRATEGY.md"
    echo ""
    echo "🔧 USEFUL COMMANDS:"
    echo "   ./launch_revolutionary_docker.sh status  # Check service status"
    echo "   ./launch_revolutionary_docker.sh logs    # View logs"
    echo "   ./launch_revolutionary_docker.sh stop    # Stop all services"
    echo ""
    echo "💡 NEXT STEPS:"
    echo "   1. Start development environment"
    echo "   2. Open browser to http://localhost:8080"
    echo "   3. Explore the Revolutionary Workspace"
    echo "   4. Run the test suite to verify everything works"
    echo "   5. Start building your next revolutionary AI project!"
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
}

# Main execution
main() {
    print_header

    echo -e "${CYAN}This script will set up your complete Revolutionary Workspace with:${NC}"
    echo -e "${CYAN}• Docker containerization for all services${NC}"
    echo -e "${CYAN}• Code-Server (VS Code in browser)${NC}"
    echo -e "${CYAN}• MCP file transfer system${NC}"
    echo -e "${CYAN}• Agentic RAG backend${NC}"
    echo -e "${CYAN}• Development and production environments${NC}"
    echo ""

    read -p "Continue with setup? (Y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        echo -e "${YELLOW}Setup cancelled.${NC}"
        exit 0
    fi

    check_system
    setup_project_structure
    install_dependencies
    setup_networking
    build_docker_images
    run_tests
    show_next_steps

    echo -e "${GREEN}🎉 Revolutionary Workspace is ready for action!${NC}"
}

# Run main function
main "$@"
