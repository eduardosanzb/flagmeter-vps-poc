# Load Test Scenarios Guide

## Overview

The load test now supports multiple configurable scenarios via environment variables. Each scenario tests different aspects of the system under different load patterns.

## Environment Variables

| Variable | Options | Default | Description |
|----------|---------|---------|-------------|
| `K6_SCENARIO` | `baseline`, `spike`, `stress`, `breakpoint`, `soak`, `all` | `baseline` | Which test scenario to run |
| `K6_INJECT_ERRORS` | `true`, `false` | `false` | Enable 5% synthetic error injection |
| `K6_USE_SLEEP` | `true`, `false` | `true` | Add sleep between requests |
| `K6_BASE_URL` | URL | `http://localhost:3000` | Target API URL |

## Scenarios

### 1. Baseline (Default)
**Purpose:** Normal load testing with realistic user behavior

**Profile:**
- 0 → 100 → 500 → 1000 VUs over 5 minutes
- Sleep between requests (0-100ms)
- Tests normal operation

**Use when:**
- Validating normal performance
- Establishing performance baselines
- Pre-production testing

**Command:**
```bash
docker run --name k6-test --network=host -p 5665:5665 -p 8080:8080 \
  -e K6_BASE_URL=https://demo.raus.cloud \
  flagmeter-load
```

**Expected:**
- RPS: ~500-800
- P99: < 500ms
- Error rate: < 5%

---

### 2. Spike
**Purpose:** Test sudden traffic surges

**Profile:**
- 0 → 1000 → 3000 VUs in 10-40 seconds
- NO sleep between requests
- Rapid ramp up and down

**Use when:**
- Testing autoscaling
- Validating cache warmup
- Preparing for traffic spikes (product launches, marketing campaigns)

**Command:**
```bash
docker run --name k6-test --network=host -p 5665:5665 -p 8080:8080 \
  -e K6_SCENARIO=spike \
  -e K6_BASE_URL=https://demo.raus.cloud \
  flagmeter-load
```

**Expected:**
- RPS: 2000-5000+ (during peak)
- P99: < 1000ms
- Error rate: < 10%
- Some errors expected during spike

---

### 3. Stress
**Purpose:** Find system limits and breaking points

**Profile:**
- 0 → 1000 → 3000 → 5000 VUs over 4 minutes
- NO sleep between requests
- Pushes system to limits

**Use when:**
- Finding capacity limits
- Testing failure modes
- Planning infrastructure scaling

**Command:**
```bash
docker run --name k6-test --network=host -p 5665:5665 -p 8080:8080 \
  -e K6_SCENARIO=stress \
  -e K6_BASE_URL=https://demo.raus.cloud \
  flagmeter-load
```

**Expected:**
- RPS: 5000-10000+ attempts
- P99: < 2000ms
- Error rate: < 20%
- System likely degrades at peak

**What breaks:**
- Database connection pool exhaustion
- Redis queue backlog
- Memory limits
- CPU saturation

---

### 4. Breakpoint
**Purpose:** Find exact RPS where system breaks

**Profile:**
- Arrival-rate executor (forces specific RPS)
- 100 → 500 → 1000 → 2000 → 3000 → 5000 RPS
- Each stage runs for 1 minute
- NO sleep

**Use when:**
- Finding maximum sustainable RPS
- Capacity planning
- SLA determination

**Command:**
```bash
docker run --name k6-test --network=host -p 5665:5665 -p 8080:8080 \
  -e K6_SCENARIO=breakpoint \
  -e K6_BASE_URL=https://demo.raus.cloud \
  flagmeter-load
```

**Expected:**
- Starts healthy, degrades progressively
- Error rate increases with RPS
- System likely breaks at 2000-3000 RPS

**Look for:**
- At what RPS does P99 exceed 1000ms?
- At what RPS do errors exceed 10%?
- At what RPS does the system become unresponsive?

---

### 5. Soak
**Purpose:** Find memory leaks and resource exhaustion over time

**Profile:**
- Constant 500 VUs for 10 minutes
- Moderate pace (50ms sleep)
- Sustained load

**Use when:**
- Testing long-running stability
- Finding memory leaks
- Validating connection pool management
- Pre-production validation

**Command:**
```bash
docker run --name k6-test --network=host -p 5665:5665 -p 8080:8080 \
  -e K6_SCENARIO=soak \
  -e K6_BASE_URL=https://demo.raus.cloud \
  flagmeter-load
```

**Expected:**
- RPS: ~300-500 (steady)
- P99: < 800ms
- Error rate: < 5%
- Memory usage should be stable

**Red flags:**
- Memory increasing over time (leak)
- Connection count increasing (not closed)
- Response time degrading over time
- Error rate increasing over time

---

### 6. All (Combined)
**Purpose:** Run multiple scenarios simultaneously

