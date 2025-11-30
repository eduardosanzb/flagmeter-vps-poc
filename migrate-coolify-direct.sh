#!/bin/bash

# Direct Coolify Migration Script
# Copy this script to your server and run it there
#
# Usage:
#   1. Copy to server: scp migrate-coolify-direct.sh root@your-server.com:/tmp/
#   2. SSH to server: ssh root@your-server.com
#   3. Run: bash /tmp/migrate-coolify-direct.sh

set -e

echo "🗄️  FlagMeter Coolify Migration"
echo "================================"
echo ""

# Find dashboard container
echo "🔍 Finding dashboard container..."
DASHBOARD_CONTAINER=$(docker ps --filter 'name=dashboard' --format '{{.Names}}' | head -n1)

if [ -z "$DASHBOARD_CONTAINER" ]; then
  echo "❌ Error: Could not find dashboard container"
  echo "   Manually specify: export DASHBOARD_CONTAINER=<name>"
  exit 1
fi

echo "✅ Found container: $DASHBOARD_CONTAINER"
echo ""

# Run migration
echo "🔄 Applying schema changes (integer → bigint)..."
echo "   This fixes PostgreSQL error 22003 (numeric_value_out_of_range)"
echo ""

docker exec "$DASHBOARD_CONTAINER" sh -c 'cd /app/packages/db && npx drizzle-kit push --config=drizzle.config.js --force'

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Migration completed successfully!"
  echo ""
  
  # Find and restart worker
  echo "🔄 Finding and restarting worker..."
  WORKER_CONTAINER=$(docker ps --filter 'name=worker' --format '{{.Names}}' | head -n1)
  
  if [ -n "$WORKER_CONTAINER" ]; then
    docker restart "$WORKER_CONTAINER"
    echo "✅ Worker restarted: $WORKER_CONTAINER"
  else
    echo "⚠️  Warning: Could not find worker container"
    echo "   You may need to manually restart it from Coolify UI"
  fi
  
  echo ""
  echo "🎉 Migration complete!"
  echo ""
  echo "💡 Next steps:"
  echo "   - Check worker logs: docker logs -f $WORKER_CONTAINER"
  echo "   - Test API: curl http://localhost:3000/api/health"
else
  echo ""
  echo "❌ Migration failed"
  echo "💡 Check the error messages above"
  exit 1
fi
