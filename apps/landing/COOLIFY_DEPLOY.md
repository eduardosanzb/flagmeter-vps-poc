# Deploy Landing Page to Coolify

Quick guide to deploy the Raus.cloud landing page to Coolify.

## 🚀 Deployment Steps

### 1. Push to Git

```bash
git push origin main
```

Coolify will auto-detect the changes from `coolify.yaml`.

### 2. Coolify Configuration

The landing service is already configured in `coolify.yaml`:

```yaml
landing:
  build:
    dockerfile: Dockerfile
    context: apps/landing
  ports:
    - "8080:80"
  healthcheck:
    test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
```

### 3. Resource Allocation

- **Memory**: 128MB (minimal, it's static nginx)
- **CPU**: 0.1 (very light)
- **Port**: 8080 (maps to nginx port 80)

### 4. Domain Configuration

In Coolify dashboard:

1. Go to your service → **Domains**
2. Add domain: `raus.cloud`
3. Enable HTTPS (automatic Let's Encrypt)
4. Save

### 5. Environment Variables

No environment variables needed! Everything is built into the static site.

To change the calendar link, edit `apps/landing/hugo.toml` before building:

```toml
[params]
  calendarLink = "https://cal.com/eduardosanzb/15min"
```

## 🔧 Manual Deploy (Optional)

If you need to manually trigger a deployment:

1. Go to Coolify dashboard
2. Select the `landing` service
3. Click **Deploy** or **Redeploy**

## 🌐 Access

After deployment:

- **Landing page**: https://raus.cloud
- **German version**: https://raus.cloud/de/
- **Health check**: https://raus.cloud/health

## 📊 Monitoring

### Health Check

Coolify automatically monitors the health endpoint:

```bash
curl https://raus.cloud/health
# Expected: "healthy"
```

### Logs

View logs in Coolify dashboard or via CLI:

```bash
docker logs flagmeter-landing
```

## 🔄 Update Content

To update content without redeploying code:

1. Edit `apps/landing/content/_index.en.md` or `_index.de.md`
2. Commit changes
3. Push to git
4. Coolify auto-deploys

## 🐛 Troubleshooting

### Landing page not accessible

1. Check service status in Coolify
2. Verify domain DNS points to Coolify server
3. Check logs: `docker logs flagmeter-landing`

### 502 Bad Gateway

1. Check health endpoint: `curl http://localhost:8080/health`
2. Restart service in Coolify
3. Check nginx logs

### Build fails

1. Verify Hugo is available in Docker image
2. Check Dockerfile for missing dependencies
3. Try building locally: `pnpm landing:build`

## 📝 Production Checklist

Before going live:

- [ ] Update calendar link in `hugo.toml`
- [ ] Review all content in `content/_index.en.md`
- [ ] Translate content in `content/_index.de.md`
- [ ] Add custom logo to `static/images/`
- [ ] Test on mobile devices
- [ ] Configure domain in Coolify
- [ ] Enable HTTPS
- [ ] Test all CTAs link to correct calendar
- [ ] Monitor health endpoint

## 🎯 Multi-Domain Setup

If you want to serve from multiple domains:

1. In Coolify, add multiple domains:
   - `raus.cloud`
   - `www.raus.cloud`
   
2. Configure redirects if needed (in nginx.conf)

## 🔐 Security

The landing page is secure by default:

- ✅ Security headers configured
- ✅ No server-side code
- ✅ No cookies or tracking
- ✅ Static files only
- ✅ HTTPS via Let's Encrypt

## 🚢 Deployment Architecture

```
GitHub → Coolify → Docker Build → Nginx Container → Port 8080

Your domain (raus.cloud)
    ↓
Coolify reverse proxy (HTTPS)
    ↓
Landing container (port 8080)
    ↓
Nginx serves static files
```

## 📊 Performance

Expected metrics:

- **Build time**: ~2-3 minutes (first build, cached after)
- **Container size**: ~50MB
- **Response time**: <50ms
- **Uptime**: 99.9%+

## 💡 Tips

### Faster Deploys

Coolify caches Docker layers. After first deploy, subsequent deploys are ~30s.

### Zero Downtime

Coolify does rolling deployments automatically.

### Preview Deployments

Preview deployments are configured in `coolify.yaml`:

```yaml
previews:
  enabled: true
  pattern: pr-{number}
```

Each PR gets its own preview URL.

---

**Ready to deploy?**

```bash
git push origin main
```

Then configure the domain in Coolify dashboard! 🚀
