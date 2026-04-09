# Implementation Plan: Scored Assessment Result

**Date**: 2026-04-09 **Status**: COMPLETED

## Overview

Transform the existing 9-question + lead-capture assessment wizard into a scored assessment with a 3-axis result (Sovereignty, Cost Resilience, AI-Readiness). The new flow has 6 scoring questions → immediate result (no email gate) → email capture → 2 qualification questions. Three existing questions (Q5-Q7) are dropped. Three new questions are added (cost visibility, AI adoption, AI coupling). A deterministic scoring function computes 0-100 scores per axis. Static diagnostic templates render per-axis paragraphs and next-step bullets. All answers are persisted to PocketBase with a session_id so data is captured even without email.

## Scope

- Work units: 7
- Execution phases: 4
- Files affected:
  - `apps/landing/content/assessments/infrastructure.en.md` — modify (restructure questions)
  - `apps/landing/content/assessments/infrastructure.de.md` — modify (restructure questions)
  - `apps/landing/content/assessments/infrastructure.es.md` — modify (restructure questions)
  - `apps/landing/content/assessments/cloudfest.en.md` — modify (restructure questions)
  - `apps/landing/layouts/assessment/single.html` — modify (add result step, scoring JS, session_id, email gate, new step flow)
  - `infra/pocketbase/pb_migrations/3_add_session_id_and_new_fields.js` — create (new DB fields)
  - `infra/pocketbase/pb_migrations/4_make_old_fields_optional.js` — create (make Q5-Q7 optional for backward compat)

## Work Units

### WU-1: Restructure English assessment content

**Dependencies**: none

**Context**: The current `infrastructure.en.md` has 9 questions + lead capture in a flat sequence. The new flow requires 6 scoring questions first (Q1, Q3, Q4, plus 3 new ones), then a result step, then email + 2 qualification questions. Questions Q5, Q6, Q7 are dropped entirely. Three new questions are added: cost visibility, AI adoption level, AI vendor coupling. The step numbers must be renumbered sequentially. The `section` labels must group questions logically. The lead capture step moves from step 10 to after the result.

**Files**:
- `apps/landing/content/assessments/infrastructure.en.md` — modify

**Steps**:
1. Replace the entire `questions:` array with the following structure. Keep all frontmatter keys (`title`, `description`, `type`, `url`, `pocketbase_endpoint`, `source`, `back_url`, `draft`) unchanged.

2. The new questions array (exact YAML):

```yaml
questions:
  - id: q1_cloud_setup
    step: 1
    section: "Infrastructure"
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

  - id: q3_pain_points
    step: 2
    section: "Infrastructure"
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
    step: 3
    section: "Infrastructure"
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

  - id: q_cost_visibility
    step: 4
    section: "Cost"
    type: radio
    question: "How well do you understand your cloud spending?"
    hint: ""
    required: true
    options:
      - value: clear
        label: "We have clear dashboards and know exactly where money goes"
      - value: rough-idea
        label: "We have a rough idea but some costs are opaque"
      - value: surprises
        label: "We get surprised by cloud bills regularly"
      - value: no-tracking
        label: "We don't really track cloud costs"

  - id: q_ai_adoption
    step: 5
    section: "AI"
    type: radio
    question: "Where is your team with AI tools?"
    hint: ""
    required: true
    options:
      - value: not-using
        label: "Not using AI tools yet"
      - value: individual
        label: "Some engineers use AI tools on their own"
      - value: team-standard
        label: "We've standardized on specific tools across the team"
      - value: ai-first
        label: "AI is core to how we build — most engineers use agents daily"

  - id: q_ai_coupling
    step: 6
    section: "AI"
    type: radio
    question: "How dependent is your company on a single AI provider?"
    hint: ""
    required: true
    options:
      - value: no-dependency
        label: "We don't rely on AI providers, or we use open-source / self-hosted models"
      - value: moderate
        label: "We use an AI provider but could switch with some effort"
      - value: deep
        label: "Our engineering workflows depend on a specific AI provider — switching would be a major project"
      - value: critical
        label: "Our entire product or team productivity depends on one AI provider — we couldn't operate without them"

  - id: q2_team_size
    step: 7
    section: "About you"
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

  - id: q8_agent_interest
    step: 8
    section: "About you"
    type: radio
    question: "Imagine an agent that continuously monitors sovereignty compliance, cost drift, and AI-readiness — flagging issues automatically. How interesting is that?"
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
    section: "About you"
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
    section: "Your snapshot"
    type: lead
    question: "Want the full picture? Leave your email and we'll send your detailed report."
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
```

3. Update the `description` frontmatter to: `"Scored assessment for European cloud & tech companies — takes 2 minutes."`

**Verification**: `cd /Users/eduardosanchez/repos/github.com/eduardosanzb/flagmeter/apps/landing && python3 -c "import yaml; d=yaml.safe_load(open('content/assessments/infrastructure.en.md'.replace('content/','content/'))); print(len(d.get('questions',[])), 'questions'); ids=[q['id'] for q in d['questions']]; print(ids); assert 'q5_audit_history' not in ids; assert 'q6_audit_usefulness' not in ids; assert 'q7_audit_budget' not in ids; assert 'q_cost_visibility' in ids; assert 'q_ai_adoption' in ids; assert 'q_ai_coupling' in ids; print('PASS')" 2>&1 || echo "YAML parse failed, trying with frontmatter splitter"; python3 -c "
import yaml, re
content = open('content/assessments/infrastructure.en.md').read()
match = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
d = yaml.safe_load(match.group(1))
qs = d.get('questions',[])
print(len(qs), 'questions')
ids = [q['id'] for q in qs]
print(ids)
assert 'q5_audit_history' not in ids, 'Q5 should be dropped'
assert 'q6_audit_usefulness' not in ids, 'Q6 should be dropped'
assert 'q7_audit_budget' not in ids, 'Q7 should be dropped'
assert 'q_cost_visibility' in ids, 'cost visibility missing'
assert 'q_ai_adoption' in ids, 'ai adoption missing'
assert 'q_ai_coupling' in ids, 'ai coupling missing'
assert len(qs) == 10, f'expected 10 items, got {len(qs)}'
print('PASS')
"`

