#!/bin/bash
# Script: 03-configure-registry.sh
# Purpose: Configure Docker registry on all nodes (Coolify guide Step 14)
# Usage: ./scripts/03-configure-registry.sh

set -e

echo "🐳 FlagMeter - Docker Registry Configuration"
echo "============================================"
echo ""

# Check for terraform state
if [ ! -f "terraform.tfstate" ]; then
  echo "❌ Error: terraform.tfstate not found"
  exit 1
fi

# Get IPs from Terraform
echo "📋 Getting server IPs..."
MANAGER_IP=$(terraform output -raw manager_public_ip)
WORKER_IP=$(terraform output -raw worker_public_ip)
echo ""

# Get registry credentials from terraform.tfvars or env vars
if [ -f "terraform.tfvars" ]; then
  REGISTRY_URL=$(grep docker_registry_url terraform.tfvars | cut -d '"' -f 2)
  REGISTRY_USER=$(grep docker_registry_username terraform.tfvars | cut -d '"' -f 2)
  REGISTRY_PASS=$(grep docker_registry_password terraform.tfvars | cut -d '"' -f 2)
else
  echo "⚠️  terraform.tfvars not found, using environment variables"
  REGISTRY_URL=${DOCKER_REGISTRY_URL:-"registry.raus.cloud"}
  REGISTRY_USER=${DOCKER_REGISTRY_USERNAME}
  REGISTRY_PASS=${DOCKER_REGISTRY_PASSWORD}
fi

# Validate credentials
if [ -z "$REGISTRY_USER" ] || [ -z "$REGISTRY_PASS" ]; then
  echo "❌ Error: Registry credentials not found"
  echo "   Set in terraform.tfvars or environment variables:"
  echo "   export DOCKER_REGISTRY_USERNAME=your_username"
  echo "   export DOCKER_REGISTRY_PASSWORD=your_password"
  exit 1
fi

echo "🔐 Registry: $REGISTRY_URL"
echo "   User: $REGISTRY_USER"
echo ""

# Login to registry on manager
echo "🔑 Logging into registry on manager..."
ssh root@$MANAGER_IP "docker login -u '$REGISTRY_USER' -p '$REGISTRY_PASS' $REGISTRY_URL" || {
  echo "❌ Failed to login to registry on manager"
  exit 1
}
echo "✅ Manager logged in"
echo ""

# Login to registry on worker
echo "🔑 Logging into registry on worker..."
ssh root@$WORKER_IP "docker login -u '$REGISTRY_USER' -p '$REGISTRY_PASS' $REGISTRY_URL" || {
  echo "❌ Failed to login to registry on worker"
  exit 1
}
echo "✅ Worker logged in"
echo ""

# Verify login
echo "🔍 Verifying registry access..."
echo "   Manager:"
ssh root@$MANAGER_IP "cat ~/.docker/config.json | grep -q '$REGISTRY_URL' && echo '   ✅ Config found'"
echo "   Worker:"
ssh root@$WORKER_IP "cat ~/.docker/config.json | grep -q '$REGISTRY_URL' && echo '   ✅ Config found'"
echo ""

echo "✅ Registry configuration complete!"
echo ""
echo "Next step:"
echo "  Deploy stacks: ./scripts/04-deploy-stacks.sh"
