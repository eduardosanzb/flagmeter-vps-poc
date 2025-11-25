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
cd /app

# Run migrations using pnpm in packages/db
echo "🔄 Creating database schema..."
cd packages/db
pnpm db:push:force

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Migrations completed successfully!"
  echo ""
  echo "💡 Next steps:"
  echo "   - Your database schema is ready"
  echo "   - Test the API: curl http://localhost:3000/api/health"
else
  echo ""
  echo "❌ Migration failed"
  exit 1
fi
