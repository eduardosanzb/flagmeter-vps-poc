# raus.cloud Distribution & Pipeline Backlog

> **North Star: Fill the pipeline.** Content is strong. Proof exists. The bottleneck is distribution: getting what we've built in front of the people who need it. Everything else is blocked on having prospects to talk to.

**Last updated:** 2026-03-31
**GitHub issues:** All raus.cloud issues migrated and closed. BACKLOG.md is now the single source of truth.

---

## Current State

### What's Working
- **4 published articles** (EN/DE/ES) with real benchmarks, not theory
- **FlagMeter reference architecture**: 500+ RPS on `€7.59/month`, production-tested
- **Landing site**: Professional, bilingual, clear pricing, Cal.com booking on every page
- **Assessment wizard**: 10-step multilingual PocketBase-backed lead capture tool at `/assessment/` (plus legacy `/cloudfest/assessment/`)
- **Slide deck v2**: 10-slide conference pitch, rendered as HTML
- **Analytics**: Umami self-hosted with CTA tracking, scroll depth, reading time

### What's Broken
- **Zero pipeline**: No audits, no pilots, no revenue. Phase 1 commercial validation has not started.
- **Content not distributed**: Articles are on the site, but the traffic and follow-up are weak.
- **No intermediate conversion**: Visitors are either ready to book a 15-min call or they bounce.
- **Article 5 archived**: Database article is fully written and researched, but still in `.archive/`.
- **Analytics unverified**: Umami may not be firing in production (`enableAnalytics = false` in `hugo.toml`).

### Phase 1 Progress (GitHub Milestone: `raus.cloud Phase 1: Validation`)

| Category | Done | Remaining |
|----------|------|-----------|
| Content/Learning | `#73`, `#94`, `#95` (3 closed) | `#65`, `#72`, `#96`, `#97` |
| Commercial (audits/pilots/revenue) | `#75` (audit framework complete) | `#74`, `#76`, `#77`, `#78`, `#79`, `#80`, `#81`, `#83` |
| Site Conversion | 4 | `SITE-5` |
| Infrastructure | 0 | `#53`, `#64`, `#84`, `#85` |
| Distribution | 0 | `DIST-1` through `DIST-5`, `#89` |

**Success criteria:** `€15k-30k` revenue, 3 case studies, 1+ referral  
**Kill trigger:** `<€15k after 5 audits`

---

## Backlog

### P0 - Distribution (This Week)

These directly put content in front of the ICP. Eduardo does these manually.

#### DIST-1: CloudFest Learnings LinkedIn Post ✅
- **Owner:** Eduardo
- **Status:** Drafted and ready to post Monday
- **Format:** Personal narrative post about CloudFest: what resonated, what people asked, what felt real
- **CTA:** Soft promotion to assessment / book a call

#### DIST-2: Direct LinkedIn Outreach to ICP CTOs
- **Owner:** Eduardo
- **Method:** Use the 3 diagnostic questions as conversation starters:
  1. *How many engineer hours last month went to infrastructure vs. features?*
  2. *What's your mean time to onboard a new dev to a "hello world" deploy?*
  3. *What would you need to show your CEO to justify an infrastructure week?*
- **Target:** European B2B SaaS, post-seed to Series B, 20-100 people
- **Signal to look for:** No dedicated DevOps hire, or 1 overloaded SRE

#### DIST-3: LinkedIn Data Posts (extracted from articles)

**Post A - The 1,400x Cost Difference (from Article 1)**
> We ran 4 identical load tests on Hetzner.
>
> Single `€7.59/month` VPS: 484 requests/second.
> Docker Swarm (same cost): 354 RPS.
>
> The simple setup won by 37%.
>
> Then we priced the AWS equivalent for 484 RPS:
> Lambda: `€9,900/mo`
> RDS Multi-AZ: `€280/mo`
> ElastiCache: `€180/mo`
> ALB + NAT + CloudWatch: `€200/mo`
> Total: `€10,560/month`.
>
> That's a 1,400x cost difference.
>
> The "best practice" distributed architecture was both slower and 1,400x more expensive.
>
> Full benchmarks and methodology: [link to article 1]

