# Raus.cloud Landing Page

A clean, minimalistic, and elegant one-page static site built with Hugo and Tailwind CSS. Supports English and German localization.

## 🎯 Overview

This landing page is designed to generate qualified audit bookings for infrastructure optimization services. It features:

- **Hero Section** - Value proposition with clear CTA
- **How It Works** - 3-step process from audit to migration
- **Operating Principles** - 4 core principles of how we work
- **Quality Pillars** - 3 non-negotiable deliverables
- **Transparent Pricing** - Free audit, pilot, and full migration
- **FAQ** - Handling objections, engineer to engineer

## 📚 Documentation

- **[Quick Start Guide](QUICKSTART.md)** - Content management basics
- **[Refactoring Demo](REFACTORING_DEMO.md)** - Complete usage guide
- **[Empty Section Protection](EMPTY_SECTION_PROTECTION.md)** - How empty sections work
- **[Commit Summary](COMMIT_SUMMARY.md)** - Technical overview of refactoring

## 🚀 Quick Start

### Development

**From project root (recommended):**

```bash
# Install dependencies (if not already done)
pnpm install

# Run development server
pnpm landing:dev

# Open browser at http://localhost:1313
```

**Or from landing directory:**

```bash
cd apps/landing

# Run development server (Hugo + Tailwind watch mode)
pnpm run dev
```

### Production Build

**From project root:**

```bash
# Build for production
pnpm landing:build
```

**Or from landing directory:**

```bash
cd apps/landing
pnpm run build
```

**Build with Docker:**

```bash
docker build -t raus-landing apps/landing

# Run production container
docker run -p 8080:80 raus-landing
```

### Using Docker Compose

```bash
# From project root
docker compose up landing

# Access at http://localhost:8080
```

## 📝 Editing Content

### **All content is in markdown files - NO CODE EDITING REQUIRED!**

### English Content

Edit: `content/_index.en.md`

```yaml
---
# Hero Section
hero:
  title: "Your headline here"
  subtitle: "Your subheadline here"
  cta_primary: "Button text"
  cta_secondary: "Secondary button text"

# How It Works
how_it_works:
  title: "Section title"
  subtitle: "Section subtitle"
  steps:
    - number: "01"
      title: "Step title"
      description: "Step description"
---
```

### German Content

Edit: `content/_index.de.md`

Same structure as English file, with German translations.

### UI Strings (Buttons, Navigation, etc.)

Edit: `i18n/en.toml` (English) or `i18n/de.toml` (German)

```toml
[cta]
[cta.bookAudit]
other = "Get Free Audit"

[navigation]
[navigation.home]
other = "Home"
```

## 🎨 Design System

### Color Palette (Subtle & Modern)

- **Primary Dark**: `#1e293b` - Dark backgrounds
- **Accent Blue**: `#3b82f6` - CTAs and highlights
- **Light Background**: `#f8fafc` - Light sections
- **Text Dark**: `#0f172a` - Body text
- **Text Muted**: `#475569` - Secondary text
- **Border**: `#e2e8f0` - Subtle borders

### Typography

- **Font**: Inter (via Google Fonts)
- **Hero**: 3.5rem / 56px
- **Display**: 2.5rem / 40px
- **Body**: 1rem / 16px

### Components

All styling uses Tailwind CSS utility classes. Custom components are defined in `assets/css/main.css`:

- `.btn` - Button base
- `.btn-primary` - Primary CTA button
- `.btn-secondary` - Secondary button
- `.card` - Content card with shadow
- `.section` - Section spacing
- `.section-dark` - Dark background section
- `.section-light` - Light background section

## 📂 Project Structure

```
apps/landing/
├── archetypes/          # Content templates
├── assets/
│   └── css/
│       └── main.css     # Tailwind source + custom styles
├── content/
│   ├── _index.en.md    # English content (EDIT THIS!)
│   └── _index.de.md    # German content (EDIT THIS!)
├── i18n/
│   ├── en.toml         # English UI strings
│   └── de.toml         # German UI strings
├── layouts/
│   ├── _default/
│   │   └── baseof.html # Base HTML template
│   ├── partials/
│   │   ├── header.html # Header with navigation
│   │   └── footer.html # Footer
│   └── index.html      # Homepage layout
├── static/
│   ├── css/            # Generated CSS (don't edit)
│   ├── images/         # Add images here
│   └── fonts/          # Add custom fonts here
├── Dockerfile          # Production build
├── nginx.conf          # Nginx configuration
├── hugo.toml           # Hugo configuration
├── package.json        # Node.js dependencies
├── tailwind.config.js  # Tailwind configuration
└── README.md           # This file
```

