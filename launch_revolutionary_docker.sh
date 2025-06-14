#!/bin/bash

# 🚀 Revolutionary Workspace Launcher Script
# Handles MCP containers, backend services, and browser-based development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE_PROD="docker-compose.yml"
COMPOSE_FILE_DEV="docker-compose.dev.yml"
CODE_SERVER_PASSWORD="${CODE_SERVER_PASSWORD:-revolution2024}"

# Functions
print_banner() {
    echo -e "${BLUE}"
    echo "████████████████████████████████████████████████████████"
    echo "██                                                    ██"
    echo "██     🚀 REVOLUTIONARY AI WORKSPACE LAUNCHER 🚀      ██"
    echo "██                                                    ██"
    echo "██  Docker-based MCP + Agentic RAG + Code-Server     ██"
    echo "██                                                    ██"
    echo "████████████████████████████████████████████████████████"
    echo -e "${NC}"
}

check_prerequisites() {
    echo -e "${YELLOW}🔍 Checking prerequisites...${NC}"

    # Check Docker
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker not found. Please install Docker first.${NC}"
        exit 1
    fi

    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        echo -e "${RED}❌ Docker Compose not found. Please install Docker Compose first.${NC}"
        exit 1
    fi

    # Check if Docker is running
    if ! docker info &> /dev/null; then
        echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
        exit 1
    fi

    echo -e "${GREEN}✅ Prerequisites satisfied${NC}"
}

setup_environment() {
    echo -e "${YELLOW}🔧 Setting up environment...${NC}"

    # Create necessary directories
    mkdir -p podplay-mcp/transfer
    mkdir -p podplay-mcp/logs
    mkdir -p podplay-mcp/temp
    mkdir -p backend/mama_bear_memory
    mkdir -p docker/ssl

    # Set permissions
    chmod 755 podplay-mcp/transfer
    chmod 755 podplay-mcp/logs
    chmod 755 backend/mama_bear_memory

    # Create .env file if it doesn't exist
    if [[ ! -f .env ]]; then
        echo "CODE_SERVER_PASSWORD=${CODE_SERVER_PASSWORD}" > .env
        echo "NODE_ENV=development" >> .env
        echo "PYTHONPATH=/app" >> .env
        echo -e "${GREEN}✅ Created .env file${NC}"
    fi

    echo -e "${GREEN}✅ Environment setup complete${NC}"
}

start_development() {
    echo -e "${YELLOW}🚀 Starting development environment...${NC}"

    # Pull latest images
    docker-compose -f $COMPOSE_FILE_DEV pull

    # Build custom images
    docker-compose -f $COMPOSE_FILE_DEV build

    # Start services
    docker-compose -f $COMPOSE_FILE_DEV up -d

    echo -e "${GREEN}✅ Development environment started!${NC}"
    print_access_info "development"
}

start_production() {
    echo -e "${YELLOW}🚀 Starting production environment...${NC}"

    # Pull latest images
    docker-compose -f $COMPOSE_FILE_PROD pull

    # Build custom images
    docker-compose -f $COMPOSE_FILE_PROD build

    # Start services
    docker-compose -f $COMPOSE_FILE_PROD up -d

    echo -e "${GREEN}✅ Production environment started!${NC}"
    print_access_info "production"
}

print_access_info() {
    local mode=$1
    echo -e "${BLUE}"
    echo "📊 ACCESS INFORMATION"
    echo "════════════════════════════════════════════════════════"
    echo -e "🌐 Revolutionary Workspace: ${GREEN}http://localhost:8080${BLUE}"
    echo -e "   Password: ${GREEN}${CODE_SERVER_PASSWORD}${BLUE}"
    echo ""
    echo -e "🔧 Backend API: ${GREEN}http://localhost:8000${BLUE}"
    echo -e "📁 MCP File Transfer: ${GREEN}http://localhost:3000${BLUE}"

    if [[ $mode == "development" ]]; then
        echo -e "🐛 Backend Debug Port: ${GREEN}5678${BLUE}"
        echo -e "🔍 MCP Debug Port: ${GREEN}9229${BLUE}"
        echo -e "🗄️  Database: ${GREEN}localhost:5432${BLUE}"
        echo -e "   DB: revolutionary_dev, User: dev_user, Pass: dev_pass"
    fi

    echo "════════════════════════════════════════════════════════"
    echo -e "${NC}"
}