**Post B - The DevOps Salary Replacement (from Article 2)**
> We replaced a `€5,000-8,000/month` DevOps engineer salary with 3 open-source tools:
>
> - Coolify (self-hosted PaaS): `€3.79/mo`
> - Docker Compose on Hetzner VPS: `€7.59/mo`
> - Terraform for IaC: `€0`
>
> Total: `€11.38/month`.
>
> What we get:
> - 2-3 minute deploys from git push
> - Preview environments for every PR (39 seconds)
> - Auto-HTTPS, zero-downtime deployments
> - 147 successful deployments tracked with commit links
> - ~10 minute full disaster recovery
>
> 218 deployments. Zero incidents. Zero vendor lock-in.
>
> Full setup guide: [link to article 2]

**Post C - The Data Behind Cloud Repatriation (from Article 3)**
> 70% of 1,800 enterprises plan to move workloads back from cloud within 24 months.
> (VMware, 17 countries)
>
> This is not contrarian anymore. It's the new mainstream.
>
> The numbers:
> - a16z: `$100B+` in market cap destroyed by cloud costs
> - 37signals: `$7M` saved over 5 years leaving AWS. Zero new hires.
> - Dropbox: Gross margin went from 33% to 67% after optimization
> - 47% of IT pros faced unexpected cloud costs of `$5k-$25k`
>
> If you're a startup spending `€5k+/month` on AWS with predictable workloads, you are the use case.
>
> Full analysis with 25+ sources: [link to article 3]

**Post D - The Scaling Lie (from Article 4)**
> Pieter Levels runs Photo AI (`$1.6M/year` revenue) on a single `$40/month` VPS.
>
> Stack Overflow served 100M+ developers on 9 web servers.
>
> WhatsApp handled 900M users with 32 engineers.
>
> Meanwhile, a startup I know burns `€6,000/month` on AWS for minimal concurrent traffic.
>
> That gap represents extending runway from 8 months to 24+ months.
>
> Most scaling problems aren't technical. They're operational. Here's a framework that matches infrastructure spend to actual revenue, not imaginary scale.
>
> Full roadmap: [link to article 4]

**Post E - The Database Truth (for when Article 5 publishes)**
> We deployed 8 research agents to settle the managed vs self-hosted database debate.
>
> Methodology: Hegelian dialectics across 8 dimensions. 50+ sources. No cherry-picking.
>
> Result: Self-hosted PostgreSQL wins 6 of 8 dimensions for bootstrapped SaaS under 2,000 RPS.
>
> The cost difference: 925x.
> - FlagMeter full stack: `€11.40/month`
> - AWS equivalent: `€10,560/month`
>
> Local NVMe: 50-200us latency
> EBS (AWS): 500-2,000us latency
> That's 10-20x faster storage.
>
> Neither side is universally right. But for bootstrapped B2B SaaS, the data is clear.
>
> Full analysis: [link to article 5]

#### DIST-4: Export Pitch v2 Slides to PDF
- **Purpose:** LinkedIn carousel post + shareable document for outreach
- **Source:** `apps/landing/content/slides/raus-cloud-pitch-v2.en.md` (10 slides)
- **Approach:** ~~Add print stylesheet to slides layout~~ ✅ Done. Open `/slides/raus-cloud-pitch-v2/` → `Cmd+P` → Save as PDF → upload to LinkedIn as carousel
- **Status:** Print stylesheet deployed. **Eduardo to do the Cmd+P export.**

#### DIST-5: Submit Article 1 to Hacker News
- **Title:** "We Spent `€11/month` Testing Docker Swarm So You Don't Have To"
- **Why Article 1:** Best hook for HN audience (benchmarks, cost comparison, contrarian finding)
- **Timing:** ✅ Site conversion fixes are now deployed. **Ready to submit.**
- **GitHub issue:** `#89`

---

### P1 - Site Conversion Fixes

Code changes that capture visitors who arrive but are not ready to book a call.

#### ~~SITE-1: Generalize Assessment Wizard~~ ✅
- **Status:** Complete
- **Result:** The assessment now lives at `/assessment/` in EN/DE/ES, with dynamic back links plus `language` and `referrer` tracking in PocketBase.
- **Completed:** 2026-03-30

#### ~~SITE-2: Add Social Links to Footer~~ ✅
- **Status:** Complete
- **Result:** LinkedIn, X/Twitter, GitHub, and Email SVG icons in footer Brand column. URLs sourced from `[params.social]` in `hugo.toml`.
- **Completed:** 2026-03-31

#### ~~SITE-3: Slides Print Stylesheet for PDF Export~~ ✅
- **Status:** Complete
- **Result:** `@media print` block in `layouts/slides/single.html`. All 10 slides render as full pages, nav hidden. Open `/slides/raus-cloud-pitch-v2/` → `Cmd+P` → Save as PDF.
- **Completed:** 2026-03-31

