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
   docker run --rm --network=host flagmeter-load
   ```

### Custom Configuration

Override base URL:
```bash
docker run --rm --network=host -e K6_BASE_URL=http://api:3000 flagmeter-load
```

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

After the test completes, you'll see:

```
========================================
FlagMeter Load Test Results
========================================
Total Requests: 245832
Average RPS: 1234.56
P95 Latency: 185.23ms
P99 Latency: 198.45ms
Error Rate: 0.12%
========================================

P99 Target: ≤ 200ms
P99 Result: ✓ PASS
```

### Key Metrics

- **Total Requests**: Total HTTP requests made
- **Average RPS**: Requests per second
- **P95 Latency**: 95th percentile response time
- **P99 Latency**: 99th percentile response time
- **Error Rate**: Percentage of failed requests

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
