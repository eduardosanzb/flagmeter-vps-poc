# pnpm Workspace Integration

The landing page is fully integrated into the pnpm monorepo workspace.

## ✅ What's Configured

- **Package name**: `@flagmeter/landing`
- **Workspace**: Included in `pnpm-workspace.yaml` via `apps/*`
- **Dependencies**: Shared with other workspace packages
- **Scripts**: Available from root via pnpm filters

## 🚀 Usage from Root

### Development

```bash
# Start dev server
pnpm landing:dev
```

This runs Hugo's dev server at **http://localhost:1313** with live reload.

### Production Build

```bash
# Build static site
pnpm landing:build
```

Output: `apps/landing/public/`

### From Landing Directory

```bash
cd apps/landing

# Development
pnpm run dev

# Production build
pnpm run build

# Build CSS only
pnpm run build:css
```

## 📦 Dependencies

All dependencies are hoisted to the workspace root when possible:

- **tailwindcss** - CSS framework
- **postcss** - CSS processing
- **autoprefixer** - Browser compatibility
- **concurrently** - Run multiple commands
- **Hugo** - Static site generator (installed globally)

## 🔧 Scripts Available

### Root Package Scripts

From project root (`/`):

```bash
pnpm landing:dev   # Start landing dev server
pnpm landing:build # Build landing for production
```

### Landing Package Scripts

From `apps/landing/`:

```bash
pnpm run dev        # Start Hugo + Tailwind watch
pnpm run dev:hugo   # Start Hugo server only
pnpm run dev:css    # Start Tailwind watch only
pnpm run build      # Production build (CSS + Hugo)
pnpm run build:css  # Build CSS only
```

## 🏗️ Build Process

1. **Tailwind CSS** compiles `assets/css/main.css` → `static/css/style.css`
2. **Hugo** generates static site from templates + content → `public/`

### Build Command Breakdown

```bash
pnpm run build
# Runs: pnpm run build:css && hugo --minify
```

1. `build:css` - Compile and minify Tailwind CSS
2. `hugo --minify` - Generate and minify HTML

## 📁 Workspace Structure

```
flagmeter/                    # Root
├── package.json              # Root package with landing:* scripts
├── pnpm-workspace.yaml       # Workspace config
├── pnpm-lock.yaml            # Lockfile (shared)
├── node_modules/             # Shared dependencies
└── apps/
    └── landing/              # Landing package
        ├── package.json      # @flagmeter/landing
        ├── node_modules/     # Landing-specific deps (if any)
        └── ...
```

## 🔄 Development Workflow

### 1. Install Dependencies (First Time)

```bash
# From root
pnpm install
```

This installs all workspace packages including landing.

### 2. Start Development

```bash
# From root
pnpm landing:dev
```

Or:

```bash
cd apps/landing
pnpm run dev
```

### 3. Edit Content

Edit `apps/landing/content/_index.en.md` - browser auto-refreshes!

### 4. Build for Production

```bash
# From root
pnpm landing:build
```

### 5. Deploy

See `DEPLOYMENT.md` for deployment options.

## 🐛 Troubleshooting

### "pnpm: command not found"

Install pnpm:

```bash
npm install -g pnpm
# Or
brew install pnpm
```

### "hugo: command not found"

Install Hugo:

```bash
brew install hugo
# Or download from https://gohugo.io/installation/
```

### Dependencies not found

Reinstall from root:

```bash
pnpm install --force
```

### Port already in use

Hugo uses port 1313 by default. Change it:

```bash
cd apps/landing
hugo server --port 1314
```

## 🎯 Benefits of pnpm Workspace

✅ **Shared dependencies** - Faster installs, less disk space
✅ **Consistent versions** - One lockfile for all packages
✅ **Cross-package development** - Easy to share code between apps
✅ **Simple scripts** - Run landing commands from root
✅ **Monorepo best practices** - Industry-standard setup

## 📚 Related Documentation

- **README.md** - Full landing page documentation
- **QUICKSTART.md** - Get started in 3 minutes
- **DEPLOYMENT.md** - Production deployment guide
- **pnpm Workspaces**: https://pnpm.io/workspaces

---

**Ready to develop?**

```bash
pnpm landing:dev
```

Open http://localhost:1313 and start editing `content/_index.en.md`! 🚀