#### ~~SITE-4: Add RSS Link to Blog Pages~~ ✅
- **Status:** Complete
- **Result:** Auto-discovery `<link rel="alternate">` in `<head>` on all pages (falls back to `.CurrentSection` on single posts). Visible "Subscribe via RSS" on blog list. RSS icon in blog single meta area.
- **Completed:** 2026-03-31

#### SITE-5: Verify Analytics in Production

**Current state:** `apps/landing/hugo.toml` has `enableAnalytics = false`. Presumably overridden in production build.

**Action:** Verify the live site source for the Umami script tag. If missing, fix the production build env.

**GitHub issue:** `#85`

---

### P2 - Content Pipeline

#### CONTENT-1: Publish Article 5 (Self-Running Databases)

**Current state:** 504-line article in `apps/landing/content/blog/.archive/self-running-databases-production.en.md` plus `.de.md` and `.es.md`. `draft: true`.

**Changes needed:**
1. Move all 3 files from `.archive/` to `apps/landing/content/blog/`
2. Set `draft: false`
3. Update `date` to the current publish date
4. Light editorial pass (links, stale references, formatting)
5. Add inline CTA + bottom CTA box, consistent with other articles

**Research:** Complete. Extensive Hegelian analysis is already in Outline.

**LinkedIn post:** See `DIST-3` Post E above.

**GitHub issue:** `#97`

#### CONTENT-2: Article 6 - US Vendor Dependency and EU Sovereignty

**Status:** Planned in Outline Live Document. Not yet written.
**Angle:** CLOUD Act, NIS2, DORA, EUCS - regulatory pressure on EU companies to demonstrate sovereign infrastructure control.
**Priority:** After Article 5 publishes and distribution ramps.

#### CONTENT-3: Hetzner + LLM + Coolify Series

**Status:** Research phase (`#96`). New series exploring self-hosted LLM inference on Hetzner ARM.
**Priority:** Future. Do not start until current series is fully distributed.

#### CONTENT-4: Blueprint from FlagMeter
- Extract reusable patterns from FlagMeter implementation
- **GitHub issue:** `#72`

#### CONTENT-5: Additional Slide Use Cases
- Slides explaining use cases and how to do it (e.g. WordPress or other common stacks)
- **GitHub issue:** `#65`

#### CONTENT-6: Database Articles
- Publish additional database-focused content
- **GitHub issue:** `#97`

---

### P3 - Sales Infrastructure

These support the audit process once leads start flowing.

#### SALES-1: Run 5-10 Free Architecture Audits
- **Goal:** Fill the pipeline with qualified leads
- **Method:** Use the standardized audit framework (see SALES-2)
- **Success metric:** >20% conversion to pilots
- **GitHub issue:** `#74`

#### SALES-2: Standardized Audit Template
- Create repeatable discovery checklist
- Should cover: cloud setup, team size, deployment pipeline, observability, cost breakdown, bus factor assessment
- The 3 diagnostic questions are the opener
- **Status:** ✅ Complete (9 docs in Outline → Fuck.Cloud collection)
- **GitHub issue:** `#75`

#### SALES-3: Audit Report Template (`€2k` Waste Report)
- Deliverable from the free 15-min audit
- Template: 1-page PDF showing waste identified, recommended stack, projected savings
- **Status:** ✅ Complete (Report Template + 1-Page Summary in Outline)
- **GitHub issue:** Part of `#75`

#### SALES-4: Pipeline Tracking
- Even a simple spreadsheet: Name, Company, Source, Stage, Next Action, Date
- Stages: Lead -> Audit Booked -> Audit Done -> Pilot Proposed -> Pilot Closed

#### SALES-5: Close First €3k Pilot
- **GitHub issue:** `#76`

#### SALES-6: Close Second €3k Pilot
- **GitHub issue:** `#77`

#### SALES-7: Execute First Full Migration
- **GitHub issue:** `#78`

#### SALES-8: Write First Case Study
- Document real client results for social proof
- **GitHub issue:** `#79`

#### SALES-9: Get First Referral
- **GitHub issue:** `#80`

#### SALES-10: Extract Migration Patterns into Playbook
- Codify what works into reusable templates
- **GitHub issue:** `#81`

#### SALES-11: Create Runbook Template
- Standardized operational documentation for clients
- **GitHub issue:** `#83`

---

### P4 - Future (Post-Traction)

Explicitly parked until Phase 1 commercial metrics are met.

