# Implementation Plan: SITE-1 Generalize Assessment Wizard

**Date**: 2026-03-30
**Status**: COMPLETED

## Overview

Make the CloudFest assessment wizard available as a permanent, multilingual site feature at `/assessment/`. Fix the hardcoded `/cloudfest/` back link in the shared template, create German and Spanish translations of the assessment content, add missing i18n navigation keys, and enhance the PocketBase submission payload with `language` and `referrer` fields for analytics.

## Scope

- Work units: 5
- Execution phases: 1 (all parallelizable)
- Files affected:
  - `apps/landing/layouts/assessment/single.html` (modify)
  - `apps/landing/content/assessments/cloudfest.en.md` (modify)
  - `apps/landing/content/assessments/infrastructure.en.md` (modify)
  - `apps/landing/content/assessments/infrastructure.de.md` (create)
  - `apps/landing/content/assessments/infrastructure.es.md` (create)
  - `apps/landing/i18n/de.toml` (modify)
  - `apps/landing/i18n/es.toml` (modify)

## Work Units

### WU-1: Fix hardcoded back link and add language/referrer to submission payload

**Dependencies**: none

**Context**: The assessment wizard template at `apps/landing/layouts/assessment/single.html` is shared by both the CloudFest assessment (`/cloudfest/assessment/`) and the generic site assessment (`/assessment/`). Currently it hardcodes `/cloudfest/` as the back-link destination in two places: line 379 (HTML anchor) and line 690 (JavaScript redirect). This means users who arrive at `/assessment/` from the main site see a back button that takes them to the CloudFest linktree page instead of the homepage. Additionally, the submission payload to PocketBase currently only sends `source` — we want to also send the user's `language` (which locale they used) and `referrer` (the page they came from, via the standard `document.referrer` browser API).

**Files**:
- `apps/landing/layouts/assessment/single.html` — modify

**Steps**:

1. **Fix HTML back link (line 379)**: Replace the hardcoded anchor:
   ```html
   <a class="back-link" href="/cloudfest/">← raus.cloud</a>
   ```
   with a dynamic Hugo template expression that reads `back_url` from frontmatter, defaulting to the language-prefixed homepage:
   ```html
   <a class="back-link" href="{{ .Params.back_url | default (printf "%s/" .Site.LanguagePrefix) }}">← raus.cloud</a>
   ```

2. **Add LANGUAGE and REFERRER constants**: After line 480 (`const TTL_MS = 7 * 24 * 60 * 60 * 1000;`), add two new constants:
   ```javascript
   const LANGUAGE = "{{ .Site.Language.Lang }}";
   const REFERRER = document.referrer || '';
   ```

3. **Fix JavaScript back link (line 690)**: Replace the hardcoded redirect in the `prevStep` function:
   ```javascript
   window.location.href = '/cloudfest/';
   ```
   with a Hugo-templated variable. Add a constant near the other constants (after step 2):
   ```javascript
   const BACK_URL = "{{ .Params.back_url | default (printf "%s/" .Site.LanguagePrefix) }}";
   ```
   Then replace line 690 with:
   ```javascript
   window.location.href = BACK_URL;
   ```

4. **Add language and referrer to submission payload**: In the `submitForm` function, the payload is initialized on line 702 as:
   ```javascript
   var payload = { source: SOURCE };
   ```
   Change it to:
   ```javascript
   var payload = { source: SOURCE, language: LANGUAGE, referrer: REFERRER };
   ```

**Verification**: `cd apps/landing && grep -q 'LANGUAGE' layouts/assessment/single.html && grep -q 'REFERRER' layouts/assessment/single.html && grep -q 'back_url' layouts/assessment/single.html && grep -q 'BACK_URL' layouts/assessment/single.html && echo "PASS" && exit 0 || (echo "FAIL" && exit 1)`

**Rollback**:
- Modified files: `git checkout -- apps/landing/layouts/assessment/single.html`

---

### WU-2: Add back_url frontmatter param to existing assessment content files

**Dependencies**: none

**Context**: The template change in WU-1 reads a `back_url` param from each assessment's YAML frontmatter to determine where the back button navigates. The CloudFest assessment should go back to `/cloudfest/` (its linktree landing page) and the generic infrastructure assessment should go back to `/` (the site homepage). Without this param, the template falls back to `{{ .Site.LanguagePrefix }}/` which works for the generic assessment but not for CloudFest. Both files are pure YAML frontmatter with no markdown body.