**Rollback**:
- Modified files: `git checkout -- apps/landing/content/assessments/infrastructure.en.md`

---

### WU-2: Restructure German and Spanish assessment content

**Dependencies**: none

**Context**: The German (`infrastructure.de.md`) and Spanish (`infrastructure.es.md`) content files have the same structure as the English one. They need the same restructuring: drop Q5-Q7, add the 3 new questions with translated labels, renumber steps, update sections. The CloudFest variant (`cloudfest.en.md`) also needs the same restructuring but keeps its own `source` and `url` values.

**Files**:
- `apps/landing/content/assessments/infrastructure.de.md` — modify
- `apps/landing/content/assessments/infrastructure.es.md` — modify
- `apps/landing/content/assessments/cloudfest.en.md` — modify

**Steps**:
1. For `infrastructure.de.md`: Replace the `questions:` array with the same structure as WU-1 but with German translations for all `label`, `question`, `hint`, and `section` fields. Keep the same `value` fields (these are data values, not translated). The German translations should follow the existing German file's style (informal "du" form, natural tech German). Specifically:
   - Section "Infrastructure" → "Infrastruktur"
   - Section "Cost" → "Kosten"
   - Section "AI" → "KI"
   - Section "About you" → "Über dich"
   - Section "Your snapshot" → "Dein Snapshot"
   - Q4 cost visibility question: "Wie gut verstehst du euer Cloud-Spending?"
     - `clear` → "Wir haben klare Dashboards und wissen genau, wo das Geld hingeht"
     - `rough-idea` → "Wir haben eine grobe Vorstellung, aber manche Kosten sind undurchsichtig"
     - `surprises` → "Wir werden regelmäßig von Cloud-Rechnungen überrascht"
     - `no-tracking` → "Wir tracken Cloud-Kosten nicht wirklich"
   - Q5 AI adoption question: "Wo steht dein Team bei KI-Tools?"
     - `not-using` → "Wir nutzen noch keine KI-Tools"
     - `individual` → "Einige Engineers nutzen KI-Tools auf eigene Faust"
     - `team-standard` → "Wir haben teamweit bestimmte Tools standardisiert"
     - `ai-first` → "KI ist Kern unserer Arbeitsweise — die meisten Engineers nutzen täglich Agents"
   - Q6 AI coupling question: "Wie abhängig ist euer Unternehmen von einem einzelnen KI-Provider?"
     - `no-dependency` → "Wir sind nicht von KI-Providern abhängig, oder nutzen Open-Source / self-hosted Models"
     - `moderate` → "Wir nutzen einen KI-Provider, könnten aber mit etwas Aufwand wechseln"
     - `deep` → "Unsere Engineering-Workflows hängen von einem spezifischen KI-Provider ab — Wechsel wäre ein großes Projekt"
     - `critical` → "Unser gesamtes Produkt oder die Team-Produktivität hängt von einem KI-Provider ab — ohne den könnten wir nicht operieren"
   - Lead question: "Willst du das volle Bild? Lass deine E-Mail da und wir schicken dir den detaillierten Report."
   - Lead hint: "Alle Felder optional — selbst nur eine E-Mail hilft."
   - Description: "Scored Assessment für europäische Cloud- & Tech-Unternehmen — dauert 2 Minuten."

2. For `infrastructure.es.md`: Same restructuring with Spanish translations. Follow the existing Spanish file's style. Specifically:
   - Section "Infrastructure" → "Infraestructura"
   - Section "Cost" → "Costes"
   - Section "AI" → "IA"
   - Section "About you" → "Sobre ti"
   - Section "Your snapshot" → "Tu instantánea"
   - Q4 cost visibility question: "¿Qué tan bien entiendes tu gasto en la nube?"
     - `clear` → "Tenemos dashboards claros y sabemos exactamente a dónde va el dinero"
     - `rough-idea` → "Tenemos una idea general pero algunos costes son opacos"
     - `surprises` → "Nos sorprenden las facturas de la nube regularmente"
     - `no-tracking` → "No realmente rastreamos los costes de la nube"
   - Q5 AI adoption question: "¿Dónde está tu equipo con las herramientas de IA?"
     - `not-using` → "Aún no usamos herramientas de IA"
     - `individual` → "Algunos ingenieros usan herramientas de IA por su cuenta"
     - `team-standard` → "Hemos estandarizado herramientas específicas en todo el equipo"
     - `ai-first` → "La IA es fundamental para cómo construimos — la mayoría de ingenieros usan agentes a diario"
   - Q6 AI coupling question: "¿Qué tan dependiente es tu empresa de un único proveedor de IA?"
     - `no-dependency` → "No dependemos de proveedores de IA, o usamos modelos open-source / self-hosted"
     - `moderate` → "Usamos un proveedor de IA pero podríamos cambiar con algo de esfuerzo"
     - `deep` → "Nuestros flujos de trabajo de ingeniería dependen de un proveedor de IA específico — cambiar sería un proyecto importante"
     - `critical` → "Todo nuestro producto o la productividad del equipo depende de un proveedor de IA — no podríamos operar sin ellos"
   - Lead question: "¿Quieres la imagen completa? Deja tu email y te enviaremos tu informe detallado."
   - Lead hint: "Todos los campos son opcionales — incluso solo un email ayuda."
   - Description: "Evaluación con puntuación para empresas europeas de cloud y tecnología — toma 2 minutos."

3. For `cloudfest.en.md`: Same restructuring as the English file in WU-1. Same questions, same labels. Only difference: keep `url: "/cloudfest/assessment/"`, `source: "cloudfest"`, `back_url: "/cloudfest/"`, and `title: "Cloud & AI Infrastructure Assessment"`.

