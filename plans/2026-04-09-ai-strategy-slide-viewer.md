# Implementation Plan: AI Strategy Slide Viewer + SVG Diagrams

**Date**: 2026-04-09  **Status**: IN PROGRESS

## Overview

The `/ai-strategy/` page exists with hero, prompt CTA, nav, and content sections, but the 12-slide deck defined in the page's frontmatter is completely ignored — the layout renders long scrolling text sections instead. This plan does two things: (1) replaces those scrolling sections with a fixed-height embedded slide viewer (prev/next, keyboard, swipe) adapted from the existing `layouts/slides/single.html`, and (2) creates the 7 inline SVG diagrams required by slides 4 and 6–11.

## Pre-Execution Step (Orchestrator runs before spawning implementors)

There are two unstaged changes in the working tree that must be committed before implementors run:
- `apps/landing/layouts/_default/ai-strategy.html` — prompt CTA already updated to hidden element
- `apps/landing/assets/css/style.css` — pending CSS changes

Run: `git add apps/landing/layouts/_default/ai-strategy.html apps/landing/assets/css/style.css && git commit -m "fix: prompt CTA to hidden element + css cleanup"`

## Scope

- Work units: 2
- Execution phases: 1 (both units touch different files → fully parallel)
- Files affected:
  - `apps/landing/layouts/partials/ai-strategy-svgs.html` — **create** (new file)
  - `apps/landing/layouts/_default/ai-strategy.html` — **rewrite**

---

## Work Units

### WU-1: Create SVG Diagrams Partial

**Dependencies**: none

**Context**: Seven of the 12 slides in `apps/landing/content/ai-strategy.en.md` have `type: custom-svg` and an `svg_id` field (values: `three-scales`, `maturity-staircase-governance`, `maturity-staircase-vendor`, `maturity-staircase-sovereignty`, `maturity-staircase-cost`, `maturity-staircase-health`, `arm-reset-timeline`). The slide viewer added in WU-2 renders these by calling `{{ partial "ai-strategy-svgs.html" (dict "svg_id" .svg_id) }}`. This partial does not exist yet — this WU creates it. All SVGs are inline (no external files), use brand colors, and are responsive via `viewBox`.

**Files**:
- `apps/landing/layouts/partials/ai-strategy-svgs.html` — create

**Steps**:

1. Create a new file at `apps/landing/layouts/partials/ai-strategy-svgs.html`. This is a Hugo partial. It receives a dict via dot context. Start with `{{ $id := .svg_id }}` then use a chain of `{{ if eq $id "..." }} ... {{ else if eq $id "..." }} ... {{ end }}` blocks — one per SVG.

2. **SVG 1 — `three-scales`**: Shows the same subsidized-adoption pattern at three scales.

   `viewBox="0 0 800 400"` `width="100%"` `height="100%"` `xmlns="http://www.w3.org/2000/svg"`

   Structure: three horizontal "lane" groups stacked vertically. Each lane sits inside a rounded rect background. Left side of each lane: bold white label (14px). Then three rounded boxes (~175px × 65px, rx=8) connected by right-pointing arrows (stroke `#6b7280`, simple `>` arrowhead or triangle). A vertical bracket on the far right with text "Same pattern" in `#10b981`.

   Lane layout (y positions): Lane 1 starts y=20, Lane 2 y=150, Lane 3 y=280. Each lane background: `fill="#1e293b"` `rx=10` `width=760` `height=110` `x=20`.

   Box colors (fill opacity 0.15, stroke full opacity, stroke-width 1.5):
   - Box 1 "Subsidized adoption": `stroke="#10b981"` `fill="#10b981"`
   - Box 2 "Dependency": `stroke="#f59e0b"` `fill="#f59e0b"`
   - Box 3 "Correction": `stroke="#ef4444"` `fill="#ef4444"`

   Box x positions within lane: x=90 (after label), x=310, x=530. Box y = lane_y + 22.

   Text inside each box: label in white bold 11px, description in `#9ca3af` 10px.

   Lane content:
   - Lane 1 label "Individual": "Dopamine loops" / "Cognitive dependency" / "Burnout"
   - Lane 2 label "Organizational": "Free/cheap tools" / "Vendor coupling" / "No leverage"
   - Lane 3 label "Economic": "Below-cost pricing" / "Fake demand" / "ARM reset"

   Right bracket: a vertical line at x=760 from y=20 to y=390, color `#10b981`, stroke-width 2. Text "Same pattern" rotated 90° at x=785 y=210, fill `#10b981`, font-size 12, font-weight bold.

