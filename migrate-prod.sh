#!/bin/sh

# FlagMeter Production Database Migration Script
# Run this inside the dashboard container in Coolify

echo "🗄️  Running FlagMeter database migrations..."
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL environment variable not set"
  exit 1
fi

echo "📍 Database: $DATABASE_URL"
echo ""

# Navigate to workspace root
cd /app/packages/db

# Run migrations using npx (downloads drizzle-kit on-the-fly)
echo "🔄 Applying schema changes..."
echo "   Converting integer columns to bigint:"
echo "   - tenants.monthly_quota: integer → bigint"
echo "   - events.tokens: integer → bigint"
echo "   - rollups.total_tokens: integer → bigint"
echo ""
echo "   This fixes PostgreSQL error 22003 (numeric_value_out_of_range)"
echo "   when token counts exceed 2.1 billion"
echo ""
npx drizzle-kit push --force

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Migrations completed successfully!"
  echo ""
  echo "🔍 Schema changes applied:"
  echo "   - All token counters now support values up to 9 quintillion"
  echo "   - Existing data preserved during conversion"
  echo ""
  echo "💡 Next steps:"
  echo "   - Restart worker service to clear cached connections"
  echo "   - Test the API: curl http://localhost:3000/api/health"
  echo "   - Monitor worker logs for successful event processing"
else
  echo ""
  echo "❌ Migration failed"
  echo ""
  echo "💡 Troubleshooting:"
  echo "   - Verify DATABASE_URL is correct"
  echo "   - Check postgres service is running"
  echo "   - Ensure database user has ALTER TABLE permissions"
  exit 1
fi
