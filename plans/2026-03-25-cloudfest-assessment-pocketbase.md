# Implementation Plan: CloudFest Assessment Wizard + PocketBase Backend

**Date**: 2026-03-25
**Status**: COMPLETED

## Overview

Add a data-driven multi-step assessment wizard at `/cloudfest/assessment/` to qualify leads at
CloudFest. Questions are defined in Hugo YAML frontmatter (same pattern as `content/slides/`), a
Hugo layout template renders the wizard, and responses are stored in a self-hosted PocketBase
(SQLite) instance running alongside the landing nginx container in the `raus.cloud.yaml` stack.

The nginx `/pb/` proxy (with Docker resolver for dynamic DNS) forwards form submissions to
PocketBase internally — no CORS, no public PocketBase exposure, fully compatible with Coolify's
Traefik load balancer.

## Architecture

```
Internet
  ↓ HTTPS (443)
Traefik (Coolify)        ← TLS termination, domain routing
  ↓ HTTP (80)
landing nginx            ← serves Hugo static site
  ↓ HTTP (8090, internal Docker DNS)
pocketbase               ← never exposed to internet
```

### Key decisions
- **Nginx**: dynamic resolver `127.0.0.11` + `set $pb_upstream` variable — prevents startup DNS
  error if PocketBase isn't ready yet; works with Coolify/Traefik without any changes to Traefik
- **PocketBase**: no `ports:` in `raus.cloud.yaml` (internal only); `"8090:8090"` in
  `compose.dev.yml` only (for local admin UI access)
- **Initial admin setup**: SSH into server after first deploy and run:
  `docker exec <pb_container_name> ./pocketbase superuser upsert admin@raus.cloud <password>`
- **Questionnaire**: Hugo data-driven — questions defined in YAML frontmatter, `jsonify`-d into
  the page as `const QUESTIONS = [...]` for the wizard JS to consume generically
- **Storage**: single `assessments` collection, `source` field differentiates future events;
  multi-select answers stored as JSON array strings
- **Hugo routing**: content at `content/assessments/cloudfest.en.md` with `type: assessment` and
  `url: /cloudfest/assessment/` — avoids any conflict with `static/cloudfest/index.html`

## Scope

- Work units: 5
- Execution phase: 1 (all parallel — no file overlaps)
- Files affected:
  - `raus.cloud.yaml`
  - `compose.dev.yml`
  - `apps/landing/nginx.conf`
  - `apps/landing/static/cloudfest/index.html`
  - `apps/landing/content/assessments/cloudfest.en.md` *(new)*
  - `apps/landing/layouts/assessment/baseof.html` *(new)*
  - `apps/landing/layouts/assessment/single.html` *(new)*
  - `infra/pocketbase/pb_migrations/1_create_assessments.js` *(new)*

---

## Work Units

### WU-1: Add PocketBase service to Docker Compose files

**Files**: `raus.cloud.yaml`, `compose.dev.yml`

**raus.cloud.yaml changes**:

Add inside `services:`, after the `landing` service block (after `start_period: 5s`), before the
blank line that precedes `resources:`:

```yaml
  pocketbase:
    image: ghcr.io/pocketbase/pocketbase:latest
    command: ["./pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data"]
    # No ports: — internal only, accessed via nginx proxy at /pb/
    # To access admin UI after first deploy:
    #   docker exec <container> ./pocketbase superuser upsert admin@raus.cloud <pass>
    volumes:
      - pocketbase_data:/pb/pb_data
      - ./infra/pocketbase/pb_migrations:/pb/pb_migrations
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:8090/api/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 15s
```

Add a top-level `volumes:` section at the end of the file (after `resources:`):

```yaml
volumes:
  pocketbase_data:
```

Extend the `resources:` section with:

```yaml
  pocketbase:
    memory: 128M      # PocketBase Go binary + SQLite
    cpu: 0.05         # Minimal CPU for survey workload
```

**compose.dev.yml changes**:

Add inside `services:`, after the `redis-exporter` block and before the `volumes:` section:

```yaml
  pocketbase:
    image: ghcr.io/pocketbase/pocketbase:latest
    container_name: flagmeter-pocketbase-dev
    command: ["./pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data"]
    ports:
      - "8090:8090"
    volumes:
      - pocketbase_data_dev:/pb/pb_data
      - ./infra/pocketbase/pb_migrations:/pb/pb_migrations
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:8090/api/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 15s
    networks:
      - flagmeter-dev
```

Add `pocketbase_data_dev:` to the existing `volumes:` section.

**Verification**: `docker compose -f compose.dev.yml config --quiet && echo VALID`

---

### WU-2: Add nginx reverse proxy location for PocketBase

**Files**: `apps/landing/nginx.conf`

Insert the following block **before** the `# Health check endpoint` comment (after the `/de/`
location block). Uses Docker's internal DNS resolver (`127.0.0.11`) with a `set $pb_upstream`
variable so nginx resolves `pocketbase` dynamically at request time — not at startup. This
prevents nginx failing to start if PocketBase isn't up yet, and is fully compatible with
Coolify's Traefik (Traefik routes to nginx on port 80; nginx proxies to pocketbase internally).

```nginx
    # PocketBase API proxy — assessment form submissions
    # Uses Docker internal DNS resolver for dynamic resolution (startup-safe)
    location /pb/ {
        resolver 127.0.0.11 valid=30s;
        set $pb_upstream http://pocketbase:8090;
        proxy_pass $pb_upstream/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 10s;
        proxy_connect_timeout 5s;

        # No caching for API calls
        expires off;
        add_header Cache-Control "no-store, no-cache, must-revalidate" always;
    }
```

**Verification**: `grep -q 'resolver 127.0.0.11' apps/landing/nginx.conf && echo VALID`

---

### WU-3: PocketBase migration — create assessments collection

**Files**: `infra/pocketbase/pb_migrations/1_create_assessments.js` *(new — create dirs too)*

Create directories `infra/pocketbase/` and `infra/pocketbase/pb_migrations/`, then create the
migration file. PocketBase automatically applies JS migrations from `pb_migrations/` on startup.

The `assessments` collection:
- `createRule: ""` — empty string = public (no auth required to submit the survey form)
- `listRule: null`, `viewRule: null`, `updateRule: null`, `deleteRule: null` — admin only
- Single-select fields: `text` type
- Multi-select fields (q3, q9): `json` type (stores JSON array strings like `["costs","vendor-lock"]`)
- Lead capture: `respondent_name` (text), `respondent_email` (email), `respondent_company` (text)
- `source` field: text, tracks which event submitted (e.g. "cloudfest", "kubecon")

```js
/// <reference path="../pb_data/types.d.ts" />
migrate(
  // UP — create the assessments collection
  (app) => {
    const collection = new Collection({
      name: "assessments",
      type: "base",

      // Public create — anyone can submit the survey (no auth token required)
      createRule: "",
      // Admin-only for everything else
      listRule: null,
      viewRule: null,
      updateRule: null,
      deleteRule: null,

      fields: [
        // --- Context ---
        { name: "q1_cloud_setup",      type: "text",  required: true,  options: { max: 100 } },
        { name: "q2_team_size",        type: "text",  required: true,  options: { max: 50  } },
        // --- Pain ---
        { name: "q3_pain_points",      type: "json",  required: true,  options: { maxSize: 2000 } },
        { name: "q4_migration",        type: "text",  required: true,  options: { max: 100 } },
        // --- Audit interest ---
        { name: "q5_audit_history",    type: "text",  required: true,  options: { max: 100 } },
        { name: "q6_audit_usefulness", type: "text",  required: true,  options: { max: 100 } },
        { name: "q7_audit_budget",     type: "text",  required: true,  options: { max: 100 } },
        // --- Automation interest ---
        { name: "q8_agent_interest",   type: "text",  required: true,  options: { max: 100 } },
        { name: "q9_agent_priorities", type: "json",  required: true,  options: { maxSize: 1000 } },
        // --- Lead capture (all optional) ---
        { name: "respondent_name",     type: "text",  required: false, options: { max: 200 } },
        { name: "respondent_email",    type: "email", required: false, options: {} },
        { name: "respondent_company",  type: "text",  required: false, options: { max: 200 } },
        // --- Tracking ---
        { name: "source",              type: "text",  required: false, options: { max: 50  } },
      ],
    });

    return app.save(collection);
  },

  // DOWN — delete the collection
  (app) => {
    const collection = app.findCollectionByNameOrId("assessments");
    return app.delete(collection);
  }
);
```

