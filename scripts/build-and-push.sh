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

# Start build process
log_info "Starting Docker Compose build and push workflow..."
echo ""

# Build images
log_info "Building images..."
if docker compose build; then
    log_success "Build successful"
    echo ""
else
    log_error "Build failed"
    exit 1
fi

# Push images to registry
log_info "Pushing images to registry..."
if docker compose push; then
    log_success "Push successful"
    echo ""
else
    log_error "Push failed"
    log_warning "Make sure you're logged into the registry: docker login registry.raus.cloud"
    exit 1
fi

log_success "Build and push completed successfully!"
echo ""
log_info "Images are ready for deployment to Swarm"