3. **SVGs 2–6 — `maturity-staircase-{governance,vendor,sovereignty,cost,health}`**: Five nearly identical SVGs, one per dimension. Each shows 4 ascending steps (staircase, left to right, rising).

   `viewBox="0 0 800 320"` `width="100%"` `height="100%"` `xmlns="http://www.w3.org/2000/svg"`

   Step geometry — all steps share baseline at y=280. Step widths: 175px each. x positions: L1=20, L2=210, L3=400, L4=590. Step heights (how tall above baseline): L1=60, L2=120, L3=185, L4=255. So top y coords: L1=220, L2=160, L3=95, L4=25.

   Step fills (`fill-opacity="0.25"`) and strokes (`stroke-opacity="0.8"` `stroke-width="1.5"` `rx="6"`):
   - L1: `fill="#ef4444"` `stroke="#ef4444"`
   - L2: `fill="#f59e0b"` `stroke="#f59e0b"`
   - L3: `fill="#3b82f6"` `stroke="#3b82f6"`
   - L4: `fill="#10b981"` `stroke="#10b981"`

   Inside each step: two text lines centered horizontally at step midpoint x. Level label in white bold 12px at top_y+18. Description in `#9ca3af` 10px at top_y+34. If text is long, use `textLength` or split into two `<tspan>` lines.

   Baseline: a full-width line `x1="20" y1="280" x2="785" y2="280"` `stroke="#374151"` `stroke-width="1"`.

   Text content per dimension (`level label / description`):

   **governance** (`maturity-staircase-governance`):
   - L1: "Chaos" / "No policy"
   - L2: "Mandate" / "Top-down, no framework"
   - L3: "Governed" / "Guardrails + engineer choice"
   - L4: "Adaptive" / "Living framework"

   **vendor** (`maturity-staircase-vendor`):
   - L1: "Coupled" / "Direct API, no exit"
   - L2: "Standardized" / "One provider, aware"
   - L3: "Abstracted" / "Abstraction layer"
   - L4: "Portable" / "Switch in hours"

   **sovereignty** (`maturity-staircase-sovereignty`):
   - L1: "Exposed" / "Data goes anywhere"
   - L2: "Aware" / "Informal rules"
   - L3: "Classified" / "Classified + routed"
   - L4: "Sovereign" / "EU by default"

   **cost** (`maturity-staircase-cost`):
   - L1: "Blind" / "No tracking"
   - L2: "Tracking" / "Some visibility"
   - L3: "Measured" / "Full cost per engineer"
   - L4: "Optimized" / "Resilient to 5x"

   **health** (`maturity-staircase-health`):
   - L1: "Unmanaged" / "Conflict, no measurement"
   - L2: "Measured" / "Some tracking"
   - L3: "Balanced" / "Both styles supported"
   - L4: "Sustainable" / "Intentional, not compulsive"

4. **SVG 7 — `arm-reset-timeline`**: Horizontal timeline showing the pricing correction trajectory.

   `viewBox="0 0 900 220"` `width="100%"` `height="100%"` `xmlns="http://www.w3.org/2000/svg"`

   Main timeline line: `x1="60" y1="115" x2="840" y2="115"` `stroke="#374151"` `stroke-width="2"`. Danger zone overlay (last segment): `x1="680" y1="115" x2="840" y2="115"` `stroke="#ef4444"` `stroke-width="2.5"`.

   Arrow tip at end: small filled triangle pointing right at x=855 y=115, color `#ef4444`.

   Four markers (circles r=8) at x positions 160, 360, 560, 760, all y=115:
   - x=160: `fill="#10b981"` (green)
   - x=360: `fill="#f59e0b"` (yellow)
   - x=560: `fill="#f97316"` (orange)
   - x=760: `fill="#ef4444"` (red), r=10 (slightly larger for emphasis)

   Above each marker (text-anchor="middle", y values above y=115):
   - x=160, y=90: "2024–2025" white bold 12px; y=75: "Teaser rates" `#9ca3af` 10px
   - x=360, y=90: "June 2025" white bold 12px; y=75: "Priority tiers" `#9ca3af` 10px
   - x=560, y=90: "2026" white bold 12px; y=75: "Rate limits tighten" `#9ca3af` 10px
   - x=760, y=90: "Coming" `#ef4444` bold 13px; y=75: "The ARM reset" `#ef4444` bold 11px

   Below each marker (text-anchor="middle", y values below y=115):
   - x=160, y=135: "$5K burn on $200 plans" `#6b7280` 9px
   - x=360, y=135: "Cursor forced to reprice" `#6b7280` 9px
   - x=560, y=135: "600→20 deep research queries" `#6b7280` 9px
   - x=760, y=135: "3–5x for dependent companies" `#ef4444` 10px bold; y=150: "No escape without abstraction" `#6b7280` 9px

