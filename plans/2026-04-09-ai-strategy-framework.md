# Implementation Plan: AI Strategy Framework Page + LinkedIn Article

**Date**: 2026-04-09 **Status**: IN PROGRESS (Phase 2 redesign)

## Overview

Build a standalone "AI Strategy Framework" page on raus.cloud that presents a practical 5-dimension framework for European tech companies. The page has two main sections: (1) a copy-paste prompt CTA that lets readers run a guided self-assessment using their own AI, and (2) an embedded slide deck with custom SVG diagrams that visually presents the framework. Additionally, create a LinkedIn article that introduces the framework and drives traffic to the page.

## Scope

- Work units: 7 (3 completed, 4 new/updated)
- Execution phases: 3
- Files affected:
  - `apps/landing/content/ai-strategy.en.md` (modify — add slides frontmatter)
  - `apps/landing/layouts/_default/ai-strategy.html` (rewrite — slide-based layout)
  - `apps/landing/i18n/en.toml` (already modified ✅)
  - `apps/landing/layouts/partials/header.html` (already modified ✅)
  - Outline documents (2 already created ✅, 1 to update)

## Completed Work Units

### WU-1: AI Strategy Framework Content File ✅

Created `apps/landing/content/ai-strategy.en.md` with frontmatter. Committed as 388eec1.

### WU-3: Navigation + i18n Updates ✅

Added `[navigation.aiStrategy]` to `i18n/en.toml` and nav link in `header.html`. Committed as ced0c4c.

### WU-4: Outline Documents — Framework + Prompt ✅

Created two Outline documents in Fuck.Cloud collection:
- "AI Strategy Framework — Reference" (ID: be3047a1-e4ca-4d75-8ea2-d8f9e6362d84)
- "AI Strategy Assessment Prompt" (ID: 216ffbe4-11e3-4515-8249-d942973aec98)

### WU-5: LinkedIn Article Draft ✅

Created Outline document "LinkedIn Article: AI Strategy Framework" (ID: e62dc617-dcd9-4783-a233-d56b0de8d002). ~1608 words.

---

## New/Updated Work Units (Phase 2 Redesign)

### WU-6: Update Content File with Slide Data

**Dependencies**: WU-1 (completed)

**Context**: The content file currently has minimal frontmatter. We need to add a `slides:` array to the frontmatter containing the slide deck data, following the exact same format as the existing slide content files (e.g., `content/slides/raus-cloud-pitch-v2.en.md`). The layout template will read this data via `.Params.slides` and render the slide viewer inline. The slide deck presents the framework visually — no thesis/antithesis/synthesis on the page (that stays in Outline as internal reference). The dialectic is encoded in the prompt instead.

**Files**:
- `apps/landing/content/ai-strategy.en.md` — modify

**Steps**:
1. Read the current content file at `apps/landing/content/ai-strategy.en.md`
2. Add a `slides:` array to the frontmatter with the following 12 slides:

