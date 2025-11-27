# Landing Page Refactoring Demo

## 🎉 What We Accomplished

Successfully refactored the landing page from a monolithic template to a modular, content-driven architecture.

### Before:
- **index.html**: 205 lines of mixed HTML/logic
- Hard to maintain, difficult to reorder sections
- Duplicated section header code 5+ times
- Adding new sections required template editing

### After:
- **index.html**: 14 lines (93% reduction!)
- **10 reusable partials**: ~206 lines total (better organized)
- Content-driven sections via YAML array
- Easy to reorder, duplicate, or remove sections

---

## 📁 New Structure

```
layouts/
├── index.html                     # 14 lines - ultra clean!
└── partials/
    ├── section.html               # Smart dispatcher
    ├── components/
    │   ├── section-header.html    # Reusable title+subtitle
    │   └── icon.html              # SVG icon selector
    └── sections/
        ├── hero.html              # Hero section
        ├── step-cards.html        # Numbered steps
        ├── icon-cards.html        # Icon-based cards
        ├── simple-cards.html      # Basic cards
        ├── pricing-cards.html     # Pricing tiers
        ├── faq-accordion.html     # FAQ accordion
        └── cta.html               # Final CTA
```

---

## 🎯 How to Use

### Reorder Sections (Content Only!)

Edit `content/_index.en.md`:

```yaml
# Just change the order of this array!
sections:
  - pricing          # ← Move pricing to top
  - how_it_works
  - principles
  - pillars
  - faq
```

### Remove a Section

**Option 1: Comment out in sections array**
```yaml
sections:
  - how_it_works
  - principles
  # - pillars       # ← Commented out = hidden
  - pricing
  - faq
```

**Option 2: Empty the items array** (section auto-skips!)
```yaml
sections:
  - how_it_works
  - principles
  - pillars         # ← Will not render if items: []
  - pricing

pillars:
  title: "What You Get"
  subtitle: "Coming soon"
  items: []         # ← Empty = not rendered
```

### Duplicate a Section

```yaml
sections:
  - how_it_works
  - pricing
  - how_it_works   # ← Shows twice!
  - faq
```

### Add a New Section

1. Add data to frontmatter:
```yaml
testimonials:
  title: "What CTOs Say"
  subtitle: "Real feedback from real teams"
  items:
    - quote: "Cut our costs by 70%"
      author: "CTO, SaaS Startup"
```

2. Add to sections array:
```yaml
sections:
  - how_it_works
  - testimonials   # ← New section!
  - pricing
```

3. Create partial (if needed):
```html
<!-- layouts/partials/sections/testimonial-cards.html -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
  {{ range .data.items }}
  <div class="card">
    <p class="text-brand-secondary mb-4">"{{ .quote }}"</p>
    <p class="text-brand-dark font-semibold">— {{ .author }}</p>
  </div>
  {{ end }}
</div>
```

---

## 🤖 Auto-Detection Logic

The `section.html` dispatcher automatically detects section type from data structure:

| Item has field... | Renders as...        | Example                    |
|------------------|----------------------|----------------------------|
| `number`         | `step-cards`         | "01", "02", "03" steps     |
| `icon`           | `icon-cards`         | Icon-based feature cards   |
| `price`          | `pricing-cards`      | Pricing tiers              |
| `question`       | `faq-accordion`      | Q&A accordion              |
| (default)        | `simple-cards`       | Basic title+description    |

**No need to specify section type!** It's automatically detected.

### 🛡️ Empty Section Protection

Sections with empty `items: []` arrays are **automatically skipped**:

```yaml
testimonials:
  title: "What CTOs Say"
  subtitle: "Coming soon"
  items: []           # ← Not rendered (no empty sections!)
```

**Checks performed:**
1. ✅ `$data` exists (skip if section key not found)
2. ✅ `$data.items` exists (skip if no items field)
3. ✅ `len($data.items) > 0` (skip if empty array)

This prevents rendering empty section containers with just title/subtitle and no content.

---

## ✅ Benefits

### For Content Team:
- ✅ Reorder sections without touching code
- ✅ Add/remove sections by editing YAML
- ✅ Duplicate sections for A/B testing
- ✅ Same pattern for all sections

### For Developers:
- ✅ Change step-card styling once, affects all instances
- ✅ Add new section types by creating one partial
- ✅ DRY principle: no duplicated section header code
- ✅ Easy to test and maintain

### For Performance:
- ✅ Hugo builds in <20ms (no performance impact)
- ✅ Same HTML output (no bloat)
- ✅ Better caching (partials are cached)

---

## 🧪 Testing

Build and verify:
```bash
cd apps/landing
npm run build:css
hugo --minify
```

Check generated files:
```bash
ls -lh public/index.html public/de/index.html
```

Start dev server:
```bash
hugo server --port 1313
```

Visit: http://localhost:1313

---

## 📊 Metrics

- **Before**: 1 file, 205 lines
- **After**: 11 files, ~220 lines total
- **index.html reduction**: 93% (205 → 14 lines)
- **Build time**: <20ms (no change)
- **Code reuse**: 5 section types, unlimited instances

---

## 🚀 What's Next?

Potential enhancements (not needed now, but possible):

1. **Background variants**: Add light/dark/gradient options
2. **Grid flexibility**: Make columns configurable per section
3. **Conditional sections**: Show/hide based on feature flags
4. **Section IDs**: Auto-generate anchor links from section keys

---

## 📝 Example: Adding a "Social Proof" Section

1. Add to `_index.en.md`:
```yaml
sections:
  - how_it_works
  - social_proof   # ← New!
  - pricing

social_proof:
  title: "Trusted by Fast-Growing Teams"
  subtitle: "Join 20+ companies who fired their DevOps"
  items:
    - name: "Acme Corp"
      logo: "/images/acme.svg"
      quote: "Cut costs by 65%"
```

2. Create `layouts/partials/sections/logo-cards.html`:
```html
<div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
  {{ range .data.items }}
  <div class="card text-center">
    <img src="{{ .logo }}" alt="{{ .name }}" class="h-12 mx-auto mb-4">
    <p class="text-brand-secondary text-sm">{{ .quote }}</p>
  </div>
  {{ end }}
</div>
```

3. Done! Hugo auto-detects and renders.

---

Happy content editing! 🎨
