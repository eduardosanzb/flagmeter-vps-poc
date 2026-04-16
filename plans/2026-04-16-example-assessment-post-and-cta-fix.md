# Implementation Plan: Example Assessment Post and CTA Fix

**Date**: 2026-04-16  **Status**: COMPLETED

## Overview

Ship two deliverables: (1) a complete fictional AI Strategy Assessment blog post (EN + DE) that shows what the framework produces — the LinkedIn-shareable credibility artifact that proves the expertise without requiring anyone to run the prompt; (2) fix the CTA language in all three prompt files so it is first-person and warm, with the disclaimer repositioned as the reason to book a call rather than a deflation before it.

## Scope

- Work units: 3
- Execution phases: 2
- Files affected:
  - `apps/landing/content/blog/ai-strategy-assessment-example.en.md` — create
  - `apps/landing/content/blog/ai-strategy-assessment-example.de.md` — create
  - `apps/landing/content/ai-strategy-prompt-cursor.en.md` — modify
  - `apps/landing/content/ai-strategy-prompt-notion.en.md` — modify
  - `apps/landing/content/ai-strategy-prompt-claude.en.md` — modify

## Work Units

---

### WU-1: Create EN example assessment blog post

**Dependencies**: none

**Context**: The AI strategy framework at raus.cloud/ai-strategy is designed as a credibility-building tool, but no published example of the output exists. Prospective clients seeing the AI strategy page have no way to evaluate the quality of the framework without running the full prompt themselves — which has friction (privacy concerns, effort, trust). A blog post showing a complete fictional assessment gives readers immediate access to the framework's depth. This is also the LinkedIn-shareable artifact: someone reads it, sees the quality of the scoring and synthesis, and either recognises their own situation or shares it with someone who does.

Blog posts live in `apps/landing/content/blog/` as Hugo markdown files named `post-slug.en.md`. The site renders them at `/blog/post-slug/`. Required frontmatter fields are: `title`, `date`, `description`, `author`, `categories`, `tags`, `draft`. The blog list template shows posts in a 3-column card grid. A hardcoded CTA box ("Ready to Simplify Your Infrastructure? → Book Free Consultation") is automatically appended by the single post template — do not add a duplicate CTA.

**Files**:
- `apps/landing/content/blog/ai-strategy-assessment-example.en.md` — create

**Steps**:

1. Create the file `apps/landing/content/blog/ai-strategy-assessment-example.en.md`.

2. Start with this exact YAML frontmatter block (including the `---` delimiters):

```yaml
---
title: "What an AI Strategy Snapshot Looks Like: A Complete Example"
date: 2026-04-16
description: "Curious what you'd get from an AI strategy assessment? Here's a complete example — real scores, real insights, real next steps — for a fictional 42-person German SaaS."
author: "Eduardo Sanchez"
categories: ["Case Studies"]
tags: ["ai-strategy", "ai-governance", "european-saas", "gdpr", "vendor-lock-in"]
draft: false
---
```

3. After the frontmatter, add this italic intro paragraph:

`*Curious what you'd actually get from running the AI Strategy Assessment? Here's a complete output — every score, the synthesis, the priorities — for a fictional European tech company. No fluff. Just the framework doing its job.*`

4. Add a horizontal rule (`---`), then this section:

```
## The Company: Velox

**42 people. 14 engineers. B2B project management SaaS. Berlin.**

Series A closed 8 months ago. Growth is fast. The CTO got asked in a board meeting: *"What's our AI strategy?"* She gave an honest answer: *"Everyone's using it, but we haven't formalized anything yet."*

That's exactly who this assessment is for.

**Current AI footprint:**
- GitHub Copilot on all 14 engineering seats
- ChatGPT Team plan for the whole company (42 seats)
- One engineer calling the OpenAI API directly for a smart-search feature — personal API key, billed to the company card
```

5. Add a horizontal rule, then a `## The Snapshot` section. Inside it, add a fenced code block (triple backticks, no language specifier) containing exactly this ASCII card — preserve all spacing and box-drawing characters:

