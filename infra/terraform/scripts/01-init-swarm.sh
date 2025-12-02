#!/bin/bash
# Script: 01-init-swarm.sh
# Purpose: Initialize Docker Swarm cluster (Coolify guide Step 5-6)
# Usage: ./scripts/01-init-swarm.sh

set -e

echo "🐝 FlagMeter - Docker Swarm Initialization"
echo "==========================================="
echo ""

# Check if we're in the terraform directory
if [ ! -f "terraform.tfstate" ]; then
  echo "❌ Error: terraform.tfstate not found"
  echo "   Run this script from the terraform directory after 'terraform apply'"
  exit 1
fi

# Get IPs from Terraform outputs
echo "📋 Getting server IPs from Terraform..."
MANAGER_IP=$(terraform output -raw manager_public_ip)
MANAGER_PRIVATE=$(terraform output -raw manager_private_ip)
WORKER_IP=$(terraform output -raw worker_public_ip)
WORKER_PRIVATE=$(terraform output -raw worker_private_ip)

echo "   Manager: $MANAGER_IP (private: $MANAGER_PRIVATE)"
echo "   Worker:  $WORKER_IP (private: $WORKER_PRIVATE)"
echo ""

# Wait for Docker to be ready on both nodes
echo "⏳ Waiting for Docker installation to complete..."
for i in {1..30}; do
  if ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 root@$MANAGER_IP "docker --version" &>/dev/null && \
     ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 root@$WORKER_IP "docker --version" &>/dev/null; then
    echo "✅ Docker is ready on both nodes"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "❌ Timeout waiting for Docker installation"
    exit 1
  fi
  echo "   Attempt $i/30... (waiting 10s)"
  sleep 10
done
echo ""

# Initialize Swarm on manager
echo "🐝 Step 5: Initializing Swarm on manager..."
ssh root@$MANAGER_IP "docker swarm init --advertise-addr $MANAGER_PRIVATE" || {
  echo "❌ Failed to initialize Swarm"
  echo "   The manager node may already be part of a swarm"
  echo "   To reset: ssh root@$MANAGER_IP 'docker swarm leave --force'"
  exit 1
}
echo "✅ Swarm initialized on manager"
echo ""

# Get worker join token
echo "🔑 Getting worker join token..."
JOIN_TOKEN=$(ssh root@$MANAGER_IP "docker swarm join-token worker -q")
echo "   Token: $JOIN_TOKEN"
echo ""

# Join worker to swarm
echo "🐝 Step 6: Joining worker to swarm..."
ssh root@$WORKER_IP "docker swarm join --token $JOIN_TOKEN $MANAGER_PRIVATE:2377" || {
  echo "❌ Failed to join worker to swarm"
  echo "   The worker node may already be part of a swarm"
  echo "   To reset: ssh root@$WORKER_IP 'docker swarm leave'"
  exit 1
}
echo "✅ Worker joined to swarm"
echo ""

# Verify cluster
echo "🔍 Verifying Swarm cluster..."
ssh root@$MANAGER_IP "docker node ls"
echo ""

# Create overlay network
echo "🌐 Creating overlay network 'flagmeter-net'..."
ssh root@$MANAGER_IP "docker network create --driver overlay --attachable flagmeter-net" || {
  echo "⚠️  Network may already exist, continuing..."
}
echo ""

# Verify network
echo "🔍 Verifying overlay networks..."
ssh root@$MANAGER_IP "docker network ls | grep overlay"
echo ""

echo "✅ Swarm initialization complete!"
echo ""
echo "Next steps:"
echo "  1. Add servers to Coolify UI (Steps 10-11)"
echo "  2. Configure Docker registry: ./scripts/03-configure-registry.sh"
echo "  3. Deploy stacks: ./scripts/04-deploy-stacks.sh"
echo ""
echo "Or run: terraform output next_steps"
