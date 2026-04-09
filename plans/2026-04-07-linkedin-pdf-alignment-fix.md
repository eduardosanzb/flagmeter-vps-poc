# Implementation Plan: LinkedIn PDF Alignment Fix

**Date**: 2026-04-07  **Status**: PENDING APPROVAL

## Overview

The slide print template has two CSS bugs that cause the exported PDF to look bad: (1) slides
vertically-center their content via `justify-center`, which leaves ~500px of blank white space at
the top of sparse slides when printed, and (2) `@page { size }` uses pixel units that browsers
ignore, so the PDF pages come out as Letter/A4 instead of the intended 4:5 (1080×1350) ratio.
Both are one-line fixes in the same file.

## Scope

- Work units: 1
- Execution phases: 1
- Files affected:
  - `apps/landing/layouts/slides/single.html`

## Work Units

### WU-1: Fix print CSS — top-align slides and correct @page dimensions

**Dependencies**: none

**Context**: The slide viewer at `apps/landing/layouts/slides/single.html` renders each slide as
a full-screen flex container with `justify-center` (vertically centered). This is fine on screen,
but in `@media print` each slide becomes a fixed 1350px-tall page. `justify-center` therefore
pushes sparse slides (e.g. the two `one-thing` type slides) down ~500px, creating a large blank
"header". Additionally, `@page { size: 1080px 1350px }` uses pixel units which browsers silently
ignore, causing the PDF to be exported at Letter/A4 size instead of 4:5 portrait. Both bugs live
in the `<style>` block at the top of the single template.

**Files**:
- `apps/landing/layouts/slides/single.html` — modify

**Steps**:

1. Open `apps/landing/layouts/slides/single.html`.

2. **Fix the `@page` size unit** (lines 4–6). Change:
   ```css
   @page {
     size: 1080px 1350px;
     margin: 0;
   }
   ```
   to:
   ```css
   @page {
     size: 286mm 357mm;
     margin: 0;
   }
   ```
   Reason: `1080px @ 96dpi = 285.75mm ≈ 286mm`; `1350px @ 96dpi = 357.19mm ≈ 357mm`.
   Browsers honour physical units (`mm`) in `@page` rules; pixel values are ignored.

3. **Fix vertical alignment in print** (the `.slide` rule inside `@media print`, around line 36–49).
   The current rule is:
   ```css
   .slide {
     position: static !important;
     opacity: 1 !important;
     pointer-events: auto !important;
     display: flex !important;
     width: 1080px !important;
     height: 1350px !important;
     box-sizing: border-box !important;
     overflow: hidden !important;
     page-break-after: always;
     break-after: page;
     background: white !important;
     padding: 1.5rem 3rem 3rem 3rem !important;
   }
   ```
   Make two changes to this rule:
   - Add `justify-content: flex-start !important;` — this overrides the `justify-center` Tailwind
     class on the HTML element and pins content to the top of the page instead of centering it.
   - Change `padding: 1.5rem 3rem 3rem 3rem !important;` → `padding: 4rem 3rem 3rem 3rem !important;`
     — top padding increased from 24px to 64px to give visual breathing room now that content is
     top-aligned instead of centered.

   The final rule should look like:
   ```css
   .slide {
     position: static !important;
     opacity: 1 !important;
     pointer-events: auto !important;
     display: flex !important;
     width: 1080px !important;
     height: 1350px !important;
     box-sizing: border-box !important;
     overflow: hidden !important;
     page-break-after: always;
     break-after: page;
     background: white !important;
     padding: 4rem 3rem 3rem 3rem !important;
     justify-content: flex-start !important;
   }
   ```

**Verification**: `cd apps/landing && hugo build 2>&1 | tail -5; echo "exit:$?"`
(Hugo must build with exit code 0 — no template parse errors.)

**Rollback**:
- Modified files: `git checkout -- apps/landing/layouts/slides/single.html`

---

## Execution Plan

### Phase 1 — Sequential (single unit, no dependencies)

- WU-1: Fix print CSS — top-align slides and correct @page dimensions

## Recovery Strategy

- **Automatic**: Implementor rolls back and retries once on failure.
- **Global rollback**: `git checkout -- apps/landing/layouts/slides/single.html`