**Files**:
- `apps/landing/content/assessments/cloudfest.en.md` — modify
- `apps/landing/content/assessments/infrastructure.en.md` — modify

**Steps**:

1. **Edit `cloudfest.en.md`**: Add `back_url: "/cloudfest/"` to the YAML frontmatter. Insert it after the `source: "cloudfest"` line (line 7) and before `draft: false` (line 8). The frontmatter block currently starts:
   ```yaml
   title: "Cloud & AI Infrastructure Assessment"
   description: "Quick survey for European cloud & tech companies — takes 3 minutes."
   type: assessment
   url: "/cloudfest/assessment/"
   pocketbase_endpoint: "/pb/api/collections/assessments/records"
   source: "cloudfest"
   draft: false
   ```
   After the edit:
   ```yaml
   title: "Cloud & AI Infrastructure Assessment"
   description: "Quick survey for European cloud & tech companies — takes 3 minutes."
   type: assessment
   url: "/cloudfest/assessment/"
   pocketbase_endpoint: "/pb/api/collections/assessments/records"
   source: "cloudfest"
   back_url: "/cloudfest/"
   draft: false
   ```

2. **Edit `infrastructure.en.md`**: Add `back_url: "/"` to the YAML frontmatter. Insert it after the `source: "website"` line (line 7) and before `draft: false` (line 8). The frontmatter block currently starts:
   ```yaml
   title: "Infrastructure Assessment"
   description: "Quick survey for European cloud & tech companies — takes 3 minutes."
   type: assessment
   url: "/assessment/"
   pocketbase_endpoint: "/pb/api/collections/assessments/records"
   source: "website"
   draft: false
   ```
   After the edit:
   ```yaml
   title: "Infrastructure Assessment"
   description: "Quick survey for European cloud & tech companies — takes 3 minutes."
   type: assessment
   url: "/assessment/"
   pocketbase_endpoint: "/pb/api/collections/assessments/records"
   source: "website"
   back_url: "/"
   draft: false
   ```

**Verification**: `cd apps/landing && grep -q 'back_url: "/cloudfest/"' content/assessments/cloudfest.en.md && grep -q 'back_url: "/"' content/assessments/infrastructure.en.md && echo "PASS" && exit 0 || (echo "FAIL" && exit 1)`

**Rollback**:
- Modified files: `git checkout -- apps/landing/content/assessments/cloudfest.en.md apps/landing/content/assessments/infrastructure.en.md`

---

### WU-3: Create German assessment translation (infrastructure.de.md)

**Dependencies**: none

**Context**: Hugo is configured with three languages: English (default, no prefix), German (`/de/`), and Spanish (`/es/`). The header and footer already link to `/assessment/` using `{{ i18n "navigation.assessment" }}`. For German users navigating to `/de/assessment/`, Hugo needs a matching `.de.md` content file. Without it, the URL returns a 404. The questions, hints, section names, and option labels must be translated to German. The option `value` fields and question `id` fields must remain in English so that PocketBase always receives consistent English data regardless of which language the user completed the assessment in. Follow the German translation guidelines: use informal "du" form, keep English tech terms (Cloud, Setup, Infrastructure, AI, Compliance, etc.), write naturally like a German tech blogger.

**Files**:
- `apps/landing/content/assessments/infrastructure.de.md` — create

**Steps**:

1. Create the file `apps/landing/content/assessments/infrastructure.de.md` with the following complete content. This is a copy of `infrastructure.en.md` with:
   - `title` translated to German
   - `description` translated to German
   - `url` set to `"/de/assessment/"`
   - `source` kept as `"website"` (same attribution)
   - `back_url` set to `"/de/"` (German homepage)
   - All `question`, `hint`, `section`, `label`, and `placeholder` fields translated to German
   - All `value`, `id`, `step`, `type`, `required`, `max` fields kept IDENTICAL to the English version
   - All `fields[].id` kept identical (`respondent_name`, `respondent_email`, `respondent_company`)

   The full file content:
   ```yaml
   ---
   title: "Infrastruktur Assessment"
   description: "Kurze Umfrage für europäische Cloud- & Tech-Unternehmen — dauert 3 Minuten."
   type: assessment
   url: "/de/assessment/"
   pocketbase_endpoint: "/pb/api/collections/assessments/records"
   source: "website"
   back_url: "/de/"
   draft: false

   questions:
     - id: q1_cloud_setup
       step: 1
       section: "Kontext"
       type: radio
       question: "Was ist dein primäres Cloud Setup heute?"
       hint: ""
       required: true
       options:
         - value: single-hyperscaler
           label: "Ein einzelner Hyperscaler (AWS, GCP oder Azure)"
         - value: multi-cloud
           label: "Multi-Cloud (Mix aus Hyperscalern)"
         - value: european-provider
           label: "Europäischer Provider (Hetzner, OVH, Scaleway, STACKIT)"
         - value: hybrid
           label: "Hybrid (Cloud + On-Premise)"
         - value: on-premise
           label: "Hauptsächlich On-Premise"

     - id: q2_team_size
       step: 2
       section: "Kontext"
       type: radio
       question: "Wie groß ist dein Engineering-Team?"
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
       section: "Pain Points"
       type: checkbox
       question: "Was davon lässt dich nachts nicht schlafen?"
       hint: "Wähle alles aus, was zutrifft"
       required: true
       options:
         - value: costs
           label: "Cloud-Kosten wachsen schneller als der Umsatz"
         - value: compliance
           label: "Unsicher, ob wir wirklich DSGVO / NIS2 / AI Act compliant sind"
         - value: vendor-lock
           label: "Abhängig von einem einzelnen US-Cloud-Provider, den wir nicht einfach verlassen können"
         - value: ai-adoption
           label: "Wollen AI einsetzen, aber wissen nicht wie — sicher und bezahlbar"
         - value: fragile-infra
           label: "Infrastructure ist fragil — zu viel manuelles Setup, zu wenig IaC"
         - value: no-observability
           label: "Keine echte Observability — wir finden Probleme erst, wenn User sich beschweren"
         - value: none
           label: "Nichts davon"

     - id: q4_migration
       step: 4
       section: "Pain Points"
       type: radio
       question: "Wenn du in 6 Monaten von deinem Cloud-Provider weg müsstest — könntest du?"
       hint: "Diese Frage macht viele nervös. Genau darum geht's."
       required: true
       options:
         - value: yes-agnostic
           label: "Ja, wir sind provider-agnostisch by design"
         - value: painful-possible
           label: "Schmerzhaft, aber machbar"
         - value: practically-impossible
           label: "Praktisch unmöglich"
         - value: never-thought
           label: "Noch nie drüber nachgedacht"

     - id: q5_audit_history
       step: 5
       section: "Interesse an einem Audit"
       type: radio
       question: "Habt ihr jemals ein formales Infrastructure Audit gemacht?"
       hint: "Sovereignty, Kosten, AI-Readiness — irgendwas davon."
       required: true
       options:
         - value: yes-regularly
           label: "Ja, regelmäßig"
         - value: once-ago
           label: "Einmal, ist aber schon länger her"
         - value: no-wanted
           label: "Nein, aber wir wollten schon immer"
         - value: no-not-radar
           label: "Nein, und steht auch nicht auf dem Radar"

     - id: q6_audit_usefulness
       step: 6
       section: "Interesse an einem Audit"
       type: radio
       question: "Wenn dir jemand einen klaren Report geben würde — Sovereignty-Lücken, Kosten-Verschwendung, AI-Readiness Score, priorisierte nächste Schritte — wäre das nützlich?"
       hint: ""
       required: true
       options:
         - value: very-useful
           label: "Sehr nützlich — hätte ich gern schon gestern gehabt"
         - value: interesting
           label: "Interessant — würde ich mir anschauen"
         - value: maybe-cost
           label: "Vielleicht, kommt auf die Kosten an"
         - value: not-really
           label: "Eher nicht"

     - id: q7_audit_budget
       step: 7
       section: "Interesse an einem Audit"
       type: radio
       question: "Was würdest du für ein einmaliges Infrastructure Audit erwarten zu zahlen?"
       hint: ""
       required: true
       options:
         - value: free
           label: "Nichts — sollte kostenlos sein / ein Lead Magnet"
         - value: 500-2000
           label: "500–2.000 Euro"
         - value: 2000-5000
           label: "2.000–5.000 Euro"
         - value: 5000-plus
           label: "5.000+ Euro"
         - value: no-idea
           label: "Keine Ahnung"

     - id: q8_agent_interest
       step: 8
       section: "Interesse an Automatisierung"
       type: radio
       question: "Stell dir einen Agent oder CLI vor, der Sovereignty Compliance, Cost Drift und AI-Readiness kontinuierlich monitort — und Probleme automatisch flaggt. Wie interessant wäre das?"
       hint: ""
       required: true
       options:
         - value: try-now
           label: "Würde ich sofort ausprobieren wollen"
         - value: want-demo
           label: "Klingt vielversprechend — würde eine Demo sehen wollen"
         - value: need-trust
           label: "Interessantes Konzept, aber müsste dem erstmal vertrauen"
         - value: not-interested
           label: "Nicht interessiert"

     - id: q9_agent_priorities
       step: 9
       section: "Interesse an Automatisierung"
       type: checkbox
       max: 2
       question: "Was wäre bei so einem Tool am wichtigsten für dich?"
       hint: "Wähle bis zu 2"
       required: true
       options:
         - value: self-hosted
           label: "Läuft auf unserer eigenen Infrastructure (self-hosted, keine Daten gehen raus)"
         - value: actionable-alerts
           label: "Actionable Alerts, nicht nur Dashboards"
         - value: auto-remediation
           label: "Automatisierte Remediation (fixt Dinge, nicht nur flaggen)"
         - value: integrations
           label: "Integriert sich in unseren bestehenden Stack (Terraform, K8s, CI/CD)"
         - value: predictable-pricing
           label: "Klare Kosten — Predictable Pricing, keine Überraschungen"

     - id: lead
       step: 10
       section: "In Kontakt bleiben"
       type: lead
       question: "Können wir uns bei dir melden?"
       hint: "Alle Felder optional — selbst nur eine E-Mail hilft."
       required: false
       fields:
         - id: respondent_name
           type: text
           label: "Name"
           placeholder: "Dein Name"
         - id: respondent_email
           type: email
           label: "E-Mail"
           placeholder: "deine@email.de"
         - id: respondent_company
           type: text
           label: "Unternehmen"
           placeholder: "Firmenname"
   ---
   ```

