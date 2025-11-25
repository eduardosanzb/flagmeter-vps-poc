#!/bin/bash

# FlagMeter Local Development Startup Script

echo "🚀 Starting FlagMeter development environment..."

# Check if .env exists
if [ ! -f .env ]; then
  echo "📝 Creating .env from .env.example..."
  cp .env.example .env
fi

# Start Docker services (Postgres, Valkey, monitoring)
echo "🐳 Starting Docker services (Postgres, Valkey, Prometheus, Grafana, Loki)..."
docker compose -f compose.dev.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 5

# Run database migrations
echo "🗄️  Running database migrations..."
cd packages/db
pnpm db:push:force 2>/dev/null || echo "⚠️  Migration failed or already applied"
cd ../..

# Open TablePlus with database URL (error tolerant)
echo "🔍 Opening TablePlus..."
DB_URL="postgresql://flagmeter:flagmeter@localhost:5432/flagmeter"
open "tableplus://?url=$DB_URL" 2>/dev/null || echo "⚠️  TablePlus not installed or not in PATH"

echo ""
echo "✅ Infrastructure ready!"
echo ""
echo "📦 Services running:"
echo "  - PostgreSQL:  localhost:5432"
echo "  - Valkey:      localhost:6379"
echo "  - Prometheus:  http://localhost:9090"
echo "  - Grafana:     http://localhost:3001 (admin/admin)"
echo "  - Loki:        http://localhost:3100"
echo ""
echo "🗄️  Database migrations: Applied (or skipped if already done)"
echo "🔍 TablePlus: Opened (if installed)"
echo ""
echo "🔧 To start the apps, run in separate terminals:"
echo "  1. Dashboard:  cd apps/dashboard && pnpm dev"
echo "  2. Worker:     cd apps/worker && pnpm dev"
echo ""
echo "📊 Dashboard will be at: http://localhost:3000"
echo ""
