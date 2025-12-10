import { getRedis } from '~/lib/redis';
import { logger } from '~/lib/logger';

/**
 * Rate limiting middleware using Redis
 * Implements a sliding window rate limiter
 */
export async function rateLimit(
  identifier: string,
  limit: number = 100,
  windowSeconds: number = 60
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const redis = getRedis();
  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const windowStart = now - windowMs;

  try {
    // Remove old entries outside the window
    await redis.zremrangebyscore(key, '-inf', windowStart);

    // Count requests in current window
    const count = await redis.zcard(key);

    if (count >= limit) {
      // Get the oldest entry to calculate reset time
      const oldest = await redis.zrange(key, 0, 0, 'WITHSCORES');
      const resetAt = oldest.length > 1 ? parseInt(oldest[1]) + windowMs : now + windowMs;
      
      logger.warn({ identifier, count, limit }, 'Rate limit exceeded');
      
      return {
        allowed: false,
        remaining: 0,
        resetAt: Math.ceil(resetAt / 1000), // Convert to seconds
      };
    }

    // Add current request
    await redis.zadd(key, now, `${now}-${Math.random()}`);
    await redis.expire(key, windowSeconds);

    return {
      allowed: true,
      remaining: limit - count - 1,
      resetAt: Math.ceil((now + windowMs) / 1000),
    };
  } catch (error) {
    logger.error({ error, identifier }, 'Rate limiting error');
    // Fail open - allow request if Redis is down
    return {
      allowed: true,
      remaining: limit,
      resetAt: Math.ceil((now + windowMs) / 1000),
    };
  }
}

/**
 * Get client IP from request, handling proxies
 */
export function getClientIp(request: Request): string {
  // Check common proxy headers
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // Take the first IP in the chain
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to 'unknown' if we can't determine IP
  return 'unknown';
}

/**
 * Check CORS and add appropriate headers
 */
export function getCorsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get('origin');
  const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map(o => o.trim()) || [];
  
  // If no origins configured, allow same-origin only
  if (allowedOrigins.length === 0) {
    return {};
  }

  // Check if origin is allowed
  if (origin && (allowedOrigins.includes('*') || allowedOrigins.includes(origin))) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };
  }

  return {};
}

/**
 * Security headers for all responses
 */
export function getSecurityHeaders(isHttps: boolean = false): HeadersInit {
  const headers: HeadersInit = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Content-Security-Policy': "default-src 'self'",
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  // Only add HSTS header on HTTPS connections
  if (isHttps) {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
  }

  return headers;
}

/**
 * Combine all security headers
 */
export function getAllSecurityHeaders(request: Request): HeadersInit {
  const isHttps = request.url.startsWith('https://');
  const corsHeaders = getCorsHeaders(request);
  const securityHeaders = getSecurityHeaders(isHttps);

  return {
    ...corsHeaders,
    ...securityHeaders,
  };
}

/**
 * Check request body size
 */
export async function checkRequestSize(
  request: Request,
  maxSizeKb: number = 100
): Promise<{ valid: boolean; error?: string }> {
  const contentLength = request.headers.get('content-length');
  
  if (contentLength) {
    const sizeKb = parseInt(contentLength) / 1024;
    if (sizeKb > maxSizeKb) {
      logger.warn({ sizeKb, maxSizeKb }, 'Request size exceeds limit');
      return {
        valid: false,
        error: `Request body too large. Maximum size: ${maxSizeKb}KB`,
      };
    }
  }

  return { valid: true };
}
