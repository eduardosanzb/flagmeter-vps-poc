import pino from 'pino';

const lokiUrl = process.env.LOKI_URL || 'http://localhost:3100';

const logger = pino({
  level: 'info',
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        level: 'debug',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
      {
        target: 'pino-loki',
        level: 'info',
        options: {
          batching: true,
          interval: 5,
          host: lokiUrl,
          labels: {
            service: 'test',
            environment: 'development',
          },
          silenceErrors: false, // Show errors for debugging
          timeout: 3000,
        },
      },
    ],
  },
});

// Generate some test logs
logger.info('Test log ingestion - info level');
logger.warn({ tenant: 'test-tenant', tokens: 1500 }, 'Test warning with context');
logger.error({ err: new Error('Test error') }, 'Test error log');
logger.info({ feature: 'gpt-4-turbo', usage: 2500 }, 'Test structured log');

// Wait for batch to be sent to Loki
await new Promise(resolve => setTimeout(resolve, 6000));
logger.info('Test completed - logs should be in Loki now');
