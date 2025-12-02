#!/bin/bash
# Build images and deploy to Swarm
# Usage: ./scripts/build-and-deploy-swarm.sh

set -e

echo "🏗️  Building all images in parallel..."

# Build all images in parallel
docker build -f infra/docker/Dockerfile.prometheus -t flagmeter-prometheus:latest . &
PROM_PID=$!

docker build -f infra/docker/Dockerfile.grafana -t flagmeter-grafana:latest . &
GRAF_PID=$!

docker build -f infra/docker/Dockerfile.dashboard -t flagmeter-dashboard:latest . &
DASH_PID=$!

docker build -f infra/docker/Dockerfile.worker -t flagmeter-worker:latest . &
WORK_PID=$!

# Wait for all builds to complete
echo "⏳ Waiting for Prometheus build..."
wait $PROM_PID && echo "✅ Prometheus built"

echo "⏳ Waiting for Grafana build..."
wait $GRAF_PID && echo "✅ Grafana built"

echo "⏳ Waiting for Dashboard build..."
wait $DASH_PID && echo "✅ Dashboard built"

echo "⏳ Waiting for Worker build..."
wait $WORK_PID && echo "✅ Worker built"

echo ""
echo "✅ All images built successfully!"

echo ""
echo "📦 Deploying observability stack..."
docker stack deploy -c coolify.observability.swarm.yaml obs

echo ""
echo "📦 Deploying app stack..."
docker stack deploy -c coolify.app.swarm.yaml app

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Check status:"
echo "  docker service ls"
echo "  docker service logs obs_prometheus"
echo "  docker service logs app_dashboard"
