import pino from 'pino';

const lokiUrl = process.env.LOKI_URL || 'http://localhost:3100';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    targets: [
      // Console transport (pretty in dev, JSON in prod)
      process.env.NODE_ENV === 'development' ? {
        target: 'pino-pretty',
        level: 'debug',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      } : {
        target: 'pino/file',
        level: 'info',
        options: {
          destination: 1, // stdout
        },
      },
      // Loki transport
      {
        target: 'pino-loki',
        level: 'info',
        options: {
          batching: true,
          interval: 5,
          host: lokiUrl,
          labels: {
            service: 'dashboard',
            environment: process.env.NODE_ENV || 'development',
          },
          // Silently fail if Loki is unavailable
          silenceErrors: true,
          timeout: 3000,
        },
      },
    ],
  },
});
