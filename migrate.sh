#!/bin/bash

# FlagMeter Database Migration Script

echo "🗄️  Running FlagMeter database migrations..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo "❌ Error: .env file not found in project root"
  echo "   Run: cp .env.example .env"
  exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL not set in .env"
  exit 1
fi

echo "📍 Database: $DATABASE_URL"
echo ""

# Check if tables already exist
TABLES_EXIST=$(docker exec flagmeter-postgres-dev psql -U flagmeter -d flagmeter -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public' AND table_name='tenants'")

if [ "$TABLES_EXIST" = "1" ]; then
  echo "✅ Database schema already exists and is up to date"
  echo ""
  echo "💡 If you need to reset the database:"
  echo "   ./reset-db.sh"
  exit 0
fi

# Run migrations
cd packages/db
echo "🔄 Creating database schema..."
pnpm db:push:force

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Migrations completed successfully!"
  echo ""
  echo "💡 Tips:"
  echo "   - View database: pnpm db:studio (in packages/db)"
  echo "   - Seed test data: pnpm db:seed (in packages/db)"
  echo "   - Open TablePlus: open 'tableplus://?url=$DATABASE_URL'"
else
  echo ""
  echo "❌ Migration failed"
  echo "💡 Try resetting the database: ./reset-db.sh"
  exit 1
fi