**Verification**: `grep -c "arm-reset-timeline" apps/landing/layouts/partials/ai-strategy-svgs.html && grep -c "maturity-staircase-health" apps/landing/layouts/partials/ai-strategy-svgs.html && grep -c "three-scales" apps/landing/layouts/partials/ai-strategy-svgs.html`
(Each command must return ≥ 1)

**Rollback**: `rm -f apps/landing/layouts/partials/ai-strategy-svgs.html`

---

### WU-2: Embed Slide Viewer in Layout

**Dependencies**: none (verification uses grep, not hugo build, so does not require WU-1 to complete first)

**Context**: The current `apps/landing/layouts/_default/ai-strategy.html` (502 lines) ignores the `.Params.slides` data entirely and renders 5 long hardcoded dimension sections instead. These must be removed. In their place, insert a fixed-height embedded slide viewer that reads `.Params.slides` from the page frontmatter and renders each slide using the same logic as `apps/landing/layouts/slides/single.html`. The viewer needs prev/next buttons, a progress bar, keyboard navigation, and swipe support — all scoped with unique IDs (prefix `ai-`) so they don't conflict if the user also visits a standalone slides page. A new `custom-svg` slide type calls the partial created in WU-1.

**Files**:
- `apps/landing/layouts/_default/ai-strategy.html` — rewrite

**Steps**:

1. Read the current file at `apps/landing/layouts/_default/ai-strategy.html`. Identify these sections:
   - **KEEP** lines 1–11: `{{ define "main" }}` + hero section (`bg-brand-primary`)
   - **KEEP** lines 13–106: Prompt CTA section (has `<span id="ai-strategy-prompt" hidden>` and copy button)
   - **REMOVE** lines 108–464: Everything from `<!-- Framework Overview -->` through `<!-- The Subprime Parallel -->` (the Core Insight section, all 5 dimension sections, and the subprime section)
   - **KEEP** lines 466–475: Companion assessment section
   - **KEEP** lines 477–487: Consulting CTA section
   - **KEEP** lines 490–501: `<script>` block containing `copyPrompt()` function
   - **KEEP** line 502: `{{ end }}`

2. Read `apps/landing/layouts/slides/single.html`. Extract the complete slide type handlers from lines 111–544 — these are the `{{ if eq .type "hero" }}`, `{{ else if eq .type "two-col" }}`, etc. blocks up to and including the closing `{{ end }}` before `</div><!-- /max-w-5xl -->`. You will paste these verbatim into the new slide viewer.

3. Between the closing `</div>` of the prompt CTA section (after line 106) and the companion assessment section (line 466), insert this slide viewer block:

```html
<!-- Slide Viewer -->
<div class="bg-brand-primary py-10">
  <div class="container-custom">
    <div class="relative rounded-2xl border border-gray-800 overflow-hidden flex flex-col" style="height: 640px;">

      <!-- Slides area -->
      <div class="flex-1 relative overflow-hidden">
        {{ $slides := default (slice) .Params.slides }}
        {{ range $slides }}
        <div class="slide absolute inset-0 flex flex-col items-center justify-center px-4 md:px-12 lg:px-20 opacity-0 pointer-events-none transition-opacity duration-300"
             data-slide="{{ .number }}">

          {{ if and .label (ne (upper .label) .title) }}
          <div class="mb-6 self-start md:self-center">
            <span class="text-xs font-semibold uppercase tracking-widest text-brand-accent border border-brand-accent/30 rounded-full px-3 py-1 bg-brand-accent/5">{{ .label }}</span>
          </div>
          {{ end }}

          <div class="w-full max-w-5xl">
            [PASTE ALL SLIDE TYPE HANDLERS FROM slides/single.html lines 111–544 HERE — verbatim, do not omit any type]

            {{/* ─── CUSTOM-SVG ─── */}}
            {{ else if eq .type "custom-svg" }}
            <div class="w-full flex flex-col items-center" style="height: 440px;">
              <div class="mb-3 text-center">
                <h2 class="text-xl md:text-2xl font-bold text-white font-display mb-1">{{ .title }}</h2>
                {{ if .subtitle }}<p class="text-brand-secondary text-sm">{{ .subtitle }}</p>{{ end }}
              </div>
              <div class="w-full flex-1 min-h-0">
                {{ partial "ai-strategy-svgs.html" (dict "svg_id" .svg_id) }}
              </div>
            </div>

            {{ end }}
          </div>
        </div>
        {{ end }}
      </div>

      <!-- Bottom bar -->
      <div class="flex-none border-t border-gray-800">
        <div class="h-0.5 bg-gray-800">
          <div id="ai-progress-bar" class="h-full bg-brand-accent transition-all duration-300" style="width: 0%; box-shadow: 0 0 8px rgba(16,185,129,0.4);"></div>
        </div>
        <div class="flex items-center justify-between px-6 py-3 bg-brand-primary">
          <button id="ai-btn-prev" data-ai-prev class="btn btn-secondary text-sm py-1.5 px-4">← Prev</button>
          <span id="ai-slide-counter" class="text-brand-secondary text-xs font-mono"></span>
          <button id="ai-btn-next" data-ai-next class="btn btn-primary text-sm py-1.5 px-4">Next →</button>
        </div>
      </div>

    </div>
  </div>
</div>
```

   **Critical**: The `{{ else if eq .type "custom-svg" }}` block must be inserted INSIDE the `{{ if eq .type "hero" }} ... {{ end }}` chain from `slides/single.html`. In `slides/single.html` the chain ends with `{{ end }}` after the last type (line ~544). Insert the custom-svg block as a new `{{ else if }}` BEFORE that final `{{ end }}`.