## 🌍 Localization

### Adding a New Language

1. Add language to `hugo.toml`:

```toml
[languages.es]
  languageName = "Español"
  weight = 3
  contentDir = "content"
```

2. Create content file: `content/_index.es.md`

3. Create translations: `i18n/es.toml`

4. Restart the dev server

### Language Switcher

The header automatically displays language options based on `hugo.toml` configuration. Users can switch between English (/) and German (/de/).

## 🔧 Configuration

### Hugo Config (`hugo.toml`)

```toml
baseURL = "https://raus.cloud"
title = "Raus.cloud - Infrastructure Without DevOps"

[params]
  calendarLink = "https://cal.com/eduardosanzb/15min"
```

### Tailwind Config (`tailwind.config.js`)

Customize colors, fonts, and other design tokens here. The config uses a subtle modern palette by default.

### Nginx Config (`nginx.conf`)

- Gzip compression enabled
- Security headers configured
- Static asset caching (1 year)
- Health check endpoint at `/health`

## 📦 Deployment

### Environment Variables

```bash
# docker-compose.yml
LANDING_PORT=8080  # Port to expose (default: 8080)
```

### Docker Compose

The landing page is integrated into the main `docker-compose.yml`:

```yaml
landing:
  build:
    context: ./apps/landing
  ports:
    - "${LANDING_PORT:-8080}:80"
  restart: unless-stopped
```

### Standalone Deployment

```bash
# Build
docker build -t raus-landing apps/landing

# Run
docker run -d -p 80:80 --name landing raus-landing

# Or use nginx directly
cd apps/landing
npm run build
# Serve the 'public/' directory with any static server
```

## 🎯 Content Strategy

### Hero Section
- **Goal**: Grab attention with clear value proposition
- **CTA**: Book free 15-min audit (primary action)
- **Keep**: One-sentence promise + short subhead

### How It Works
- **Goal**: Remove friction with simple 3-step flow
- **Emphasize**: Speed (weeks, not quarters) and transparency

### Operating Principles
- **Goal**: Show efficiency rules that boost productivity
- **Highlight**: No meetings, async, pause anytime, we fire ourselves

### Quality Pillars
- **Goal**: Set expectations and differentiate from commodity work
- **Focus**: 60% guarantee, 2-day ownership, tests + runbooks

### Pricing
- **Goal**: Make the decision low-risk
- **Strategy**: Plain pricing + strong guarantee (money back)

### FAQ
- **Goal**: Handle objections proactively
- **Tone**: Engineer to engineer, no BS

## 🛠 Troubleshooting

### Tailwind styles not updating

```bash
# Kill the dev server and restart
npm run dev
```

### Hugo not finding content

- Check that frontmatter is valid YAML (use `---` delimiters)
- Ensure file is in `content/` directory
- Verify language code matches `hugo.toml`

### Build fails in Docker

```bash
# Check Node.js and Hugo versions in Dockerfile
# Ensure package-lock.json is committed
# Try building locally first: npm run build
```

### Language switcher not working

- Verify language is configured in `hugo.toml`
- Check that content file exists for that language
- Ensure `defaultContentLanguage` is set correctly

## 📊 Performance

- **Build Time**: ~2-3 seconds
- **Page Size**: ~50KB (HTML + CSS + JS)
- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: <1s

## 🔒 Security

- No server-side code (static site)
- Security headers configured in nginx
- No cookies or tracking (privacy-first)
- HTTPS ready (configure with reverse proxy)

## 🚢 Next Steps

1. **Add Analytics** (optional): Integrate Plausible or Simple Analytics
2. **A/B Testing**: Test different headlines and CTAs
3. **Social Proof**: Add testimonials when available
4. **Blog**: Create `/blog` section for content marketing
5. **SEO**: Add sitemap.xml and robots.txt (Hugo generates these)

## 📞 Support

For questions or issues:

- **Project**: https://github.com/eduardosanzb/flagmeter
- **Landing Page**: apps/landing/
- **Contact**: eduardo@raus.cloud

---

**Built with**: Hugo, Tailwind CSS, Alpine.js, Nginx
**Domain**: https://raus.cloud
**License**: MIT