**Verification**: `node -e "require('fs').readFileSync('infra/pocketbase/pb_migrations/1_create_assessments.js'); console.log('VALID')"`

---

### WU-4: Add Assessment CTA to existing CloudFest card page

**Files**: `apps/landing/static/cloudfest/index.html`

Two edits:

1. Replace the tagline text (around line 205):
   - Old: `Feature flags for teams that ship fast. Let's connect!`
   - New: `European cloud &amp; AI infrastructure consulting. Take 3 minutes to find out where you stand.`

2. Add a new primary CTA as the **first** item inside `<div class="ctas">`, before the existing
   "Book a 15min call" anchor (around line 210):

```html
      <a class="cta cta-primary" href="/cloudfest/assessment/">
        <div class="cta-icon">📋</div>
        <div class="cta-text">
          <div class="cta-label">Infrastructure Assessment</div>
          <div class="cta-sub">3 min · find your sovereignty gaps</div>
        </div>
        <div class="cta-arrow">→</div>
      </a>

```

**Verification**: `grep -q '/cloudfest/assessment/' apps/landing/static/cloudfest/index.html && echo VALID`

---

### WU-5: Assessment Hugo content + layout (data-driven wizard)

**Files**:
- `apps/landing/content/assessments/cloudfest.en.md` *(new)*
- `apps/landing/layouts/assessment/baseof.html` *(new)*
- `apps/landing/layouts/assessment/single.html` *(new)*

This follows the exact same pattern as `content/slides/raus-cloud-pitch.en.md` +
`layouts/slides/single.html`. The content file holds all question data in YAML frontmatter; the
layout template iterates it and renders the wizard. Hugo injects `const QUESTIONS = <jsonify>` into
the page so the vanilla JS wizard is fully data-driven — no hardcoded field names or question logic.

Hugo layout lookup: `type: assessment` in frontmatter → Hugo looks in `layouts/assessment/`.
Hugo URL: explicit `url: /cloudfest/assessment/` in frontmatter overrides the default path,
avoiding any conflict with `static/cloudfest/index.html` which serves `/cloudfest/`.

---

#### 5a — Content file: `apps/landing/content/assessments/cloudfest.en.md`

Create directory `apps/landing/content/assessments/` then create the file:

