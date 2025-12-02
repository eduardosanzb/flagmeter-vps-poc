#!/bin/bash
# Script: 00-deploy-all.sh
# Purpose: Complete end-to-end deployment (build → push → deploy)
# Usage: ./scripts/00-deploy-all.sh

set -e

echo "🚀 FlagMeter - Complete Deployment Pipeline"
echo "============================================"
echo ""

# Step 1: Build images locally and push to registry
echo "STEP 1: Build and Push Images"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
./scripts/02-build-and-push.sh
echo ""

# Step 2: Configure registry on Swarm nodes
echo "STEP 2: Configure Registry on Swarm Nodes"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
./scripts/03-configure-registry.sh
echo ""

# Step 3: Deploy stacks to Swarm
echo "STEP 3: Deploy Stacks to Swarm"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
./scripts/04-deploy-stacks.sh
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ COMPLETE DEPLOYMENT SUCCESSFUL!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Your FlagMeter deployment:"
echo ""
WORKER_IP=$(terraform output -raw worker_public_ip 2>/dev/null || echo "WORKER_IP")
MANAGER_IP=$(terraform output -raw manager_public_ip 2>/dev/null || echo "MANAGER_IP")
echo "  Dashboard:  http://$WORKER_IP:3000"
echo "  Health:     http://$WORKER_IP:3000/api/health"
echo "  Grafana:    http://$MANAGER_IP:3001"
echo "  Prometheus: http://$MANAGER_IP:9090"
echo ""
echo "📝 Next steps:"
echo "  1. Test health: curl http://$WORKER_IP:3000/api/health"
echo "  2. Run migrations: ssh root@$MANAGER_IP 'docker exec \$(docker ps -qf name=app_dashboard) sh -c \"cd /app/packages/db && pnpm db:push:force\"'"
echo "  3. Load test: cd infra/load-test && ./run-test.sh"
echo ""