**Verification**: `test -f apps/landing/content/assessments/infrastructure.de.md && grep -q 'url: "/de/assessment/"' apps/landing/content/assessments/infrastructure.de.md && grep -q 'source: "website"' apps/landing/content/assessments/infrastructure.de.md && grep -q 'back_url: "/de/"' apps/landing/content/assessments/infrastructure.de.md && grep -q 'value: single-hyperscaler' apps/landing/content/assessments/infrastructure.de.md && echo "PASS" && exit 0 || (echo "FAIL" && exit 1)`

**Rollback**:
- Created files: `rm -f apps/landing/content/assessments/infrastructure.de.md`

---

### WU-4: Create Spanish assessment translation (infrastructure.es.md)

**Dependencies**: none

**Context**: Same rationale as WU-3 but for Spanish. Hugo has Spanish configured as a third language with `/es/` prefix. The header and footer link to `/assessment/` which Hugo prefixes as `/es/assessment/` for Spanish users. Without a matching `.es.md` content file, this URL returns a 404. Spanish translations should be natural Latin American/European Spanish, using informal "tú" form. Technical terms that are commonly used in English in the Spanish tech community should stay in English (Cloud, Setup, Infrastructure, AI, Compliance, etc.).

**Files**:
- `apps/landing/content/assessments/infrastructure.es.md` — create

**Steps**:

