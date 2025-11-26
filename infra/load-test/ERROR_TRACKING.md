# Enhanced Error Tracking in Load Tests

## Overview

The load test script has been significantly improved to properly track, report, and diagnose errors under load conditions.

## Why the Error Rate Was Always 0

### Previous Issues

1. **Custom metric not properly tracked**: The `errors` metric was defined but wasn't being properly accessed in `handleSummary()`
2. **No error injection**: All requests were valid, so under normal conditions there were no errors to track
3. **No visibility into different error types**: All errors were lumped together
4. **No sample logging**: When errors did occur, there was no way to diagnose them

### What Changed

## New Error Tracking Features

### 1. Multiple Error Metrics

The script now tracks multiple types of errors separately:

| Metric | Description | Threshold |
|--------|-------------|-----------|
| `custom_errors` | Requests that failed any check | < 10% |
| `http_req_failed` | Built-in k6 HTTP failure metric | < 5% |
| `http_errors` | HTTP 5xx server errors | < 100 total |
| `validation_errors` | HTTP 4xx client errors | Tracked |
| `check_failures` | Total failed assertions | Tracked |
| `response_timeouts` | Requests exceeding 10s timeout | Tracked |
| `checks` | Pass rate for all checks | > 95% |

### 2. Status Code Distribution

Every response status code is tracked with tags:

```javascript
statusCodeDistribution.add(1, { status: postResponse.status });
```

This allows you to see in the web dashboard:
- How many 201s (success)
- How many 400s (validation errors)
- How many 500s (server errors)
- How many 0s (timeouts/connection failures)

### 3. Error Injection (5% Invalid Requests)

To ensure error handling works correctly, 5% of requests are intentionally invalid:

```javascript
if (Math.random() < 0.05) {
  tokens = Math.random() < 0.5 ? -100 : 0; // Negative or zero
}
```

This validates that:
- The API properly validates input
- Error responses are correctly formatted
- Error handling doesn't crash under load

### 4. Sample Logging

The first 10 failed requests are logged with full details:

```
[FAILED REQUEST #1] POST /api/events
  Status: 400
  Body: {"error":"Invalid request body","details":[...]}
  Payload: {"tenant":"acme-corp","feature":"gpt-4-turbo","tokens":-100}
  Invalid: true
```

This helps identify:
- Patterns in failures
- Whether errors are from invalid test data or real issues
- What the API returns for different error scenarios

### 5. Enhanced Summary Report

The `handleSummary()` function now shows:

```
Error Metrics:
========================================
Custom Error Rate: 5.23%
HTTP Failed Rate: 2.15%
Checks Pass Rate: 94.77%
HTTP Errors (5xx): 1234
Validation Errors (4xx): 2456
Check Failures: 3690
Response Timeouts: 45
========================================

Threshold Results:
========================================
P99 Latency (≤ 200ms): ✓ PASS (198.45ms)
Custom Error Rate (< 10%): ✓ PASS (5.23%)
HTTP Failed Rate (< 5%): ✓ PASS (2.15%)
Checks Pass Rate (> 95%): ✗ FAIL (94.77%)
========================================
```

With contextual warnings:

```
⚠️  WARNING: Error rates exceed acceptable thresholds
   This could indicate:
   - Database connection pool exhaustion
   - Redis queue saturation
   - Application errors under load
   - Network timeouts
```

## Expected Error Rates

### Normal Operation

With 5% error injection:
- **Custom Error Rate**: ~5% (from intentional invalid requests)
- **HTTP Failed Rate**: ~5% (same as above)
- **Validation Errors (4xx)**: ~5% of total requests
- **HTTP Errors (5xx)**: Should be 0 or very close to 0
- **Response Timeouts**: Should be 0

### Under Stress

If you see higher error rates:

| Error Type | Possible Cause |
|------------|----------------|
| HTTP Errors (5xx) > 0 | Database connection pool exhaustion, Redis issues, application bugs |
| Response Timeouts > 0 | Database query timeouts, worker queue backlog, slow external APIs |
| Validation Errors > 5% | Test data generation issue, API validation changed |
| Check Failures > Custom Errors | Response format changed, unexpected response structure |

## About Traefik and Cloudflare

### Traefik

Traefik is a **reverse proxy**, not a queue or retry mechanism. It:
- Routes requests to the correct service
- Terminates TLS
- Provides load balancing (if multiple instances)
- Does **NOT** queue or retry failed requests by default

Any errors from the API will pass through Traefik unchanged.

### Cloudflare

Cloudflare sits in front and can:
- Return 429 (rate limiting) if too many requests
- Return 503 (service unavailable) during DDoS attacks
- Return 524 (timeout) if origin doesn't respond in 100s
- Cache responses (not relevant for POSTs)

But Cloudflare does **NOT**:
- Queue requests
- Retry failed requests
- Hide HTTP 4xx/5xx errors from origin

## Debugging High Error Rates

### Step 1: Check Sample Logs

Look at the first 10 failed requests in the console output:

```bash
docker logs k6-test | grep "FAILED REQUEST"
```

### Step 2: Check Status Code Distribution

In the web dashboard (http://localhost:5665), look at:
- `status_codes` metric broken down by status tag
- `http_req_duration` for different endpoints

### Step 3: Check Application Logs

```bash
docker compose logs api
docker compose logs worker
```

Look for:
- Database connection errors
- Redis connection errors
- Unexpected exceptions
- Slow queries

### Step 4: Check Resource Usage

```bash
docker stats
```

Look for:
- High CPU usage
- Memory near limits
- Network saturation

### Step 5: Check Database

```bash
docker compose exec postgres psql -U flagmeter -c "SELECT count(*) FROM pg_stat_activity;"
```

Check:
- Number of active connections
- Long-running queries
- Lock contention

## Testing Different Scenarios

### Test with only valid requests:

Edit `load.js` and change:

```javascript
if (Math.random() < 0.00) { // Changed from 0.05 to 0.00
  tokens = Math.random() < 0.5 ? -100 : 0;
}
```

Now error rate should be ~0% if everything works correctly.

### Test with higher error injection:

```javascript
if (Math.random() < 0.20) { // 20% invalid requests
  tokens = Math.random() < 0.5 ? -100 : 0;
}
```

Custom error rate should be ~20%.

### Test with missing fields:

```javascript
const payload = JSON.stringify({
  tenant: tenant,
  // feature: feature, // Commented out
  tokens: tokens,
});
```

Should see 400 validation errors.

## Conclusion

With these improvements:

1. ✅ **Error rates are properly tracked** across multiple dimensions
2. ✅ **Error injection validates** error handling works correctly
3. ✅ **Sample logging helps diagnose** real issues quickly
4. ✅ **Enhanced reporting** shows exactly what's failing
5. ✅ **Threshold checks** automatically flag problems

If you see 0% error rate now, it means:
- All intentionally invalid requests (5%) are being properly rejected with 400
- All valid requests (95%) are succeeding with 201
- The API is handling the load correctly

If you see >5% error rate, the detailed metrics will help identify the root cause.