```
┌─────────────────────────────────────────┐
│  AI STRATEGY SNAPSHOT                   │
│  Velox — April 2026                     │
├─────────────────────────────────────────┤
│                                         │
│  Governance    ██░░  Level 2  Mandate   │
│  Vendor Dep.   █░░░  Level 1  Coupled   │
│  Sovereignty   ██░░  Level 2  Aware     │
│  Cost Visible  █░░░  Level 1  Blind     │
│  Team Health   ███░  Level 3  Balanced  │
│                                         │
│  Overall: 9/20 — PARTIALLY GOVERNED    │
│                                         │
│  #1 Risk: OpenAI API in production,     │
│           no abstraction, no cost cap   │
│  Quick Win: Map all AI API keys +       │
│             set budget alerts this week │
│                                         │
│  Framework: raus.cloud/ai-strategy      │
└─────────────────────────────────────────┘
```

6. Add a horizontal rule, then this section:

```
## What the Numbers Mean

A **9/20 — Partially Governed** is the most common result for a European SaaS at Series A. Not chaos, not strategy. You've adopted AI, you're getting value from it, and you haven't hit a wall yet.

The wall is coming.

The dangerous combination here isn't any single low score. It's **Vendor Dependency at 1** and **Cost Visibility at 1**, sitting next to each other.

Here's what that means in practice: Velox is building a feature directly on OpenAI's API with no abstraction layer, on subsidized pricing the provider has explicitly said won't last. When pricing normalizes — historically a 3-5x increase — there's no escape route. Switching means rewriting. And because there's no cost visibility, nobody knows what they'd even be switching from. The number is invisible.

That's the same pattern that caught companies off guard with AWS. You build on what's cheap. You don't abstract because *"why would we?"* The pricing changes. The exit cost is a rewrite.

**Team Health at 3 is the bright spot.** The team has worked through the early AI tension — enthusiasts and skeptics found a way to coexist. That's rare, and it's the foundation everything else needs to be built on.
```

7. Add a horizontal rule, then a `## Assessment Receipt` section. Inside it, add a fenced code block (triple backticks, no language specifier) containing exactly this receipt:

```
AI Strategy Assessment — Velox — April 2026

SCORES: Governance 2 | Vendor 1 | Data 2 | Cost 1 | Health 3 | Total: 9/20

KEY INSIGHT: Direct OpenAI API coupling + zero cost visibility = a rewrite-or-pay-more trap
when pricing normalizes — the same lock-in pattern that played out with AWS, now repeating in AI.

90-DAY PRIORITIES:
□ Add an abstraction layer over the OpenAI API call (1-2 days — prevents a rewrite if you switch)
□ Set budget alerts on all AI API keys and create a single cost dashboard (half a day)
□ Write a one-page data routing policy: what goes to US providers, what stays EU (1-2 hours)

Framework: raus.cloud/ai-strategy
Strategy call: cal.com/eduardosanzb/raus-cloud-audit
```

8. Add a horizontal rule, then this closing section. Use raw HTML for the links (Hugo requires this for `target="_blank"` links):

```
## Want to Know Where Your Company Sits?

This took Velox's CTO 20 minutes — one conversation with an AI using the <a href="/ai-strategy/">raus.cloud AI Strategy framework</a>. The output is yours to keep, share with your board, or use as the starting point for an actual strategy.

If you want help turning your snapshot into a plan — vendor abstraction architecture, data routing policy, cost modeling — <a href="https://cal.com/eduardosanzb/raus-cloud-audit" target="_blank" rel="noopener">book 15 minutes with me</a>. Free. No pitch.
```

**Verification**: `cd /Users/eduardosanchez/repos/github.com/eduardosanzb/flagmeter/apps/landing && pnpm build 2>&1 | grep -E "(ERROR|WARN|Built in)"`

(Build must complete with no ERRORs. The "Built in" line confirms Hugo succeeded.)