```yaml
slides:
  - number: 1
    type: hero
    title: "AI STRATEGY FRAMEWORK"
    subtitle: "Five dimensions. Four maturity levels. Zero bullshit."
    bullets:
      - "Adoption Governance"
      - "Vendor Dependency"
      - "Data Sovereignty"
      - "Cost Visibility"
      - "Team Health"
    cta: "raus.cloud/ai-strategy"

  - number: 2
    type: one-thing
    statement: "AI vendor dependency is the new cloud vendor lock-in. And it's worse."
    tagline: "When AWS raises prices, you migrate your Terraform. When Anthropic raises prices, you can't migrate your prompts."

  - number: 3
    type: two-col
    label: "The Parallel"
    title: "SAME TRAP, DIFFERENT LAYER"
    subtitle: "The dependency pattern is identical — but the switching cost is higher."
    col_a:
      heading: "Cloud Era (2015-2020)"
      items:
        - '"You need AWS"'
        - "Direct SDK integration"
        - "Can't leave without rewriting"
        - "US jurisdiction (CLOUD Act)"
        - "€15k/month bill you can't escape"
    col_b:
      heading: "AI Era (2024-now)"
      items:
        - '"You need OpenAI"'
        - "Direct API integration"
        - "Can't leave without rewriting"
        - "US jurisdiction (CLOUD Act)"
        - "€5k/month API bill that will 3-5x"

  - number: 4
    type: custom-svg
    svg_id: "three-scales"
    label: "The Pattern"
    title: "SAME PATTERN, THREE SCALES"
    subtitle: "Subsidized adoption → Dependency → Pricing correction. It's happening at every level."

  - number: 5
    type: icon-grid
    label: "The Framework"
    title: "FIVE DIMENSIONS"
    subtitle: "Each dimension has four maturity levels. Where are you?"
    items:
      - icon: "users"
        heading: "Adoption Governance"
        body: "Who decides which AI tools? Is there a framework or is it chaos? Levels: Chaos → Mandate → Governed → Adaptive"
      - icon: "chain"
        heading: "Vendor Dependency"
        body: "Coupled to one AI provider? Can you switch without rewriting? Levels: Coupled → Standardized → Abstracted → Portable"
      - icon: "shield"
        heading: "Data Sovereignty"
        body: "What data flows through AI providers? GDPR compliant? Levels: Exposed → Aware → Classified → Sovereign"
      - icon: "banknote"
        heading: "Cost Visibility"
        body: "Know what you spend on AI? Building on subsidized pricing? Levels: Blind → Tracking → Measured → Optimized"
      - icon: "heart"
        heading: "Team Health"
        body: "More productive or more burned out? Skill atrophy? Levels: Unmanaged → Measured → Balanced → Sustainable"

  - number: 6
    type: custom-svg
    svg_id: "maturity-staircase-governance"
    label: "Dimension 1"
    title: "ADOPTION GOVERNANCE"
    subtitle: "Who decides which AI tools the company uses?"

  - number: 7
    type: custom-svg
    svg_id: "maturity-staircase-vendor"
    label: "Dimension 2"
    title: "VENDOR DEPENDENCY"
    subtitle: "Are you coupled to one AI provider the same way you were coupled to AWS?"

  - number: 8
    type: custom-svg
    svg_id: "maturity-staircase-sovereignty"
    label: "Dimension 3"
    title: "DATA SOVEREIGNTY"
    subtitle: "What data flows through AI providers? Are you GDPR/EU AI Act compliant?"

  - number: 9
    type: custom-svg
    svg_id: "maturity-staircase-cost"
    label: "Dimension 4"
    title: "COST VISIBILITY"
    subtitle: "Do you know what you're spending on AI? Are you building on subsidized pricing?"

  - number: 10
    type: custom-svg
    svg_id: "maturity-staircase-health"
    label: "Dimension 5"
    title: "TEAM HEALTH"
    subtitle: "Is AI making your team more productive or more burned out?"

  - number: 11
    type: custom-svg
    svg_id: "arm-reset-timeline"
    label: "The Risk"
    title: "THE ARM RESET IS COMING"
    subtitle: "AI pricing mirrors the 2008 subprime mortgage crisis. Subsidized rates will end."

  - number: 12
    type: cta
    label: "Next Step"
    title: "ASSESS YOURSELF."
    subtitle: "Copy the prompt. Paste it into your AI. Get your snapshot. Free, no email required."
    website: "raus.cloud/ai-strategy"
    email: "hello@raus.cloud"
    tagline: "Right-sized AI strategy. Sovereign by default. No lock-in."
```

3. Note the `type: custom-svg` slides — these are new slide types that the layout template must handle. Each has an `svg_id` that identifies which SVG diagram to render. The layout template will contain the SVG rendering logic for each diagram.

**Verification**: `cd apps/landing && hugo --quiet 2>&1; echo $?` exits 0.

**Rollback**:
- `git checkout -- apps/landing/content/ai-strategy.en.md`

---

### WU-7: Rewrite Layout Template — Slide-Based with SVG Diagrams