1. Create the file `apps/landing/content/assessments/infrastructure.es.md` with the following complete content. Same rules as WU-3: translate all UI-facing text, keep all `value`, `id`, `step`, `type`, `required`, `max`, and `fields[].id` fields identical to the English version.

   The full file content:
   ```yaml
   ---
   title: "Assessment de Infraestructura"
   description: "Encuesta rápida para empresas europeas de cloud y tecnología — toma 3 minutos."
   type: assessment
   url: "/es/assessment/"
   pocketbase_endpoint: "/pb/api/collections/assessments/records"
   source: "website"
   back_url: "/es/"
   draft: false

   questions:
     - id: q1_cloud_setup
       step: 1
       section: "Contexto"
       type: radio
       question: "¿Cuál es tu setup principal de cloud hoy?"
       hint: ""
       required: true
       options:
         - value: single-hyperscaler
           label: "Un solo hyperscaler (AWS, GCP o Azure)"
         - value: multi-cloud
           label: "Multi-cloud (mix de hyperscalers)"
         - value: european-provider
           label: "Proveedor europeo (Hetzner, OVH, Scaleway, STACKIT)"
         - value: hybrid
           label: "Híbrido (cloud + on-premise)"
         - value: on-premise
           label: "Principalmente on-premise"

     - id: q2_team_size
       step: 2
       section: "Contexto"
       type: radio
       question: "¿Qué tan grande es tu equipo de ingeniería?"
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
       section: "Pain Points"
       type: checkbox
       question: "¿Cuáles de estos te quitan el sueño?"
       hint: "Selecciona todos los que apliquen"
       required: true
       options:
         - value: costs
           label: "Costes de cloud creciendo más rápido que los ingresos"
         - value: compliance
           label: "No estamos seguros de ser realmente GDPR / NIS2 / AI Act compliant"
         - value: vendor-lock
           label: "Dependientes de un solo proveedor cloud de EE.UU. del que no podemos salir fácilmente"
         - value: ai-adoption
           label: "Queremos adoptar AI pero no sabemos cómo hacerlo de forma segura y asequible"
         - value: fragile-infra
           label: "La infrastructure es frágil — demasiado setup manual, poco IaC"
         - value: no-observability
           label: "Sin observability real — nos enteramos de los problemas cuando los usuarios se quejan"
         - value: none
           label: "Ninguno de los anteriores"

     - id: q4_migration
       step: 4
       section: "Pain Points"
       type: radio
       question: "Si tuvieras que migrar de tu proveedor cloud principal en 6 meses, ¿podrías?"
       hint: "Esta pregunta incomoda a muchos. Ese es el punto."
       required: true
       options:
         - value: yes-agnostic
           label: "Sí, somos provider-agnostic por diseño"
         - value: painful-possible
           label: "Doloroso pero posible"
         - value: practically-impossible
           label: "Prácticamente imposible"
         - value: never-thought
           label: "Nunca lo había pensado"

     - id: q5_audit_history
       step: 5
       section: "Interés en un audit"
       type: radio
       question: "¿Alguna vez han hecho un audit formal de infrastructure?"
       hint: "Sovereignty, costes, AI-readiness — cualquiera de esos."
       required: true
       options:
         - value: yes-regularly
           label: "Sí, regularmente"
         - value: once-ago
           label: "Una vez, hace tiempo"
         - value: no-wanted
           label: "No, pero hemos querido hacerlo"
         - value: no-not-radar
           label: "No, y no está en nuestro radar"

     - id: q6_audit_usefulness
       step: 6
       section: "Interés en un audit"
       type: radio
       question: "Si alguien te diera un reporte claro — gaps de sovereignty, desperdicio de costes, score de AI-readiness, próximos pasos priorizados — ¿sería útil?"
       hint: ""
       required: true
       options:
         - value: very-useful
           label: "Muy útil — lo hubiera querido ayer"
         - value: interesting
           label: "Interesante — le echaría un vistazo"
         - value: maybe-cost
           label: "Quizás, depende del coste"
         - value: not-really
           label: "No realmente"

     - id: q7_audit_budget
       step: 7
       section: "Interés en un audit"
       type: radio
       question: "¿Cuánto esperarías pagar por un audit de infrastructure único?"
       hint: ""
       required: true
       options:
         - value: free
           label: "Nada — debería ser gratis / un lead magnet"
         - value: 500-2000
           label: "500–2.000 euros"
         - value: 2000-5000
           label: "2.000–5.000 euros"
         - value: 5000-plus
           label: "5.000+ euros"
         - value: no-idea
           label: "Ni idea"

     - id: q8_agent_interest
       step: 8
       section: "Interés en automatización"
       type: radio
       question: "Imagina un agente o CLI que monitorea continuamente sovereignty compliance, cost drift y AI-readiness — flaggeando problemas automáticamente. ¿Qué tan interesante es eso?"
       hint: ""
       required: true
       options:
         - value: try-now
           label: "Querría probarlo ahora mismo"
         - value: want-demo
           label: "Suena prometedor — querría ver un demo"
         - value: need-trust
           label: "Concepto interesante pero necesitaría confiar primero"
         - value: not-interested
           label: "No me interesa"

     - id: q9_agent_priorities
       step: 9
       section: "Interés en automatización"
       type: checkbox
       max: 2
       question: "Para una herramienta así, ¿qué sería lo más importante?"
       hint: "Elige hasta 2"
       required: true
       options:
         - value: self-hosted
           label: "Que corra en nuestra propia infrastructure (self-hosted, ningún dato sale)"
         - value: actionable-alerts
           label: "Alertas accionables, no solo dashboards"
         - value: auto-remediation
           label: "Remediación automatizada (que arregle cosas, no solo las flaggee)"
         - value: integrations
           label: "Que se integre con nuestro stack existente (Terraform, K8s, CI/CD)"
         - value: predictable-pricing
           label: "Costes claros — pricing predecible, sin sorpresas"

     - id: lead
       step: 10
       section: "Mantengamos el contacto"
       type: lead
       question: "¿Podemos contactarte?"
       hint: "Todos los campos son opcionales — incluso solo un email ayuda."
       required: false
       fields:
         - id: respondent_name
           type: text
           label: "Nombre"
           placeholder: "Tu nombre"
         - id: respondent_email
           type: email
           label: "Email"
           placeholder: "tu@email.com"
         - id: respondent_company
           type: text
           label: "Empresa"
           placeholder: "Nombre de la empresa"
   ---
   ```

