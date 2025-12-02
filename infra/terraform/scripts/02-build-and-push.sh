#!/bin/bash
# Script: 02-build-and-push.sh
# Purpose: Build images locally and push to registry.raus.cloud
# Usage: ./scripts/02-build-and-push.sh

set -e

echo "🏗️  FlagMeter - Build and Push Images"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -f "../../package.json" ]; then
  echo "❌ Error: Must run from infra/terraform directory"
  exit 1
fi

cd ../..

# Get registry credentials from terraform.tfvars or env vars
if [ -f "infra/terraform/terraform.tfvars" ]; then
  REGISTRY_URL=$(grep docker_registry_url infra/terraform/terraform.tfvars | cut -d '"' -f 2)
  REGISTRY_USER=$(grep docker_registry_username infra/terraform/terraform.tfvars | cut -d '"' -f 2)
  REGISTRY_PASS=$(grep docker_registry_password infra/terraform/terraform.tfvars | cut -d '"' -f 2)
else
  REGISTRY_URL=${DOCKER_REGISTRY_URL:-"registry.raus.cloud"}
  REGISTRY_USER=${DOCKER_REGISTRY_USERNAME}
  REGISTRY_PASS=${DOCKER_REGISTRY_PASSWORD}
fi

# Validate credentials
if [ -z "$REGISTRY_USER" ] || [ -z "$REGISTRY_PASS" ]; then
  echo "❌ Error: Registry credentials not found"
  echo "   Set in terraform.tfvars or environment variables"
  exit 1
fi

echo "🔐 Registry: $REGISTRY_URL"
echo "   User: $REGISTRY_USER"
echo ""

# Login to registry
echo "🔑 Logging into registry..."
echo "$REGISTRY_PASS" | docker login -u "$REGISTRY_USER" --password-stdin "$REGISTRY_URL"
echo "✅ Logged in"
echo ""

# Build images in parallel
echo "🏗️  Building images in parallel..."
echo ""

# Build Dashboard
echo "📦 Building dashboard..."
docker build -f infra/docker/Dockerfile.dashboard \
  -t flagmeter-dashboard:latest \
  -t $REGISTRY_URL/flagmeter/dashboard:latest \
  -t $REGISTRY_URL/flagmeter/dashboard:$(date +%Y%m%d-%H%M%S) \
  . &
DASH_PID=$!

# Build Worker
echo "📦 Building worker..."
docker build -f infra/docker/Dockerfile.worker \
  -t flagmeter-worker:latest \
  -t $REGISTRY_URL/flagmeter/worker:latest \
  -t $REGISTRY_URL/flagmeter/worker:$(date +%Y%m%d-%H%M%S) \
  . &
WORK_PID=$!

# Note: Prometheus and Grafana now use native images with configs
# No need to build custom images for observability stack

# Wait for builds
echo ""
echo "⏳ Waiting for dashboard build..."
wait $DASH_PID && echo "✅ Dashboard built" || { echo "❌ Dashboard build failed"; exit 1; }

echo "⏳ Waiting for worker build..."
wait $WORK_PID && echo "✅ Worker built" || { echo "❌ Worker build failed"; exit 1; }

# Prometheus and Grafana skipped (using native images)

echo ""
echo "✅ All images built successfully!"
echo ""

# Push images to registry
echo "📤 Pushing images to registry..."
echo ""

echo "Pushing dashboard..."
docker push $REGISTRY_URL/flagmeter/dashboard:latest
echo "✅ Dashboard pushed"
echo ""

echo "Pushing worker..."
docker push $REGISTRY_URL/flagmeter/worker:latest
echo "✅ Worker pushed"
echo ""

# Prometheus and Grafana use native images (no push needed)

echo "✅ All images pushed to $REGISTRY_URL!"
echo ""
echo "Custom images in registry:"
echo "  - $REGISTRY_URL/flagmeter/dashboard:latest"
echo "  - $REGISTRY_URL/flagmeter/worker:latest"
echo ""
echo "Using native Docker images (no build needed):"
echo "  - prom/prometheus:latest"
echo "  - grafana/grafana:latest"
echo "  - grafana/loki:latest"
echo ""
echo "Next step:"
echo "  ./scripts/04-deploy-stacks.sh"
