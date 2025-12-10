# Security Audit Report

**Date:** 2025-12-10  
**Project:** FlagMeter VPS POC  
**Status:** ⚠️ Multiple security issues identified and addressed

## Executive Summary

This document outlines the security audit findings for the FlagMeter microservice application. The audit covered code security, secrets management, API security, and deployment configurations.

## Critical Findings

### 1. ⚠️ Weak Default Credentials in Deployment Files

**Severity:** HIGH  
**Status:** DOCUMENTED (requires environment variable configuration)

**Issue:**
Default credentials are present in deployment configuration files:
- `coolify.yaml`: `POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-flagmeter123}`
- `coolify.yaml`: `GF_SECURITY_ADMIN_PASSWORD: ${GF_SECURITY_ADMIN_PASSWORD:-admin}`
- `compose.prod.yml`: Similar default values
- `scripts/build-and-push.sh`: `REGISTRY_PASSWORD="${REGISTRY_PASSWORD:-test}"`

**Risk:**
If deployed without overriding these environment variables, systems will use weak default credentials that are publicly visible in the repository.

**Mitigation:**
✅ All deployment configs use environment variable substitution with defaults only for development
✅ Production deployments MUST override these via Coolify environment variables
✅ Added documentation in SECURITY.md requiring strong passwords

**Action Required:**
- Ensure production deployments set strong values for:
  - `POSTGRES_PASSWORD` (minimum 32 characters)
  - `GF_SECURITY_ADMIN_PASSWORD` (minimum 16 characters)
  - `REGISTRY_PASSWORD` (for private registry)

### 2. ⚠️ Missing Rate Limiting

**Severity:** MEDIUM  
**Status:** FIXED

**Issue:**
API endpoints (`/api/events`, `/api/usage/:tenant`) lack rate limiting, making them vulnerable to:
- DDoS attacks
- Resource exhaustion
- Abuse of the ingestion endpoint

**Mitigation:**
✅ Implemented Redis-based rate limiting middleware
✅ Applied to all API routes:
  - `/api/events`: 100 requests per minute per IP
  - `/api/usage/:tenant`: 60 requests per minute per IP
  - `/api/health`: No rate limit (needed for healthchecks)
✅ Rate limit headers included in responses

### 3. ⚠️ Missing CORS Configuration

**Severity:** MEDIUM  
**Status:** FIXED

**Issue:**
No CORS policy configured, potentially allowing unwanted cross-origin requests in production.

**Mitigation:**
✅ Added CORS middleware with strict defaults
✅ Configurable via environment variable `CORS_ORIGIN`
✅ Defaults to same-origin in production

### 4. ⚠️ Console Logging in Production Code

**Severity:** LOW  
**Status:** FIXED

**Issue:**
Several files use `console.log()` and `console.error()` which:
- May leak sensitive information in logs
- Doesn't integrate with structured logging system
- Harder to filter/search in production

**Files affected:**
- `apps/dashboard/src/lib/redis.ts`
- `apps/dashboard/src/lib/metrics.server.ts`
- `apps/dashboard/src/telemetry-init.server.ts`
- `apps/dashboard/src/routes/index.tsx`
- `packages/db/seed.ts`

**Mitigation:**
✅ Replaced all console.log/error with pino structured logger
✅ Maintains same logging functionality with better security
✅ No sensitive data logged

### 5. ✅ SQL Injection Protection

**Severity:** N/A  
**Status:** SECURE

**Finding:**
All database queries use parameterized queries via:
- Drizzle ORM's type-safe query builder
- Tagged template literals with `sql\`` preventing injection
- No string concatenation in SQL queries

**Examples:**
```typescript
// Safe - parameterized
await sql`SELECT * FROM tenants WHERE name = ${tenantName}`;

// Safe - Drizzle ORM
await db.select().from(tenants).where(eq(tenants.name, tenantName));
```

### 6. ✅ Input Validation

**Severity:** N/A  
**Status:** SECURE

**Finding:**
All API endpoints use Zod schemas for input validation:
- Type checking enforced
- Required fields validated
- Data types validated (string, number, positive integers)

**Example:**
```typescript
const createEventSchema = z.object({
  tenant: z.string().min(1),
  feature: z.string().min(1),
  tokens: z.number().int().positive(),
});
```

### 7. ⚠️ Missing Security Headers

**Severity:** MEDIUM  
**Status:** FIXED

**Issue:**
API responses lack standard security headers:
- No X-Content-Type-Options
- No X-Frame-Options
- No X-XSS-Protection
- No Strict-Transport-Security (HSTS)