stop_services() {
    echo -e "${YELLOW}🛑 Stopping services...${NC}"

    # Stop development environment
    if docker-compose -f $COMPOSE_FILE_DEV ps -q | grep -q .; then
        docker-compose -f $COMPOSE_FILE_DEV down
    fi

    # Stop production environment
    if docker-compose -f $COMPOSE_FILE_PROD ps -q | grep -q .; then
        docker-compose -f $COMPOSE_FILE_PROD down
    fi

    echo -e "${GREEN}✅ All services stopped${NC}"
}

show_logs() {
    local service=$1
    if [[ -z $service ]]; then
        echo -e "${YELLOW}📋 Showing all logs...${NC}"
        docker-compose -f $COMPOSE_FILE_DEV logs -f
    else
        echo -e "${YELLOW}📋 Showing logs for $service...${NC}"
        docker-compose -f $COMPOSE_FILE_DEV logs -f $service
    fi
}

show_status() {
    echo -e "${BLUE}📊 Service Status${NC}"
    echo "════════════════════════════════════════════════════════"

    # Check development services
    if docker-compose -f $COMPOSE_FILE_DEV ps -q | grep -q .; then
        echo -e "${GREEN}Development Environment:${NC}"
        docker-compose -f $COMPOSE_FILE_DEV ps
        echo ""
    fi

    # Check production services
    if docker-compose -f $COMPOSE_FILE_PROD ps -q | grep -q .; then
        echo -e "${GREEN}Production Environment:${NC}"
        docker-compose -f $COMPOSE_FILE_PROD ps
        echo ""
    fi

    # Show resource usage
    echo -e "${BLUE}Resource Usage:${NC}"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
}

cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up Docker resources...${NC}"

    # Stop all services
    stop_services

    # Remove unused images
    docker image prune -f

    # Remove unused volumes
    docker volume prune -f

    # Remove unused networks
    docker network prune -f

    echo -e "${GREEN}✅ Cleanup complete${NC}"
}

# Main script logic
case "$1" in
    dev|development)
        print_banner
        check_prerequisites
        setup_environment
        start_development
        ;;
    prod|production)
        print_banner
        check_prerequisites
        setup_environment
        start_production
        ;;
    stop)
        stop_services
        ;;
    logs)
        show_logs $2
        ;;
    status)
        show_status
        ;;
    restart)
        echo -e "${YELLOW}🔄 Restarting services...${NC}"
        stop_services
        sleep 2
        if [[ "$2" == "prod" ]]; then
            start_production
        else
            start_development
        fi
        ;;
    cleanup)
        cleanup
        ;;
    help|*)
        echo -e "${BLUE}🚀 Revolutionary Workspace Launcher${NC}"
        echo ""
        echo "Usage: $0 [command] [options]"
        echo ""
        echo "Commands:"
        echo "  dev, development  - Start development environment with hot reload"
        echo "  prod, production  - Start production environment"
        echo "  stop             - Stop all services"
        echo "  restart [prod]   - Restart services (dev by default)"
        echo "  logs [service]   - Show logs (all services by default)"
        echo "  status           - Show service status and resource usage"
        echo "  cleanup          - Clean up Docker resources"
        echo "  help             - Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 dev           # Start development with code-server on :8080"
        echo "  $0 prod          # Start production environment"
        echo "  $0 logs backend  # Show backend service logs"
        echo "  $0 status        # Check all service status"
        echo ""
        echo -e "${GREEN}Access Revolutionary Workspace at: http://localhost:8080${NC}"
        ;;
esac
