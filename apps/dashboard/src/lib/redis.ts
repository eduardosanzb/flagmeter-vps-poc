import Redis from 'ioredis';
import { logger } from './logger';

let _redis: Redis | null = null;

export function getRedis(): Redis {
  if (!_redis) {
    const VALKEY_URL = process.env.VALKEY_URL;

    if (!VALKEY_URL) {
      throw new Error('VALKEY_URL environment variable is not set');
    }

    _redis = new Redis(VALKEY_URL, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: false,
    });

    _redis.on('error', (err) => {
      logger.error({ error: err }, 'Redis connection error');
    });

    _redis.on('connect', () => {
      logger.info('Connected to Valkey');
    });
  }

  return _redis;
}

// For backwards compatibility
export const redis = new Proxy({} as Redis, {
  get(target, prop) {
    return getRedis()[prop as keyof Redis];
  },
});

export const QUEUE_NAME = process.env.QUEUE_NAME || 'events';