**Verification**: `cd /Users/eduardosanchez/repos/github.com/eduardosanzb/flagmeter/apps/landing && python3 -c "
import yaml, re
for f in ['infrastructure.de.md', 'infrastructure.es.md', 'cloudfest.en.md']:
    content = open(f'content/assessments/{f}').read()
    match = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
    d = yaml.safe_load(match.group(1))
    qs = d.get('questions',[])
    ids = [q['id'] for q in qs]
    assert 'q_cost_visibility' in ids, f'{f}: cost visibility missing'
    assert 'q_ai_adoption' in ids, f'{f}: ai adoption missing'
    assert 'q_ai_coupling' in ids, f'{f}: ai coupling missing'
    assert 'q5_audit_history' not in ids, f'{f}: Q5 should be dropped'
    assert len(qs) == 10, f'{f}: expected 10 items, got {len(qs)}'
    print(f'{f}: {len(qs)} questions, PASS')
print('ALL PASS')
"`

**Rollback**:
- Modified files: `git checkout -- apps/landing/content/assessments/infrastructure.de.md apps/landing/content/assessments/infrastructure.es.md apps/landing/content/assessments/cloudfest.en.md`

---

### WU-3: Add PocketBase migration for new fields and session_id

**Dependencies**: none

**Context**: The PocketBase `assessments` collection currently has fields for Q1-Q9 plus lead capture fields, source, language, and referrer. The new assessment drops Q5-Q7 and adds 3 new question fields (`q_cost_visibility`, `q_ai_adoption`, `q_ai_coupling`) plus a `session_id` field for tracking submissions without email. Old Q5-Q7 fields must be made optional (not required) so existing records aren't invalidated and the form doesn't fail validation when those fields are absent. The new fields should also be optional since the new flow submits data progressively (scoring questions first, then qualification questions after email gate).

**Files**:
- `infra/pocketbase/pb_migrations/3_add_session_id_and_new_fields.js` — create
- `infra/pocketbase/pb_migrations/4_make_old_fields_optional.js` — create

**Steps**:
1. Create `3_add_session_id_and_new_fields.js` with this exact content:

```js
/// <reference path="../pb_data/types.d.ts" />
migrate(
  // UP — add session_id and new question fields to assessments
  (app) => {
    const collection = app.findCollectionByNameOrId("assessments");

    // Session ID — client-generated UUID for tracking submissions without email
    collection.fields.add(new Field({
      name: "session_id",
      type: "text",
      required: false,
      max: 36,
    }));

    // New scoring question: cost visibility
    collection.fields.add(new Field({
      name: "q_cost_visibility",
      type: "text",
      required: false,
      max: 100,
    }));

    // New scoring question: AI adoption level
    collection.fields.add(new Field({
      name: "q_ai_adoption",
      type: "text",
      required: false,
      max: 100,
    }));

    // New scoring question: AI vendor coupling
    collection.fields.add(new Field({
      name: "q_ai_coupling",
      type: "text",
      required: false,
      max: 100,
    }));

    // Scores — computed by the frontend scoring function
    collection.fields.add(new Field({
      name: "score_sovereignty",
      type: "number",
      required: false,
    }));

    collection.fields.add(new Field({
      name: "score_cost_resilience",
      type: "number",
      required: false,
    }));

    collection.fields.add(new Field({
      name: "score_ai_readiness",
      type: "number",
      required: false,
    }));

    return app.save(collection);
  },

  // DOWN — remove the added fields
  (app) => {
    const collection = app.findCollectionByNameOrId("assessments");
    collection.fields.removeByName("session_id");
    collection.fields.removeByName("q_cost_visibility");
    collection.fields.removeByName("q_ai_adoption");
    collection.fields.removeByName("q_ai_coupling");
    collection.fields.removeByName("score_sovereignty");
    collection.fields.removeByName("score_cost_resilience");
    collection.fields.removeByName("score_ai_readiness");
    return app.save(collection);
  }
);
```

2. Create `4_make_old_fields_optional.js` with this exact content:

```js
/// <reference path="../pb_data/types.d.ts" />
migrate(
  // UP — make Q5-Q7 and Q2 optional (dropped or moved in new flow)
  (app) => {
    const collection = app.findCollectionByNameOrId("assessments");

    // Q5, Q6, Q7 are dropped from the new assessment flow
    // Make them optional so new submissions don't fail validation
    const q5 = collection.fields.getByName("q5_audit_history");
    if (q5) q5.required = false;

    const q6 = collection.fields.getByName("q6_audit_usefulness");
    if (q6) q6.required = false;

    const q7 = collection.fields.getByName("q7_audit_budget");
    if (q7) q7.required = false;

    // Q2 is moved after the result screen — may not be submitted in early partial saves
    const q2 = collection.fields.getByName("q2_team_size");
    if (q2) q2.required = false;

    // Q8, Q9 also moved after result — make optional for partial submissions
    const q8 = collection.fields.getByName("q8_agent_interest");
    if (q8) q8.required = false;

    const q9 = collection.fields.getByName("q9_agent_priorities");
    if (q9) q9.required = false;

    // Q1, Q3, Q4 are still required in the scoring phase
    // But make them optional too since we save progressively
    const q1 = collection.fields.getByName("q1_cloud_setup");
    if (q1) q1.required = false;

    const q3 = collection.fields.getByName("q3_pain_points");
    if (q3) q3.required = false;

    const q4 = collection.fields.getByName("q4_migration");
    if (q4) q4.required = false;

    return app.save(collection);
  },

  // DOWN — restore required status (best effort)
  (app) => {
    const collection = app.findCollectionByNameOrId("assessments");
    const requiredFields = [
      "q1_cloud_setup", "q2_team_size", "q3_pain_points", "q4_migration",
      "q5_audit_history", "q6_audit_usefulness", "q7_audit_budget",
      "q8_agent_interest", "q9_agent_priorities"
    ];
    requiredFields.forEach(function(name) {
      const field = collection.fields.getByName(name);
      if (field) field.required = true;
    });
    return app.save(collection);
  }
);
```

**Verification**: `cd /Users/eduardosanchez/repos/github.com/eduardosanzb/flagmeter && ls -la infra/pocketbase/pb_migrations/3_add_session_id_and_new_fields.js infra/pocketbase/pb_migrations/4_make_old_fields_optional.js && echo "FILES EXIST" && node -c infra/pocketbase/pb_migrations/3_add_session_id_and_new_fields.js && echo "MIGRATION 3 SYNTAX OK" && node -c infra/pocketbase/pb_migrations/4_make_old_fields_optional.js && echo "MIGRATION 4 SYNTAX OK"`