**Dependencies**: WU-6

**Context**: The current layout template (WU-2, already built) is a wall-of-text design with 5 long sections containing thesis/antithesis/synthesis. We need to completely rewrite it as: (1) hero, (2) prompt CTA box, (3) embedded slide viewer with custom SVG diagrams, (4) companion assessment link, (5) consulting CTA. The slide viewer uses the same rendering logic as `layouts/slides/single.html` but inlined into the page layout. Custom SVG diagrams replace the text-heavy dimension sections.

**Files**:
- `apps/landing/layouts/_default/ai-strategy.html` — rewrite

**Steps**:
1. Read the current layout file at `apps/landing/layouts/_default/ai-strategy.html`
2. Read the slide rendering logic at `apps/landing/layouts/slides/single.html` (651 lines) — this contains all the slide type templates and the JavaScript navigation logic
3. Rewrite `apps/landing/layouts/_default/ai-strategy.html` with the following structure:

   **A. `{{ define "main" }}` wrapper** — inherits baseof.html (header, footer, site CSS, dark mode)

   **B. Hero section** (dark bg `bg-brand-primary`):
   - Title: "AI Strategy Framework"
   - Subtitle: "A practical framework for companies too big to wing it but too lean to hire specialists."
   - One-liner: "Not adopting AI is a risk. Adopting without strategy is a bigger risk."

   **C. Prompt CTA section** (light bg `bg-brand-light`, prominent):
   - Heading: "Run this assessment with your own AI"
   - Body: "Copy the prompt below and paste it into Claude, ChatGPT, or whatever you use. It'll walk you through each dimension, score you, and give you a personalized snapshot. No email required."
   - The prompt text in a `<pre id="ai-strategy-prompt">` element — read the exact prompt from Outline document ID `216ffbe4-11e3-4515-8249-d942973aec98` and embed it verbatim
   - Copy button with `copyPrompt()` JavaScript function
   - The prompt should be updated to include dialectical questioning instructions: "For each dimension, challenge the user's assumptions. If they say they're fine, push back with the skeptical position. If they say they're doomed, offer the counter-argument. Use dialectical questioning to help them see beyond their current position."

   **D. Embedded slide viewer** (dark bg, full-width):
   - Copy the slide rendering logic from `layouts/slides/single.html` — the `{{ range .Params.slides }}` loop with all slide type templates (hero, one-thing, two-col, icon-grid, diagnostic, pyramid, cta, etc.)
   - Add a new `custom-svg` slide type that renders inline SVG diagrams based on the `svg_id` field
   - Copy the JavaScript navigation logic (keyboard, swipe, progress bar, slide counter)
   - The slide viewer should be styled to fit within the page (not full-screen like the standalone slide page) — use a fixed-height container (e.g., `h-[600px] md:h-[700px]`) with the slides inside

   **E. Custom SVG diagrams** — implement these 7 SVGs inline in the template:

   **SVG 1: "three-scales"** — The same pattern at three scales:
   - Three horizontal lanes stacked vertically
   - Each lane has: "Subsidized adoption → Dependency → Pricing correction" as three connected boxes with arrows
   - Lane 1 (top): "Individual" — "Dopamine loops → Cognitive dependency → Burnout"
   - Lane 2 (middle): "Organizational" — "Free/cheap tools → Vendor coupling → No leverage"
   - Lane 3 (bottom): "Economic" — "Below-cost pricing → Fake demand → ARM reset"
   - A vertical bracket or highlight connecting all three lanes on the right side: "Same pattern"
   - Colors: brand-accent (#10b981) for arrows, brand-primary (#0f1419) for backgrounds, white for text, red (#ef4444) for the "correction" endpoints

   **SVG 2-6: "maturity-staircase-{governance,vendor,sovereignty,cost,health}"** — Five nearly identical SVGs, one per dimension:
   - Four steps rising from left to right (like a staircase)
   - Step 1 (leftmost, shortest): Red tint — Level 1 label + 1-line description
   - Step 2: Yellow tint — Level 2 label + 1-line description
   - Step 3: Blue tint — Level 3 label + 1-line description
   - Step 4 (rightmost, tallest): Green tint — Level 4 label + 1-line description
   - A "You are here" indicator (a dot or arrow) that the user can mentally place
   - The specific labels for each dimension:
     - Governance: Chaos → Mandate → Governed → Adaptive
     - Vendor: Coupled → Standardized → Abstracted → Portable
     - Sovereignty: Exposed → Aware → Classified → Sovereign
     - Cost: Blind → Tracking → Measured → Optimized
     - Health: Unmanaged → Measured → Balanced → Sustainable
   - Each step also has a 3-5 word description:
     - Governance: "No policy" → "Use AI (no framework)" → "Guardrails + choice" → "Living framework"
     - Vendor: "Direct API, no exit" → "One provider, aware" → "Abstraction layer" → "Switch in hours"
     - Sovereignty: "Data goes anywhere" → "Informal rules" → "Classified + routed" → "EU by default"
     - Cost: "No tracking" → "Some visibility" → "Full cost per engineer" → "Resilient to 5x"
     - Health: "Conflict, no measurement" → "Some tracking" → "Both styles supported" → "Intentional, not compulsive"

   **SVG 7: "arm-reset-timeline"** — The pricing correction timeline:
   - Horizontal timeline with 4 markers:
   - Marker 1 (left): "2024-2025: Teaser rates" — "Anthropic: $5K/month burn on $200 subscriptions. Every AI startup subsidizes users."
   - Marker 2: "June 2025: Priority tiers launch" — "Anthropic and OpenAI jack up enterprise API prices. Cursor forced to reprice."
   - Marker 3: "2026: Rate limits tighten" — "Perplexity drops from 600 to 20 deep research queries. Augment removes features."
   - Marker 4 (right, red): "Coming: The ARM reset" — "3-5x price increases. Companies that built dependency face the same shock as 2008 homeowners."
   - An arrow from left to right showing the trajectory
   - Colors: brand-accent for early markers, transitioning to red (#ef4444) for the ARM reset marker

   **F. Companion assessment section** (light bg):
   - "Already know your infrastructure position?" — link to `/assessment/`

   **G. Consulting CTA section** (brand-accent bg):
   - "Want help executing?" — link to `{{ .Site.Params.calendarLink }}`

4. All SVGs must:
   - Use `viewBox` for responsive scaling
   - Use brand colors: `#10b981` (accent), `#0f1419` (primary), `#6b7280` (secondary), `#ef4444` (red), `#f59e0b` (yellow), `#3b82f6` (blue)
   - Support dark mode (the SVGs are on dark backgrounds already, so white text is fine)
   - Be readable at mobile sizes (min 320px viewport)

5. The prompt text must be updated to include dialectical questioning. Read the current prompt from Outline (ID: 216ffbe4-11e3-4515-8249-d942973aec98), add the dialectical instructions, and embed the updated version.

**Verification**: `cd apps/landing && hugo --quiet 2>&1; echo $?` exits 0. Then verify: `grep -c "custom-svg" public/ai-strategy/index.html` >= 1, `grep -c "three-scales" public/ai-strategy/index.html` >= 1, `grep -c "maturity-staircase" public/ai-strategy/index.html` >= 5, `grep -c "arm-reset" public/ai-strategy/index.html` >= 1, `grep -c "Copy to clipboard" public/ai-strategy/index.html` >= 1.

**Rollback**:
- `git checkout -- apps/landing/layouts/_default/ai-strategy.html`

---

### WU-8: Update Outline Prompt with Dialectical Instructions

**Dependencies**: none

**Context**: The prompt in Outline (ID: 216ffbe4-11e3-4515-8249-d942973aec98) currently instructs the AI to ask questions and score. We need to add dialectical questioning instructions so the AI challenges the user's assumptions rather than just accepting their answers. The thesis/antithesis/synthesis is removed from the page but encoded in the prompt as a questioning strategy.

**Files**:
- Outline document: "AI Strategy Assessment Prompt" (ID: 216ffbe4-11e3-4515-8249-d942973aec98) — update

**Steps**:
1. Read the current prompt from Outline via `mcp-outline_read_document` (ID: 216ffbe4-11e3-4515-8249-d942973aec98)
2. Add a new section to the prompt titled "Dialectical Questioning Strategy" with the following content:

```
## Dialectical Questioning Strategy

For each dimension, there are two common but incomplete positions that most companies hold. Your job is to help the user see beyond their current position by challenging their assumptions.

**The pattern for each dimension:**
- The "naive" position: the optimistic, adopt-everything view (e.g., "AI tools are cheap and obviously helpful")
- The "skeptical" position: the pessimistic, risk-focused view (e.g., "AI is a bubble and vendor lock-in is inevitable")
- The "practical" position: the middle path that neither blindly adopts nor blindly resists

**How to use this in the conversation:**
- If the user expresses the naive position, gently introduce the skeptical counter-argument with specific evidence (e.g., "Anthropic burns $10B on compute against $5B revenue — the pricing is subsidized")
- If the user expresses the skeptical position, acknowledge the risk but offer the practical alternative (e.g., "You're right to be concerned about lock-in — that's exactly why abstraction layers exist")
- If the user is already at the practical position, validate it and help them deepen it
- Never be punitive or shaming. Use stage-based language ("you're at Level 1" not "you're failing")
- The goal is not to argue — it's to help them see the full picture, not just the part they're currently looking at

**Specific dialectical pairs for each dimension:**
1. Adoption Governance: "Give everyone AI tools" ↔ "AI adoption without framework creates chaos" → "Top-down guardrails, bottom-up adoption"
2. Vendor Dependency: "Use the best model for the job" ↔ "You can't switch later, the pricing is fake" → "Abstract from day one, switch in config not code"
3. Data Sovereignty: "AI providers have DPAs, it's fine" ↔ "Your engineers are pasting customer data into ChatGPT right now" → "Classify first, route second"
4. Cost Visibility: "AI tools are cheap, ROI is obvious" ↔ "Pricing is subsidized, the ARM reset is coming" → "Measure before you optimize, plan for 3-5x increases"
5. Team Health: "AI makes engineers 10x more productive" ↔ "Agentic coding is draining, skill atrophy is real" → "Productivity is not output volume, support both styles"
```

3. Update the Outline document with the full prompt (existing content + new dialectical section) using `mcp-outline_update_document`.

**Verification**: Read the updated document via `mcp-outline_read_document` and confirm the dialectical section is present.

**Rollback**:
- Re-update the Outline document to remove the dialectical section if needed

---

## Execution Plan

### Phase 1 — Completed ✅

- WU-1: Content file ✅
- WU-3: Navigation + i18n ✅
- WU-4: Outline documents ✅
- WU-5: LinkedIn article ✅

### Phase 2 — Parallel (redesign)

- WU-6: Update content file with slide data
- WU-8: Update Outline prompt with dialectical instructions

### Phase 3 — Sequential (requires Phase 2)

- WU-7: Rewrite layout template — slide-based with SVG diagrams

### Phase 4 — Verification

- `cd apps/landing && hugo server -D` and visual check of /ai-strategy/ page
- Verify all 7 SVG diagrams render
- Verify slide navigation works (keyboard, swipe, buttons)
- Verify prompt copy-to-clipboard works
- Verify prompt includes dialectical instructions

## Recovery Strategy

- **Automatic**: Each implementor rolls back and retries once on failure.
- **Dependency failure**: If WU-6 fails, WU-7 cannot run. WU-8 is independent.
- **Global rollback**: `git checkout -- apps/landing/content/ai-strategy.en.md apps/landing/layouts/_default/ai-strategy.html` plus revert Outline prompt document.
- **Independent failures**: WU-6 and WU-8 are independent. If one fails, the other still executes.
