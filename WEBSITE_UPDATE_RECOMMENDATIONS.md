# raus.cloud Website Update Recommendations

## Goal
Strengthen the connection between raus.cloud (the business/service) and eduardosanzb.dev (the founder/personal brand) to match the business card strategy.

---

## Recommendation 1: Add "About the Founder" Section

**Location:** Add as a new section after "How It Works" or before "Pricing"
**Purpose:** Humanize the brand and create a clear link to your personal site

### Content Structure (for `_index.en.md`):

```yaml
founder:
  title: "Meet the Engineer"
  subtitle: "The person behind raus.cloud"
  name: "Eduardo Sanchez Bautista"
  title_role: "Product Engineer"
  bio: "9+ years shipping production systems at scale. Former Unity Technologies (€70k cost savings). Built 100% with AI agents."
  location: "Berlin, Germany"
  link_text: "View full profile →"
  link_url: "https://eduardosanzb.dev"
```

### Implementation:

Create new file: `layouts/partials/sections/founder.html`

```html
<!-- Founder Section -->
<section id="founder" class="section-dark">
  <div class="container-custom">
    <div class="max-w-4xl mx-auto">
      {{ partial "components/section-header.html" (dict "title" .Params.founder.title "subtitle" .Params.founder.subtitle) }}
      
      <div class="mt-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <!-- Avatar/Logo Placeholder -->
        <div class="w-32 h-32 md:w-40 md:h-40 rounded-full bg-brand-accent/10 border-2 border-brand-accent flex items-center justify-center flex-shrink-0">
          <span class="text-4xl font-bold text-brand-accent">ES</span>
        </div>
        
        <div class="text-center md:text-left">
          <h3 class="text-2xl font-bold text-white mb-1">{{ .Params.founder.name }}</h3>
          <p class="text-brand-accent font-medium mb-4">{{ .Params.founder.title_role }}</p>
          <p class="text-slate-300 dark:text-gray-400 mb-6 leading-relaxed">{{ .Params.founder.bio }}</p>
          <p class="text-sm text-slate-400 dark:text-gray-500 mb-4">📍 {{ .Params.founder.location }}</p>
          <a href="{{ .Params.founder.link_url }}" target="_blank" rel="noopener" class="inline-flex items-center text-brand-accent hover:text-white transition-colors">
            {{ .Params.founder.link_text }}
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
```

Add to `_index.en.md` sections list:
```yaml
sections:
  - who_we_are
  - how_it_works
  - founder          # <-- ADD THIS
  - sovereignty
  - principles
  - pillars
  - blog_posts
  - pricing
  - faq
```

---

## Recommendation 2: Update Footer to Include Founder Link

**Current footer only says:** "Infrastructure without DevOps"

**Update:** `layouts/partials/footer.html`

Replace the Brand section (lines 4-8):
```html
<!-- Brand -->
<div>
  <h3 class="text-2xl font-bold mb-4 text-white">raus.cloud</h3>
  <p class="text-slate-300 dark:text-gray-400 mb-4">{{ i18n "footer.built" }}</p>
  <p class="text-sm text-slate-400 dark:text-gray-500">
    Built by <a href="https://eduardosanzb.dev" target="_blank" rel="noopener" class="text-brand-accent hover:text-white transition-colors">Eduardo Sanchez</a>
  </p>
</div>
```

Add to `i18n/en.toml`:
```toml
[footer]
built = "Infrastructure without DevOps"
 impressum = "Legal Notice"
```

---

## Recommendation 3: Add "Founder" Link to Navigation

**Update:** `layouts/partials/header.html`

Add to the navigation menu (after Blog):
```html
<li><a href="{{ .Site.LanguagePrefix }}/#founder" class="nav-link">Founder</a></li>
```

Or add to dropdown/mobile menu if space is limited.

---

## Recommendation 4: Update Hero Subtitle

**Current:** "European B2B SaaS teams pay €8k+/month..."

**Option A - Add founder credibility:**
```
European B2B SaaS teams pay €8k+/month for infrastructure they can't leave. 
We cut costs 60% and hand your team a stack they fully own — in 90 days.
Built by Eduardo Sanchez, former Unity Technologies engineer.
```

**Option B - Keep it cleaner, link in footer only:**
Keep hero as-is, rely on Founder section and footer for personal connection.

**Recommendation:** Option B - keep hero focused on value prop, use Founder section for credibility.

---

## Recommendation 5: Update "Who We Are" Section

**Current:** Uses "we" language but raus.cloud is primarily you.

**Option:** Change to first-person or acknowledge solo-founder status:

```yaml
who_we_are:
  title: "Built by an engineer who's been there"
  subtitle: "Not in theory — in production"
  items:
    - title: "Engineer First"
      description: "I've shipped production systems at scale and watched vendor dependency destroy teams. I proved a €7.59/month EU VPS handles 500+ RPS because the alternative actually works."
    - title: "Cloud Skeptic"
      description: "I've seen €8k/month AWS bills for 100 RPS. I've seen the one engineer who understood CloudFormation quit. Vendor dependency is a business risk. I treat it like one."
    - title: "The Disappearing Act"
      description: "After 90 days, every config is in your repo, every tool is standard, every decision is yours. Deploy, debug, scale — without me, without AWS, without anyone's permission."
```

This makes it more authentic and naturally connects to you as the founder.

---

## Recommendation 6: Create German Translations

For all new content, create German versions:

**`i18n/de.toml` additions:**
```toml
[footer]
built = "Infrastructure ohne DevOps"
 impressum = "Impressum"

[founder]
title = "Der Engineer"
subtitle = "Die Person hinter raus.cloud"
link_text = "Vollständiges Profil ansehen →"
```

**`_index.de.md` additions:**
```yaml
founder:
  title: "Der Engineer"
  subtitle: "Die Person hinter raus.cloud"
  name: "Eduardo Sanchez Bautista"
  title_role: "Product Engineer"
  bio: "9+ Jahre Produktivsysteme im großen Maßstab. Ehemals Unity Technologies (€70k Kosteneinsparungen). 100% mit AI Agents gebaut."
  location: "Berlin, Deutschland"
  link_text: "Vollständiges Profil ansehen →"
  link_url: "https://eduardosanzb.dev"
```

---

## Implementation Priority

**Phase 1 (Do Now):**
1. ✅ Update footer with founder link
2. ✅ Update "Who We Are" to first-person (optional but recommended)

**Phase 2 (Do This Week):**
3. Create "About the Founder" section
4. Add German translations

**Phase 3 (Nice to Have):**
5. Add founder to navigation
6. Consider hero subtitle update

---

## Visual Consistency with Business Card

The business card uses:
- Dark background (#0a0a0a)
- Emerald accent (#10b981)
- Space Grotesk + Inter fonts
- Clean, asymmetric layout

Your website already uses these brand colors! Just ensure:
- Founder avatar uses emerald accent (as shown in code above)
- Links to eduardosanzb.dev use the emerald accent color
- Keep the minimalist aesthetic

---

## Expected Result

After these changes:
- Business card recipients can scan QR → land on raus.cloud → click "Founder" → see your full profile
- Website visitors see there's a real person behind the service
- Both brands (raus.cloud and eduardosanzb.dev) cross-promote naturally
- Professional consistency across all touchpoints
