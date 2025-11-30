import Redis from 'ioredis';
import { sql as pgSql } from '@flagmeter/db';
import { logger } from './logger.js';
import { checkQuotaAndNotify } from './webhook.js';
import type { EventJob } from '@flagmeter/types';

const VALKEY_URL = process.env.VALKEY_URL;
const QUEUE_NAME = process.env.QUEUE_NAME || 'events';
const WORKER_CONCURRENCY = Number(process.env.WORKER_CONCURRENCY) || 4;

if (!VALKEY_URL) {
  throw new Error('VALKEY_URL environment variable is not set');
}

const redis = new Redis(VALKEY_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
});

redis.on('error', (err) => {
  logger.error({ error: err }, 'Redis connection error');
});

redis.on('connect', () => {
  logger.info('Connected to Valkey');
});

// Process a single job from the queue
async function processJob(job: EventJob): Promise<void> {
  const startTime = Date.now();
  const { eventId, tenantId, feature, tokens, createdAt } = job;

  // Truncate to minute
  const minute = new Date(createdAt);
  minute.setSeconds(0, 0);

  logger.info({ 
    eventId, 
    tenantId, 
    feature, 
    tokens, 
    minute: minute.toISOString(),
    jobAge: Date.now() - new Date(createdAt).getTime()
  }, 'Processing event');

  try {
    // Upsert rollup using raw SQL for performance
    const rollupStart = Date.now();
    await pgSql`
      INSERT INTO rollups (tenant_id, feature, minute, total_tokens, updated_at)
      VALUES (${tenantId}, ${feature}, ${minute.toISOString()}, ${tokens}, NOW())
      ON CONFLICT (tenant_id, feature, minute)
      DO UPDATE SET
        total_tokens = rollups.total_tokens + ${tokens},
        updated_at = NOW()
    `;
    const rollupDuration = Date.now() - rollupStart;
    
    logger.debug({ 
      eventId, 
      tenantId, 
      feature, 
      rollupDuration 
    }, 'Rollup upserted');

    // Cache quota percentage in Valkey (10s TTL)
    const usageStart = Date.now();
    const usageResult = await pgSql`
      SELECT 
        t.monthly_quota,
        COALESCE(SUM(r.total_tokens), 0)::bigint AS total_tokens
      FROM tenants t
      LEFT JOIN rollups r ON r.tenant_id = t.id 
        AND r.minute >= date_trunc('month', now())
      WHERE t.id = ${tenantId}
      GROUP BY t.id, t.monthly_quota
    `;
    const usageDuration = Date.now() - usageStart;

    if (usageResult.length > 0) {
      const usage = usageResult[0]!; // Safe: we checked length > 0
      const totalTokens = Number(usage.total_tokens);
      const monthlyQuota = Number(usage.monthly_quota);
      const quotaPercent = monthlyQuota > 0 ? (totalTokens / monthlyQuota) * 100 : 0;

      // Cache in Valkey with 10s TTL
      await redis.setex(`quota:${tenantId}`, 10, quotaPercent.toString());

      const processDuration = Date.now() - startTime;
      logger.info({ 
        eventId,
        tenantId, 
        feature,
        tokens,
        totalTokens,
        monthlyQuota,
        quotaPercent: quotaPercent.toFixed(2),
        processDuration,
        rollupDuration,
        usageDuration
      }, 'Event processed successfully');

      // Check if we need to notify (≥80%)
      if (quotaPercent >= 80) {
        logger.warn({ 
          tenantId, 
          quotaPercent: quotaPercent.toFixed(2),
          totalTokens,
          monthlyQuota
        }, 'Quota threshold exceeded, checking notification');
        await checkQuotaAndNotify(tenantId, totalTokens, monthlyQuota, quotaPercent);
      }
    } else {
      logger.warn({ tenantId, eventId }, 'No usage data found for tenant');
    }
  } catch (error) {
    const processDuration = Date.now() - startTime;
    logger.error({ 
      error, 
      eventId, 
      tenantId, 
      feature, 
      tokens,
      processDuration 
    }, 'Failed to process job');
    throw error; // Re-throw to be caught by worker
  }
}

// Worker that continuously polls the queue
async function startWorker(workerId: number): Promise<void> {
  logger.info({ workerId }, 'Worker started');

  while (true) {
    try {
      // BRPOP with 2s timeout
      const result = await redis.brpop(QUEUE_NAME, 2);

      if (result) {
        const [_queue, jobData] = result;
        const job = JSON.parse(jobData) as EventJob;
        await processJob(job);
      }
    } catch (error) {
      logger.error({ error, workerId }, 'Worker error');
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  await redis.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  await redis.quit();
  process.exit(0);
});

// Start multiple workers
logger.info({ concurrency: WORKER_CONCURRENCY }, 'Starting workers');

const workers = Array.from({ length: WORKER_CONCURRENCY }, (_, i) => startWorker(i + 1));

Promise.all(workers).catch((error) => {
  logger.error({ error }, 'Worker pool failed');
  process.exit(1);
});
