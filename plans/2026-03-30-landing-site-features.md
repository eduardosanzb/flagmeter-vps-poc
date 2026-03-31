# Implementation Plan: Landing Site Features (Social Links, Print Stylesheet, RSS)

**Date**: 2026-03-30
**Status**: COMPLETED

## Overview

Implement three landing site features for the Hugo site at `apps/landing/`: (1) social media icon links in the footer, (2) a print stylesheet for the slides template to enable clean PDF export, and (3) RSS feed links on blog pages. All changes are HTML/TOML template edits using inline SVGs and Tailwind utility classes.

## Scope

- Work units: 5
- Execution phases: 2
- Files affected:
  - `apps/landing/hugo.toml`
  - `apps/landing/layouts/partials/footer.html`
  - `apps/landing/layouts/slides/single.html`
  - `apps/landing/layouts/_default/baseof.html`
  - `apps/landing/layouts/blog/list.html`
  - `apps/landing/layouts/blog/single.html`

## Work Units

### WU-1: Add social params to hugo.toml

**Dependencies**: none

**Context**: The site needs social media URLs configured centrally so they can be referenced from templates using `{{ .Site.Params.social.linkedin }}` etc. These params go into the existing `[params]` section of the Hugo configuration file.

**Files**:
- `apps/landing/hugo.toml` — modify

**Steps**:
1. Open `apps/landing/hugo.toml`. After line 42 (which reads `analyticsWebsiteId = "268a904e-a27e-49ac-943e-9012ef9f0875"`), add a blank line and then the following TOML block:
   ```toml
   [params.social]
     linkedin = "https://linkedin.com/in/eduardosanzb"
     twitter = "https://x.com/eduardosanzb"
     github = "https://github.com/eduardosanzb"
     email = "hello@raus.cloud"
   ```
2. Ensure the new block appears BEFORE the `[module]` section (which starts at line 44). The `[params.social]` block is a sub-table of `[params]` and must appear within that section, before any other top-level table like `[module]`.

**Verification**: `cd apps/landing && grep -q 'params.social' hugo.toml && grep -q 'linkedin' hugo.toml && echo 'OK'`

**Rollback**:
- Modified files: `git checkout -- apps/landing/hugo.toml`

---

### WU-2: Add social icons to footer

**Dependencies**: WU-1

**Context**: The footer's Brand column (first column of a 3-column grid) currently ends with a "built by Eduardo Sanchez" line. We need to add a row of small inline SVG social icons (LinkedIn, X/Twitter, GitHub, Email) below it. The icons should link to the URLs defined in `hugo.toml` params.social.

**Files**:
- `apps/landing/layouts/partials/footer.html` — modify

**Steps**:
1. Open `apps/landing/layouts/partials/footer.html`. Find the closing `</p>` tag of the "builtBy" paragraph, which is on line 12. The current code at lines 10-12 is:
   ```html
         <p class="text-sm text-gray-400">
           {{ i18n "footer.builtBy" }} <a href="https://eduardosanzb.dev" target="_blank" rel="noopener" class="text-brand-accent hover:text-white transition-colors">Eduardo Sanchez</a>
         </p>
   ```
2. Immediately after that closing `</p>` on line 12, add the following HTML block (with proper 8-space indentation to match the surrounding code):
   ```html
        <div class="flex items-center gap-4 mt-4">
          {{ with .Site.Params.social.linkedin }}
          <a href="{{ . }}" target="_blank" rel="noopener" class="text-gray-400 hover:text-brand-accent transition-colors" aria-label="LinkedIn">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          {{ end }}
          {{ with .Site.Params.social.twitter }}
          <a href="{{ . }}" target="_blank" rel="noopener" class="text-gray-400 hover:text-brand-accent transition-colors" aria-label="X / Twitter">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          {{ end }}
          {{ with .Site.Params.social.github }}
          <a href="{{ . }}" target="_blank" rel="noopener" class="text-gray-400 hover:text-brand-accent transition-colors" aria-label="GitHub">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
          </a>
          {{ end }}
          {{ with .Site.Params.social.email }}
          <a href="mailto:{{ . }}" class="text-gray-400 hover:text-brand-accent transition-colors" aria-label="Email">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </a>
          {{ end }}
        </div>
   ```
3. The `{{ with }}` blocks ensure icons only render if the corresponding URL is configured. The icons are ~20px (w-5 h-5) inline SVGs in a horizontal flex row with gap-4.

