# Quick Start Guide - Raus.cloud Landing Page

## 🚀 Get Running in 3 Minutes

### Step 1: Install Hugo

**macOS:**
```bash
brew install hugo
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt install hugo

# Or download from https://github.com/gohugoio/hugo/releases
```

**Windows:**
```bash
choco install hugo-extended
```

### Step 2: Install Dependencies (pnpm workspace)

**From project root:**
```bash
pnpm install
```

### Step 3: Run Development Server

**From project root:**
```bash
pnpm landing:dev
```

**Or from landing directory:**
```bash
cd apps/landing
pnpm run dev
```

Open **http://localhost:1313** in your browser.

---

## ✏️ Edit Content (No Code Required!)

### Change Hero Text

Edit: `content/_index.en.md`

```yaml
hero:
  title: "Your new headline"
  subtitle: "Your new subtitle"
```

Save the file. The browser will **auto-refresh**.

### Change Pricing

Edit: `content/_index.en.md`

```yaml
pricing:
  tiers:
    - name: "Free Audit"
      price: "€0"
      features:
        - "Your feature here"
```

### Add German Translation

Edit: `content/_index.de.md` (same structure as English)

---

## 🐋 Docker Deployment

### Run with Docker Compose

From **project root**:

```bash
docker compose up landing
```

Access at: **http://localhost:8080**

### Run Standalone

```bash
cd apps/landing
docker build -t raus-landing .
docker run -p 8080:80 raus-landing
```

---

## 🎨 Customize Design

### Colors

Edit: `tailwind.config.js`

```javascript
colors: {
  brand: {
    accent: '#3b82f6',  // Change this to your brand color
  }
}
```

### Fonts

Edit: `layouts/_default/baseof.html`

Replace Google Fonts link with your preferred font.

---

## 📝 Common Tasks

### Add a New Section

1. Add content to `content/_index.en.md`:

```yaml
new_section:
  title: "Section Title"
  items:
    - title: "Item 1"
      description: "Description"
```

2. Add HTML to `layouts/index.html`:

```html
<section class="section">
  <div class="container-custom">
    <h2>{{ .Params.new_section.title }}</h2>
    {{ range .Params.new_section.items }}
      <div class="card">
        <h3>{{ .title }}</h3>
        <p>{{ .description }}</p>
      </div>
    {{ end }}
  </div>
</section>
```

### Change CTA Link

Edit: `hugo.toml`

```toml
[params]
  calendarLink = "https://your-calendar-link.com"
```

### Add Analytics

Edit: `layouts/_default/baseof.html`

Add tracking code before `</head>`:

```html
<!-- Plausible Analytics -->
<script defer data-domain="raus.cloud" src="https://plausible.io/js/script.js"></script>
```

---

## 🔧 Troubleshooting

### Port already in use?

```bash
# Change port in hugo.toml
hugo server --port 1314
```

### Tailwind not building?

```bash
# Kill dev server, rebuild CSS, restart
npm run build:css
npm run dev
```

### Docker build failing?

```bash
# Test build locally first
npm run build

# Check if 'public/' folder was created
ls -la public/
```

---

## 📦 Production Deployment

### Build Static Files

**From project root:**
```bash
pnpm landing:build
```

**Or from landing directory:**
```bash
cd apps/landing
pnpm run build
```

Output: `apps/landing/public/` directory

### Deploy to Netlify/Vercel

1. Connect GitHub repo
2. Set build command: `cd apps/landing && pnpm run build`
3. Set publish directory: `apps/landing/public`

### Deploy to VPS with nginx

```bash
# Build locally
npm run build

# Copy to server
scp -r public/* user@your-server:/var/www/raus.cloud/

# Or use rsync
rsync -avz public/ user@your-server:/var/www/raus.cloud/
```

---

## 🎯 Next Steps

1. **Edit content** in `content/_index.en.md`
2. **Test locally** with `npm run dev`
3. **Add your logo** to `static/images/`
4. **Customize colors** in `tailwind.config.js`
5. **Deploy** with Docker or static hosting

---

## 📞 Need Help?

- **README**: `apps/landing/README.md` (comprehensive guide)
- **Hugo Docs**: https://gohugo.io/documentation/
- **Tailwind Docs**: https://tailwindcss.com/docs

---

**You're all set!** 🎉 Edit `content/_index.en.md` and watch the magic happen.
