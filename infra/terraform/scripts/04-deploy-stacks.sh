#!/bin/bash
# Script: 04-deploy-stacks.sh
# Purpose: Deploy FlagMeter stacks to Swarm (Coolify guide Step 15)
# Usage: ./scripts/04-deploy-stacks.sh

set -e

echo "🚀 FlagMeter - Deploy Stacks to Swarm"
echo "======================================"
echo ""

# Check for terraform state
if [ ! -f "terraform.tfstate" ]; then
  echo "❌ Error: terraform.tfstate not found"
  exit 1
fi

# Get manager IP
echo "📋 Getting manager IP..."
MANAGER_IP=$(terraform output -raw manager_public_ip)
echo "   Manager: $MANAGER_IP"
echo ""

# Check if stack files exist
PROJECT_ROOT="$(cd ../.. && pwd)"
OBS_STACK="$PROJECT_ROOT/coolify.observability.swarm.yaml"
APP_STACK="$PROJECT_ROOT/coolify.app.swarm.yaml"

if [ ! -f "$OBS_STACK" ]; then
  echo "❌ Error: $OBS_STACK not found"
  exit 1
fi

if [ ! -f "$APP_STACK" ]; then
  echo "❌ Error: $APP_STACK not found"
  exit 1
fi

echo "📄 Stack files found:"
echo "   Observability: $OBS_STACK"
echo "   Application:   $APP_STACK"
echo ""

# Copy stack files to manager
echo "📤 Copying stack files to manager..."
scp -o StrictHostKeyChecking=no "$OBS_STACK" root@$MANAGER_IP:/root/observability.yaml
scp -o StrictHostKeyChecking=no "$APP_STACK" root@$MANAGER_IP:/root/app.yaml"
echo "✅ Files copied"
echo ""

# Deploy observability stack
echo "📦 Deploying observability stack (Prometheus, Grafana, Loki)..."
ssh root@$MANAGER_IP "docker stack deploy -c /root/observability.yaml obs"
echo "✅ Observability stack deployed"
echo ""

# Wait a bit for observability to start
echo "⏳ Waiting 10s for observability services to initialize..."
sleep 10
echo ""

# Deploy application stack
echo "📦 Deploying application stack (Dashboard, Worker, PostgreSQL, Valkey)..."
ssh root@$MANAGER_IP "docker stack deploy -c /root/app.yaml app"
echo "✅ Application stack deployed"
echo ""

# Show deployed services
echo "🔍 Deployed services:"
ssh root@$MANAGER_IP "docker service ls"
echo ""

# Show service status
echo "📊 Service status (waiting for convergence)..."
echo "   This may take 2-3 minutes for all services to start..."
echo ""
for i in {1..6}; do
  echo "   Check $i/6:"
  ssh root@$MANAGER_IP "docker service ls --format 'table {{.Name}}\t{{.Replicas}}\t{{.Image}}'" | grep -E "(NAME|obs_|app_)"
  echo ""
  if [ $i -lt 6 ]; then
    sleep 20
  fi
done

echo "✅ Stack deployment complete!"
echo ""
echo "🔗 Access your services:"
WORKER_IP=$(terraform output -raw worker_public_ip)
echo "   Dashboard:  http://$WORKER_IP:3000"
echo "   Health:     http://$WORKER_IP:3000/api/health"
echo "   Grafana:    http://$MANAGER_IP:3001"
echo "   Prometheus: http://$MANAGER_IP:9090"
echo ""
echo "📝 Useful commands:"
echo "   View all services:    ssh root@$MANAGER_IP docker service ls"
echo "   Service logs:         ssh root@$MANAGER_IP docker service logs -f SERVICE_NAME"
echo "   Service tasks:        ssh root@$MANAGER_IP docker service ps SERVICE_NAME"
echo "   Scale a service:      ssh root@$MANAGER_IP docker service scale SERVICE_NAME=N"
echo "   Remove stacks:        ssh root@$MANAGER_IP docker stack rm obs app"