**Verification**: `cd apps/landing && grep -q 'Site.Params.social.linkedin' layouts/partials/footer.html && grep -q 'aria-label="GitHub"' layouts/partials/footer.html && echo 'OK'`

**Rollback**:
- Modified files: `git checkout -- apps/landing/layouts/partials/footer.html`

---

### WU-3: Add print stylesheet to slides template

**Dependencies**: none

**Context**: The slides template (`apps/landing/layouts/slides/single.html`) is a single-page presentation that shows one slide at a time using `opacity-0 pointer-events-none` classes toggled by JavaScript. For PDF export via browser print, ALL slides must be visible simultaneously with page breaks between them. The template has three structural areas: (1) a top bar (lines 8-15) with back link, title button, and slide counter inside a `flex-none` div, (2) slides area (lines 18-472) where each slide is a `div.slide` with classes `absolute inset-0 opacity-0 pointer-events-none`, and (3) a bottom bar (lines 475-492) containing a progress bar and prev/next navigation buttons. The entire app is wrapped in `div#slides-app` with classes `flex flex-col h-screen w-screen bg-brand-primary overflow-hidden`.

**Files**:
- `apps/landing/layouts/slides/single.html` — modify

**Steps**:
1. Open `apps/landing/layouts/slides/single.html`. Find the very first line which reads:
   ```
   {{ define "main" }}
   ```
2. Immediately after `{{ define "main" }}` (after line 1) and BEFORE line 2 (`{{ $slides := ... }}`), insert the following `<style>` block:
   ```html
   <style>
   @media print {
     /* Reset the slides app container for print flow */
     #slides-app {
       display: block !important;
       height: auto !important;
       width: auto !important;
       overflow: visible !important;
       background: white !important;
     }

     /* Hide the top bar (back link, title, slide counter) */
     #slides-app > .flex-none:first-child {
       display: none !important;
     }

     /* Hide the bottom bar (progress bar, nav buttons) */
     #slides-app > .flex-none:last-child {
       display: none !important;
     }

     /* Make slides area a normal flow container */
     #slides-app > .flex-1 {
       position: static !important;
       overflow: visible !important;
     }

     /* Make ALL slides visible and positioned in normal flow */
     .slide {
       position: static !important;
       opacity: 1 !important;
       pointer-events: auto !important;
       display: flex !important;
       width: 100% !important;
       min-height: 100vh;
       page-break-after: always;
       break-after: page;
       background: white !important;
       padding: 2rem !important;
     }

     /* Ensure text is black for print readability */
     .slide, .slide * {
       color: black !important;
       -webkit-print-color-adjust: exact;
       print-color-adjust: exact;
     }

     /* Keep accent color for visual elements */
     .slide .text-brand-accent {
       color: #10b981 !important;
     }

     /* Remove transitions and animations */
     * {
       transition: none !important;
       animation: none !important;
     }

     /* Ensure backgrounds print correctly for cards */
     .slide .bg-gray-900\/60,
     .slide .bg-gray-900\/40,
     .slide .bg-gray-950 {
       background: #f9fafb !important;
       border-color: #e5e7eb !important;
     }

     /* Make borders visible in print */
     .slide [class*="border-gray-800"],
     .slide [class*="border-brand-accent"] {
       border-color: #d1d5db !important;
     }
   }
   </style>
   ```
3. This block must appear before any HTML content so the styles are available when the browser renders the print layout.

**Verification**: `cd apps/landing && grep -q '@media print' layouts/slides/single.html && grep -q 'page-break-after: always' layouts/slides/single.html && echo 'OK'`

**Rollback**:
- Modified files: `git checkout -- apps/landing/layouts/slides/single.html`

---

### WU-4: Add RSS link tag to baseof.html head

**Dependencies**: none

**Context**: The Hugo site already has RSS output enabled (configured in `hugo.toml` under `[outputs]` with `home = ["HTML", "RSS"]` and `section = ["HTML", "RSS"]`). However, the base template's `<head>` section doesn't include an RSS auto-discovery `<link>` tag. This tag helps browsers and RSS readers find the feed automatically. It should go in the `<head>` section near the favicon line.

**Files**:
- `apps/landing/layouts/_default/baseof.html` — modify

**Steps**:
1. Open `apps/landing/layouts/_default/baseof.html`. Find the favicon line at line 27:
   ```html
     <link rel="icon" type="image/svg+xml" href="/favicon.svg">
   ```
2. Immediately after line 27 (the favicon link), add the following line:
   ```html
     {{ with .OutputFormats.Get "RSS" }}<link rel="alternate" type="application/rss+xml" title="{{ $.Site.Title }}" href="{{ .RelPermalink }}">{{ end }}
   ```
