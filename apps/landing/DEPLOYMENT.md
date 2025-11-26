# Raus.cloud Landing Page - Deployment Guide

## 🎉 Your Site is Ready!

The landing page has been created at `/apps/landing` in your monorepo.

---

## 🚀 Development

### Local Development (Recommended)

**From project root (easiest):**

```bash
# Install dependencies (one time, if not already done)
pnpm install

# Start development server
pnpm landing:dev
```

**Or from landing directory:**

```bash
cd apps/landing

# Start development server
pnpm run dev
```

Visit: **http://localhost:1313**

**Live reload enabled** - changes to content files auto-refresh the browser.

---

## 🐋 Docker Deployment

### Option 1: Docker Compose (Integrated)

From project root:

```bash
# Start all services including landing page
docker compose up

# Or just the landing page
docker compose up landing
```

Visit: **http://localhost:8080**

### Option 2: Standalone Docker

```bash
cd apps/landing

# Build
docker build -t raus-landing .

# Run
docker run -d -p 8080:80 --name landing raus-landing
```

---

## 🌍 Production Deployment Options

### Option 1: Netlify (Recommended for Static Hosting)

1. Connect your GitHub repo to Netlify
2. Configure build settings:
   - **Base directory**: `apps/landing`
   - **Build command**: `pnpm install && pnpm run build`
   - **Publish directory**: `apps/landing/public`
3. Deploy!

**Pros**: Free, automatic HTTPS, CDN, continuous deployment
**Cons**: None for static sites

### Option 2: Vercel

```bash
cd apps/landing
pnpm run build
vercel --prod
```

### Option 3: Your Own VPS (Hetzner, DigitalOcean, etc.)

```bash
# Build locally from project root
pnpm landing:build

# Or from landing directory
cd apps/landing
pnpm run build

# Copy to server
rsync -avz apps/landing/public/ user@your-vps:/var/www/raus.cloud/

# Configure nginx on server
sudo nano /etc/nginx/sites-available/raus.cloud
```

Example nginx config:

```nginx
server {
    listen 80;
    server_name raus.cloud www.raus.cloud;
    
    root /var/www/raus.cloud;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Option 4: Docker Compose with Reverse Proxy

Add to your `docker-compose.yml`:

```yaml
services:
  landing:
    build: ./apps/landing
    expose:
      - "80"
    
  nginx-proxy:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/proxy.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/letsencrypt
```

---

## 🔒 HTTPS / SSL

### With Netlify/Vercel
Automatic! ✅

### With Your Own Server

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d raus.cloud -d www.raus.cloud

# Auto-renewal
sudo certbot renew --dry-run
```

---

## 🔧 Environment Variables

### For Docker Compose

Edit `.env` in project root:

```env
LANDING_PORT=8080
```

### For Production

No environment variables needed! Everything is configured in `hugo.toml`.

To change the calendar link:

Edit `apps/landing/hugo.toml`:

```toml
[params]
  calendarLink = "https://cal.com/eduardosanzb/15min"
```

---

## 📊 Performance Checklist

- ✅ Gzip compression enabled
- ✅ Static assets cached (1 year)
- ✅ Minified HTML/CSS
- ✅ Security headers configured
- ✅ Health check endpoint (`/health`)
- ✅ Responsive images (add as needed)

### Add Analytics (Optional)

Edit `layouts/_default/baseof.html`, add before `</head>`:

```html
<!-- Plausible (privacy-friendly) -->
<script defer data-domain="raus.cloud" 
        src="https://plausible.io/js/script.js"></script>

<!-- Or Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🎨 Customization Guide

### Change Colors

Edit `apps/landing/tailwind.config.js`:

```javascript
colors: {
  brand: {
    accent: '#3b82f6',  // Your brand color
  }
}
```

Rebuild:

```bash
npm run build:css
```

### Change Content

Edit `apps/landing/content/_index.en.md` (English) or `_index.de.md` (German)

**No code knowledge required!** Just edit the YAML frontmatter.

### Add Logo

1. Add logo to `apps/landing/static/images/logo.png`
2. Edit `apps/landing/layouts/partials/header.html`:

```html
<a href="{{ .Site.BaseURL }}">
  <img src="/images/logo.png" alt="Raus.cloud" class="h-8">
</a>
```

---

## 🔍 SEO Checklist

- ✅ Meta descriptions configured
- ✅ Open Graph tags added
- ✅ Twitter Card tags added
- ✅ Semantic HTML structure
- ✅ Mobile responsive
- ✅ Fast load times (<1s)

### Generate Sitemap

Hugo automatically generates `sitemap.xml` at:
- https://raus.cloud/sitemap.xml

### Submit to Google

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `raus.cloud`
3. Submit sitemap: `https://raus.cloud/sitemap.xml`

---

## 📈 Monitoring

### Health Check

The nginx container includes a health endpoint:

```bash
curl http://localhost:8080/health
# Expected: "healthy"
```

### Docker Health Status

```bash
docker ps
# Check STATUS column - should show "healthy"
```

### Uptime Monitoring

Use a service like:
- **UptimeRobot** (free)
- **Better Uptime** (paid)
- **Pingdom** (paid)

Monitor: `https://raus.cloud/health`

---

## 🐛 Troubleshooting

### Site not loading?

```bash
# Check if container is running
docker ps | grep landing

# Check logs
docker logs flagmeter-landing

# Restart
docker compose restart landing
```

### Styles not applying?

```bash
# Rebuild CSS
cd apps/landing
npm run build:css

# Rebuild Docker image
docker compose build landing
docker compose up landing
```

### Language switcher not working?

Check that both content files exist:
- `content/_index.en.md`
- `content/_index.de.md`

### 404 errors?

Check nginx config allows language paths:

```nginx
location /de/ {
    try_files $uri $uri/ /de/index.html;
}
```

---

## 📦 Backup & Version Control

### Git

Already configured! The landing page is part of your monorepo.

```bash
git add apps/landing/
git commit -m "feat: add landing page for raus.cloud"
git push
```

### Content Backup

Content is in markdown files - version controlled with Git.

To backup separately:

```bash
tar -czf landing-content-backup.tar.gz apps/landing/content/
```

---

## 🎯 Launch Checklist

Before going live:

- [ ] Update calendar link in `hugo.toml`
- [ ] Add logo to `static/images/`
- [ ] Customize colors in `tailwind.config.js`
- [ ] Review all content in `content/_index.en.md`
- [ ] Translate content in `content/_index.de.md`
- [ ] Test on mobile devices
- [ ] Set up analytics (Plausible/Google)
- [ ] Configure HTTPS/SSL
- [ ] Submit sitemap to Google
- [ ] Set up uptime monitoring
- [ ] Test calendar booking link

---

## 📞 Support

- **Quick Start**: `apps/landing/QUICKSTART.md`
- **Full Documentation**: `apps/landing/README.md`
- **Hugo Docs**: https://gohugo.io/documentation/
- **Tailwind Docs**: https://tailwindcss.com/docs

---

## 🚀 You're Ready to Launch!

1. Start dev server: `npm run dev`
2. Edit content: `content/_index.en.md`
3. Deploy with: `docker compose up landing`
4. Point domain: `raus.cloud → your-server-ip`

**Good luck with your infrastructure optimization business!** 🎉