4. After the existing `<script>` block containing `copyPrompt()` and before `{{ end }}`, add this navigation script (a scoped IIFE that does NOT use `history.pushState` and does NOT expose globals):

```html
<script>
(function() {
  var slides = document.querySelectorAll('.slide');
  var total = slides.length;
  var current = 1;

  function showSlide(n) {
    current = Math.max(1, Math.min(n, total));
    slides.forEach(function(s) {
      var isActive = parseInt(s.dataset.slide) === current;
      s.classList.toggle('opacity-0', !isActive);
      s.classList.toggle('pointer-events-none', !isActive);
    });
    var pct = (current / total * 100).toFixed(1);
    var bar = document.getElementById('ai-progress-bar');
    var counter = document.getElementById('ai-slide-counter');
    var prev = document.getElementById('ai-btn-prev');
    var next = document.getElementById('ai-btn-next');
    if (bar) bar.style.width = pct + '%';
    if (counter) counter.textContent = current + ' / ' + total;
    if (prev) { prev.disabled = current === 1; prev.style.opacity = current === 1 ? '0.3' : '1'; }
    if (next) { next.disabled = current === total; next.style.opacity = current === total ? '0.3' : '1'; }
  }

  document.addEventListener('click', function(e) {
    if (e.target.closest('[data-ai-prev]')) showSlide(current - 1);
    if (e.target.closest('[data-ai-next]')) showSlide(current + 1);
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); showSlide(current + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); showSlide(current - 1); }
  });

  var touchStartX = 0;
  document.addEventListener('touchstart', function(e) { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  document.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 50) { if (dx < 0) showSlide(current + 1); else showSlide(current - 1); }
  }, { passive: true });

  showSlide(1);
})();
</script>
```

**Verification**: `grep -c "ai-progress-bar" apps/landing/layouts/_default/ai-strategy.html && grep -c "custom-svg" apps/landing/layouts/_default/ai-strategy.html && grep -c "ai-strategy-svgs" apps/landing/layouts/_default/ai-strategy.html && grep -c "data-ai-next" apps/landing/layouts/_default/ai-strategy.html`
(Each must return ≥ 1)

**Rollback**: `git checkout -- apps/landing/layouts/_default/ai-strategy.html`

---

## Execution Plan

### Phase 1 — Parallel (no dependencies, different files)

- WU-1: Create SVG diagrams partial (`ai-strategy-svgs.html`)
- WU-2: Embed slide viewer in layout (`ai-strategy.html`)

### Phase 2 — Verification (after Phase 1)

Run `cd apps/landing && hugo --quiet 2>&1 | tail -5; echo $?` — must exit 0.
Then confirm: `grep -c "maturity-staircase" public/ai-strategy/index.html` ≥ 5.

## Recovery Strategy

- **Automatic**: Each implementor rolls back and retries once on failure.
- **WU-1 failure**: WU-2 can still complete (its verification doesn't require hugo build). But the final Phase 2 hugo build will fail because the partial is missing. Manual fix: check partial syntax.
- **WU-2 failure**: Roll back with `git checkout -- apps/landing/layouts/_default/ai-strategy.html`. Re-examine the slide type chain insertion point.
- **Global rollback**: `git checkout -- apps/landing/layouts/_default/ai-strategy.html && rm -f apps/landing/layouts/partials/ai-strategy-svgs.html`