```yaml
---
title: "Cloud & AI Infrastructure Assessment"
description: "Quick survey for European cloud & tech companies — takes 3 minutes."
type: assessment
url: "/cloudfest/assessment/"
pocketbase_endpoint: "/pb/api/collections/assessments/records"
source: "cloudfest"
draft: false

questions:
  - id: q1_cloud_setup
    step: 1
    section: "Context"
    type: radio
    question: "What's your primary cloud setup today?"
    hint: ""
    required: true
    options:
      - value: single-hyperscaler
        label: "Single hyperscaler (AWS, GCP, or Azure)"
      - value: multi-cloud
        label: "Multi-cloud (mix of hyperscalers)"
      - value: european-provider
        label: "European provider (Hetzner, OVH, Scaleway, STACKIT)"
      - value: hybrid
        label: "Hybrid (cloud + on-premise)"
      - value: on-premise
        label: "Mostly on-premise"

  - id: q2_team_size
    step: 2
    section: "Context"
    type: radio
    question: "How big is your engineering team?"
    hint: ""
    required: true
    options:
      - value: "1-5"
        label: "1–5"
      - value: "6-20"
        label: "6–20"
      - value: "21-50"
        label: "21–50"
      - value: "50+"
        label: "50+"

  - id: q3_pain_points
    step: 3
    section: "Pain"
    type: checkbox
    question: "Which of these keep you up at night?"
    hint: "Pick all that apply"
    required: true
    options:
      - value: costs
        label: "Cloud costs growing faster than revenue"
      - value: compliance
        label: "Unsure if we're actually GDPR / NIS2 / AI Act compliant"
      - value: vendor-lock
        label: "Dependent on a single US cloud provider we can't easily leave"
      - value: ai-adoption
        label: "Want to adopt AI but don't know how to do it securely / affordably"
      - value: fragile-infra
        label: "Infrastructure is fragile — too much manual setup, not enough IaC"
      - value: no-observability
        label: "No real observability — we find issues when users complain"
      - value: none
        label: "None of the above"

  - id: q4_migration
    step: 4
    section: "Pain"
    type: radio
    question: "If you had to migrate away from your main cloud provider in 6 months, could you?"
    hint: "This one makes people uncomfortable. That's the point."
    required: true
    options:
      - value: yes-agnostic
        label: "Yes, we're provider-agnostic by design"
      - value: painful-possible
        label: "Painful but possible"
      - value: practically-impossible
        label: "Practically impossible"
      - value: never-thought
        label: "Never thought about it"

  - id: q5_audit_history
    step: 5
    section: "Interest in an audit"
    type: radio
    question: "Have you ever done a formal infrastructure audit?"
    hint: "Sovereignty, cost, AI-readiness — any of those."
    required: true
    options:
      - value: yes-regularly
        label: "Yes, regularly"
      - value: once-ago
        label: "Once, a while ago"
      - value: no-wanted
        label: "No, but we've wanted to"
      - value: no-not-radar
        label: "No, and it's not on our radar"

  - id: q6_audit_usefulness
    step: 6
    section: "Interest in an audit"
    type: radio
    question: "If someone gave you a clear report — sovereignty gaps, cost waste, AI-readiness score, prioritised next steps — would that be useful?"
    hint: ""
    required: true
    options:
      - value: very-useful
        label: "Very useful — I'd want that yesterday"
      - value: interesting
        label: "Interesting — I'd look at it"
      - value: maybe-cost
        label: "Maybe, depends on the cost"
      - value: not-really
        label: "Not really"

  - id: q7_audit_budget
    step: 7
    section: "Interest in an audit"
    type: radio
    question: "What would you expect to pay for a one-time infrastructure audit like that?"
    hint: ""
    required: true
    options:
      - value: free
        label: "Nothing — it should be free / a lead magnet"
      - value: 500-2000
        label: "€500–€2,000"
      - value: 2000-5000
        label: "€2,000–€5,000"
      - value: 5000-plus
        label: "€5,000+"
      - value: no-idea
        label: "No idea"

  - id: q8_agent_interest
    step: 8
    section: "Interest in automation"
    type: radio
    question: "Imagine an agent or CLI that continuously monitors sovereignty compliance, cost drift, and AI-readiness — flagging issues automatically. How interesting is that?"
    hint: ""
    required: true
    options:
      - value: try-now
        label: "I'd want to try it now"
      - value: want-demo
        label: "Sounds promising — I'd want a demo"
      - value: need-trust
        label: "Interesting concept but I'd need to trust it first"
      - value: not-interested
        label: "Not interested"

  - id: q9_agent_priorities
    step: 9
    section: "Interest in automation"
    type: checkbox
    max: 2
    question: "For a tool like that, what would matter most?"
    hint: "Pick up to 2"
    required: true
    options:
      - value: self-hosted
        label: "Runs on our own infrastructure (self-hosted, no data leaves)"
      - value: actionable-alerts
        label: "Actionable alerts, not just dashboards"
      - value: auto-remediation
        label: "Automated remediation (fixes things, not just flags them)"
      - value: integrations
        label: "Integrates with our existing stack (Terraform, K8s, CI/CD)"
      - value: predictable-pricing
        label: "Clear cost — predictable pricing, no surprises"

  - id: lead
    step: 10
    section: "Stay in touch"
    type: lead
    question: "Can we follow up with you?"
    hint: "All fields optional — even just an email helps."
    required: false
    fields:
      - id: respondent_name
        type: text
        label: "Name"
        placeholder: "Your name"
      - id: respondent_email
        type: email
        label: "Email"
        placeholder: "your@email.com"
      - id: respondent_company
        type: text
        label: "Company"
        placeholder: "Company name"
---
```

