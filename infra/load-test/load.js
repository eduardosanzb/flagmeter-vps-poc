import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 100 },   // Ramp up to 100 VUs
    { duration: '1m', target: 500 },    // Ramp up to 500 VUs
    { duration: '2m', target: 1000 },   // Ramp up to 1000 VUs
    { duration: '1m', target: 1000 },   // Stay at 1000 VUs
    { duration: '30s', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200', 'p(99)<500'], // 95% < 200ms, 99% < 500ms
    errors: ['rate<0.1'], // Error rate should be less than 10%
    http_req_failed: ['rate<0.05'], // Less than 5% failed requests
  },
};

// Test data - cycle through tenants
const tenants = ['acme-corp', 'globex-inc', 'initech-llc'];
const features = ['gpt-4-turbo', 'gpt-4o', 'claude-3-opus', 'claude-3-sonnet'];

// Base URL - can be overridden with K6_BASE_URL env var
const BASE_URL = __ENV.K6_BASE_URL || 'http://localhost:3000';

export default function () {
  // Randomly select tenant and feature
  const tenant = tenants[Math.floor(Math.random() * tenants.length)];
  const feature = features[Math.floor(Math.random() * features.length)];
  const tokens = Math.floor(Math.random() * 5000) + 100; // 100-5100 tokens

  // POST /events
  const payload = JSON.stringify({
    tenant: tenant,
    feature: feature,
    tokens: tokens,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: '10s',
  };

  const postResponse = http.post(`${BASE_URL}/api/events`, payload, params);

  // Check response
  const postSuccess = check(postResponse, {
    'POST /events status is 201': (r) => r.status === 201,
    'POST /events has eventId': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.success === true && body.eventId !== undefined;
      } catch (e) {
        return false;
      }
    },
  });

  errorRate.add(!postSuccess);

  // 20% chance to also call GET /usage/:tenant
  if (Math.random() < 0.2) {
    const getResponse = http.get(`${BASE_URL}/api/usage/${tenant}`, params);

    const getSuccess = check(getResponse, {
      'GET /usage status is 200': (r) => r.status === 200,
      'GET /usage has valid data': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.tenantName !== undefined && body.quotaPercent !== undefined;
        } catch (e) {
          return false;
        }
      },
    });

    errorRate.add(!getSuccess);
  }

  // Small random sleep (0-50ms) to simulate real-world usage patterns
  sleep(Math.random() * 0.05);
}

export function handleSummary(data) {
  const p95 = data.metrics.http_req_duration.values['p(95)'];
  const p99 = data.metrics.http_req_duration.values['p(99)'];
  const avgRps = data.metrics.http_reqs.values.rate;
  const errorRate = data.metrics.errors ? data.metrics.errors.values.rate : 0;

  console.log('\n========================================');
  console.log('FlagMeter Load Test Results');
  console.log('========================================');
  console.log(`Total Requests: ${data.metrics.http_reqs.values.count}`);
  console.log(`Average RPS: ${avgRps.toFixed(2)}`);
  console.log(`P95 Latency: ${p95.toFixed(2)}ms`);
  console.log(`P99 Latency: ${p99.toFixed(2)}ms`);
  console.log(`Error Rate: ${(errorRate * 100).toFixed(2)}%`);
  console.log('========================================');

  // Check targets
  const p99Target = 200;
  const p99Pass = p99 <= p99Target;

  console.log(`\nP99 Target: ≤ ${p99Target}ms`);
  console.log(`P99 Result: ${p99Pass ? '✓ PASS' : '✗ FAIL'}`);

  if (!p99Pass) {
    console.log(`\nWARNING: P99 latency (${p99.toFixed(2)}ms) exceeds target (${p99Target}ms)`);
  }

  console.log('\n');

  return {
    'stdout': '', // k6 already printed summary
  };
}
