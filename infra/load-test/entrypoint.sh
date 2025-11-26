#!/bin/sh

echo "=========================================="
echo "Starting k6 Load Test"
echo "=========================================="
echo ""

# Run k6 test in background and capture PID
k6 run /scripts/load.js &
K6_PID=$!

# Wait for k6 to finish
wait $K6_PID
K6_EXIT_CODE=$?

echo ""
echo "=========================================="
echo "Load test completed with exit code: $K6_EXIT_CODE"
echo "=========================================="
echo ""

# Always start the HTTP server to keep container alive
if [ -f "/tmp/report.html" ]; then
  echo "✓ HTML report generated: /tmp/report.html"
else
  echo "⚠ No report file found at /tmp/report.html"
  echo "  Creating placeholder..."
  echo "<html><body><h1>No report generated</h1><p>The test may have failed or report export was disabled.</p></body></html>" > /tmp/report.html
fi

echo ""
echo "Starting HTTP server on port 8080..."
echo ""
echo "  View report at: http://localhost:8080/report.html"
echo ""
echo "Container will stay alive indefinitely."
echo "To stop: docker stop <container-name>"
echo "=========================================="
echo ""

# Start HTTP server in foreground to keep container alive
cd /tmp
exec busybox httpd -f -p 8080 -h /tmp