---

#### 5b — Layout baseof: `apps/landing/layouts/assessment/baseof.html`

Minimal dark shell — no main site nav/footer, always dark, brand fonts via CDN. Identical visual
language to `static/cloudfest/index.html` (same CSS variables). No Alpine.js, no Umami, no theme
toggle — self-contained experience.

```html
<!DOCTYPE html>
<html lang="{{ .Language.Lang | default "en" }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>{{ .Title }} — raus.cloud</title>
  <meta name="description" content="{{ .Description }}">
  <meta property="og:title" content="{{ .Title }} — raus.cloud">
  <meta property="og:description" content="{{ .Description }}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  {{ block "main" . }}{{ end }}
</body>
</html>
```

---

#### 5c — Layout single: `apps/landing/layouts/assessment/single.html`

This is the main template. It:
1. Iterates `.Params.questions` to render each step's HTML (radio, checkbox, or lead inputs)
2. Emits `const QUESTIONS = {{ .Params.questions | jsonify }}` so JS is fully data-driven
3. The JS builds the PocketBase payload generically from `QUESTIONS[].id` — no hardcoded field names

Full file content:

```html
{{ define "main" }}
{{ $questions := .Params.questions }}
{{ $total := len $questions }}

<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0a;
    --accent: #10b981;
    --accent-dark: #059669;
    --text: #ffffff;
    --secondary: #6b7280;
    --card: #111111;
    --font: 'Space Grotesk', Inter, system-ui, -apple-system, sans-serif;
  }

  html, body {
    min-height: 100svh;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font);
    -webkit-font-smoothing: antialiased;
  }

  body::before {
    content: '';
    position: fixed;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 600px; height: 400px;
    background: radial-gradient(ellipse at top, rgba(16,185,129,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .page {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    padding: 24px 20px 48px;
  }

  /* Header */
  .wizard-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 40px;
    flex-shrink: 0;
  }

  .back-link {
    font-size: 13px;
    color: var(--secondary);
    text-decoration: none;
    white-space: nowrap;
    flex-shrink: 0;
    transition: color 0.2s;
  }
  .back-link:hover { color: var(--accent); }

  .progress-wrap {
    flex: 1;
    height: 3px;
    background: rgba(255,255,255,0.08);
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--accent);
    border-radius: 4px;
    transition: width 0.35s ease;
    width: 10%;
    box-shadow: 0 0 8px rgba(16,185,129,0.4);
  }

  .step-counter {
    font-size: 12px;
    color: var(--secondary);
    white-space: nowrap;
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
  }

  /* Body */
  .wizard-body { flex: 1; }

  .step { display: none; }
  .step.active { display: block; }

  .step-section {
    font-size: 11px;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .step-question {
    font-size: 22px;
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: -0.3px;
    margin-bottom: 6px;
  }

  .step-hint {
    font-size: 13px;
    color: var(--secondary);
    line-height: 1.5;
    margin-bottom: 24px;
  }

  /* Options (radio + checkbox) */
  .options {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .option {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    background: var(--card);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, transform 0.1s;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }

  .option:hover {
    border-color: rgba(255,255,255,0.15);
    background: #161616;
  }

  .option:active { transform: scale(0.98); }

  .option input { display: none; }

  .indicator {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.2);
    flex-shrink: 0;
    transition: border-color 0.2s, background 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .option.checkbox .indicator { border-radius: 6px; }

  .option.selected {
    border-color: rgba(16,185,129,0.4);
    background: rgba(16,185,129,0.06);
  }

  .option.selected .indicator {
    border-color: var(--accent);
    background: rgba(16,185,129,0.25);
  }

  .option.selected .indicator::after {
    content: '✓';
    font-size: 11px;
    color: var(--accent);
    font-weight: 700;
  }

  .option-text {
    font-size: 15px;
    font-weight: 500;
    line-height: 1.3;
    flex: 1;
  }

  /* Lead inputs */
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 14px;
  }

  .input-label {
    font-size: 12px;
    color: var(--secondary);
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .text-input {
    width: 100%;
    background: var(--card);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 14px 16px;
    color: var(--text);
    font-family: var(--font);
    font-size: 15px;
    outline: none;
    transition: border-color 0.2s;
    -webkit-appearance: none;
  }

  .text-input:focus { border-color: rgba(16,185,129,0.5); }
  .text-input::placeholder { color: rgba(255,255,255,0.2); }

  /* Navigation */
  .wizard-nav {
    display: flex;
    gap: 12px;
    margin-top: 32px;
    flex-shrink: 0;
  }

  .btn-nav {
    flex: 1;
    padding: 16px;
    border-radius: 14px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    font-family: var(--font);
    transition: background 0.2s, transform 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-nav:active { transform: scale(0.97); }
  .btn-nav:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-back {
    background: rgba(255,255,255,0.06);
    color: var(--secondary);
    flex: 0 0 auto;
    padding: 16px 20px;
  }
  .btn-back:hover:not(:disabled) { background: rgba(255,255,255,0.1); }

  .btn-next {
    background: var(--accent);
    color: #000;
    font-weight: 700;
  }
  .btn-next:hover:not(:disabled) { background: var(--accent-dark); }

  /* Error */
  .error-msg {
    min-height: 18px;
    font-size: 13px;
    color: #f87171;
    text-align: center;
    margin-top: 10px;
    padding: 0 8px;
  }

  /* Success screen */
  .step-success {
    display: none;
    text-align: center;
    padding: 48px 0;
    flex-direction: column;
    align-items: center;
  }

  .step-success.active {
    display: flex;
  }

  .success-icon { font-size: 56px; margin-bottom: 20px; }

  .success-title {
    font-size: 26px;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: -0.3px;
  }

  .success-body {
    font-size: 15px;
    color: var(--secondary);
    line-height: 1.6;
    margin-bottom: 32px;
    max-width: 340px;
  }

  .success-cta {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 20px;
    background: rgba(16,185,129,0.12);
    border: 1px solid rgba(16,185,129,0.3);
    border-radius: 16px;
    text-decoration: none;
    color: var(--text);
    width: 100%;
    transition: border-color 0.2s, background 0.2s;
  }

  .success-cta:hover {
    border-color: rgba(16,185,129,0.6);
    background: rgba(16,185,129,0.18);
  }

  .success-cta-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(16,185,129,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }

  .success-cta-label { font-size: 15px; font-weight: 600; color: var(--accent); }
  .success-cta-sub { font-size: 12px; color: var(--secondary); margin-top: 2px; }
  .success-cta-arrow { color: var(--secondary); font-size: 16px; margin-left: auto; }
</style>

<div class="page">

  <div class="wizard-header">
    <a class="back-link" href="/cloudfest/">← raus.cloud</a>
    <div class="progress-wrap">
      <div class="progress-fill" id="progress-fill"></div>
    </div>
    <div class="step-counter" id="step-counter">1 / {{ $total }}</div>
  </div>

  <div class="wizard-body" id="wizard-body">

    {{ range $questions }}
    {{ $q := . }}
    <div class="step" id="step-{{ .step }}" data-step="{{ .step }}">

      {{ if .section }}<div class="step-section">{{ .section }}</div>{{ end }}
      <div class="step-question">{{ .question }}</div>
      {{ if .hint }}<div class="step-hint">{{ .hint }}</div>{{ end }}

      {{ if or (eq .type "radio") (eq .type "checkbox") }}
      <div class="options" id="options-{{ $q.step }}"{{ if $q.max }} data-max="{{ $q.max }}"{{ end }}>
        {{ range .options }}
        <label class="option{{ if eq $q.type "checkbox" }} checkbox{{ end }}">
          <input type="{{ if eq $q.type "checkbox" }}checkbox{{ else }}radio{{ end }}"
                 name="q{{ $q.step }}" value="{{ .value }}">
          <span class="indicator"></span>
          <span class="option-text">{{ .label }}</span>
        </label>
        {{ end }}
      </div>

      {{ else if eq .type "lead" }}
      {{ range .fields }}
      <div class="input-group">
        <label class="input-label">{{ .label }}</label>
        <input class="text-input" type="{{ .type }}" id="input-{{ .id }}"
               placeholder="{{ .placeholder }}" autocomplete="{{ if eq .type "email" }}email{{ else if eq .id "respondent_name" }}name{{ else }}organization{{ end }}">
      </div>
      {{ end }}
      {{ end }}

    </div>
    {{ end }}

    <div class="step-success" id="step-success">
      <div class="success-icon">✅</div>
      <div class="success-title">Thanks for sharing!</div>
      <div class="success-body">
        We'll review your answers and reach out if there's a clear fit.<br><br>
        In the meantime, see how raus.cloud helps European teams cut cloud costs and reclaim sovereignty.
      </div>
      <a class="success-cta" href="https://raus.cloud">
        <div class="success-cta-icon">🚀</div>
        <div>
          <div class="success-cta-label">Explore raus.cloud</div>
          <div class="success-cta-sub">Infrastructure consulting · Berlin</div>
        </div>
        <div class="success-cta-arrow">→</div>
      </a>
    </div>

  </div><!-- /wizard-body -->

  <div class="wizard-nav" id="wizard-nav">
    <button class="btn-nav btn-back" id="btn-back">← Back</button>
    <button class="btn-nav btn-next" id="btn-next">Continue →</button>
  </div>

  <div class="error-msg" id="error-msg"></div>

</div><!-- /page -->

<script>
(function () {
  const QUESTIONS = {{ .Params.questions | jsonify }};
  const TOTAL = {{ $total }};
  const PB_ENDPOINT = {{ .Params.pocketbase_endpoint | default "/pb/api/collections/assessments/records" | jsonify }};
  const SOURCE = {{ .Params.source | default "unknown" | jsonify }};

  let current = 1;
  const answers = {};

  // Wire up option selection (visual selected state + max enforcement)
  document.querySelectorAll('.options').forEach(container => {
    const max = container.dataset.max ? parseInt(container.dataset.max, 10) : null;
    container.querySelectorAll('.option').forEach(opt => {
      opt.addEventListener('click', () => {
        const input = opt.querySelector('input');
        const isCheckbox = input.type === 'checkbox';

        if (isCheckbox) {
          // Toggle this one
          input.checked = !input.checked;
          opt.classList.toggle('selected', input.checked);

          // Enforce max
          if (max) {
            const checked = Array.from(container.querySelectorAll('input:checked'));
            if (checked.length > max) {
              // Uncheck the first checked item that isn't this one
              for (const cb of checked) {
                if (cb !== input) {
                  cb.checked = false;
                  cb.closest('.option').classList.remove('selected');
                  break;
                }
              }
            }
          }
        } else {
          // Radio: deselect all, select this
          container.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
          container.querySelectorAll('input').forEach(i => { i.checked = false; });
          input.checked = true;
          opt.classList.add('selected');
        }
        document.getElementById('error-msg').textContent = '';
      });
    });
  });

  function getQ(step) {
    return QUESTIONS.find(q => q.step === step);
  }

  function getStepValue(step) {
    const q = getQ(step);
    if (!q) return null;
    if (q.type === 'radio') {
      const el = document.querySelector(`input[name="q${step}"]:checked`);
      return el ? el.value : null;
    }
    if (q.type === 'checkbox') {
      return Array.from(document.querySelectorAll(`input[name="q${step}"]:checked`))
                  .map(i => i.value);
    }
    return null; // lead type handled separately
  }

  function validateStep(step) {
    const q = getQ(step);
    if (!q || !q.required) return true;
    const val = getStepValue(step);
    if (val === null) return false;
    if (Array.isArray(val) && val.length === 0) return false;
    return true;
  }

  function showStep(n) {
    // Hide all
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    document.getElementById('step-success').classList.remove('active');

    const stepEl = document.getElementById('step-' + n);
    if (stepEl) stepEl.classList.add('active');

    // Progress
    const pct = Math.round((n / TOTAL) * 100);
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('step-counter').textContent = n + ' / ' + TOTAL;

    // Nav
    const btnBack = document.getElementById('btn-back');
    const btnNext = document.getElementById('btn-next');
    btnBack.style.display = n === 1 ? 'none' : '';
    btnNext.textContent = n === TOTAL ? 'Submit →' : 'Continue →';
    btnNext.disabled = false;

    document.getElementById('error-msg').textContent = '';
  }

  function nextStep() {
    if (!validateStep(current)) {
      document.getElementById('error-msg').textContent =
        'Please select at least one option to continue.';
      return;
    }

    // Save answer
    const val = getStepValue(current);
    if (val !== null) answers['step_' + current] = val;

    if (current === TOTAL) {
      submitForm();
      return;
    }
    current++;
    showStep(current);
  }

  function prevStep() {
    if (current === 1) {
      window.location.href = '/cloudfest/';
      return;
    }
    current--;
    showStep(current);
  }

  async function submitForm() {
    const btnNext = document.getElementById('btn-next');
    btnNext.disabled = true;
    btnNext.textContent = 'Submitting…';

    // Build payload generically from QUESTIONS
    const payload = { source: SOURCE };

    QUESTIONS.forEach(q => {
      if (q.type === 'radio') {
        const el = document.querySelector(`input[name="q${q.step}"]:checked`);
        payload[q.id] = el ? el.value : '';
      } else if (q.type === 'checkbox') {
        const vals = Array.from(
          document.querySelectorAll(`input[name="q${q.step}"]:checked`)
        ).map(i => i.value);
        payload[q.id] = JSON.stringify(vals);
      } else if (q.type === 'lead') {
        (q.fields || []).forEach(f => {
          const el = document.getElementById('input-' + f.id);
          payload[f.id] = el ? el.value.trim() : '';
        });
      }
    });

    try {
      const res = await fetch(PB_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error('HTTP ' + res.status + ': ' + body.slice(0, 200));
      }

      // Success state
      document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
      document.getElementById('step-success').classList.add('active');
      document.getElementById('wizard-nav').style.display = 'none';
      document.getElementById('progress-fill').style.width = '100%';
      document.getElementById('step-counter').textContent = '✓ Done';

    } catch (err) {
      console.error('Submission error:', err);
      document.getElementById('error-msg').textContent =
        'Something went wrong. Please try again or email eduardo@raus.cloud';
      btnNext.disabled = false;
      btnNext.textContent = 'Submit →';
    }
  }

  document.getElementById('btn-next').addEventListener('click', nextStep);
  document.getElementById('btn-back').addEventListener('click', prevStep);

  // Init
  showStep(1);
})();
</script>
{{ end }}
```

