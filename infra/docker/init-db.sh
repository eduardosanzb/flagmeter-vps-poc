#!/bin/bash
set -e

echo "Running Drizzle migrations..."
cd /app
pnpm db:push
echo "Database initialized successfully"
