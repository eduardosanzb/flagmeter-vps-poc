# Website Overhaul Summary

## Branch: `feat/founder-section`

## Changes Made

### 1. Content Updates

#### Founder Section Added
- **English** (`_index.en.md`): "Meet the Engineer" section with Eduardo's bio
- **German** (`_index.de.md`): "Lerne den Engineer kennen" with full translation
- **Spanish** (`_index.es.md`): "Conoce al Engineer" with full translation

#### Footer Updated
- Added "Built by Eduardo Sanchez" link to personal site
- Link uses emerald accent color (#10b981)
- Opens in new tab with proper security attributes

#### "Who We Are" Section
- **Kept as "we"** (as requested)
- Maintained professional tone across all languages

### 2. Design Overhaul (Business Card Style)

#### Typography
- **Primary Font:** Inter (body text)
- **Display Font:** Space Grotesk (headings)
- Added via Google Fonts in `baseof.html`
- Updated `tailwind.config.js` with new font stacks

#### Color Scheme
- **Background:** #0a0a0a (pure black, dark mode by default)
- **Primary Text:** #ffffff (white)
- **Accent:** #10b981 (emerald green)
- **Secondary:** #6b7280 (gray)
- **Borders:** rgba(55, 65, 81, 0.5) (subtle dark borders)

#### CSS Improvements
- **Dark theme by default** (no more light/dark toggle needed initially)
- **Modern buttons** with emerald glow shadow and hover lift effect
- **Subtle animations** (transitions, hover effects)
- **Enhanced cards** with border accent on hover
- **Better contrast** for accessibility
- **Backdrop blur** effects on secondary buttons
- **Modern shadows** with emerald tint

### 3. New Files Created

1. `apps/landing/layouts/partials/sections/founder.html`
   - Responsive founder section
   - Initials avatar (ES) with emerald border
   - Bio, location, and link to full profile

2. `apps/landing/assets/css/main.css` (completely overhauled)
   - Dark theme by default
   - Space Grotesk for headings
   - Enhanced button styles
   - Better card designs
   - Modern prose styling

3. `WEBSITE_UPDATE_RECOMMENDATIONS.md` (documentation)

### 4. Translation Updates

**English** (`i18n/en.toml`):
- Added `footer.builtBy`
- Added `founder.title`, `founder.subtitle`, `founder.linkText`

**German** (`i18n/de.toml`):
- Added `footer.builtBy = "Gebaut von"`
- Added `founder.title = "Lerne den Engineer kennen"`
- Added `founder.subtitle = "Die Person hinter raus.cloud"`
- Added `founder.linkText = "Vollständiges Profil ansehen →"`

**Spanish** (content only, no i18n file update needed for now)

## Design Philosophy

### Business Card Alignment
The website now matches the business card aesthetic:
- **Dark, sleek background** (#0a0a0a)
- **Emerald accent color** (#10b981) used sparingly but effectively
- **Space Grotesk + Inter** fonts for modern, tech-forward feel
- **Minimal borders** with subtle accent highlights
- **Clean typography** with good hierarchy

### Key Visual Elements
1. **Buttons:** Emerald glow, lift on hover
2. **Cards:** Dark background, border accent on hover
3. **Text:** High contrast white on black
4. **Links:** Emerald color, subtle underline on hover
5. **Borders:** Semi-transparent dark gray, emerald accent on interaction

## Testing

### Local Development
```bash
cd apps/landing
pnpm dev
```
Visit: http://localhost:1313

### Build for Production
```bash
cd apps/landing
pnpm build
```

## Files Modified

1. `apps/landing/layouts/_default/baseof.html` - Added Google Fonts
2. `apps/landing/layouts/partials/footer.html` - Added founder link
3. `apps/landing/layouts/partials/sections/founder.html` - New section (created)
4. `apps/landing/content/_index.en.md` - Added founder section
5. `apps/landing/content/_index.de.md` - Added founder section (German)
6. `apps/landing/content/_index.es.md` - Added founder section (Spanish)
7. `apps/landing/i18n/en.toml` - Added translation keys
8. `apps/landing/i18n/de.toml` - Added translation keys (German)
9. `apps/landing/tailwind.config.js` - Updated font families
10. `apps/landing/assets/css/main.css` - Complete overhaul (replaced)

## Next Steps

1. **Test locally** with `pnpm dev`
2. **Review all pages** (home, blog posts, pricing)
3. **Check responsive design** (mobile, tablet, desktop)
4. **Test dark/light mode toggle** (if still desired)
5. **Review translations** (especially German)
6. **Commit and push** when ready

## Business Card Integration

The website now perfectly complements the business card design:
- **Consistent color palette**
- **Same font families**
- **Matching dark aesthetic**
- **Professional emerald accent**

When someone scans the QR code on the business card → lands on raus.cloud → they see:
1. Dark, modern design matching the card
2. "Meet the Engineer" section with your face/name
3. Link to your full profile (eduardosanzb.dev)
4. Professional, cohesive brand experience

## Brand Consistency

### raus.cloud
- Primary service/business
- Dark, modern, technical
- Emerald accent color
- "Infrastructure Independence" messaging

### eduardosanzb.dev
- Personal brand (linked from raus.cloud)
- Founder profile
- Portfolio + case studies
- Complements raus.cloud positioning

---

**Ready for review and testing!**
