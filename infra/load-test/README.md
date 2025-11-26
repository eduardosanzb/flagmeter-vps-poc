# Load Testing

## Overview

FlagMeter uses k6 for load testing to ensure it meets performance targets:
- **Throughput**: 1,000 requests/second
- **Latency**: P99 ≤ 200ms
- **Memory**: ≤ 2GB total

## Running Load Tests

### Local Testing

1. **Start FlagMeter services:**
   ```bash
   pnpm dev
   ```

2. **Build and run load test:**
   ```bash
   docker build -t flagmeter-load infra/load-test
   docker run --name k6-test --network=host -p 5665:5665 -p 8080:8080 flagmeter-load
   ```

3. **View Results:**
   
   **During the test** (real-time):
   - Open http://localhost:5665 to see the live web dashboard
   - Monitor request rate, latency, errors, and virtual users in real-time
   
   **After the test** (static report):
   - The container stays alive after k6 finishes
   - Open http://localhost:8080/report.html to view the full HTML report
   - The report includes all charts and metrics from the test
   
4. **Stop the container:**
   ```bash
   docker stop k6-test
   docker rm k6-test
   ```

### Alternative: Auto-remove container

If you want the container to exit after the test (without the report server):

```bash
docker run --rm --network=host -p 5665:5665 \
  -e K6_WEB_DASHBOARD_EXPORT="" \
  flagmeter-load
```

### Test Scenarios

The load test supports multiple scenarios via the `K6_SCENARIO` environment variable:

**Baseline (default)** - Normal load testing:
```bash
docker run --name k6-test --network=host -p 5665:5665 -p 8080:8080 \
  -e K6_BASE_URL=https://demo.raus.cloud \
  flagmeter-load
```

**Spike** - Test sudden traffic surge (3000 VUs):
```bash
docker run --name k6-test --network=host -p 5665:5665 -p 8080:8080 \
  -e K6_SCENARIO=spike \
  -e K6_BASE_URL=https://demo.raus.cloud \
  flagmeter-load
```

**Stress** - Find breaking point (5000 VUs):
```bash
docker run --name k6-test --network=host -p 5665:5665 -p 8080:8080 \
  -e K6_SCENARIO=stress \
  -e K6_BASE_URL=https://demo.raus.cloud \
  flagmeter-load
```

**Breakpoint** - Find exact RPS capacity (forced arrival rate):
```bash
docker run --name k6-test --network=host -p 5665:5665 -p 8080:8080 \
  -e K6_SCENARIO=breakpoint \
  -e K6_BASE_URL=https://demo.raus.cloud \
  flagmeter-load
```

**Soak** - Long-term stability (10 minutes):
```bash
docker run --name k6-test --network=host -p 5665:5665 -p 8080:8080 \
  -e K6_SCENARIO=soak \
  -e K6_BASE_URL=https://demo.raus.cloud \
  flagmeter-load
```

**All** - Multiple scenarios simultaneously:
```bash
docker run --name k6-test --network=host -p 5665:5665 -p 8080:8080 \
  -e K6_SCENARIO=all \
  -e K6_BASE_URL=https://demo.raus.cloud \
  flagmeter-load
```

### Advanced Configuration

**Disable sleep for maximum throughput:**
```bash
-e K6_USE_SLEEP=false
```

**Enable error injection (5% invalid requests):**
```bash
-e K6_INJECT_ERRORS=true
```

**Example - Maximum stress:**
```bash
docker run --name k6-test --network=host -p 5665:5665 -p 8080:8080 \
  -e K6_SCENARIO=stress \
  -e K6_USE_SLEEP=false \
  -e K6_BASE_URL=https://demo.raus.cloud \
  flagmeter-load
```

See [SCENARIOS.md](./SCENARIOS.md) for detailed scenario documentation.

### Test Stages

The load test runs through these stages:
1. **Ramp-up (30s)**: 0 → 100 virtual users
2. **Ramp-up (1m)**: 100 → 500 virtual users
3. **Ramp-up (2m)**: 500 → 1,000 virtual users
4. **Sustained (1m)**: Hold at 1,000 virtual users
5. **Ramp-down (30s)**: 1,000 → 0 virtual users

Total duration: ~5 minutes

## Test Scenarios

The load test simulates:
- **80%** of requests: POST /api/events (create events)
- **20%** of requests: GET /api/usage/:tenant (query usage)
- Random tenant selection (3 tenants)
- Random feature selection (4 features)
- Random token counts (100-5,100)

## Success Criteria

- **P95 latency** < 200ms
- **P99 latency** < 500ms (target: ≤200ms for POC)
- **Error rate** < 10%
- **Failed requests** < 5%
- **Memory usage** ≤ 2GB (check with `docker stats`)

## Interpreting Results

After the test completes, you'll see detailed metrics including:

```
========================================
FlagMeter Load Test Results
========================================
Total Requests: 245832
Average RPS: 1234.56
P95 Latency: 185.23ms
P99 Latency: 198.45ms
========================================

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

### Key Metrics

#### Performance Metrics
- **Total Requests**: Total HTTP requests made
- **Average RPS**: Requests per second
- **P95 Latency**: 95th percentile response time
- **P99 Latency**: 99th percentile response time

#### Error Metrics
- **Custom Error Rate**: Percentage of requests that failed any check
- **HTTP Failed Rate**: Built-in k6 metric for HTTP request failures
- **Checks Pass Rate**: Percentage of all assertion checks that passed
- **HTTP Errors (5xx)**: Count of server errors
- **Validation Errors (4xx)**: Count of client errors (bad requests)
- **Check Failures**: Total number of failed assertions
- **Response Timeouts**: Requests that exceeded timeout (10s)

### Error Injection

The load test automatically injects **5% invalid requests** with:
- Negative token values
- Zero token values

This helps validate that error handling works correctly under load.

### Failed Request Samples

During the test, the first 10 failed requests are logged with:
- HTTP status code
- Response body (first 200 chars)
- Request payload
- Whether it was an intentionally invalid request

This helps identify patterns in failures.

## Optimization Tips

If tests fail to meet targets:

1. **Database Connection Pooling**: Adjust `max` in `packages/db/src/client.ts`
2. **Worker Concurrency**: Increase `WORKER_CONCURRENCY` env var
3. **Valkey Memory**: Monitor with `redis-cli INFO memory`
4. **Postgres Tuning**: Adjust `shared_buffers`, `work_mem` in postgres.conf
5. **Container Resources**: Increase memory/CPU limits in docker-compose.yml

## Continuous Testing

Integrate into CI/CD:

```yaml
# .github/workflows/load-test.yml
- name: Run load test
  run: |
    docker compose up -d
    sleep 30  # Wait for services to be ready
    docker build -t flagmeter-load infra/load-test
    docker run --network=flagmeter flagmeter-load
```

## Advanced Usage

### Custom k6 Options

Edit `load.js` to customize:
- Virtual users (VUs)
- Test duration
- Request patterns
- Thresholds

### Distributed Load Testing

For higher load, use k6 cloud or distributed mode:

```bash
k6 run --out cloud infra/load-test/load.js
```

## Troubleshooting

**High P99 latency:**
- Check database query performance with `EXPLAIN ANALYZE`
- Monitor queue depth in Grafana
- Verify worker is processing jobs quickly

**High error rate:**
- Check API logs: `docker compose logs api`
- Verify database connections available
- Check Valkey memory usage

**Memory exceeds 2GB:**
- Profile with `docker stats`
- Reduce worker concurrency
- Optimize Node.js heap size
