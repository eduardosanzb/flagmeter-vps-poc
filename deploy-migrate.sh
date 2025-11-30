#!/bin/bash

# FlagMeter Automated Production Migration Script
# This script can be run from your local machine to migrate deployed containers
#
# Usage:
#   ./deploy-migrate.sh <mode>
#
# Modes:
#   docker    - Migrate Docker Compose deployment
#   coolify   - Migrate Coolify deployment (requires SSH access)
#   local     - Migrate local development environment

set -e

MODE="${1:-docker}"

echo "🗄️  FlagMeter Production Migration"
echo "=================================="
echo ""
echo "Mode: $MODE"
echo ""

case "$MODE" in
  docker)
    echo "📦 Migrating Docker Compose deployment..."
    echo ""
    
    # Check if dashboard container exists
    if ! docker ps -a --format '{{.Names}}' | grep -q "flagmeter-dashboard"; then
      echo "❌ Error: flagmeter-dashboard container not found"
      echo "   Make sure your Docker Compose stack is running"
      exit 1
    fi
    
    # Check if container is running
    if ! docker ps --format '{{.Names}}' | grep -q "flagmeter-dashboard"; then
      echo "❌ Error: flagmeter-dashboard container is not running"
      echo "   Start it with: docker compose -f compose.prod.yml up -d dashboard"
      exit 1
    fi
    
    echo "✅ Found running dashboard container"
    echo ""
    echo "🔄 Applying schema changes (integer → bigint)..."
    echo "   This will convert:"
    echo "   - tenants.monthly_quota: integer → bigint"
    echo "   - events.tokens: integer → bigint"
    echo "   - rollups.total_tokens: integer → bigint"
    echo ""
    
    # Execute migration inside dashboard container
    docker exec flagmeter-dashboard sh -c "cd /app/packages/db && npx drizzle-kit push --force"
    
    if [ $? -eq 0 ]; then
      echo ""
      echo "✅ Migration completed successfully!"
      echo ""
      echo "🔄 Restarting worker to clear cached connections..."
      docker restart flagmeter-worker
      echo ""
      echo "✅ Worker restarted"
      echo ""
      echo "🎉 Deployment migration complete!"
      echo ""
      echo "💡 Next steps:"
      echo "   - Verify health: curl http://localhost:3000/api/health"
      echo "   - Check logs: docker logs -f flagmeter-worker"
    else
      echo ""
      echo "❌ Migration failed"
      echo "💡 Troubleshooting:"
      echo "   - Check DATABASE_URL: docker exec flagmeter-dashboard env | grep DATABASE_URL"
      echo "   - Check postgres: docker ps | grep postgres"
      echo "   - View logs: docker logs flagmeter-dashboard"
      exit 1
    fi
    ;;
    
  coolify)
    echo "☁️  Migrating Coolify deployment..."
    echo ""
    
    # Check if SSH config is provided
    if [ -z "$COOLIFY_SSH_HOST" ]; then
      echo "❌ Error: COOLIFY_SSH_HOST environment variable not set"
      echo ""
      echo "💡 Usage:"
      echo "   export COOLIFY_SSH_HOST=user@your-server.com"
      echo "   export COOLIFY_DASHBOARD_CONTAINER=<container-id>  # Optional"
      echo "   ./deploy-migrate.sh coolify"
      exit 1
    fi
    
    echo "🔗 Connecting to Coolify server: $COOLIFY_SSH_HOST"
    echo ""
    
    # Find dashboard container if not specified
    if [ -z "$COOLIFY_DASHBOARD_CONTAINER" ]; then
      echo "🔍 Finding dashboard container..."
      COOLIFY_DASHBOARD_CONTAINER=$(ssh "$COOLIFY_SSH_HOST" "docker ps --filter 'name=dashboard' --format '{{.Names}}' | head -n1")
      
      if [ -z "$COOLIFY_DASHBOARD_CONTAINER" ]; then
        echo "❌ Error: Could not find dashboard container"
        echo "   Manually specify with: export COOLIFY_DASHBOARD_CONTAINER=<name>"
        exit 1
      fi
      
      echo "✅ Found container: $COOLIFY_DASHBOARD_CONTAINER"
    fi
    
    echo ""
    echo "🔄 Applying schema changes..."
    echo ""
    
    # Execute migration on remote server
    ssh "$COOLIFY_SSH_HOST" "docker exec $COOLIFY_DASHBOARD_CONTAINER sh -c 'cd /app/packages/db && npx drizzle-kit push --force'"
    
    if [ $? -eq 0 ]; then
      echo ""
      echo "✅ Migration completed successfully!"
      echo ""
      echo "🔄 Restarting worker..."
      
      # Find and restart worker
      WORKER_CONTAINER=$(ssh "$COOLIFY_SSH_HOST" "docker ps --filter 'name=worker' --format '{{.Names}}' | head -n1")
      
      if [ -n "$WORKER_CONTAINER" ]; then
        ssh "$COOLIFY_SSH_HOST" "docker restart $WORKER_CONTAINER"
        echo "✅ Worker restarted: $WORKER_CONTAINER"
      else
        echo "⚠️  Warning: Could not find worker container to restart"
        echo "   You may need to manually restart it from Coolify UI"
      fi
      
      echo ""
      echo "🎉 Coolify migration complete!"
    else
      echo ""
      echo "❌ Migration failed"
      echo "💡 Check Coolify logs in the web UI"
      exit 1
    fi
    ;;
    
  local)
    echo "🏠 Migrating local development environment..."
    echo ""
    
    # Check if .env exists
    if [ ! -f .env ]; then
      echo "❌ Error: .env file not found"
      echo "   Run: cp .env.example .env"
      exit 1
    fi
    
    # Check if postgres container is running
    if ! docker ps --format '{{.Names}}' | grep -q "flagmeter-postgres-dev"; then
      echo "❌ Error: flagmeter-postgres-dev container not running"
      echo "   Start it with: ./dev.sh"
      exit 1
    fi
    
    echo "✅ Development environment detected"
    echo ""
    echo "🔄 Applying schema changes..."
    echo ""
    
    # Run migration locally
    cd packages/db
    pnpm db:push --force
    
    if [ $? -eq 0 ]; then
      echo ""
      echo "✅ Migration completed successfully!"
      echo ""
      echo "💡 Next steps:"
      echo "   - Restart worker: cd apps/worker && pnpm dev"
      echo "   - View database: pnpm db:studio"
    else
      echo ""
      echo "❌ Migration failed"
      exit 1
    fi
    ;;
    
  *)
    echo "❌ Error: Unknown mode '$MODE'"
    echo ""
    echo "Usage: ./deploy-migrate.sh <mode>"
    echo ""
    echo "Available modes:"
    echo "  docker    - Migrate Docker Compose deployment"
    echo "  coolify   - Migrate Coolify deployment (requires SSH)"
    echo "  local     - Migrate local development environment"
    exit 1
    ;;
esac
