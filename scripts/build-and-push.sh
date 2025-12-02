#!/bin/bash
set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✅${NC} $1"
}

log_error() {
    echo -e "${RED}❌${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Compose file to use (can be overridden with -f flag)
COMPOSE_FILE="${COMPOSE_FILE:-coolify.app.swarm.yaml}"

# Registry credentials
REGISTRY_URL="${REGISTRY_URL:-registry.raus.cloud}"
REGISTRY_USER="${REGISTRY_USER:-coolify}"
REGISTRY_PASSWORD="${REGISTRY_PASSWORD:-test}"

# Start build process
log_info "Starting Docker Compose build and push workflow..."
log_info "Using compose file: $COMPOSE_FILE"
echo ""

# Login to registry
log_info "Logging into registry: $REGISTRY_URL"
if echo "$REGISTRY_PASSWORD" | docker login "$REGISTRY_URL" -u "$REGISTRY_USER" --password-stdin; then
    log_success "Registry login successful"
    echo ""
else
    log_error "Registry login failed"
    exit 1
fi

# Build images
log_info "Building images..."
if docker compose -f "$COMPOSE_FILE" build; then
    log_success "Build successful"
    echo ""
else
    log_error "Build failed"
    exit 1
fi

# Push images to registry
log_info "Pushing images to registry..."
# Create empty .env if it doesn't exist to avoid docker compose errors
if [ ! -f .env ]; then
    touch .env
fi
if docker compose -f "$COMPOSE_FILE" push; then
    log_success "Push successful"
    echo ""
else
    log_error "Push failed"
    exit 1
fi

log_success "Build and push completed successfully!"
echo ""
log_info "Images are ready for deployment to Swarm"
