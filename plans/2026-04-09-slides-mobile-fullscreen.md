# Implementation Plan: Slides Mobile-Friendly + Fullscreen

**Date**: 2026-04-09 **Status**: IN PROGRESS

## Overview

Make the AI Strategy slide viewer at `/ai-strategy/` usable on mobile devices by replacing fixed-pixel heights with responsive viewport-relative sizing, and add a CSS-overlay fullscreen mode so mobile readers can focus on one slide at a time without browser chrome distractions.

## Scope

- Work units: 3
- Execution phases: 2
- Files affected:
  - `apps/landing/assets/css/main.css`
  - `apps/landing/layouts/_default/ai-strategy.html`
  - `apps/landing/i18n/en.toml`
  - `apps/landing/i18n/de.toml`
  - `apps/landing/i18n/es.toml`

## Work Units

### WU-1: Add responsive slide + fullscreen CSS

**Dependencies**: none

**Context**: The slide viewer currently uses inline `style="height: 640px;"` on the outer container and `style="height: 420px;"` on custom-svg inner divs. These fixed heights are too tall on mobile (375px-wide phones) and don't account for browser chrome. We need CSS classes that are responsive on mobile and also support a fullscreen overlay mode. The fullscreen uses a CSS overlay approach (position: fixed) rather than the native `requestFullscreen()` API because iOS Safari heavily restricts the native API — and the user confirmed this is for mobile readers.

**Files**:
- `apps/landing/assets/css/main.css` — modify

**Steps**:

1. Open `apps/landing/assets/css/main.css`.

2. At the end of the `@layer components { ... }` block (just before the closing `}` on the line that currently ends the components layer — the line before `/* Navigation link hover effects */`), add the following CSS inside the components layer:

```css
  /* ─── Slide viewer responsive + fullscreen ─── */
  .slide-viewer {
    height: 640px;
  }

  @media (max-width: 768px) {
    .slide-viewer {
      height: calc(100svh - 100px);
      min-height: 400px;
    }
  }

  .slide-svg-container {
    height: 420px;
  }

  @media (max-width: 768px) {
    .slide-svg-container {
      height: 280px;
    }
  }

  /* Fullscreen overlay mode */
  .slide-viewer-fullscreen {
    position: fixed !important;
    inset: 0 !important;
    z-index: 50 !important;
    height: 100svh !important;
    border-radius: 0 !important;
    border: none !important;
  }

  .slide-viewer-fullscreen .slide-svg-container {
    height: calc(100svh - 160px);
  }

  /* Fullscreen close button */
  .slide-fullscreen-close {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    z-index: 60;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    cursor: pointer;
    transition: background 0.2s;
  }

  .slide-fullscreen-close:hover {
    background: rgba(0, 0, 0, 0.7);
  }

  /* Fullscreen toggle button in bottom bar */
  .slide-fullscreen-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.375rem;
    color: #9ca3af;
    transition: color 0.2s;
    cursor: pointer;
    background: transparent;
    border: none;
  }

  .slide-fullscreen-btn:hover {
    color: #10b981;
  }
```

3. Verify the CSS is inside the `@layer components` block and the file still has valid CSS syntax.

**Verification**: `cd /Users/eduardosanchez/repos/github.com/eduardosanzb/flagmeter/apps/landing && npx tailwindcss --help > /dev/null 2>&1 && echo "CSS tooling OK" || echo "CSS tooling missing"`

**Rollback**:
- Modified files: `git checkout -- apps/landing/assets/css/main.css`

---

### WU-2: Add fullscreen i18n keys

**Dependencies**: none

**Context**: The fullscreen feature needs localized strings for the button aria-labels (accessibility) and the close button tooltip. Three language files need updating: English, German, and Spanish.

**Files**:
- `apps/landing/i18n/en.toml` — modify
- `apps/landing/i18n/de.toml` — modify
- `apps/landing/i18n/es.toml` — modify

**Steps**:

1. Open `apps/landing/i18n/en.toml`. At the end of the file (after the line `other = "← → keys · swipe"`), add:

```toml

[aiStrategy.fullscreen]
other = "Fullscreen"

[aiStrategy.exitFullscreen]
other = "Exit fullscreen"
```

2. Open `apps/landing/i18n/de.toml`. At the end of the file (after the line `other = "← → Tasten · Swipe"`), add:

```toml

[aiStrategy.fullscreen]
other = "Vollbild"

[aiStrategy.exitFullscreen]
other = "Vollbild beenden"
```

3. Open `apps/landing/i18n/es.toml`. At the end of the file (after the line `other = "Teclas ← → · desliza"`), add:

```toml

[aiStrategy.fullscreen]
other = "Pantalla completa"

[aiStrategy.exitFullscreen]
other = "Salir de pantalla completa"
```

**Verification**: `cd /Users/eduardosanchez/repos/github.com/eduardosanzb/flagmeter/apps/landing && grep -c 'fullscreen' i18n/en.toml i18n/de.toml i18n/es.toml`

**Rollback**:
- Modified files: `git checkout -- apps/landing/i18n/en.toml apps/landing/i18n/de.toml apps/landing/i18n/es.toml`

---

### WU-3: Update slide viewer HTML + JS for responsive height and fullscreen

