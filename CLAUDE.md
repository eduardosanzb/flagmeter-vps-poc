# FlagMeter Agent Guidelines

> **AI-quota microservice**: Event ingestion → Valkey queue → Worker aggregation → PostgreSQL rollups → Dashboard + Slack webhooks at 80% quota

## Design System

The raus.cloud design system is documented as a living page in the landing site.

- **Page source**: `apps/landing/content/design-system.en.md`
- **Layout**: `apps/landing/layouts/_default/design-system.html`
- **URL**: `/design-system/` (not linked from main nav — internal reference only)

**Always reference this page when:**
- Creating new landing pages or sections
- Adding new UI components to the Hugo site
- Choosing colors, spacing, typography, shadows, or animation tokens

### Brand Summary

| Token | Value | Usage |
|-------|-------|-------|
| `brand-accent` | `#10b981` | Primary CTA, links, highlights |
| `brand-accentDark` | `#059669` | Hover states |
| `brand-dark` | `#0a0a0a` | Body text |
| `brand-primary` | `#0f1419` | Dark section backgrounds |
| `brand-secondary` | `#6b7280` | Secondary text |
| `brand-light` | `#ecfdf5` | Light section backgrounds |
| `brand-border` | `#d1fae5` | Card/input borders |

**Fonts** (self-hosted in `static/fonts/`):
- Display/headings: **Space Grotesk** (300–700)
- Body/UI: **Inter** (300–700)

**Wordmark**: `raus.cloud` as plain text — `text-3xl font-light tracking-wide`
**Icon**: Emerald square (`#10b981`, rx=20) + white bold "R"

## Outline Document Workflow

### Accessing Comments & Content from Outline

**Important**: Short alphanumeric document IDs from Outline URLs (e.g., `T175VscwC9`) are not valid for API operations. You must convert them to full UUIDs first.

**Workflow for any document operation:**

1. **Always convert short IDs to UUIDs first** using `mcp-outline_get_document_id_from_title`
   - Search by document title (can be partial/approximate)
   - This returns the proper UUID needed for API operations
   - **Cache this UUID** for future operations within the session

2. **Then perform the desired operation** with the UUID:
   - `mcp-outline_read_document` - Read document content
   - `mcp-outline_list_document_comments` - Get all comments with anchor text
   - `mcp-outline_update_document` - Edit document
   - `mcp-outline_export_document` - Export as markdown

**Example:**
```
# Given URL: https://notes.eduardosanzb.dev/doc/draft-article-0-the-status-quo-on-cloud-repatriation-T175VscwC9

# Step 1: Get the UUID
get_document_id_from_title("status quo on cloud repatriation")
# Returns: badf9a35-1db9-4b33-885b-8b3587f4edb2

# Step 2: Use UUID to get comments
list_document_comments(document_id="badf9a35-1db9-4b33-885b-8b3587f4edb2", include_anchor_text=true)
```

**When user provides an Outline URL:**
1. Extract the document title/description from the URL
2. Use `mcp-outline_get_document_id_from_title` to get the UUID
3. Map and reference the UUID internally for all subsequent operations
4. Display the UUID to the user for their reference

## GitHub Project Management

The raus.cloud business is tracked in GitHub issues within the `eduardosanzb/eduardosanzb` repository, organized by milestones that correspond to business phases.