| Item | GitHub Issue | Trigger |
|------|-------------|---------|
| Extract blueprint to public repo | `#86` | After 2+ completed audits inform the patterns |
| Document blueprint: README, architecture diagrams, deployment guide | `#87` | After `#86` |
| Add client patterns: Rails/Node/Python examples | `#88` | After real client migrations |
| Launch on HN/Reddit (blueprint) | `#89` | After `#86-#88` |
| TUI/agent audit tool | New issue | After assessment generates signal |
| DIY Guide (`€199`) | `#91` | Phase 3 |
| Office Hours (`€500/mo`) | `#92` | Phase 3 |
| Path C website messaging ("Use our blueprint or hire us") | `#90` | Phase 3 |
| Fixed scope services (no bespoke work outside blueprint) | `#93` | Phase 3 |

---

### P5 - Infrastructure Operations

Platform and tooling improvements to support the consulting service.

#### INFRA-1: Migrate to ARM Hetzner Instance
- Optimize FlagMeter deployment for ARM architecture
- **GitHub issue:** `#53`

#### INFRA-2: Decouple Database to Coolify DB
- Separate database management from application deployment
- **GitHub issue:** `#64`

#### ~~INFRA-3: RSS Subscription for Blog~~ ✅
- **Status:** Complete (covered by SITE-4)
- **Completed:** 2026-03-31

#### INFRA-4: Fix Analytics
- Resolve Umami analytics tracking issues in production
- **Status:** Production build may be missing analytics script
- **GitHub issue:** `#85`

---

## LinkedIn Post Cross-Article Power Stats

Best numbers for standalone posts or comments.

| Stat | Context |
|------|---------|
| **1,400x cost difference** (`€7.59` vs `€10,560/mo`) | VPS vs AWS Lambda equivalent |
| **925x cost difference** (`€11.40` vs `€10,560/mo`) | Full stack self-hosted vs AWS |
| **70% of enterprises** repatriating by 2026 | VMware survey, 1,800 orgs, 17 countries |
| **`$100B+` market cap destroyed** by cloud costs | a16z analysis |
| **37signals: `$7M` saved** over 5 years | Zero new hires after repatriation |
| **Pieter Levels: `$1.6M/yr` on `$40/mo` VPS** | Photo AI on DigitalOcean |
| **WhatsApp: 900M users, 32 engineers** | Simplicity at scale |
| **37% better performance from simpler architecture** | Single VPS vs Docker Swarm |
| **`€5k-8k/mo` DevOps salary replaced by `€11.38/mo`** | Coolify + Docker + Terraform |
| **10-20x faster storage** (local NVMe vs EBS) | Self-hosted vs managed DB |

---

## Kill Triggers (from BSC)

| Metric | Trigger | Action |
|--------|---------|--------|
| Revenue | `<€15k after 5 audits` | Wrong ICP or pricing |
| Pilot conversion | `0 pilots after 3 audits` | Solution does not resonate |
| Referrals | `0 referrals after 2 pilots` | Wrong business model |
| GitHub stars | `<200 after Phase 2 launch` | Positioning does not work |
| Inbound leads | `0 from OSS after 3 months` | OSS strategy ineffective |

---

## Key Files Reference

| Asset | Path |
|-------|------|
| Assessment wizard (content) | `apps/landing/content/assessments/cloudfest.en.md` |
| Assessment wizard (layout) | `apps/landing/layouts/assessment/single.html` |
| Slides pitch v2 | `apps/landing/content/slides/raus-cloud-pitch-v2.en.md` |
| Slides layout | `apps/landing/layouts/slides/single.html` |
| Article 5 (archived) | `apps/landing/content/blog/.archive/self-running-databases-production.{en,de,es}.md` |
| Header nav | `apps/landing/layouts/partials/header.html` |
| Footer | `apps/landing/layouts/partials/footer.html` |
| Hugo config | `apps/landing/hugo.toml` |
| Blog post template | `apps/landing/layouts/blog/single.html` |
| Analytics JS | `apps/landing/static/js/analytics.js` |
| Email signature | `apps/landing/static/email-signature.html` |
| CloudFest landing | `apps/landing/static/cloudfest/index.html` |
| PocketBase endpoint | `https://admin.raus.cloud/api/collections/assessments/records` |
| Cal.com booking | `https://cal.com/eduardosanzb/15min` |
| GitHub issues | `eduardosanzb/eduardosanzb` repo, `raus.cloud` label |