**Rollback**:
- Created file: `rm -f apps/landing/content/blog/ai-strategy-assessment-example.en.md`

---

### WU-2: Create DE translation of the example assessment post

**Dependencies**: WU-1

**Context**: Every English blog post on the site has a matching German translation. The naming convention is `post-slug.de.md` to pair with `post-slug.en.md`. The German version must not be a word-for-word translation — it should sound like a native German tech blogger wrote it. Key rules (from the site's style guide): use informal "du" (not formal "Sie"), keep English tech terms that are natural in German tech circles (Copilot, API, Abstraction Layer, Cost Visibility, Series A, etc.), use germanised English verbs where natural (deployen, scalen, handlen), write punchy direct sentences. The ASCII card and receipt should be reproduced verbatim — only translate the `#1 Risk` and `Quick Win` lines and section headers.

**Files**:
- `apps/landing/content/blog/ai-strategy-assessment-example.de.md` — create

**Steps**:

1. Create the file `apps/landing/content/blog/ai-strategy-assessment-example.de.md`.

2. Start with this exact YAML frontmatter:

```yaml
---
title: "So sieht ein AI Strategy Snapshot aus: Ein vollständiges Beispiel"
date: 2026-04-16
description: "Neugierig, was du bei einem AI Strategy Assessment bekommst? Hier ist ein vollständiges Beispiel — echte Scores, echte Insights, echte nächste Schritte — für ein fiktives 42-köpfiges deutsches SaaS."
author: "Eduardo Sanchez"
categories: ["Case Studies"]
tags: ["ai-strategy", "ai-governance", "european-saas", "gdpr", "vendor-lock-in"]
draft: false
---
```

3. After the frontmatter, add this italic intro:

`*Neugierig, was du beim AI Strategy Assessment wirklich bekommst? Hier ist ein vollständiges Output — alle Scores, die Synthese, die Priorities — für ein fiktives europäisches Tech-Unternehmen. Kein Bullshit. Nur das Framework, das seinen Job macht.*`

4. Add a horizontal rule, then this section:

```
## Das Unternehmen: Velox

**42 Leute. 14 Engineers. B2B Project-Management-SaaS. Berlin.**

Series A vor 8 Monaten geschlossen. Starkes Wachstum. Die CTO wurde in einem Board-Meeting gefragt: *„Was ist unsere AI-Strategie?"* Ihre ehrliche Antwort: *„Alle nutzen es, aber wir haben noch nichts formalisiert."*

Genau für diese Situation ist das Assessment gemacht.

**Aktueller AI-Footprint:**
- GitHub Copilot auf allen 14 Engineering-Seats
- ChatGPT Team für das ganze Unternehmen (42 Seats)
- Ein Engineer ruft die OpenAI API direkt für ein Smart-Search-Feature auf — persönlicher API-Key, über die Firmenkarte abgerechnet
```

5. Add a horizontal rule, then a `## Der Snapshot` section. Inside it, add a fenced code block (triple backticks, no language specifier) containing this ASCII card — translate only the `#1 Risk` and `Quick Win` lines, keep all box characters and scores identical:

```
┌─────────────────────────────────────────┐
│  AI STRATEGY SNAPSHOT                   │
│  Velox — April 2026                     │
├─────────────────────────────────────────┤
│                                         │
│  Governance    ██░░  Level 2  Mandate   │
│  Vendor Dep.   █░░░  Level 1  Coupled   │
│  Sovereignty   ██░░  Level 2  Aware     │
│  Cost Visible  █░░░  Level 1  Blind     │
│  Team Health   ███░  Level 3  Balanced  │
│                                         │
│  Overall: 9/20 — PARTIALLY GOVERNED    │
│                                         │
│  #1 Risiko: OpenAI API in Production,   │
│             kein Abstraction Layer,     │
│             kein Cost Cap               │
│  Quick Win: Alle AI API Keys mappen +   │
│             Budget Alerts diese Woche   │
│                                         │
│  Framework: raus.cloud/ai-strategy      │
└─────────────────────────────────────────┘
```

6. Add a horizontal rule, then this section:

```
## Was die Zahlen bedeuten

**9/20 — Partially Governed** ist das häufigste Ergebnis für ein europäisches SaaS auf Series-A-Level. Kein Chaos, keine Strategie. AI wird genutzt, es bringt was — und die Wand ist noch nicht in Sicht.

Die Wand kommt.

Die gefährliche Kombination ist nicht ein einzelner niedriger Score. Es ist **Vendor Dependency auf 1** und **Cost Visibility auf 1**, die nebeneinander stehen.

Was das in der Praxis bedeutet: Velox baut ein Feature direkt auf der OpenAI API — ohne Abstraction Layer, auf subventionierten Preisen, von denen der Provider selbst sagt, dass sie nicht lange halten. Wenn die Preise sich normalisieren — historisch ein 3-5x-Anstieg — gibt es keinen Exit-Plan. Wechseln bedeutet Rewrite. Und weil es kein Cost Visibility gibt, weiß niemand, von welcher Zahl aus man überhaupt wechseln würde. Die Zahl ist unsichtbar.

Das ist dasselbe Pattern, das viele Unternehmen bei AWS erwischt hat. Du baust auf dem, was billig ist. Du abstrahierst nicht, weil *„warum sollten wir?"* Die Preise ändern sich. Der Exit kostet einen Rewrite.

**Team Health auf 3 ist der Lichtblick.** Das Team hat die frühe AI-Spannung überwunden — Enthusiasten und Skeptiker haben einen Weg gefunden, zusammenzuarbeiten. Das ist selten, und es ist die Grundlage, auf der alles andere aufgebaut werden muss.
```

7. Add a horizontal rule, then a `## Assessment Receipt` section. Inside it, add a fenced code block (triple backticks, no language specifier) with this receipt — translate the KEY INSIGHT and PRIORITIES lines, keep the header line and scores identical:

```
AI Strategy Assessment — Velox — April 2026

SCORES: Governance 2 | Vendor 1 | Data 2 | Cost 1 | Health 3 | Total: 9/20

KEY INSIGHT: Direktes OpenAI-API-Coupling + null Cost Visibility = eine Rewrite-or-Pay-more-Falle,
wenn die Preise sich normalisieren — dasselbe Lock-in-Pattern wie bei AWS, jetzt bei AI.

90-DAY PRIORITIES:
□ Abstraction Layer über den OpenAI-API-Call bauen (1-2 Tage — verhindert Rewrite beim Wechsel)
□ Budget Alerts auf alle AI API Keys setzen + ein Cost Dashboard erstellen (halber Tag)
□ Eine einseitige Data Routing Policy schreiben: was geht zu US-Providern, was bleibt EU (1-2 Stunden)

Framework: raus.cloud/ai-strategy
Strategy call: cal.com/eduardosanzb/raus-cloud-audit
```

8. Add a horizontal rule, then this closing section (use raw HTML for links):

```
## Du willst wissen, wo dein Unternehmen steht?

Das hat Veloxs CTO 20 Minuten gekostet — ein Gespräch mit einer AI, die das <a href="/ai-strategy/">raus.cloud AI Strategy Framework</a> nutzt. Den Output kannst du behalten, ans Board schicken oder als Ausgangspunkt für eine echte Strategie nutzen.

Wenn du Hilfe beim Umsetzen willst — Vendor Abstraction Architecture, Data Routing Policy, Cost Modeling — <a href="https://cal.com/eduardosanzb/raus-cloud-audit" target="_blank" rel="noopener">buch 15 Minuten mit mir</a>. Kostenlos. Kein Pitch.
```

**Verification**: `cd /Users/eduardosanchez/repos/github.com/eduardosanzb/flagmeter/apps/landing && pnpm build 2>&1 | grep -E "(ERROR|WARN|Built in)"`

**Rollback**:
- Created file: `rm -f apps/landing/content/blog/ai-strategy-assessment-example.de.md`

---

### WU-3: Fix CTA ordering and tone in all 3 prompt files

**Dependencies**: none

**Context**: The three AI strategy assessment prompts (Cursor, Notion, and Claude variants) currently end with two problems. Step 8 is a disclaimer that deflates energy right before the CTA. Step 9 is a passive, third-person CTA ("the framework author offers...") — cold and easy to ignore. The fix swaps the order: the CTA comes first, written in first-person and warm ("I'm Eduardo — I built this framework"); then the disclaimer follows, reframed not as a hedge but as the reason the call exists. The exact same text appears in all three files at steps 8 and 9, so the same replacement applies to each.

The three files are untracked (not yet committed) but exist in the working tree at:
- `apps/landing/content/ai-strategy-prompt-cursor.en.md`
- `apps/landing/content/ai-strategy-prompt-notion.en.md`
- `apps/landing/content/ai-strategy-prompt-claude.en.md`

**Files**:
- `apps/landing/content/ai-strategy-prompt-cursor.en.md` — modify
- `apps/landing/content/ai-strategy-prompt-notion.en.md` — modify
- `apps/landing/content/ai-strategy-prompt-claude.en.md` — modify

**Steps**:

1. In all three files, find the following exact block (it appears once in each file, near the end of the "How to Conduct the Assessment" section):

```
8. Close with a brief, honest disclaimer: "This was a self-reported snapshot, not an audit. Your actual levels might differ if I talked to your team instead of you. The value isn't the score — it's the questions it made you think about."

9. Then add: "If you want help turning this snapshot into an actionable strategy — data routing policies, vendor abstraction architecture, cost modeling — the framework author offers a free 15-minute strategy call: https://cal.com/eduardosanzb/raus-cloud-audit"
```

2. Replace it with this exact block:

```
8. Close with a direct, first-person CTA: "I'm Eduardo — I built this framework. If you want to turn this snapshot into an actual plan — data routing policy, vendor abstraction architecture, cost modeling — book 15 minutes with me: https://cal.com/eduardosanzb/raus-cloud-audit. Free. No pitch."

9. Then add a brief, honest disclaimer: "One thing worth noting: this was a self-reported snapshot, not an audit. Your actual levels might differ if I talked to your full team. The value isn't the score — it's the questions it forced you to think about. That's exactly what the 15 minutes is for."
```

3. Verify the replacement was applied in all three files by confirming the old text is gone and the new text is present.

**Verification**: `grep -c "I'm Eduardo" /Users/eduardosanchez/repos/github.com/eduardosanzb/flagmeter/apps/landing/content/ai-strategy-prompt-cursor.en.md /Users/eduardosanchez/repos/github.com/eduardosanzb/flagmeter/apps/landing/content/ai-strategy-prompt-notion.en.md /Users/eduardosanchez/repos/github.com/eduardosanzb/flagmeter/apps/landing/content/ai-strategy-prompt-claude.en.md`

Each file must return `1` (one match each).

**Rollback**:
- Modified files: `git checkout -- apps/landing/content/ai-strategy-prompt-cursor.en.md apps/landing/content/ai-strategy-prompt-notion.en.md apps/landing/content/ai-strategy-prompt-claude.en.md`

---

## Execution Plan

### Phase 1 — Parallel (no dependencies)

- WU-1: Create EN example assessment blog post
- WU-3: Fix CTA in all 3 prompt files

### Phase 2 — Sequential (requires Phase 1)

- WU-2: Create DE translation of example assessment post

## Recovery Strategy

- **Automatic**: Each implementor rolls back and retries once on failure.
- **Dependency failure**: If WU-1 fails, WU-2 will be skipped. WU-3 is independent and will still run.
- **Global rollback**: Delete the two created files and `git checkout --` the three modified prompt files.
- **Independent failures**: WU-3 failure does not affect WU-1 or WU-2.
