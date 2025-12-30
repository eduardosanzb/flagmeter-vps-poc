# FlagMeter Landing Agent Guidelines

Hugo static site generator for raus.cloud marketing site with bilingual support (EN/DE).

## Build & Commands
- **Dev**: `pnpm dev` - Runs Hugo server (:1313) + Tailwind watch in parallel
- **Dev Hugo only**: `pnpm run dev:hugo`
- **Dev CSS only**: `pnpm run dev:css`
- **Build**: `pnpm build` - Minified Tailwind CSS + Hugo with minification
- **Hugo module commands**:
  - `hugo mod get github.com/hugomods/mermaid` - Install Mermaid module
  - `hugo mod vendor` - Vendor dependencies for reproducible builds
  - `hugo mod tidy` - Clean unused modules

## Code Style

### Hugo Templates
- Use lowercase for partial references: `{{ partial "header.html" }}`
- Functional components over classes where possible
- Use Hugo's built-in functions: `{{ i18n "key.name" }}`, `{{ relref . "file.md" }}`
- Maintain language switcher logic in `layouts/_default/baseof.html`

### Frontmatter (Markdown)
- YAML format with strict key ordering
- Required fields for blog posts:
  ```yaml
  ---
  title: "Post Title"
  date: YYYY-MM-DD
  description: "Short description"
  author: "Eduardo Sanchez"
  categories: ["Category"]
  tags: ["tag1", "tag2"]
  draft: false
  mermaid: true  # Only if using diagrams
  ---
  ```
- Use double quotes for string values
- Date format: ISO 8601 (YYYY-MM-DD)

### Content Structure
- **Pages**: Root level (`_index.en.md`, `_index.de.md`)
- **Blog**: `content/blog/post-title.en.md` + matching `.de.md`
- **Images**: Place in `static/images/blog/`, reference as `/images/blog/filename.png`
- **Translations**: Create `.en.md` and `.de.md` pairs for each page

### External Links
- Use HTML for target="_blank" to avoid Hugo processing issues:
  ```html
  <a href="https://hetzner.com" target="_blank" rel="noopener">Hetzner</a>
  ```

### Tailwind CSS
- Use brand color palette from `tailwind.config.js`:
  - `brand-dark` (#0a0a0a) - text on light backgrounds
  - `brand-primary` (#0f1419) - dark section backgrounds
  - `brand-secondary` (#6b7280) - description text
  - `brand-accent` (#10b981) - PRIMARY CTA color
  - `brand-accentDark` (#059669) - hover states
- Dark mode: Toggle `dark:` variants, persisted via localStorage
- Custom classes: Add to safelist if dynamic (Tailwind purges unused classes)

### Mermaid Diagrams
- Enable with `mermaid: true` in frontmatter
- Syntax:
  ```markdown
  ```mermaid
  graph TB
      A[Node] --> B[Another Node]
  ```
  ```
- Uses emerald green theme matching brand colors
- Auto-switches between light/dark mode

### i18n (Internationalization)
- Add translations to `i18n/en.toml` and `i18n/de.toml`
- Use in templates: `{{ i18n "key.name" }}`
- Language switcher auto-detects translated pages
- Falls back to homepage switch if page not translated

### Naming Conventions
- Files: kebab-case (`my-blog-post.en.md`)
- Template variables: camelCase (`{{ .Site.Title }}`)
- CSS classes: kebab-case (`hero-section`)
- Frontmatter keys: camelCase (`description`, `categories`, `tags`)

### Formatting
- 2-space indent for YAML frontmatter
- Markdown: standard GitHub Flavored Markdown
- HTML: 2-space indent, lowercase tag names
- No trailing whitespace
- Use Hugo's pipe `|` and safe `|safe` for HTML in content

### Blog Post Workflow
1. Create English post: `content/blog/my-post.en.md`
2. Add frontmatter (see Frontmatter section above)
3. Create German translation: `content/blog/my-post.de.md`
4. Add images: Place in `static/images/blog/`
5. Test locally: `pnpm dev`, visit http://localhost:1313/blog/my-post/

### Key Files Reference
- `layouts/_default/baseof.html` - Base template (header, footer, scripts)
- `layouts/partials/header.html` - Navigation with language switcher
- `layouts/partials/footer.html` - Footer links
- `layouts/blog/single.html` - Blog post template
- `i18n/en.toml` / `i18n/de.toml` - Translation keys
- `assets/css/main.css` - Tailwind imports + custom styles
- `hugo.toml` - Site configuration

### Common Tasks
- **Add blog post**: Create `.en.md` and `.de.md` in `content/blog/`
- **Update translations**: Edit `i18n/en.toml` or `i18n/de.toml`
- **Add CTA button**: Use `bg-brand-accent` gradient with `hover:bg-brand-accentDark`
- **Add screenshot**: Copy to `static/images/blog/`, reference with `/images/blog/filename.png`
- **Check broken links**: `hugo` build will warn about broken internal links

### Validation
- Hugo will fail on build if:
  - Frontmatter has syntax errors
  - Internal links point to non-existent pages
  - Images referenced don't exist
- Check console output for warnings during `pnpm dev`