3. This uses Hugo's `OutputFormats.Get "RSS"` which returns nil on pages without RSS output, so the tag only renders when appropriate. The `$.Site.Title` syntax (with `$`) is needed because we're inside a `with` block.

**Verification**: `cd apps/landing && grep -q 'application/rss+xml' layouts/_default/baseof.html && echo 'OK'`

**Rollback**:
- Modified files: `git checkout -- apps/landing/layouts/_default/baseof.html`

---

### WU-5: Add RSS subscribe links to blog list and single templates

**Dependencies**: none

**Context**: The blog list page (`layouts/blog/list.html`) and single post page (`layouts/blog/single.html`) need visible RSS subscribe links. For the list page, the link goes after the description `<p>` tag in the header section. For the single page, the link goes in the meta area alongside author/date/reading time. Both use an inline RSS SVG icon with brand-accent styling.

**Files**:
- `apps/landing/layouts/blog/list.html` — modify
- `apps/landing/layouts/blog/single.html` — modify

**Steps**:
1. **blog/list.html**: Open `apps/landing/layouts/blog/list.html`. Find lines 7-8:
   ```html
         <p class="text-xl text-gray-300 max-w-3xl">{{ .Params.description }}</p>
       </div>
   ```
   Insert the following RSS link between the `</p>` and `</div>`, i.e., after line 7 and before line 8:
   ```html
         {{ with .OutputFormats.Get "RSS" }}
         <a href="{{ .RelPermalink }}" class="inline-flex items-center gap-2 mt-4 text-gray-400 hover:text-brand-accent transition-colors text-sm font-medium" aria-label="RSS Feed">
           <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795 0 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.742-7.099-15.783-15.839-15.82zm0-8.18v4.819c12.951.062 23.42 10.542 23.497 23.497h4.503c-.063-15.537-12.643-28.119-28-28.316z"/></svg>
           Subscribe via RSS
         </a>
         {{ end }}
   ```

2. **blog/single.html**: Open `apps/landing/layouts/blog/single.html`. Find the reading time section at lines 73-80:
   ```html
           {{ if .ReadingTime }}
           <span class="flex items-center gap-2">
             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
             </svg>
             {{ .ReadingTime }} min read
           </span>
           {{ end }}
   ```
   After the closing `{{ end }}` on line 80, and BEFORE the closing `</div>` of the meta area on line 81, add:
   ```html
           {{ with .OutputFormats.Get "RSS" }}
           <a href="{{ .RelPermalink }}" class="flex items-center gap-2 text-gray-300 hover:text-brand-accent transition-colors" aria-label="RSS Feed">
             <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795 0 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.742-7.099-15.783-15.839-15.82zm0-8.18v4.819c12.951.062 23.42 10.542 23.497 23.497h4.503c-.063-15.537-12.643-28.119-28-28.316z"/></svg>
             RSS
           </a>
           {{ end }}
   ```
3. Both use the standard RSS icon SVG, wrapped in Hugo's `{{ with .OutputFormats.Get "RSS" }}` so the link only appears on pages that actually generate an RSS feed.

**Verification**: `cd apps/landing && grep -q 'Subscribe via RSS' layouts/blog/list.html && grep -q 'OutputFormats.Get "RSS"' layouts/blog/single.html && echo 'OK'`

**Rollback**:
- Modified files: `git checkout -- apps/landing/layouts/blog/list.html apps/landing/layouts/blog/single.html`

---

## Execution Plan

### Phase 1 — Parallel (no dependencies)
- WU-1: Add social params to hugo.toml
- WU-3: Add print stylesheet to slides template
- WU-4: Add RSS link tag to baseof.html head
- WU-5: Add RSS subscribe links to blog list and single templates

### Phase 2 — Parallel (requires Phase 1)
- WU-2: Add social icons to footer (depends on WU-1 for params)

## Recovery Strategy

- **Automatic**: Each implementor rolls back and retries once on failure.
- **Dependency failure**: If WU-1 fails, WU-2 will not run. WU-3, WU-4, and WU-5 are independent and will still execute.
- **Global rollback**: `git checkout -- apps/landing/hugo.toml apps/landing/layouts/partials/footer.html apps/landing/layouts/slides/single.html apps/landing/layouts/_default/baseof.html apps/landing/layouts/blog/list.html apps/landing/layouts/blog/single.html`
- **Independent failures**: Work units with no dependency on a failed unit will still execute.