### Project Board
- **Location**: [Freelance Project Board](https://github.com/users/eduardosanzb/projects/2/views/2)
- **Repository**: `eduardosanzb/eduardosanzb`
- **Label**: All raus.cloud issues are tagged with `raus.cloud`

### Business Phases (Milestones)
1. **Phase 1: Validation** - €15-30k revenue, 3 case studies, 1+ referral
2. **Phase 2: Blueprint Launch** - 500+ GitHub stars, 10+ inbound leads, HN frontpage
3. **Phase 3: Productized Scale** - €50-100k/yr, 50/50 DIY/paid split

### BSC Layers (Labels)
- `bsc:impact` - Brand, referrals, recognition (Purple)
- `bsc:customer` - Client deliverables, migrations (Green)
- `bsc:process` - Internal efficiency, templates (Blue)
- `bsc:learning` - Content, OSS, skills (Yellow)
- `bsc:financial` - Revenue, pricing (Orange)

### Creating New Issues
When creating new issues for raus.cloud initiatives:
1. Use the `eduardosanzb/eduardosanzb` repository
2. Apply the `raus.cloud` label
3. Assign appropriate BSC layer labels
4. Associate with the correct milestone/phase
5. Include clear objectives and success criteria in the issue body

Example command:
```bash
gh issue create --repo eduardosanzb/eduardosanzb --title "New Initiative" --label "raus.cloud,bsc:customer" --milestone "raus.cloud Phase 1: Validation"
```

## Quick Start
- **Stack**: Node 20 LTS + PostgreSQL 18 + Valkey + TanStack Start + Drizzle ORM + shadcn/ui
- **Structure**: Monorepo (pnpm workspace) - `apps/` (dashboard, worker, landing) + `packages/` (db, types, telemetry) + `infra/`
- **Dev Setup**: Copy `.env.example` → `.env`, then `./dev.sh` (starts Postgres, Valkey, Prometheus, Grafana, Loki via Docker)

## Build & Commands
- **Dev**: `pnpm dev` (Docker full stack), `cd apps/dashboard && pnpm dev` (dashboard only on :3000), `cd apps/worker && pnpm dev` (worker only)
- **Test**: `cd apps/dashboard && pnpm test` (all tests), `cd apps/dashboard && pnpm test -- <file>` (single test via vitest)
- **Typecheck**: `pnpm typecheck` (all packages)
- **Database**: `./migrate.sh` (apply migrations), `./reset-db.sh` (drop & recreate), `pnpm db:studio` (Drizzle Studio), `cd packages/db && pnpm db:seed` (test data)
- **Lint**: `pnpm lint` (all packages)
- **Load Test**: `docker build -t flagmeter-load infra/load-test && docker run --name k6-test --network=host -p 5665:5665 -p 8080:8080 flagmeter-load` (targets: 1k rps, P99 ≤200ms)

## Code Style
- **TypeScript**: Strict mode (`strict: true`), no unused locals/parameters, explicit return types for exported functions/hooks
- **Imports**: Use `@/` or `~/` for local imports (configured via tsconfig `paths`), workspace packages via `@flagmeter/db`, `@flagmeter/types`, `@flagmeter/telemetry`
- **Formatting**: 2-space indent, single quotes, trailing commas, ES2022 target
- **Naming**: camelCase (vars/functions), PascalCase (types/components), UPPER_SNAKE (constants)
- **Error Handling**: Try-catch with pino logger (`logger.error({ err, context }, 'message')`), return JSON errors with status (`json({ error: 'message' }, { status: 400 })`)
- **Validation**: Zod schemas (`z.object()`), use `.safeParse()` and check `success`
- **Database**: Drizzle ORM with explicit types (`typeof table.$inferSelect`), use `eq()`, `and()` helpers, raw SQL for hot paths
- **React**: TanStack Router (`createFileRoute`), functional components, hooks over classes
- **Logging**: Structured pino logs (`logger.info({ tenant, tokens }, 'Event ingested')`)

## Observability
- **Telemetry**: Auto-instrumented via `@flagmeter/telemetry` (OpenTelemetry) - HTTP, PostgreSQL, Redis, Node.js runtime metrics
- **Metrics Ports**: Dashboard `:9464/metrics`, Worker `:9465/metrics`
- **Dashboards**: Grafana (http://localhost:3001, admin/admin) - HTTP latency (p50/p95/p99), queue depth, DB connections, worker concurrency, memory/CPU
- **Queries**: See `PROMETHEUS_QUERIES.md` for examples (e.g., `rate(http_server_requests_total[1m])`, `histogram_quantile(0.99, rate(http_server_duration_bucket[5m]))`)
- **Logs**: Loki (http://localhost:3100) collects structured logs from dashboard + worker via pino-loki transport
  - **Labels**: `service` (dashboard/worker), `environment` (dev/prod), `level` (info/warn/error)
  - **Example Queries**: `{service="dashboard"}`, `{service="worker", level="error"}`, `{service="dashboard"} |= "tenant"`
  - **Grafana**: Explore → Select "Loki" datasource → Use LogQL queries to filter and search logs
  - **Test Logs**: `cd apps/dashboard && node test-logs.mjs` (generates sample logs for testing)

## Deployment

### Docker Swarm Architecture (2-Server Setup)

**Deployment Configs:**
- `coolify.yaml` - All-in-one single-server config (backup/reference)
- `coolify.observability.yaml` - Observability stack (deploys to manager node)
- `coolify.app.yaml` - Application stack (deploys to worker node)

**Server Topology:**

**Manager Node (CAX21 recommended):**
- Role: Swarm manager + observability
- Services: Prometheus, Grafana, Loki
- Resources: ~1GB RAM, 0.6 CPU
- Scrapes metrics from worker via overlay network

**Worker Node (CAX11 for testing, CAX21 for production):**
- Role: Swarm worker + application + databases
- Services: Dashboard, Worker, PostgreSQL, Valkey, Exporters
- Resources: ~4GB RAM, 2.0 CPU (maxed for load testing)
- Exposes: :3000 (dashboard app) to internet
- Metrics ports (9464, 9465) only accessible via overlay network

**Network Architecture:**
- Overlay network: `flagmeter-net` (private communication between nodes)
- Prometheus scrapes `dashboard:9464` and `worker:9465` via overlay
- No metrics ports exposed to internet (security)
- Only dashboard :3000 and Grafana :3001 publicly accessible

**Setup Steps:**
1. Init Swarm on manager: `docker swarm init --advertise-addr <MANAGER_IP>`
2. Join worker: `docker swarm join --token <TOKEN> <MANAGER_IP>:2377`
3. Create overlay network: `docker network create --driver overlay --attachable flagmeter-net`
4. Deploy observability: `docker stack deploy -c coolify.observability.yaml obs`
5. Deploy app: `docker stack deploy -c coolify.app.yaml app`

**Hetzner Configuration:**
- Setup private network (10.0.0.0/16) between servers
- Attach manager + worker to private network
- Swarm traffic goes over private network (faster, free bandwidth)

**Load Testing Goal:**
- Isolate observability on manager node
- Pure app performance testing on worker node
- Find max RPS @ P90 <250ms on CAX11 without observability overhead

### Single-Server Deployment (Coolify)
- **Coolify**: Push to `main` → auto-deploy with zero downtime, auto-HTTPS via Let's Encrypt, branch previews at `pr-{n}.meter.yourdomain.com`
- **Environment**: Set `DATABASE_URL`, `VALKEY_URL`, `NODE_ENV=production`, `WORKER_CONCURRENCY=4`, `GF_SECURITY_ADMIN_PASSWORD` in Coolify UI
- **Migrations**: First deploy: `cd /app/packages/db && pnpm db:push:force` in Coolify terminal
- **Target VPS Options**:
  - **CAX21** (ARM64, 4 vCPU, 8GB RAM, €7.59/mo): Current production, handles 500+ RPS sustained, ~1000 RPS peak with optimized PostgreSQL config
  - **CAX11** (ARM64, 2 vCPU, 4GB RAM, €3.79/mo): Target for cost optimization, handles 250-350 RPS sustained, requires tuned PostgreSQL config

## PostgreSQL Configuration
- **Location**: Inline command arguments in `coolify.yaml` postgres service
- **Optimization**: Tuned for heavy write workload (INSERT ... ON CONFLICT upserts), 500+ RPS sustained
- **Critical Settings**:
  - `synchronous_commit=off`: 2-3x write throughput, reduces CPU by 40-60% (acceptable for metrics data)
  - `max_wal_size=3GB`: Reduces checkpoint frequency from every 2-3min to every 10-15min
  - `shared_buffers=1GB` (CAX21) or `512MB` (CAX11)
  - `checkpoint_timeout=900`: Spreads checkpoint I/O over longer periods
- **Server Selection**: Edit `coolify.yaml` postgres command section to switch between CAX21/CAX11 settings
- **Performance Impact**: Before tuning: 103% CPU @ 500 RPS → After tuning: 50-60% CPU @ 500 RPS
- **Documentation**: See `infra/postgres/README.md` for monitoring queries, troubleshooting, and CAX21↔CAX11 migration guide
- **Validation**: After deploy, connect to postgres and run `SHOW synchronous_commit;` to verify settings applied

## API Endpoints
- `POST /api/events` - Ingest event: `{ "tenant": "acme-corp", "feature": "gpt-4-turbo", "tokens": 1500 }`
- `GET /api/usage/:tenant` - Current month usage with quota percent
- `GET /api/health` - Health check

## Shadcn Components
- Install via: `pnpx shadcn@latest add <component>` (configured at `apps/dashboard/components.json`)

## Hugo Landing Site (`apps/landing`)

### Quick Start
- **Framework**: Hugo v0.145+ (extended version required for PostCSS/Tailwind)
- **Dev**: `cd apps/landing && hugo server -D` (runs on http://localhost:1313)
- **Build**: `hugo` (outputs to `public/`)
- **Languages**: English (default) + German (`/de/`)

### Structure
- `content/` - Markdown content (pages, blog posts)
  - `_index.en.md` / `_index.de.md` - Homepage content with sections
  - `blog/` - Blog posts (case studies)
  - `impressum.en.md` / `impressum.de.md` - Legal notice pages
- `layouts/` - HTML templates
  - `_default/baseof.html` - Base template (header, footer, scripts)
  - `partials/` - Reusable components (header, footer)
  - `blog/` - Blog-specific templates (list, single)
- `i18n/` - Translations (en.toml, de.toml)
- `assets/css/main.css` - Tailwind CSS + custom styles
- `static/` - Static files (images, favicon)

### Blog Post Workflow
1. **Create English post**: `content/blog/my-post.en.md`
2. **Add frontmatter**:
   ```yaml
   ---
   title: "Post Title"
   date: 2025-12-08
   description: "Short description"
   author: "Eduardo Sanchez"
   categories: ["Case Studies"]
   tags: ["tag1", "tag2"]
   draft: false
   mermaid: true  # If using Mermaid diagrams
   ---
   ```
3. **Create German translation**: `content/blog/my-post.de.md` (same filename with `.de`)
4. **Add images**: Place in `static/images/blog/`, reference as `/images/blog/filename.png`
5. **External links**: Use HTML for target="_blank": `<a href="url" target="_blank" rel="noopener">text</a>`

### Mermaid Diagrams
- Enable with `mermaid: true` in frontmatter
- Uses custom emerald green theme matching brand colors
- Auto-switches between light/dark mode
- Syntax: Standard mermaid in code fence:
  ````markdown
  ```mermaid
  graph TB
      A[Node] --> B[Another Node]
  ```
  ````

### Brand Colors (Tailwind)
- `brand-dark`: `#0a0a0a` (pure black)
- `brand-primary`: `#0f1419` (rich black)
- `brand-secondary`: `#6b7280` (gray)
- `brand-accent`: `#10b981` (emerald-500) - PRIMARY CTA color
- `brand-accentDark`: `#059669` (emerald-600) - hover states

### i18n (Internationalization)
- Add translations to `i18n/en.toml` and `i18n/de.toml`
- Use in templates: `{{ i18n "key.name" }}`
- Language switcher automatically detects translated pages
- Falls back to homepage switch if page not translated

### CSS/Styling
- Uses Tailwind CSS v3 with custom brand colors
- Custom prose styling for blog content (`.prose-brand`)
- Dark mode support via `dark:` variants
- Tables auto-styled with emerald headers and hover effects

### Key Features
- ✅ Bilingual (EN/DE) with smart language switcher
- ✅ Blog with categories, tags, and pagination
- ✅ Mermaid diagrams with brand theming
- ✅ Dark mode with localStorage persistence
- ✅ SEO-friendly (Open Graph, Twitter Cards)
- ✅ Mobile-responsive navigation
- ✅ Fast (Hugo static site generation)

### Hugo Modules
- Uses Hugo modules for Mermaid support
- Vendored in `_vendor/` directory for reproducible builds
- Commands:
  - `hugo mod get github.com/hugomods/mermaid` - Install module
  - `hugo mod vendor` - Vendor dependencies locally
  - `hugo mod tidy` - Clean up unused modules

### Common Tasks
- **Add blog post**: Create `.en.md` and `.de.md` in `content/blog/`
- **Update translations**: Edit `i18n/en.toml` or `i18n/de.toml`
- **Add CTA button**: Use brand-accent gradient with hover effects (see Philosophy section example)
- **Add screenshot**: Copy to `static/images/blog/`, reference with `/images/blog/filename.png`
- **Link Hetzner servers**: Use `<a href="https://www.hetzner.com/cloud/arm" target="_blank" rel="noopener">Hetzner CAX21</a>`

### Blog Series: Infrastructure Repatriation

**Article 1: "We Spent €11/month Testing Docker Swarm So You Don't Have To"** ✅ Published (EN + DE)
- Target: Bootstrapped B2B SaaS founders burning runway on AWS
- Core message: Stop spending runway on AWS, spend it on customers instead
- Proof: Single VPS (€7.59/mo) beats Docker Swarm, handles 484 RPS
- AWS reality: Lambda deployment = €10,560/mo vs €7.59/mo VPS
- Key data: Cost per 100 RPS comparison, month-by-month AWS escalation (€200 → €8,000)

**Article 2: "The Lean DevOps Stack: From Git Push to Production in 2 Minutes"** ✅ Published (EN + DE)
- Target: Founders who want to ship features, not debug Kubernetes
- Core message: Production-grade infrastructure without DevOps expertise
- Tools covered: Coolify (PaaS), Docker Compose (simple orchestration), Terraform (IaC)
- Focus: Developer experience over operational complexity
- Proof: Deploy FlagMeter with auto-HTTPS, zero-downtime deployments, branch previews in <30 min
- Key data: 2-3 minute deploys, €11.38/mo total cost, 147+ successful deployments

**Article 3: "The €8 to €800 Scaling Roadmap"** 🔜 Coming Soon
- Target: Founders planning growth from launch to scale
- Core message: Predictable vertical scaling path that preserves runway
- Roadmap: CAX11 (€3.79) → CAX21 (€7.59) → CAX31 (€14.90) → CAX41 (€28.49)
- When to distribute: Only after maxing out largest VPS (~1,500-2,000 RPS)
- Cost comparison: €1.50-1.90 per 100 RPS (VPS) vs €50-80 per 100 RPS (AWS)

**Article 5: "Self-Running Databases in Production: The €7.59 Reality Check"** ✅ Published (EN + DE)
- Target: Founders deciding between managed (RDS) and self-hosted PostgreSQL
- Core message: Truth-seeking analysis, neither option is universally better
- Methodology: Hegelian dialectic analysis (thesis/antithesis/synthesis) across 8 dimensions
- Key finding: Self-hosted wins 6 of 8 dimensions for bootstrapped SaaS (<2,000 RPS)
- Cost comparison: €7.59/mo (self-hosted) vs $200-500/mo (RDS) = 925x cost difference
- Research: 50+ sources, 8 Hegelian agents, documented in Outline
- Decision framework: Mermaid flowchart based on team maturity, scale, compliance, budget

### Marketing Strategy
See Outline: "Marketing Strategy: Infrastructure Repatriation Blog Series"
- Located under: Fuck.Cloud → FlagMeter 2.0
- Complete distribution plan, LinkedIn templates, success metrics
- Launch week checklist with specific dates/times
