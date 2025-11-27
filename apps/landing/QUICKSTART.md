# Quick Start Guide - Landing Page Management

## 🚀 Managing Your Landing Page

Your landing page is now fully modular and content-driven. Here's everything you need to know:

---

## 📝 Reorder Sections (Most Common Task)

**Edit:** `content/_index.en.md`

```yaml
sections:
  - how_it_works
  - principles
  - pillars
  - pricing
  - faq
```

**Want pricing first?** Just move it:

```yaml
sections:
  - pricing          # ← Moved to top!
  - how_it_works
  - principles
  - pillars
  - faq
```

**That's it!** No code changes needed. 🎉

---

## 🙈 Hide a Section

**Option 1: Comment out**

```yaml
sections:
  - how_it_works
  # - principles    # ← Hidden
  - pricing
```

**Option 2: Empty the items** (section auto-skips)

```yaml
principles:
  title: "How We Work"
  subtitle: "Coming soon"
  items: []         # ← Empty = not rendered
```

---

## 🔁 Duplicate a Section

```yaml
sections:
  - how_it_works
  - pricing
  - how_it_works   # ← Shows twice!
```

Great for A/B testing or emphasizing content!

---

## ➕ Add Content to a Section

Edit the `items` array:

```yaml
how_it_works:
  title: "Three Steps to Freedom"
  subtitle: "..."
  items:
    - number: "01"
      title: "Step 1"
      description: "..."
    - number: "02"      # ← Add more items
      title: "Step 2"
      description: "..."
```

---

## 🌍 Update Both Languages

Always update both files:
- `content/_index.en.md` (English)
- `content/_index.de.md` (German)

Keep the `sections` array in sync!

---

## 🏗️ Build & Deploy

```bash
# From project root
cd apps/landing

# Build CSS
npm run build:css

# Build site
hugo --minify

# Preview locally
hugo server --port 1313
# Visit: http://localhost:1313
```

---

## 📂 Section Types (Auto-Detected)

You don't need to specify types—they're auto-detected from data:

| Type | Detected By | Example Use |
|------|------------|-------------|
| **step-cards** | `number` field | How it works (01, 02, 03) |
| **icon-cards** | `icon` field | Principles (with icons) |
| **pricing-cards** | `price` field | Pricing tiers |
| **faq-accordion** | `question` field | FAQ section |
| **simple-cards** | (default) | Basic cards (What You Get) |

---

## ⚠️ Common Mistakes

### ❌ Don't Do This:
```yaml
sections:
  - new_section      # ← Section data doesn't exist below
```

### ✅ Do This:
```yaml
sections:
  - how_it_works     # ← Make sure this exists below

how_it_works:
  title: "..."
  items: [...]
```

---

## 🆘 Troubleshooting

### Section Not Showing?

**Check:**
1. Is it in the `sections` array?
2. Does the section data exist below?
3. Does `items: []` have content?

### Build Failing?

```bash
# Check for YAML syntax errors
hugo --minify
# Look for error messages about parsing
```

### Wrong Order?

The `sections` array controls order, not the order of sections in YAML!

---

## 📚 More Help

- **Full guide**: `REFACTORING_DEMO.md`
- **Empty sections**: `EMPTY_SECTION_PROTECTION.md`
- **Summary**: `COMMIT_SUMMARY.md`

---

## 💡 Pro Tips

1. **Test locally first**: Always run `hugo server` before deploying
2. **Keep sections array in sync**: EN and DE should have same order
3. **Use comments**: Document why sections are hidden
4. **Empty for WIP**: Use `items: []` for work-in-progress sections

---

**Happy content editing!** 🎨
