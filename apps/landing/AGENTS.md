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

### German Translation Guidelines

**Goal:** Make translations sound natural and conversational, not like literal translations.

**Tone & Style:**
- Use informal "du" form, NOT formal "Sie" (standard in German tech community)
- Write like a native German tech blogger would write
- Be direct and casual, avoid overly formal business German
- Mix German/English tech terms naturally (Denglisch is authentic in German tech writing)

**Technical Terms - When to Use English:**
Use English terms that are commonly used in German tech circles:
- Performance, Throughput, Latency, Bottleneck
- Scale/Scaling, Load Balancing, Failover
- Setup, Stack, Pipeline, Deployment
- Infrastructure, Cloud, On-premise
- Best Practice, Use Case, Proof of Concept
- RPS (Requests per Second), CPU, RAM, vCPU
- Single-node, Multi-node, Distributed
- Baseline, Benchmark, Test Case

**Technical Terms - When to Use German:**
Use German for general concepts and actions:
- kosten/Kosten (cost/costs)
- Server (same in both languages)
- testen/Test (test/testing)
- gewinnt/verliert (wins/loses)
- schneller/langsamer (faster/slower)

**Common Patterns:**

❌ **Avoid (too literal/formal):**
- "Sie müssen die Konfiguration anpassen" → ❌ Too formal
- "Durchsatz" → ❌ Germans say "Throughput"
- "Flaschenhals" → ❌ Germans say "Bottleneck"
- "Skalierung" → ❌ Germans say "Scale" or "Scaling"
- "bewältigen Sie" → ❌ Too formal
- "Leistung" → ❌ Germans say "Performance"

✅ **Use instead (natural German tech slang):**
- "Du musst die Config anpassen" → ✅ Natural
- "Throughput" → ✅ Natural
- "Bottleneck" → ✅ Natural
- "Scale/Scaling" → ✅ Natural
- "handlen" (handle) → ✅ Natural
- "Performance" → ✅ Natural

**Sentence Structure:**
- Keep it punchy and direct
- Use contractions naturally: "hat's" instead of "hat es"
- Mix verb forms: "gewinnt" (wins), "killt" (kills), "crashed" (crashed)
- Use English verbs germanized: "handlen", "testen", "deployen", "scalen"

**Examples of Natural Tech German:**

Good:
- "Der single CAX21 schlägt alles"
- "Traefik hat 180% CPU gefressen"
- "Das Setup ist simple"
- "Wir haben vier Tests durchgeführt"
- "Performance-Overhead killt die Latency"
- "Zero errors, aber langsam"

Bad (too literal):
- "Der einzelne CAX21 gewinnt alles"
- "Traefik verbrauchte 180% CPU"
- "Die Einrichtung ist einfach"
- "Wir führten vier Tests durch"
- "Leistungs-Overhead tötet die Latenz"
- "Keine Fehler, aber langsam"

**Translation Process:**
1. Read the English version completely first
2. Understand the tone and message
3. Rewrite in German as if you were a German tech blogger writing originally
4. Don't translate word-for-word
5. Keep technical terms in English where natural
6. Use "du" form consistently
7. Read it out loud - does it sound natural or stilted?

**Final Check:**
Ask yourself: "Would a native German developer write it this way?" If it sounds like a translation, rewrite it.

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


### Git Operations Policy (CRITICAL)

**NEVER commit or push changes to git unless explicitly told by the user.**

**This is a hard rule for this repository.**

**When user requests changes:**
1. Make file modifications locally
2. Test with `pnpm dev` if needed
3. Wait for user to explicitly say "commit" or "push"
4. Only commit/push at that specific time
5. Do not proactively commit or push

**If you commit/push without permission:**
- You will overwrite manual user changes
- You will cause merge conflicts
- You will revert important updates
- **This breaks the repository state**

**User must explicitly say one of:**
- "commit this"
- "push this"
- "create a commit"
- "push to remote"
- "save to git"
- Similar specific git action commands

Until then: **NO GIT OPERATIONS** - only local file changes.
