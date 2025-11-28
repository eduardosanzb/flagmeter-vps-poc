#!/bin/bash
set -e

echo "=== Testing HTTP Metrics ==="
echo ""

echo "1. Checking if dashboard is running..."
if ! curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
  echo "❌ Dashboard is not running on port 3000"
  echo "   Please start it with: cd apps/dashboard && pnpm dev"
  exit 1
fi
echo "✅ Dashboard is running"
echo ""

echo "2. Sending test requests to generate metrics..."
for i in {1..5}; do
  curl -s -X POST http://localhost:3000/api/events \
    -H "Content-Type: application/json" \
    -d "{\"tenant\":\"test-$i\",\"feature\":\"gpt-4\",\"tokens\":$((i*100))}" > /dev/null
  echo "   Sent request $i/5"
done
echo "✅ Test requests sent"
echo ""

echo "3. Waiting for metrics to be collected..."
sleep 3
echo ""

echo "4. Checking metrics endpoint..."
if ! curl -s http://localhost:9464/metrics > /dev/null 2>&1; then
  echo "❌ Metrics endpoint not accessible on port 9464"
  exit 1
fi
echo "✅ Metrics endpoint is accessible"
echo ""

echo "5. Looking for HTTP server metrics..."
COUNTER_METRICS=$(curl -s http://localhost:9464/metrics | grep "http_server_requests_total" | head -3)
HISTOGRAM_METRICS=$(curl -s http://localhost:9464/metrics | grep "http_server_duration" | head -3)

if [ -z "$COUNTER_METRICS" ]; then
  echo "❌ No http_server_requests_total metrics found"
  echo ""
  echo "Available metrics:"
  curl -s http://localhost:9464/metrics | grep -E "^[a-z_]+{" | cut -d'{' -f1 | sort -u
  echo ""
  echo "This means the manual metrics are not being exported."
  echo "Check the dashboard logs for any errors."
  exit 1
fi

echo "✅ Found http_server_requests_total metrics:"
echo "$COUNTER_METRICS"
echo ""

if [ -z "$HISTOGRAM_METRICS" ]; then
  echo "⚠️  No http_server_duration metrics found"
else
  echo "✅ Found http_server_duration metrics:"
  echo "$HISTOGRAM_METRICS"
fi
echo ""

echo "6. Testing Prometheus queries..."
echo ""
echo "Request rate (last 1m):"
curl -s 'http://localhost:9090/api/v1/query?query=rate(http_server_requests_total[1m])' | python3 -m json.tool 2>/dev/null || echo "  (Prometheus not running or query failed)"
echo ""

echo "=== Summary ==="
echo "✅ All tests passed!"
echo ""
echo "You can now view the metrics in:"
echo "  - Prometheus: http://localhost:9090"
echo "  - Grafana: http://localhost:3001"
echo "  - Metrics endpoint: http://localhost:9464/metrics"
