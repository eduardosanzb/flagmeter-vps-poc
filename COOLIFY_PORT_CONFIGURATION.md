# Coolify Port Configuration Guide

## How Port Mapping Works in Coolify

Coolify uses a **reverse proxy** (Traefik/Caddy) to route external traffic to your containers. Here's how it works:

```
Internet (Port 80/443) 
    ↓
Coolify Reverse Proxy (Traefik/Caddy)
    ↓
Your Container (Port 3000)
```

## Current Configuration

**In `coolify.yaml`:**
```yaml
dashboard:
  ports:
    - "3000:3000"  # Exposes container port 3000
```

**In `Dockerfile.dashboard`:**
```dockerfile
EXPOSE 3000  # Dashboard listens on port 3000 internally
```

## Step-by-Step: Configure External Access on Port 80

### Option 1: Coolify UI Configuration (Recommended)

1. **Go to Coolify Dashboard**: `https://cool.eduardosanzb.dev/`

2. **Navigate to Your Service**:
   - Click on your FlagMeter project
   - Select the **dashboard** service

3. **Configure Domain/Port**:
   - Find the "Domains" or "Network" section
   - Look for "Public Port" or "Exposed Port"
   - Set it to expose port `3000`

4. **Add Domain (Optional)**:
   - If you want a custom domain, add it in the Domains section
   - Coolify will automatically configure SSL with Let's Encrypt
   - Example: `flagmeter.yourdomain.com`

5. **Verify Routing**:
   - Coolify should show something like:
     - External: `http://your-domain.com` (port 80/443)
     - Internal: `http://dashboard:3000`

### Option 2: Environment Variable (Alternative)

Some Coolify versions use environment variables. Add this to the dashboard service in Coolify UI:

```env
PORT=3000
```

### Option 3: Explicit Port Mapping in UI

In Coolify's service settings:
- **Container Port**: `3000`
- **Public Port**: `80` (or leave empty for auto)
- **HTTPS**: Enable for port 443 access

## Current Service URL

According to the build logs, your service is already accessible at:
```
http://pccgcc0o4c4o840s4s848wko.46.224.38.202.sslip.io
```

This is a **Coolify-generated URL** that automatically routes:
- External port 80 → Container port 3000

## Verify It's Working

Once deployed, test:

```bash
# Should work (port 80 implicit)
curl http://pccgcc0o4c4o840s4s848wko.46.224.38.202.sslip.io/api/health

# Should also work (explicit port 80)
curl http://pccgcc0o4c4o840s4s848wko.46.224.38.202.sslip.io:80/api/health

# Should NOT work (direct container port)
curl http://pccgcc0o4c4o840s4s848wko.46.224.38.202.sslip.io:3000/api/health
```

## Enable HTTPS (Port 443)

To enable HTTPS:

1. **In Coolify UI**:
   - Go to dashboard service settings
   - Find "SSL/TLS" or "HTTPS" section
   - Enable automatic SSL certificate
   - Coolify will use Let's Encrypt

2. **Or add a custom domain**:
   - Add your domain in Coolify
   - Point your DNS to Coolify's IP
   - Coolify will automatically provision SSL

Then your service will be accessible on:
- `http://your-domain.com` (port 80)
- `https://your-domain.com` (port 443)

## Troubleshooting

### Service not accessible on port 80

Check in Coolify UI:
1. Service is running ✅
2. Port 3000 is exposed ✅
3. Reverse proxy is enabled ✅
4. No firewall blocking port 80

### Getting "Connection Refused"

- Check container logs in Coolify
- Verify dashboard is actually listening on port 3000
- Check healthcheck is passing

### Want to change internal port

If you need the dashboard to use a different internal port:

1. **Update Dockerfile**:
```dockerfile
EXPOSE 8080
ENV PORT=8080
```

2. **Update coolify.yaml**:
```yaml
ports:
  - "8080:8080"
```

3. **Update healthcheck**:
```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:8080/api/health"]
```

## Summary

✅ **No code changes needed** - your configuration is correct

📝 **What Coolify does automatically**:
- Detects port 3000 from your container
- Creates a reverse proxy route
- Maps external port 80/443 → internal port 3000
- Provides a public URL

🔧 **What you need to do in Coolify UI**:
- Verify the dashboard service has port 3000 exposed
- Optionally add a custom domain
- Enable HTTPS if desired

The port mapping happens **at the infrastructure level** (Coolify's reverse proxy), not in your application code.
