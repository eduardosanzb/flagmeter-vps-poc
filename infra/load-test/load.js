import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('custom_errors');
const httpErrors = new Counter('http_errors');
const validationErrors = new Counter('validation_errors');
const checkFailures = new Counter('check_failures');
const responseTimeouts = new Counter('response_timeouts');
const statusCodeDistribution = new Counter('status_codes');

// Configuration from environment variables
const BASE_URL = __ENV.K6_BASE_URL || 'http://localhost:3000';
const SCENARIO = __ENV.K6_SCENARIO || 'baseline';
const INJECT_ERRORS = __ENV.K6_INJECT_ERRORS === 'true';
const USE_SLEEP = __ENV.K6_USE_SLEEP !== 'false';

// Test data
const tenants = ['acme-corp', 'globex-inc', 'initech-llc'];
const features = ['gpt-4-turbo', 'gpt-4o', 'claude-3-opus', 'claude-3-sonnet'];

// Scenario configurations
const scenarioConfigs = {
  baseline: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '10s', target: 100 },
      { duration: '20s', target: 500 },
      { duration: '30s', target: 1000 },
      { duration: '1m', target: 2000 },
      { duration: '1m', target: 5000 },
      { duration: '2m', target: 1000 },
      { duration: '30s', target: 0 },
    ],
    exec: 'baselineTraffic',
  },

  spike: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '10s', target: 1000 },
      { duration: '30s', target: 3000 },
      { duration: '30s', target: 5000 },
      { duration: '1m', target: 3000 },
      { duration: '10s', target: 0 },
    ],
    exec: 'spikeTraffic',
  },

  stress: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '30s', target: 1000 },
      { duration: '1m', target: 3000 },
      { duration: '1m', target: 5000 },
      { duration: '1m', target: 5000 },
      { duration: '30s', target: 0 },
    ],
    exec: 'stressTraffic',
  },

  breakpoint: {
    executor: 'ramping-arrival-rate',
    startRate: 100,
    timeUnit: '1s',
    stages: [
      { duration: '1m', target: 500 },
      { duration: '1m', target: 1000 },
      { duration: '1m', target: 2000 },
      { duration: '1m', target: 3000 },
      { duration: '1m', target: 5000 },
    ],
    preAllocatedVUs: 500,
    maxVUs: 10000,
    exec: 'breakpointTraffic',
  },

  soak: {
    executor: 'constant-vus',
    vus: 500,
    duration: '10m',
    exec: 'soakTraffic',
  },

  all: {
    baseline: {
      executor: 'constant-vus',
      vus: 200,
      duration: '5m',
      exec: 'baselineTraffic',
      startTime: '0s',
    },
    spike: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 2000 },
        { duration: '30s', target: 2000 },
        { duration: '10s', target: 0 },
      ],
      exec: 'spikeTraffic',
      startTime: '1m',
    },
    stress: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 3000 },
        { duration: '1m', target: 3000 },
        { duration: '30s', target: 0 },
      ],
      exec: 'stressTraffic',
      startTime: '3m',
    },
  },
};

// Build options based on scenario
export const options = {
  scenarios: SCENARIO === 'all' ? scenarioConfigs.all : {
    [SCENARIO]: scenarioConfigs[SCENARIO],
  },

  thresholds: {
    'http_req_duration{scenario:baseline}': ['p(95)<200', 'p(99)<500'],
    'http_req_duration{scenario:spike}': ['p(99)<1000'],
    'http_req_duration{scenario:stress}': ['p(99)<2000'],
    'http_req_duration{scenario:breakpoint}': ['p(99)<3000'],
    'http_req_duration{scenario:soak}': ['p(95)<300', 'p(99)<800'],

    'http_req_failed{scenario:baseline}': ['rate<0.05'],
    'http_req_failed{scenario:spike}': ['rate<0.1'],
    'http_req_failed{scenario:stress}': ['rate<0.2'],
    'http_req_failed{scenario:breakpoint}': ['rate<0.5'],
    'http_req_failed{scenario:soak}': ['rate<0.05'],

    custom_errors: ['rate<0.3'],
    http_errors: ['count<10000'],
    checks: ['rate>0.7'],
  },
};

// Helper: Generate payload
function generatePayload(forceInvalid = false) {
  const tenant = tenants[Math.floor(Math.random() * tenants.length)];
  const feature = features[Math.floor(Math.random() * features.length)];

  let tokens;
  if (forceInvalid || (INJECT_ERRORS && Math.random() < 0.05)) {
    tokens = Math.random() < 0.5 ? -100 : 0;
  } else {
    tokens = Math.floor(Math.random() * 5000) + 100;
  }

  return JSON.stringify({ tenant, feature, tokens });
}

// Helper: Track metrics
function trackMetrics(response) {
  statusCodeDistribution.add(1, { status: response.status });

  if (response.status === 0) {
    responseTimeouts.add(1);
  } else if (response.status >= 400 && response.status < 500) {
    validationErrors.add(1);
  } else if (response.status >= 500) {
    httpErrors.add(1);
  }

  const checks = check(response, {
    'status is 201': (r) => r.status === 201,
    'has eventId': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.success === true && body.eventId !== undefined;
      } catch (e) {
        return false;
      }
    },
  });

  if (!checks) {
    errorRate.add(1);
    checkFailures.add(1);
  } else {
    errorRate.add(0);
  }
}