**Mitigation:**
✅ Added security headers middleware
✅ All API responses now include:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains` (HTTPS only)
  - `Content-Security-Policy: default-src 'self'`

### 8. ⚠️ No Request Size Limits

**Severity:** MEDIUM  
**Status:** FIXED

**Issue:**
API endpoints don't enforce request body size limits, allowing potential memory exhaustion attacks.

**Mitigation:**
✅ Added request size limit middleware (100KB default)
✅ Configurable via `MAX_REQUEST_SIZE_KB` environment variable
✅ Returns 413 Payload Too Large for oversized requests

### 9. ✅ No Leaked Secrets in Git History

**Severity:** N/A  
**Status:** SECURE

**Finding:**
- Git history checked for committed secrets ✅
- No actual credentials found in commits ✅
- `.gitignore` properly configured to exclude `.env` files ✅
- Only `.env.example` committed (no sensitive values) ✅

### 10. ✅ Proper Secrets Management

**Severity:** N/A  
**Status:** SECURE

**Finding:**
- All secrets loaded from environment variables ✅
- No hardcoded secrets in source code ✅
- `.env.example` used as template ✅
- Production secrets managed via Coolify environment variables ✅

## Low Priority Findings

### 1. ℹ️ No Authentication/Authorization

**Status:** BY DESIGN

**Finding:**
API endpoints are publicly accessible without authentication. This appears to be intentional for the POC use case (internal microservice).

**Recommendation for Production:**
If deployed as a public API, consider adding:
- API key authentication
- JWT tokens
- OAuth2 integration
- Per-tenant API keys

### 2. ℹ️ Webhook URL Not Validated

**Status:** ACCEPTABLE

**Finding:**
Slack webhook URLs are stored and used without validation. This could allow SSRF attacks if an attacker can modify the database.

**Recommendation:**
- Validate webhook URLs against allowed domains
- Consider using webhook signing for verification

## Security Best Practices Implemented

✅ **Environment Variables**: All sensitive config loaded from env vars  
✅ **Input Validation**: Zod schemas on all API endpoints  
✅ **SQL Injection Protection**: Parameterized queries throughout  
✅ **Structured Logging**: Pino with no sensitive data in logs  
✅ **Error Handling**: Generic error messages to clients  
✅ **Health Checks**: Separate endpoint for monitoring  
✅ **Graceful Shutdown**: SIGTERM/SIGINT handlers  
✅ **Rate Limiting**: Redis-based rate limiting on API routes  
✅ **CORS Protection**: Strict CORS policy  
✅ **Security Headers**: Standard security headers on all responses  
✅ **Request Size Limits**: Prevent memory exhaustion attacks  

## Recommendations for Production Deployment

### Immediate Actions Required

1. **Set Strong Passwords:**
   ```bash
   # Generate strong passwords
   POSTGRES_PASSWORD=$(openssl rand -base64 32)
   GF_SECURITY_ADMIN_PASSWORD=$(openssl rand -base64 24)
   ```

2. **Configure CORS:**
   ```bash
   # Set allowed origins (comma-separated)
   CORS_ORIGIN=https://your-app.com,https://www.your-app.com
   ```

3. **Review Rate Limits:**
   - Default: 100 req/min for ingestion, 60 req/min for usage
   - Adjust based on your traffic patterns
   - Monitor Redis memory usage

4. **Enable HTTPS:**
   - Coolify provides automatic Let's Encrypt certificates
   - Ensure HSTS headers are working (already implemented)

### Security Monitoring

1. **Enable Audit Logging:**
   - Current logging via Pino → Loki is good
   - Consider adding database audit triggers for sensitive operations

2. **Monitor for Anomalies:**
   - Unusual request patterns (available via Prometheus metrics)
   - Failed authentication attempts (if auth is added)
   - Rate limit violations (logged by rate limiting middleware)

3. **Regular Updates:**
   - Keep dependencies updated (use `pnpm audit`)
   - Monitor CVE databases for used packages
   - Review security advisories

### Additional Hardening (Future)

1. **Add Authentication:**
   - Implement API key authentication for `/api/events`
   - Per-tenant API keys stored securely
   - Rate limiting per API key, not just per IP

2. **Database Encryption:**
   - Enable PostgreSQL SSL/TLS
   - Encrypt data at rest (available on Hetzner)

3. **Network Security:**
   - Use private networks for inter-service communication
   - Firewall rules to limit public access
   - VPN for admin access

4. **Secrets Rotation:**
   - Regular password rotation schedule
   - Automated secret rotation with vault (e.g., HashiCorp Vault)

5. **Security Scanning:**
   - Integrate CodeQL or Snyk in CI/CD
   - Container image scanning (Trivy, Clair)
   - SAST/DAST testing

## Compliance Considerations

- **GDPR**: Currently no PII collected (only tenant names and usage metrics)
- **Data Retention**: Consider implementing data retention policies
- **Audit Trail**: Logging system provides basic audit trail
- **Access Control**: Implement RBAC if multiple users need access

## Testing Recommendations

1. **Security Testing:**
   ```bash
   # Test rate limiting
   for i in {1..150}; do curl -X POST http://localhost:3000/api/events; done
   
   # Test CORS
   curl -H "Origin: http://evil.com" http://localhost:3000/api/events
   
   # Test request size limit
   curl -X POST http://localhost:3000/api/events -d @large-payload.json
   ```

2. **Penetration Testing:**
   - Consider professional pen testing before production
   - Test for common OWASP Top 10 vulnerabilities

## Summary

The codebase demonstrates good security practices in most areas:
- No leaked secrets ✅
- SQL injection protected ✅
- Input validation implemented ✅
- Structured logging ✅

Critical improvements made:
- Rate limiting added ✅
- CORS protection added ✅
- Security headers added ✅
- Request size limits added ✅
- Console logging replaced with structured logging ✅

**Production Readiness:** The application is now production-ready from a security perspective, provided that:
1. Strong passwords are set for all services
2. CORS origins are properly configured
3. Regular security updates are applied

**Last Updated:** 2025-12-10
