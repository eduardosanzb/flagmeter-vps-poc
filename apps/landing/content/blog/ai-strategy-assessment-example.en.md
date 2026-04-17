---
title: "What an AI Strategy Snapshot Looks Like: A Complete Example"
date: 2026-04-16
description:
  "Curious what you'd get from an AI strategy assessment? Here's a complete example — real scores, real
  insights, real next steps — for a fictional 42-person German SaaS."
author: "Eduardo Sanchez"
categories: ["Case Studies"]
tags: ["ai-strategy", "ai-governance", "european-saas", "gdpr", "vendor-lock-in"]
draft: true
---

_Curious what you'd actually get from running the AI Strategy Assessment? Here's a complete output — every
score, the synthesis, the priorities — for a fictional European tech company. No fluff. Just the framework
doing its job._

---

## The Company: Velox

**42 people. 14 engineers. B2B project management SaaS. Berlin.**

Series A closed 8 months ago. Growth is fast. The CTO got asked in a board meeting: _"What's our AI
strategy?"_ She gave an honest answer: _"Everyone's using it, but we haven't formalized anything yet."_

That's exactly who this assessment is for.

**Current AI footprint:**

- GitHub Copilot on all 14 engineering seats
- ChatGPT Team plan for the whole company (42 seats)
- One engineer calling the OpenAI API directly for a smart-search feature — personal API key, billed to the
  company card

---

## The Snapshot

```
┌─────────────────────────────────────────┐
│  AI STRATEGY SNAPSHOT                   │
│  Velox — April 2026                     │
├─────────────────────────────────────────┤
│                                         │
│  Governance    ██░░  Level 2  Mandate   │
│  Vendor Dep.   █░░░  Level 1  Coupled   │
│  Data Sov.     ██░░  Level 2  Aware     │
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

---

## What the Numbers Mean

A **9/20 — Partially Governed** is the most common result for a European SaaS at Series A. Not chaos, not
strategy. You've adopted AI, you're getting value from it, and you haven't hit a wall yet.

The wall is coming.

The dangerous combination here isn't any single low score. It's **Vendor Dependency at 1** and **Cost
Visibility at 1**, sitting next to each other.

Here's what that means in practice: Velox is building a feature directly on OpenAI's API with no abstraction
layer, on subsidized pricing the provider has explicitly said won't last. When pricing normalizes —
historically a 3-5x increase — there's no escape route. Switching means rewriting. And because there's no cost
visibility, nobody knows what they'd even be switching from. The number is invisible.

That's the same pattern that caught companies off guard with AWS. You build on what's cheap. You don't
abstract because _"why would we?"_ The pricing changes. The exit cost is a rewrite.

**Team Health at 3 is the bright spot.** The team has worked through the early AI tension — enthusiasts and
skeptics found a way to coexist. That's rare, and it's the foundation everything else needs to be built on.

---

## Assessment Receipt

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

---

## Want to Know Where Your Company Sits?

This took Velox's CTO 20 minutes — one conversation with an AI using the <a href="/ai-strategy/">raus.cloud AI
Strategy framework</a>. The output is yours to keep, share with your board, or use as the starting point for
an actual strategy.

If you want help turning your snapshot into a plan — vendor abstraction architecture, data routing policy,
cost modeling — <a href="https://cal.com/eduardosanzb/raus-cloud-audit" target="_blank" rel="noopener">book 15
minutes with me</a>. Free. No pitch.
