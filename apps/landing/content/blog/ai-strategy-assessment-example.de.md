---
title: "So sieht ein AI Strategy Snapshot aus: Ein vollständiges Beispiel"
date: 2026-04-16
description:
  "Neugierig, was du bei einem AI Strategy Assessment bekommst? Hier ist ein vollständiges Beispiel — echte
  Scores, echte Insights, echte nächste Schritte — für ein fiktives 42-köpfiges deutsches SaaS."
author: "Eduardo Sanchez"
categories: ["Case Studies"]
tags: ["ai-strategy", "ai-governance", "european-saas", "gdpr", "vendor-lock-in"]
draft: true
---

_Neugierig, was du beim AI Strategy Assessment wirklich bekommst? Hier ist ein vollständiges Output — alle
Scores, die Synthese, die Priorities — für ein fiktives europäisches Tech-Unternehmen. Kein Bullshit. Nur das
Framework, das seinen Job macht._

---

## Das Unternehmen: Velox

**42 Leute. 14 Engineers. B2B Project-Management-SaaS. Berlin.**

Series A vor 8 Monaten geschlossen. Starkes Wachstum. Die CTO wurde in einem Board-Meeting gefragt: _„Was ist
unsere AI-Strategie?"_ Ihre ehrliche Antwort: _„Alle nutzen es, aber wir haben noch nichts formalisiert."_

Genau für diese Situation ist das Assessment gemacht.

**Aktueller AI-Footprint:**

- GitHub Copilot auf allen 14 Engineering-Seats
- ChatGPT Team für das ganze Unternehmen (42 Seats)
- Ein Engineer ruft die OpenAI API direkt für ein Smart-Search-Feature auf — persönlicher API-Key, über die
  Firmenkarte abgerechnet

---

## Der Snapshot

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

---

## Was die Zahlen bedeuten

**9/20 — Partially Governed** ist das häufigste Ergebnis für ein europäisches SaaS auf Series-A-Level. Kein
Chaos, keine Strategie. AI wird genutzt, es bringt was — und die Wand ist noch nicht in Sicht.

Die Wand kommt.

Die gefährliche Kombination ist nicht ein einzelner niedriger Score. Es ist **Vendor Dependency auf 1** und
**Cost Visibility auf 1**, die nebeneinander stehen.

Was das in der Praxis bedeutet: Velox baut ein Feature direkt auf der OpenAI API — ohne Abstraction Layer, auf
subventionierten Preisen, von denen der Provider selbst sagt, dass sie nicht lange halten. Wenn die Preise
sich normalisieren — historisch ein 3-5x-Anstieg — gibt es keinen Exit-Plan. Wechseln bedeutet Rewrite. Und
weil es kein Cost Visibility gibt, weiß niemand, von welcher Zahl aus man überhaupt wechseln würde. Die Zahl
ist unsichtbar.

Das ist dasselbe Pattern, das viele Unternehmen bei AWS erwischt hat. Du baust auf dem, was billig ist. Du
abstrahierst nicht, weil _„warum sollten wir?"_ Die Preise ändern sich. Der Exit kostet einen Rewrite.

**Team Health auf 3 ist der Lichtblick.** Das Team hat die frühe AI-Spannung überwunden — Enthusiasten und
Skeptiker haben einen Weg gefunden, zusammenzuarbeiten. Das ist selten, und es ist die Grundlage, auf der
alles andere aufgebaut werden muss.

---

## Assessment Receipt

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

---

## Du willst wissen, wo dein Unternehmen steht?

Das hat Veloxs CTO 20 Minuten gekostet — ein Gespräch mit einer AI, die das <a href="/ai-strategy/">raus.cloud
AI Strategy Framework</a> nutzt. Den Output kannst du behalten, ans Board schicken oder als Ausgangspunkt für
eine echte Strategie nutzen.

Wenn du Hilfe beim Umsetzen willst — Vendor Abstraction Architecture, Data Routing Policy, Cost Modeling —
<a href="https://cal.com/eduardosanzb/raus-cloud-audit" target="_blank" rel="noopener">buch 15 Minuten mit
mir</a>. Kostenlos. Kein Pitch.