**Dependencies**: WU-1, WU-2

**Context**: The slide viewer layout template has two inline styles that must be replaced with the CSS classes from WU-1, and needs new HTML elements (fullscreen button, close button) and JS logic for the fullscreen toggle. This work unit depends on WU-1 (CSS classes must exist) and WU-2 (i18n keys must exist).

**Files**:
- `apps/landing/layouts/_default/ai-strategy.html` — modify

**Steps**:

1. Open `apps/landing/layouts/_default/ai-strategy.html`.

2. **Replace the outer container inline style with CSS class.** On line 31, change:
   ```html
   <div class="relative rounded-2xl border border-gray-800 overflow-hidden flex flex-col" style="height: 640px;">
   ```
   to:
   ```html
   <div id="ai-slide-viewer" class="slide-viewer relative rounded-2xl border border-gray-800 overflow-hidden flex flex-col">
   ```

3. **Replace the custom-svg inline style with CSS class.** On line 484, change:
   ```html
   <div class="w-full flex flex-col items-center" style="height: 420px;">
   ```
   to:
   ```html
   <div class="slide-svg-container w-full flex flex-col items-center">
   ```

4. **Add fullscreen close button.** Right after the opening tag of the slide viewer div (the line you just modified in step 2), add this new line:
   ```html
   <button id="ai-fullscreen-close" class="slide-fullscreen-close hidden" aria-label="{{ i18n "aiStrategy.exitFullscreen" }}">
     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
   </button>
   ```

5. **Add fullscreen toggle button in the bottom bar.** In the bottom bar section (around line 505-512), find the center div that contains the counter and keyboard hint:
   ```html
   <div class="text-center">
     <span id="ai-slide-counter" class="text-brand-secondary text-xs font-mono block"></span>
     <span class="text-gray-600 text-xs font-mono hidden sm:inline">{{ i18n "aiStrategy.keyboardHint" }}</span>
   </div>
   ```
   Change it to:
   ```html
   <div class="text-center flex items-center gap-2">
     <span id="ai-slide-counter" class="text-brand-secondary text-xs font-mono block"></span>
     <span class="text-gray-600 text-xs font-mono hidden sm:inline">{{ i18n "aiStrategy.keyboardHint" }}</span>
     <button id="ai-btn-fullscreen" class="slide-fullscreen-btn" aria-label="{{ i18n "aiStrategy.fullscreen" }}">
       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
     </button>
   </div>
   ```

6. **Add fullscreen JS logic.** In the second `<script>` block at the bottom of the file (the slideshow IIFE starting at line 558), add the following code inside the IIFE, after the `showSlide(1);` call (which is the last line before the closing `})();`):

   ```javascript
   // Fullscreen overlay toggle
   var viewer = document.getElementById('ai-slide-viewer');
   var fsBtn = document.getElementById('ai-btn-fullscreen');
   var fsClose = document.getElementById('ai-fullscreen-close');
   var isFullscreen = false;

   function toggleFullscreen() {
     isFullscreen = !isFullscreen;
     viewer.classList.toggle('slide-viewer-fullscreen', isFullscreen);
     fsClose.classList.toggle('hidden', !isFullscreen);
     document.body.style.overflow = isFullscreen ? 'hidden' : '';
     if (fsBtn) {
       fsBtn.setAttribute('aria-label', isFullscreen ? '{{ i18n "aiStrategy.exitFullscreen" }}' : '{{ i18n "aiStrategy.fullscreen" }}');
     }
   }

   if (fsBtn) fsBtn.addEventListener('click', toggleFullscreen);
   if (fsClose) fsClose.addEventListener('click', toggleFullscreen);
   ```

   Also, in the existing `keydown` event listener (around line 587-589), add an Escape handler for fullscreen. Find this block:
   ```javascript
   document.addEventListener('keydown', function(e) {
     if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); showSlide(current + 1); }
     else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); showSlide(current - 1); }
   });
   ```
   Change it to:
   ```javascript
   document.addEventListener('keydown', function(e) {
     if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); showSlide(current + 1); }
     else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); showSlide(current - 1); }
     else if (e.key === 'Escape' && isFullscreen) { e.preventDefault(); toggleFullscreen(); }
   });
   ```

7. Verify the file is syntactically valid HTML with no unclosed tags.

**Verification**: `cd /Users/eduardosanchez/repos/github.com/eduardosanzb/flagmeter/apps/landing && pnpm build`

**Rollback**:
- Modified files: `git checkout -- apps/landing/layouts/_default/ai-strategy.html`

## Execution Plan

### Phase 1 — Parallel (no dependencies)

- WU-1: Add responsive slide + fullscreen CSS
- WU-2: Add fullscreen i18n keys

### Phase 2 — Sequential (requires Phase 1)

- WU-3: Update slide viewer HTML + JS for responsive height and fullscreen

## Recovery Strategy

- **Automatic**: Each implementor rolls back and retries once on failure.
- **Dependency failure**: If WU-1 or WU-2 fails, WU-3 will not run. The orchestrator will report which units were skipped.
- **Global rollback**: `git reset HEAD~N --hard` where N is the number of committed work units, or use `git revert` to undo individual WU commits non-destructively.
- **Independent failures**: Work units with no dependency on a failed unit will still execute.
