# Quick Start: Running Load Tests

## TL;DR

```bash
# Build
docker build -t flagmeter-load infra/load-test

# Run against production
docker run --name k6-test --network=host -p 5665:5665 -p 8080:8080 \
  -e K6_BASE_URL=https://demo.raus.cloud \
  flagmeter-load

# View live dashboard
open http://localhost:5665

# After test completes, view HTML report
open http://localhost:8080/report.html

# Stop container
docker stop k6-test && docker rm k6-test
```

## What to Expect

### During the Test (5 minutes)

- **0-30s**: Ramps up to 100 VUs
- **30s-1m30s**: Ramps up to 500 VUs  
- **1m30s-3m30s**: Ramps up to 1,000 VUs
- **3m30s-4m30s**: Holds at 1,000 VUs
- **4m30s-5m**: Ramps down to 0

### Error Injection

5% of requests are **intentionally invalid** to test error handling:
- Negative token values
- Zero token values

This is **expected** and validates that the API properly rejects bad input.

### Expected Metrics

#### ✅ Good Results
- **P99 Latency**: < 200ms
- **Custom Error Rate**: ~5% (from intentional invalid requests)
- **HTTP Failed Rate**: ~5% (same as above)
- **HTTP Errors (5xx)**: 0
- **Response Timeouts**: 0
- **Checks Pass Rate**: > 95%

#### ⚠️ Warning Signs

If you see:
- **P99 > 500ms**: Database or worker slowdown
- **HTTP Errors (5xx) > 0**: Application errors
- **Custom Error Rate > 10%**: More failures than expected
- **Response Timeouts > 0**: Requests taking > 10s

### Sample Failed Requests

The first 10 failed requests are logged:

```
[FAILED REQUEST #1] POST /api/events
  Status: 400
  Body: {"error":"Invalid request body"...}
  Payload: {"tenant":"acme-corp","tokens":-100}
  Invalid: true
```

Look for requests where `Invalid: false` - these are **real errors**, not test data.

## Reading the Summary

```
========================================
FlagMeter Load Test Results
========================================
Total Requests: 245832          ← Total HTTP requests made
Average RPS: 1234.56            ← Requests per second
P95 Latency: 185.23ms          ← 95% of requests faster than this
P99 Latency: 198.45ms          ← 99% of requests faster than this
========================================

Error Metrics:
========================================
Custom Error Rate: 5.23%        ← Failed any check (should be ~5%)
HTTP Failed Rate: 2.15%         ← Built-in k6 failure metric
Checks Pass Rate: 94.77%        ← % of assertions that passed
HTTP Errors (5xx): 0            ← Server errors (should be 0)
Validation Errors (4xx): 12345  ← Client errors (~5% of requests)
Check Failures: 3690            ← Total failed assertions
Response Timeouts: 0            ← Requests > 10s (should be 0)
========================================

Threshold Results:
========================================
P99 Latency (≤ 200ms): ✓ PASS
Custom Error Rate (< 10%): ✓ PASS
HTTP Failed Rate (< 5%): ✓ PASS
Checks Pass Rate (> 95%): ✗ FAIL
========================================
```

## Debugging Failures

### Check Application Logs

```bash
docker compose logs api | grep -i error
docker compose logs worker | grep -i error
```

### Check Database Connections

```bash
docker compose exec postgres psql -U flagmeter -c \
  "SELECT count(*) FROM pg_stat_activity;"
```

### Check Resource Usage

```bash
docker stats
```

Look for:
- High CPU (> 80%)
- Memory near limits
- Disk I/O

### Check Sample Failed Requests

```bash
docker logs k6-test | grep "FAILED REQUEST"
```

Look for requests where `Invalid: false` - these indicate real issues.

## Common Issues

### "Connection refused"

```
Error Rate: 100.00%
Response Timeouts: 245832
```

**Fix**: Make sure services are running:
```bash
docker compose ps
docker compose up -d
```

### High P99 Latency (> 500ms)

**Possible causes:**
- Database query slowness
- Worker queue backlog
- Insufficient resources

**Fix**: Check database indexes, worker concurrency, resource limits

### HTTP Errors (5xx) > 0

**Possible causes:**
- Database connection pool exhausted
- Redis connection failures
- Application bugs

**Fix**: Check application logs, increase connection pools

### Custom Error Rate > 10%

**Possible causes:**
- More than 5% invalid requests getting through
- Real validation errors
- Application returning unexpected responses

**Fix**: Check sample failed requests, verify API behavior

## Test Different Scenarios

### Test without error injection:

Edit `infra/load-test/load.js`:

```javascript
if (Math.random() < 0.00) { // Changed from 0.05
  tokens = Math.random() < 0.5 ? -100 : 0;
}
```

Expected: Error rate should be 0%

### Test with higher error injection (20%):

```javascript
if (Math.random() < 0.20) { // Changed from 0.05
  tokens = Math.random() < 0.5 ? -100 : 0;
}
```

Expected: Error rate should be ~20%

### Test local development:

```bash
docker run --name k6-test --network=host -p 5665:5665 -p 8080:8080 \
  -e K6_BASE_URL=http://localhost:3000 \
  flagmeter-load
```

## More Information

- **Full documentation**: See `README.md`
- **Error tracking details**: See `ERROR_TRACKING.md`
- **k6 web dashboard docs**: https://grafana.com/docs/k6/latest/results-output/web-dashboard/