**Verification**: `test -f apps/landing/content/assessments/infrastructure.es.md && grep -q 'url: "/es/assessment/"' apps/landing/content/assessments/infrastructure.es.md && grep -q 'source: "website"' apps/landing/content/assessments/infrastructure.es.md && grep -q 'back_url: "/es/"' apps/landing/content/assessments/infrastructure.es.md && grep -q 'value: single-hyperscaler' apps/landing/content/assessments/infrastructure.es.md && echo "PASS" && exit 0 || (echo "FAIL" && exit 1)`

**Rollback**:
- Created files: `rm -f apps/landing/content/assessments/infrastructure.es.md`

---

### WU-5: Add navigation.assessment i18n keys for German and Spanish

**Dependencies**: none

**Context**: The site header (`layouts/partials/header.html`) renders the assessment link using `{{ i18n "navigation.assessment" }}`. The English i18n file (`i18n/en.toml`) already has this key set to `"Free Assessment"` (line 85-86). The German (`i18n/de.toml`) and Spanish (`i18n/es.toml`) files are missing this key. Without it, Hugo renders an empty string for the assessment link text in the DE and ES navbars. The header already links to `/assessment/` and Hugo handles language prefixing, so only the translation text is needed.

**Files**:
- `apps/landing/i18n/de.toml` — modify
- `apps/landing/i18n/es.toml` — modify

**Steps**:

1. **Edit `de.toml`**: Append the following two lines at the end of the file (after line 83 which is `other = "← Zurück zu den Fallstudien"`):
   ```toml

   [navigation.assessment]
   other = "Kostenloses Assessment"
   ```

2. **Edit `es.toml`**: Append the following two lines at the end of the file (after line 70 which is `other = "← Volver a los Casos de Estudio"`):
   ```toml

   [navigation.assessment]
   other = "Assessment Gratuito"
   ```

**Verification**: `grep -q 'navigation.assessment' apps/landing/i18n/de.toml && grep -q 'Kostenloses Assessment' apps/landing/i18n/de.toml && grep -q 'navigation.assessment' apps/landing/i18n/es.toml && grep -q 'Assessment Gratuito' apps/landing/i18n/es.toml && echo "PASS" && exit 0 || (echo "FAIL" && exit 1)`

**Rollback**:
- Modified files: `git checkout -- apps/landing/i18n/de.toml apps/landing/i18n/es.toml`

---

## Execution Plan

### Phase 1 — Parallel (no dependencies, no file overlaps)
- WU-1: Fix hardcoded back link and add language/referrer to submission payload (`single.html`)
- WU-2: Add back_url frontmatter param to existing content files (`cloudfest.en.md`, `infrastructure.en.md`)
- WU-3: Create German assessment translation (`infrastructure.de.md`)
- WU-4: Create Spanish assessment translation (`infrastructure.es.md`)
- WU-5: Add navigation.assessment i18n keys (`de.toml`, `es.toml`)

## Recovery Strategy

- **Automatic**: Each implementor rolls back and retries once on failure.
- **Dependency failure**: All work units are independent. A failure in any one unit does not block others.
- **Global rollback**: `git checkout -- apps/landing/layouts/assessment/single.html apps/landing/content/assessments/cloudfest.en.md apps/landing/content/assessments/infrastructure.en.md apps/landing/i18n/de.toml apps/landing/i18n/es.toml && rm -f apps/landing/content/assessments/infrastructure.de.md apps/landing/content/assessments/infrastructure.es.md`
- **Independent failures**: Each work unit can be rolled back independently without affecting others.

## PocketBase Requirement (Manual Step)

After deployment, two new text fields must be added to the `assessments` collection in PocketBase at `https://admin.raus.cloud`:
- `language` (plain text) — stores `"en"`, `"de"`, or `"es"`
- `referrer` (plain text / URL) — stores `document.referrer` value

Without these fields, PocketBase will reject submissions that include the new fields. This must be done before the code goes live.
