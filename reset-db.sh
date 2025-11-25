#!/bin/bash

# FlagMeter Database Reset Script

echo "⚠️  WARNING: This will DELETE ALL DATA in the database!"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "❌ Reset cancelled"
  exit 0
fi

echo ""
echo "🗑️  Dropping all tables..."

# Drop all tables
docker exec flagmeter-postgres-dev psql -U flagmeter -d flagmeter -c "
  DROP TABLE IF EXISTS slack_webhooks CASCADE;
  DROP TABLE IF EXISTS rollups CASCADE;
  DROP TABLE IF EXISTS events CASCADE;
  DROP TABLE IF EXISTS tenants CASCADE;
"

echo "✅ All tables dropped"
echo ""

# Run migrations
echo "🔄 Creating fresh schema..."
cd packages/db
pnpm db:push:force

echo ""
echo "✅ Database reset complete!"
echo ""
echo "💡 Next steps:"
echo "   - Seed data: cd packages/db && pnpm db:seed"
echo "   - Start dashboard: cd apps/dashboard && pnpm dev"