**Rollback**:
- Created files: `rm -f infra/pocketbase/pb_migrations/3_add_session_id_and_new_fields.js infra/pocketbase/pb_migrations/4_make_old_fields_optional.js`

---

### WU-4: Add scoring function and result step to assessment template

**Dependencies**: WU-1, WU-2, WU-3

**Context**: The assessment template (`layouts/assessment/single.html`) is a 763-line self-contained file with inline CSS, HTML, and JS. The wizard currently iterates over `{{ .Params.questions }}` to render steps, then shows a success screen on submit. The new flow requires: (1) a scoring function that computes 3 axis scores from the first 6 answers, (2) a result step that appears after step 6 (before the email/qualification questions), (3) session_id generation and progressive saving to PocketBase, (4) the email gate integrated into the lead capture step, and (5) the success screen replaced with the full result display. The scoring function is deterministic JS (~80 lines). The result step shows 3 score cards with tier labels, diagnostic paragraphs, and next-step bullets. The existing step rendering, navigation, and localStorage persistence must continue to work.

**Files**:
- `apps/landing/layouts/assessment/single.html` — modify

**Steps**:
1. **Add CSS for the result step** — After the existing `.resume-btn.primary` rule (around line 373), add these new CSS rules:

```css
  /* --- Result step --- */
  .step-result { display: none; }
  .step-result.active { display: block; }

  .result-header {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 6px;
    letter-spacing: -0.3px;
  }

  .result-subtitle {
    font-size: 13px;
    color: var(--secondary);
    line-height: 1.5;
    margin-bottom: 28px;
  }

  .axis-card {
    background: var(--card);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 18px 16px;
    margin-bottom: 12px;
  }

  .axis-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .axis-name {
    font-size: 13px;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .axis-score {
    font-size: 20px;
    font-weight: 700;
  }

  .axis-tier {
    font-size: 12px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 6px;
    display: inline-block;
    margin-bottom: 10px;
  }

  .tier-dependent { background: rgba(239,68,68,0.15); color: #f87171; }
  .tier-transitional { background: rgba(251,191,36,0.15); color: #fbbf24; }
  .tier-sovereign { background: rgba(16,185,129,0.15); color: #10b981; }

  .tier-vulnerable { background: rgba(239,68,68,0.15); color: #f87171; }
  .tier-managing { background: rgba(251,191,36,0.15); color: #fbbf24; }
  .tier-optimized { background: rgba(16,185,129,0.15); color: #10b981; }

  .tier-unprepared { background: rgba(239,68,68,0.15); color: #f87171; }
  .tier-exploring { background: rgba(251,191,36,0.15); color: #fbbf24; }
  .tier-strategic { background: rgba(16,185,129,0.15); color: #10b981; }

  .axis-bar {
    height: 4px;
    background: rgba(255,255,255,0.08);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 12px;
  }

  .axis-bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.8s ease;
  }

  .bar-red { background: #f87171; }
  .bar-yellow { background: #fbbf24; }
  .bar-green { background: #10b981; }

  .axis-diagnostic {
    font-size: 14px;
    color: var(--secondary);
    line-height: 1.6;
    margin-bottom: 10px;
  }

  .axis-next-steps {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .axis-next-steps li {
    font-size: 13px;
    color: var(--text);
    line-height: 1.5;
    padding: 4px 0 4px 18px;
    position: relative;
  }

  .axis-next-steps li::before {
    content: '→';
    position: absolute;
    left: 0;
    color: var(--accent);
    font-size: 12px;
  }

  .result-cta {
    margin-top: 24px;
    padding: 18px 20px;
    background: rgba(16,185,129,0.12);
    border: 1px solid rgba(16,185,129,0.3);
    border-radius: 16px;
    text-decoration: none;
    color: var(--text);
    display: block;
    transition: border-color 0.2s, background 0.2s;
  }

  .result-cta:hover {
    border-color: rgba(16,185,129,0.6);
    background: rgba(16,185,129,0.18);
  }

  .result-cta-label { font-size: 15px; font-weight: 600; color: var(--accent); }
  .result-cta-sub { font-size: 12px; color: var(--secondary); margin-top: 2px; }

  .result-disclaimer {
    font-size: 11px;
    color: rgba(255,255,255,0.3);
    line-height: 1.5;
    margin-top: 20px;
    text-align: center;
  }
```

2. **Add the result step HTML** — After the closing `{{ end }}` of the `{{ range $questions }}` block (around line 420, before `<div class="step-success"`), insert:

```html
    <div class="step-result" id="step-result">
      <div class="result-header">Your raus.cloud snapshot</div>
      <div class="result-subtitle">Based on your self-reported answers. A proper audit looks at your actual infra, IaC, bills, and data flows.</div>

      <div id="result-axes"></div>

      <a class="result-cta" href="{{ .Site.Params.calendarLink }}" target="_blank" rel="noopener">
        <div class="result-cta-label">Want a real audit? Book a free 15-min call →</div>
        <div class="result-cta-sub">We'll look at your actual infrastructure, not just your answers.</div>
      </a>

      <div class="result-disclaimer">This snapshot is based on your self-reported answers and reflects positioning, not an actual infrastructure audit.</div>
    </div>
```

3. **Replace the success screen** — Replace the entire `<div class="step-success" id="step-success">...</div>` block (lines 422-449) with a simpler version that shows after the lead capture step:

```html
    <div class="step-success" id="step-success">
      <div class="success-icon">✅</div>
      <div class="success-title">Snapshot saved!</div>
      <div class="success-body">
        We'll send your detailed report if you left your email.<br><br>
        Want to discuss your infrastructure right now? Book a free 15-minute call.
      </div>
      
      <a class="success-cta" href="{{ .Site.Params.calendarLink }}" target="_blank" rel="noopener" style="margin-bottom: 12px;">
        <div class="success-cta-icon">📅</div>
        <div>
          <div class="success-cta-label">Book Free Call</div>
          <div class="success-cta-sub">15 min · No commitment</div>
        </div>
        <div class="success-cta-arrow">→</div>
      </a>
      
      <a class="success-cta" href="{{ .Site.LanguagePrefix }}/" style="background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1);">
        <div class="success-cta-icon" style="background: rgba(255,255,255,0.1);">🏠</div>
        <div>
          <div class="success-cta-label" style="color: var(--text);">Explore raus.cloud</div>
          <div class="success-cta-sub">Read case studies & methodology</div>
        </div>
        <div class="success-cta-arrow">→</div>
      </a>
    </div>
```

4. **Add the scoring function and result rendering JS** — In the `<script>` section, after the `const BACK_URL` line (around line 483), add:

```js
  // --- Session ID ---
  const SESSION_KEY = STORAGE_KEY + '_sid';
  function getSessionId() {
    try {
      var sid = localStorage.getItem(SESSION_KEY);
      if (sid) return sid;
    } catch (err) {}
    var sid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    try { localStorage.setItem(SESSION_KEY, sid); } catch (err) {}
    return sid;
  }
  const SESSION_ID = getSessionId();

  // --- Scoring constants ---
  var SCORING_STEP = 6; // Result appears after step 6

  // --- Scoring function ---
  function computeScores() {
    var q1 = getStepValue(1);   // cloud setup
    var q3 = getStepValue(2);   // pain points (checkbox array)
    var q4 = getStepValue(3);   // migration feasibility
    var qCost = getStepValue(4); // cost visibility
    var qAiAdopt = getStepValue(5); // AI adoption
    var qAiCouple = getStepValue(6); // AI coupling

    // --- Sovereignty (0-100) ---
    var sovereignty = 50; // baseline
    // Q1: cloud provider
    var providerScores = { 'single-hyperscaler': -30, 'multi-cloud': -10, 'european-provider': 20, 'hybrid': 10, 'on-premise': 15 };
    sovereignty += providerScores[q1] || 0;
    // Q3: pain points
    if (q3 && q3.indexOf('vendor-lock') !== -1) sovereignty -= 20;
    if (q3 && q3.indexOf('compliance') !== -1) sovereignty -= 10;
    // Q4: migration feasibility
    var migrationScores = { 'yes-agnostic': 25, 'painful-possible': 5, 'practically-impossible': -25, 'never-thought': -15 };
    sovereignty += migrationScores[q4] || 0;
    // AI coupling: strong sovereignty signal
    var aiCoupleScores = { 'no-dependency': 10, 'moderate': -5, 'deep': -20, 'critical': -30 };
    sovereignty += aiCoupleScores[qAiCouple] || 0;
    sovereignty = Math.max(0, Math.min(100, sovereignty));

    // --- Cost Resilience (0-100) ---
    var costResilience = 50;
    // Q3: pain points
    if (q3 && q3.indexOf('costs') !== -1) costResilience -= 20;
    if (q3 && q3.indexOf('fragile-infra') !== -1) costResilience -= 15;
    // Q4: migration optionality = cost leverage
    costResilience += migrationScores[q4] || 0;
    // Cost visibility
    var costVisScores = { 'clear': 20, 'rough-idea': 0, 'surprises': -20, 'no-tracking': -30 };
    costResilience += costVisScores[qCost] || 0;
    costResilience = Math.max(0, Math.min(100, costResilience));

    // --- AI-Readiness (0-100) ---
    var aiReadiness = 50;
    // Q1: EU provider bonus (data residency for EU AI Act)
    if (q1 === 'european-provider') aiReadiness += 5;
    // Q3: pain points
    if (q3 && q3.indexOf('ai-adoption') !== -1) aiReadiness -= 15;
    if (q3 && q3.indexOf('no-observability') !== -1) aiReadiness -= 10;
    // AI adoption level
    var aiAdoptScores = { 'not-using': -25, 'individual': -10, 'team-standard': 10, 'ai-first': 15 };
    aiReadiness += aiAdoptScores[qAiAdopt] || 0;
    // AI coupling (infrastructure dimension)
    var aiCoupleReadiness = { 'no-dependency': 15, 'moderate': 0, 'deep': -15, 'critical': -25 };
    aiReadiness += aiCoupleReadiness[qAiCouple] || 0;
    aiReadiness = Math.max(0, Math.min(100, aiReadiness));

    return {
      sovereignty: sovereignty,
      costResilience: costResilience,
      aiReadiness: aiReadiness,
    };
  }

  // --- Tier labels ---
  function getTier(score, axis) {
    var tiers = {
      sovereignty: [
        { max: 33, label: 'Dependent', css: 'tier-dependent', bar: 'bar-red' },
        { max: 66, label: 'Transitional', css: 'tier-transitional', bar: 'bar-yellow' },
        { max: 100, label: 'Sovereign', css: 'tier-sovereign', bar: 'bar-green' },
      ],
      costResilience: [
        { max: 33, label: 'Vulnerable', css: 'tier-vulnerable', bar: 'bar-red' },
        { max: 66, label: 'Managing', css: 'tier-managing', bar: 'bar-yellow' },
        { max: 100, label: 'Optimized', css: 'tier-optimized', bar: 'bar-green' },
      ],
      aiReadiness: [
        { max: 33, label: 'Unprepared', css: 'tier-unprepared', bar: 'bar-red' },
        { max: 66, label: 'Exploring', css: 'tier-exploring', bar: 'bar-yellow' },
        { max: 100, label: 'Strategic', css: 'tier-strategic', bar: 'bar-green' },
      ],
    };
    var list = tiers[axis] || [];
    for (var i = 0; i < list.length; i++) {
      if (score <= list[i].max) return list[i];
    }
    return list[list.length - 1];
  }

  // --- Diagnostic templates ---
  var DIAGNOSTICS = {
    sovereignty: {
      Dependent: {
        text: "You're running on a single US hyperscaler and a migration would be difficult or impossible. That's the textbook lock-in position. Sovereignty decisions are being made for you, not by you.",
        steps: [
          "Pick one non-critical service and deploy it on a European provider in parallel — not to migrate, just to prove you could.",
          "Get your IaC coverage above 80%. Anything in someone's head is a sovereignty risk disguised as a bus-factor risk.",
          "Evaluate your AI provider dependencies — they may be creating the same lock-in pattern.",
        ],
      },
      Transitional: {
        text: "You have some optionality but it's incomplete. You could leave, but it would hurt. The key question is whether you're building toward more independence or slowly drifting deeper in.",
        steps: [
          "Document your provider-specific dependencies — you can't reduce what you can't name.",
          "Add a European provider as a secondary for at least one workload.",
          "Create a migration playbook even if you never use it — the exercise itself reveals risks.",
        ],
      },
      Sovereign: {
        text: "You're in a strong position. You can choose where your data lives and who processes it. The challenge now is maintaining this as you grow and adopt AI.",
        steps: [
          "Formalize your sovereignty requirements into a policy document.",
          "Evaluate AI providers through the same lens — EU data residency, portability, exit strategy.",
          "Share your approach with your customers — sovereignty is a competitive advantage.",
        ],
      },
    },
    costResilience: {
      Vulnerable: {
        text: "Costs are growing faster than revenue and you lack the visibility to optimize. The real problem isn't the cost — it's the inability to experiment with alternatives. You can't negotiate with a provider you can't credibly leave.",
        steps: [
          "Implement cost dashboards this month. You can't fix what you can't see.",
          "Identify your top 3 cost drivers and evaluate alternatives for each.",
          "Tag all cloud resources by team/project — accountability drives optimization.",
        ],
      },
      Managing: {
        text: "You have some cost awareness but gaps remain. Surprise bills and opaque pricing are signs that your cost model is fragile, not resilient.",
        steps: [
          "Set up automated cost anomaly alerts — catch surprises before they become bills.",
          "Benchmark your cloud spend against equivalent self-hosted infrastructure.",
          "Negotiate committed-use discounts only after proving you could run elsewhere.",
        ],
      },
      Optimized: {
        text: "You have clear visibility into costs and the leverage to optimize. The question is whether you're using that position proactively or reactively.",
        steps: [
          "Review your cost structure quarterly — cloud pricing changes, your usage changes.",
          "Evaluate reserved capacity vs. on-demand for predictable workloads.",
          "Consider whether self-hosting high-volume workloads could reduce costs further.",
        ],
      },
    },
    aiReadiness: {
      Unprepared: {
        text: "You're not using AI tools yet, or adoption is ad-hoc without coordination. This means no AI lock-in — yet. But falling behind on AI adoption creates a different kind of risk: your competitors are building capabilities you don't have.",
        steps: [
          "Start with a single, well-defined AI use case — not a strategy document.",
          "Choose open-source or EU-hosted models for your first integration to avoid creating lock-in from day one.",
          "Define a 'what data can go where' policy before adding any AI tool.",
        ],
      },
      Exploring: {
        text: "You're experimenting with AI but without a framework. This is the danger zone — adoption is happening, but lock-in is being built accidentally. Every direct API integration without an abstraction layer is a future migration cost.",
        steps: [
          "Add an abstraction layer (like LiteLLM) between your code and any AI provider — swap models in config, not code.",
          "Inventory all AI tools in use — you'll likely find more than you think.",
          "Evaluate EU-hosted alternatives for any workload handling customer data.",
        ],
      },
      Strategic: {
        text: "You have a deliberate AI strategy with portability built in. The risk now is complacency — AI capabilities evolve fast, and today's strategic position can become tomorrow's legacy.",
        steps: [
          "Review your AI provider landscape quarterly — new models and providers emerge constantly.",
          "Benchmark your AI spend against open-source alternatives for routine tasks.",
          "Document your AI architecture decisions — future you will thank present you.",
        ],
      },
    },
  };

  // --- Render result ---
  function renderResult(scores) {
    var container = document.getElementById('result-axes');
    container.innerHTML = '';

    var axes = [
      { key: 'sovereignty', label: 'Sovereignty', score: scores.sovereignty },
      { key: 'costResilience', label: 'Cost Resilience', score: scores.costResilience },
      { key: 'aiReadiness', label: 'AI-Readiness', score: scores.aiReadiness },
    ];

    axes.forEach(function(axis) {
      var tier = getTier(axis.score, axis.key);
      var diag = DIAGNOSTICS[axis.key][tier.label];

      var card = document.createElement('div');
      card.className = 'axis-card';
      card.innerHTML =
        '<div class="axis-header">' +
          '<span class="axis-name">' + axis.label + '</span>' +
          '<span class="axis-score">' + axis.score + ' / 100</span>' +
        '</div>' +
        '<span class="axis-tier ' + tier.css + '">' + tier.label + '</span>' +
        '<div class="axis-bar"><div class="axis-bar-fill ' + tier.bar + '" style="width: ' + axis.score + '%"></div></div>' +
        '<div class="axis-diagnostic">' + diag.text + '</div>' +
        '<ul class="axis-next-steps">' + diag.steps.map(function(s) { return '<li>' + s + '</li>'; }).join('') + '</ul>';

      container.appendChild(card);
    });
  }
```

