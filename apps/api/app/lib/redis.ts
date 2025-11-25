import Redis from 'ioredis';

const VALKEY_URL = process.env.VALKEY_URL;

if (!VALKEY_URL) {
  throw new Error('VALKEY_URL environment variable is not set');
}

export const redis = new Redis(VALKEY_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: false,
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('Connected to Valkey');
});

export const QUEUE_NAME = process.env.QUEUE_NAME || 'events';