// Scenario 1: Baseline - Normal traffic with sleep
export function baselineTraffic() {
  const payload = generatePayload();

  const params = {
    headers: { 'Content-Type': 'application/json' },
    timeout: '10s',
    tags: { name: 'POST_/api/events', scenario: 'baseline' },
  };

  const response = http.post(`${BASE_URL}/api/events`, payload, params);
  trackMetrics(response);

  if (USE_SLEEP) {
    sleep(Math.random() * 0.1); // 0-100ms
  }
}

// Scenario 2: Spike - Fast burst
export function spikeTraffic() {
  const payload = generatePayload();

  const params = {
    headers: { 'Content-Type': 'application/json' },
    timeout: '5s',
    tags: { name: 'POST_/api/events', scenario: 'spike' },
  };

  const response = http.post(`${BASE_URL}/api/events`, payload, params);
  trackMetrics(response);
  if (USE_SLEEP) {
    sleep(Math.random() * 0.1); // 0-100ms
  }
}

// Scenario 3: Stress - Maximum throughput
export function stressTraffic() {
  const payload = generatePayload();

  const params = {
    headers: { 'Content-Type': 'application/json' },
    timeout: '5s',
    tags: { name: 'POST_/api/events', scenario: 'stress' },
  };

  const response = http.post(`${BASE_URL}/api/events`, payload, params);
  trackMetrics(response);
  // NO SLEEP
}

// Scenario 4: Breakpoint - Find breaking point
export function breakpointTraffic() {
  const payload = generatePayload();

  const params = {
    headers: { 'Content-Type': 'application/json' },
    timeout: '5s',
    tags: { name: 'POST_/api/events', scenario: 'breakpoint' },
  };

  const response = http.post(`${BASE_URL}/api/events`, payload, params);
  trackMetrics(response);
  // NO SLEEP
}

// Scenario 5: Soak - Sustained load
export function soakTraffic() {
  const payload = generatePayload();

  const params = {
    headers: { 'Content-Type': 'application/json' },
    timeout: '10s',
    tags: { name: 'POST_/api/events', scenario: 'soak' },
  };

  const response = http.post(`${BASE_URL}/api/events`, payload, params);
  trackMetrics(response);

  sleep(0.05); // 50ms
}

// Default export for backwards compatibility
export default function () {
  baselineTraffic();
}

// Enhanced summary
export function handleSummary(data) {
  const p95 = data.metrics?.http_req_duration?.values?.['p(95)'] ?? 0;
  const p99 = data.metrics?.http_req_duration?.values?.['p(99)'] ?? 0;
  const totalRequests = data.metrics?.http_reqs?.values?.count ?? 0;
  const avgRps = data.metrics?.http_reqs?.values?.rate ?? 0;

  const customErrorRate = data.metrics?.custom_errors?.values?.rate ?? 0;
  const httpReqFailedRate = data.metrics?.http_req_failed?.values?.rate ?? 0;
  const httpErrorsCount = data.metrics?.http_errors?.values?.count ?? 0;
  const validationErrorsCount = data.metrics?.validation_errors?.values?.count ?? 0;
  const checkFailuresCount = data.metrics?.check_failures?.values?.count ?? 0;
  const responseTimeoutsCount = data.metrics?.response_timeouts?.values?.count ?? 0;
  const checksRate = data.metrics?.checks?.values?.rate ?? 0;

  console.log('\n========================================');
  console.log(`FlagMeter Load Test - ${SCENARIO.toUpperCase()} Scenario`);
  console.log('========================================');
  console.log(`Total Requests: ${totalRequests}`);
  console.log(`Average RPS: ${avgRps.toFixed(2)}`);
  console.log(`P95 Latency: ${p95.toFixed(2)}ms`);
  console.log(`P99 Latency: ${p99.toFixed(2)}ms`);
  console.log('========================================');

  console.log('\nError Metrics:');
  console.log('========================================');
  console.log(`Custom Error Rate: ${(customErrorRate * 100).toFixed(2)}%`);
  console.log(`HTTP Failed Rate: ${(httpReqFailedRate * 100).toFixed(2)}%`);
  console.log(`Checks Pass Rate: ${(checksRate * 100).toFixed(2)}%`);
  console.log(`HTTP Errors (5xx): ${httpErrorsCount}`);
  console.log(`Validation Errors (4xx): ${validationErrorsCount}`);
  console.log(`Check Failures: ${checkFailuresCount}`);
  console.log(`Response Timeouts: ${responseTimeoutsCount}`);
  console.log('========================================');

  console.log('\nConfiguration:');
  console.log('========================================');
  console.log(`Scenario: ${SCENARIO}`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Error Injection: ${INJECT_ERRORS ? 'Enabled (5%)' : 'Disabled'}`);
  console.log(`Sleep Between Requests: ${USE_SLEEP ? 'Enabled' : 'Disabled'}`);
  console.log('========================================\n');

  return {
    'stdout': '',
  };
}