5. **Modify the `showStep` function** — Replace the existing `showStep` function (lines 656-675) with this version that handles the result step:

```js
  function showStep(n, persist) {
    if (persist !== false) saveState();
    document.querySelectorAll('.step').forEach(function(el) { el.classList.remove('active'); });
    document.getElementById('step-result').classList.remove('active');
    document.getElementById('step-success').classList.remove('active');

    // Show result after scoring questions
    if (n === SCORING_STEP + 1) {
      var scores = computeScores();
      renderResult(scores);
      document.getElementById('step-result').classList.add('active');
      document.getElementById('progress-fill').style.width = '100%';
      document.getElementById('step-counter').textContent = '✓ Results';
      document.getElementById('wizard-nav').style.display = 'none';
      // Save scores + partial data to PocketBase
      savePartial(scores);
      return;
    }

    var stepEl = document.getElementById('step-' + n);
    if (stepEl) stepEl.classList.add('active');

    var pct = Math.round((n / TOTAL) * 100);
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('step-counter').textContent = n + ' / ' + TOTAL;

    var btnBack = document.getElementById('btn-back');
    var btnNext = document.getElementById('btn-next');
    btnBack.style.display = n === 1 ? 'none' : '';
    btnNext.textContent = n === TOTAL ? 'Submit →' : 'Continue →';
    btnNext.disabled = false;

    // Show nav bar for question steps
    document.getElementById('wizard-nav').style.display = '';

    document.getElementById('error-msg').textContent = '';
  }
```

