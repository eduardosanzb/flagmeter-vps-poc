#!/bin/bash

echo "🔍 Testing environment variable loading..."
echo ""

echo "📦 Testing Worker (tsx):"
cd apps/worker
tsx --env-file=../../.env -e "console.log('DATABASE_URL:', process.env.DATABASE_URL); console.log('VALKEY_URL:', process.env.VALKEY_URL)"
cd ../..

echo ""
echo "📦 Testing Dashboard (vite with envDir):"
echo "  Start dashboard with 'cd apps/dashboard && pnpm dev'"
echo "  Vite will load .env from root due to envDir config"
echo ""
echo "✅ Environment loading configured!"