**Verification**: `grep -c 'data-step' apps/landing/layouts/assessment/single.html | xargs test 1 -le && echo VALID`

---

## Execution

### Phase 1 — All parallel (no file overlaps)
| WU | Implementor | Files |
|----|-------------|-------|
| WU-1 | impl-1 | `raus.cloud.yaml`, `compose.dev.yml` |
| WU-2 | impl-2 | `apps/landing/nginx.conf` |
| WU-3 | impl-3 | `infra/pocketbase/pb_migrations/1_create_assessments.js` |
| WU-4 | impl-4 | `apps/landing/static/cloudfest/index.html` |
| WU-5 | impl-5 | `content/assessments/cloudfest.en.md`, `layouts/assessment/baseof.html`, `layouts/assessment/single.html` |

---

## Post-Deploy Checklist

1. **First deploy**: PocketBase applies the migration automatically on startup
2. **Create admin**: `docker exec <pb_container> ./pocketbase superuser upsert admin@raus.cloud <strong-password>`
3. **Verify collection**: Visit PocketBase admin UI via SSH tunnel: `ssh -L 8090:localhost:8090 user@server`
4. **Test form**: Submit the assessment at `/cloudfest/assessment/`, check PocketBase admin for the record
5. **Future SQLite backup**: `docker exec <pb_container> cp /pb/pb_data/data.db /backup/` via cron

## Rollback

```bash
git checkout -- raus.cloud.yaml compose.dev.yml apps/landing/nginx.conf apps/landing/static/cloudfest/index.html
rm -rf infra/pocketbase/ apps/landing/content/assessments/ apps/landing/layouts/assessment/
```