6. **Add the `savePartial` function** — After the `renderResult` function, add:

```js
  // --- Save partial data to PocketBase after scoring ---
  function savePartial(scores) {
    var payload = {
      source: SOURCE,
      language: LANGUAGE,
      referrer: REFERRER,
      session_id: SESSION_ID,
      score_sovereignty: scores.sovereignty,
      score_cost_resilience: scores.costResilience,
      score_ai_readiness: scores.aiReadiness,
    };

    // Collect all answered questions so far
    QUESTIONS.forEach(function(q) {
      if (q.step > SCORING_STEP) return; // Only scoring questions
      if (q.type === 'radio') {
        var el = document.querySelector('input[name="q' + q.step + '"]:checked');
        payload[q.id] = el ? el.value : '';
      } else if (q.type === 'checkbox') {
        var vals = Array.from(
          document.querySelectorAll('input[name="q' + q.step + '"]:checked')
        ).map(function(i) { return i.value; });
        payload[q.id] = JSON.stringify(vals);
      }
    });

    fetch(PB_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(function(err) {
      console.error('Partial save error:', err);
    });
  }
```

7. **Modify the `submitForm` function** — Replace the existing `submitForm` function (lines 700-747) with this version that updates the existing record via session_id:

```js
  function submitForm() {
    var btnNext = document.getElementById('btn-next');
    btnNext.disabled = true;
    btnNext.textContent = 'Submitting…';

    var payload = {
      source: SOURCE,
      language: LANGUAGE,
      referrer: REFERRER,
      session_id: SESSION_ID,
    };

    // Collect ALL question answers (including post-result qualification questions)
    QUESTIONS.forEach(function(q) {
      if (q.type === 'radio') {
        var el = document.querySelector('input[name="q' + q.step + '"]:checked');
        payload[q.id] = el ? el.value : '';
      } else if (q.type === 'checkbox') {
        var vals = Array.from(
          document.querySelectorAll('input[name="q' + q.step + '"]:checked')
        ).map(function(i) { return i.value; });
        payload[q.id] = JSON.stringify(vals);
      } else if (q.type === 'lead') {
        (q.fields || []).forEach(function(f) {
          var el = document.getElementById('input-' + f.id);
          payload[f.id] = el ? el.value.trim() : '';
        });
      }
    });

    // Include computed scores
    var scores = computeScores();
    payload.score_sovereignty = scores.sovereignty;
    payload.score_cost_resilience = scores.costResilience;
    payload.score_ai_readiness = scores.aiReadiness;

    fetch(PB_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(function(res) {
      if (!res.ok) {
        return res.text().then(function(body) {
          throw new Error('HTTP ' + res.status + ': ' + body.slice(0, 200));
        });
      }
      document.querySelectorAll('.step').forEach(function(el) { el.classList.remove('active'); });
      document.getElementById('step-result').classList.remove('active');
      clearState();
      document.getElementById('step-success').classList.add('active');
      document.getElementById('wizard-nav').style.display = 'none';
      document.getElementById('progress-fill').style.width = '100%';
      document.getElementById('step-counter').textContent = '✓ Done';
    }).catch(function(err) {
      console.error('Submission error:', err);
      document.getElementById('error-msg').textContent =
        'Something went wrong. Please try again or email eduardo@raus.cloud';
      btnNext.disabled = false;
      btnNext.textContent = 'Submit →';
    });
  }
```

8. **Add "Continue" button on the result step** — The result step needs a way to proceed to the qualification questions. Add a button inside the `step-result` div, after the disclaimer, before the closing `</div>`:

```html
      <div style="margin-top: 20px; text-align: center;">
        <button class="btn-nav btn-next" id="btn-result-continue" style="display: inline-flex; width: auto; padding: 14px 28px;">Answer 3 more questions →</button>
      </div>
```

And wire it in the JS initialization section (after the btn-next/btn-back event listeners):

```js
  document.getElementById('btn-result-continue').addEventListener('click', function() {
    current = SCORING_STEP + 1; // Go to first post-result question
    showStep(current);
  });
```

9. **Update the `nextStep` function** — Modify the `nextStep` function to handle the transition through the result step. After step 6 (SCORING_STEP), the next step should show the result (which is handled by showStep). The current `nextStep` already increments `current` and calls `showStep`, which will detect `current === SCORING_STEP + 1` and show the result. No change needed to `nextStep` itself.

10. **Update the `prevStep` function** — When on the first post-result question (step 7), pressing back should return to the result screen, not step 6. Modify `prevStep`:

Replace the existing `prevStep` function (lines 691-698) with:

```js
  function prevStep() {
    if (current === 1) {
      window.location.href = BACK_URL;
      return;
    }
    // If on first post-result question, go back to result
    if (current === SCORING_STEP + 1) {
      var scores = computeScores();
      renderResult(scores);
      document.querySelectorAll('.step').forEach(function(el) { el.classList.remove('active'); });
      document.getElementById('step-result').classList.add('active');
      document.getElementById('wizard-nav').style.display = 'none';
      document.getElementById('progress-fill').style.width = '100%';
      document.getElementById('step-counter').textContent = '✓ Results';
      return;
    }
    current--;
    showStep(current);
  }
```

**Verification**: `cd /Users/eduardosanchez/repos/github.com/eduardosanzb/flagmeter/apps/landing && hugo build 2>&1 | tail -5; echo "exit:$?"`

**Rollback**:
- Modified files: `git checkout -- apps/landing/layouts/assessment/single.html`

---

### WU-5: Update resume bar and localStorage for new step flow

**Dependencies**: WU-4