**Profile:**
- Baseline: 200 VUs constant (background)
- Spike: 2000 VUs spike at 1min
- Stress: 3000 VUs stress at 3min

**Use when:**
- Realistic mixed load testing
- Testing system under varied conditions
- Comprehensive performance validation

**Command:**
```bash
docker run --name k6-test --network=host -p 5665:5665 -p 8080:8080 \
  -e K6_SCENARIO=all \
  -e K6_BASE_URL=https://demo.raus.cloud \
  flagmeter-load
```

**Timeline:**
- 0:00-5:00: Baseline (200 VUs constant)
- 1:00-1:50: Spike (2000 VUs) + Baseline
- 3:00-4:30: Stress (3000 VUs) + Baseline

**Expected:**
- Variable RPS depending on which scenarios are active
- Errors during spike and stress phases
- System should recover when load drops

---

## Advanced Usage

### Disable Sleep for Maximum Throughput

```bash
docker run --name k6-test --network=host -p 5665:5665 -p 8080:8080 \
  -e K6_SCENARIO=baseline \
  -e K6_USE_SLEEP=false \
  -e K6_BASE_URL=https://demo.raus.cloud \
  flagmeter-load
```

This will hammer the API as fast as possible with baseline VU ramp.

### Enable Error Injection

```bash
docker run --name k6-test --network=host -p 5665:5665 -p 8080:8080 \
  -e K6_SCENARIO=baseline \
  -e K6_INJECT_ERRORS=true \
  -e K6_BASE_URL=https://demo.raus.cloud \
  flagmeter-load
```

5% of requests will have invalid data (negative/zero tokens).

### Stress Test Without Sleep

```bash
docker run --name k6-test --network=host -p 5665:5665 -p 8080:8080 \
  -e K6_SCENARIO=stress \
  -e K6_USE_SLEEP=false \
  -e K6_BASE_URL=https://demo.raus.cloud \
  flagmeter-load
```

Maximum stress - 5000 VUs with no delays. This WILL break things!

---

## Comparison Chart

| Scenario | Duration | Max VUs | Max RPS | Sleep | Goal |
|----------|----------|---------|---------|-------|------|
| **baseline** | 5min | 1000 | ~800 | Yes | Normal operation |
| **spike** | 2min | 3000 | ~5000 | No | Sudden surge |
| **stress** | 4min | 5000 | ~10000 | No | Find limits |
| **breakpoint** | 5min | Auto | 5000 | No | Find exact breaking point |
| **soak** | 10min | 500 | ~500 | Yes | Long-term stability |
| **all** | 5min | 5200 | Varies | Mixed | Realistic mixed load |

---

## Interpreting Results

### Baseline Success:
- ✅ P99 < 500ms
- ✅ Error rate < 5%
- ✅ No timeouts
- ✅ Stable memory

### Spike Success:
- ✅ System handles sudden load
- ✅ P99 < 1000ms during spike
- ✅ Error rate < 10%
- ✅ System recovers after spike

### Stress Success:
- ⚠️ System degrades gracefully
- ⚠️ Errors increase predictably
- ⚠️ No crashes or OOMs
- ⚠️ Recovers after load drops

### Breakpoint Success:
- 📊 Identifies exact RPS capacity
- 📊 Clear degradation pattern
- 📊 Predictable failure mode

### Soak Success:
- ✅ Stable performance over time
- ✅ No memory leaks
- ✅ No connection leaks
- ✅ Consistent response times

---

## Common Findings

### At ~300 RPS (Current):
- **Issue:** API response time is ~3 seconds under load
- **Likely cause:** Database or worker bottleneck
- **Fix:** Optimize queries, increase connection pool

### At ~1000 RPS:
- **Issue:** Database connection pool exhausted
- **Symptoms:** Connection timeouts, 500 errors
- **Fix:** Increase pool size, optimize connection usage

### At ~2000 RPS:
- **Issue:** Redis queue backlog
- **Symptoms:** Worker can't keep up, memory increases
- **Fix:** Scale workers, optimize processing

### At ~5000 RPS:
- **Issue:** Complete system saturation
- **Symptoms:** Timeouts, OOM, crashes
- **Fix:** Horizontal scaling, load balancing

---

## Quick Reference

```bash
# Normal testing
K6_SCENARIO=baseline

# Find breaking point
K6_SCENARIO=breakpoint

# Test sudden spike
K6_SCENARIO=spike

# Maximum stress
K6_SCENARIO=stress K6_USE_SLEEP=false

# Long-term stability
K6_SCENARIO=soak

# Everything at once
K6_SCENARIO=all
```

---

## Next Steps

1. **Run baseline** - Establish current performance
2. **Run breakpoint** - Find capacity limits
3. **Optimize bottlenecks** - Based on findings
4. **Re-test** - Validate improvements
5. **Set up monitoring** - Grafana dashboards
6. **Create alerts** - Based on thresholds discovered
