# Empty Section Protection

## Overview

The section dispatcher now includes **automatic empty section detection** to prevent rendering sections with no content items.

## How It Works

The `section.html` partial performs three checks before rendering:

```go
1. if not $data → Skip (section key doesn't exist in frontmatter)
2. if not $data.items → Skip (no items field defined)
3. if len($data.items) == 0 → Skip (items array is empty)
```

## Use Cases

### 1. Work-in-Progress Sections

Keep sections in your YAML but don't render them until ready:

```yaml
sections:
  - how_it_works
  - testimonials    # ← Listed but won't render if empty
  - pricing

testimonials:
  title: "What CTOs Say"
  subtitle: "Coming soon"
  items: []         # ← Empty = auto-skipped
```

### 2. A/B Testing

Easily disable sections without removing from content:

```yaml
# Before (section renders)
social_proof:
  items:
    - logo: "/img/company1.svg"

# After (section hidden)
social_proof:
  items: []         # ← Just empty the array
```

### 3. Conditional Content

Hide sections based on environment/feature flags:

```yaml
beta_features:
  title: "Beta Features"
  items: {{ if .Site.Params.showBeta }}[...]{{ else }}[]{{ end }}
```

## Benefits

✅ **No empty containers**: Prevents rendering `<section>` tags with just title/subtitle
✅ **Clean output**: No wasted HTML for placeholder sections
✅ **Flexible**: Keep section structure without showing it
✅ **Safe**: Won't break if items field is missing or null

## Example Output

**With items:**
```html
<section class="section section-light">
  <div class="container-custom">
    <div class="text-center mb-16">
      <h2>How It Works</h2>
      <p>Subtitle here</p>
    </div>
    <div class="grid">
      <!-- Cards render here -->
    </div>
  </div>
</section>
```

**Empty items:**
```html
<!-- Nothing rendered - section completely skipped -->
```

## Verification

Test with the testimonials section (already configured with empty items):

```bash
cd apps/landing
hugo --minify
grep -c "What CTOs Say" public/index.html
# Output: 0 (correctly skipped)
```

## Implementation

See `layouts/partials/section.html` lines 13-22:

```go
{{ if not $items }}
  <!-- No items to render -->
  {{ return }}
{{ end }}

<!-- Check if items array has any elements -->
{{ if eq (len $items) 0 }}
  <!-- Items array is empty, skip rendering -->
  {{ return }}
{{ end }}
```

---

**Result**: Cleaner HTML output, more flexible content management! 🎯