**Context**: The resume bar and localStorage persistence currently track step numbers 1-10. The new flow has a result step between step 6 and step 7 that isn't a numbered question step. The `showResumeBar` function references `TOTAL` which is still 10 (the number of question items). The `saveState`/`restoreAnswers` functions need to handle the result step correctly — if someone returns after seeing the result, they should see the result, not step 7. The resume bar text should say something like "You were on question 4 of 6" for scoring questions, or "You completed the assessment — view your results" for post-result steps.

**Files**:
- `apps/landing/layouts/assessment/single.html` — modify

**Steps**:
1. **Update `showResumeBar`** — Replace the existing `showResumeBar` function (lines 562-585) with:

```js
  function showResumeBar(saved) {
    var bar = document.getElementById('resume-bar');
    var text = document.getElementById('resume-bar-text');
    if (saved.step > SCORING_STEP) {
      text.innerHTML = 'You <strong>completed the scoring questions</strong> and saw your results.';
    } else {
      text.innerHTML = 'You were on <strong>question ' + saved.step + '</strong> of ' + SCORING_STEP + '.';
    }
    bar.classList.add('active');

    document.getElementById('resume-continue').onclick = function() {
      bar.classList.remove('active');
      restoreAnswers(saved.answers);
      if (saved.step > SCORING_STEP) {
        // Show result screen
        var scores = computeScores();
        renderResult(scores);
        document.querySelectorAll('.step').forEach(function(el) { el.classList.remove('active'); });
        document.getElementById('step-result').classList.add('active');
        document.getElementById('wizard-nav').style.display = 'none';
        document.getElementById('progress-fill').style.width = '100%';
        document.getElementById('step-counter').textContent = '✓ Results';
        current = saved.step;
      } else {
        current = saved.step;
        showStep(saved.step, false);
      }
    };

    document.getElementById('resume-start-over').onclick = function() {
      clearState();
      bar.classList.remove('active');
      current = 1;
      document.querySelectorAll('.option').forEach(function(o) { o.classList.remove('selected'); });
      document.querySelectorAll('input').forEach(function(i) {
        if (i.type === 'checkbox' || i.type === 'radio') i.checked = false;
        if (i.classList && i.classList.contains('text-input')) i.value = '';
      });
      showStep(1, false);
    };
  }
```

2. **Update the initialization block** — Replace the initialization block at the bottom (lines 752-760) with:

```js
  var saved = getSavedState();
  if (saved) {
    current = saved.step;
    restoreAnswers(saved.answers);
    showResumeBar(saved);
  } else {
    showStep(1, false);
  }
```

Note: The `showResumeBar` now handles calling `showStep` internally for the "Continue" action, so we don't call `showStep(saved.step, false)` directly on init anymore.

**Verification**: `cd /Users/eduardosanchez/repos/github.com/eduardosanzb/flagmeter/apps/landing && hugo build 2>&1 | tail -5; echo "exit:$?"`

**Rollback**:
- Modified files: `git checkout -- apps/landing/layouts/assessment/single.html`

---

### WU-6: Hugo build verification and visual check

**Dependencies**: WU-1, WU-2, WU-3, WU-4, WU-5

**Context**: After all the changes, the Hugo site must build without errors. The assessment page must render correctly with the new question flow, scoring function, and result step. This work unit verifies the build succeeds and the key elements are present in the generated HTML.

**Files**:
- No file changes — verification only

**Steps**:
1. Run `cd /Users/eduardosanchez/repos/github.com/eduardosanzb/flagmeter/apps/landing && hugo build 2>&1` and confirm exit code 0.
2. Check that the generated HTML for the assessment page contains the scoring function, result step, and session_id logic by grepping the output.
3. Check that all 4 content files (en, de, es, cloudfest) build without errors.

**Verification**: `cd /Users/eduardosanchez/repos/github.com/eduardosanzb/flagmeter/apps/landing && hugo build 2>&1 && echo "BUILD SUCCESS" || echo "BUILD FAILED"`

**Rollback**: N/A (no file changes)

---

### WU-7: PocketBase migration syntax and field verification

**Dependencies**: WU-3

**Context**: The PocketBase migrations must be syntactically valid JavaScript that PocketBase can execute. This work unit verifies the migration files parse correctly and contain the expected field definitions.

**Files**:
- No file changes — verification only

**Steps**:
1. Run `node -c` on both migration files to verify syntax.
2. Grep the migration files for the expected field names to confirm they're present.

**Verification**: `cd /Users/eduardosanchez/repos/github.com/eduardosanzb/flagmeter && node -c infra/pocketbase/pb_migrations/3_add_session_id_and_new_fields.js && echo "MIGRATION 3 OK" && node -c infra/pocketbase/pb_migrations/4_make_old_fields_optional.js && echo "MIGRATION 4 OK" && grep -c "session_id\|q_cost_visibility\|q_ai_adoption\|q_ai_coupling\|score_sovereignty\|score_cost_resilience\|score_ai_readiness" infra/pocketbase/pb_migrations/3_add_session_id_and_new_fields.js`

**Rollback**: N/A (no file changes)

## Execution Plan

### Phase 1 — Parallel (no dependencies)

- WU-1: Restructure English assessment content
- WU-2: Restructure German, Spanish, and CloudFest assessment content
- WU-3: Add PocketBase migration for new fields and session_id

### Phase 2 — Parallel (requires Phase 1)

- WU-4: Add scoring function and result step to assessment template
- WU-5: Update resume bar and localStorage for new step flow

### Phase 3 — Parallel (requires Phase 2)

- WU-6: Hugo build verification and visual check
- WU-7: PocketBase migration syntax and field verification

### Phase 4 — Sequential (requires Phase 3)

- Manual: Run `pnpm dev` and visually verify the assessment flow in browser

## Recovery Strategy

- **Automatic**: Each implementor rolls back and retries once on failure.
- **Dependency failure**: If a work unit fails and later units depend on it, those later units will not run. The orchestrator will report which units were skipped.
- **Global rollback**: `git reset HEAD~N --hard` where N is the number of committed work units, or use `git revert` to undo individual WU commits non-destructively.
- **Independent failures**: Work units with no dependency on a failed unit will still execute.
