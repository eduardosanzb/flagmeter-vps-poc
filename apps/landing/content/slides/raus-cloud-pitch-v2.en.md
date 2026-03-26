---
title: "raus.cloud — Conference Pitch"
description: "10-slide conference deck — responsible architecture, unbundled from hyperscalers"
slides:
  - number: 1
    type: hero
    title: "RAUS.CLOUD"
    subtitle: "Responsible Architecture. Unbundled from Hyperscalers."
    bullets:
      - "Cost"
      - "People"
      - "Sovereignty"
    cta: "raus.cloud --schedule --free-audit"

  - number: 2
    type: one-thing
    statement: "The dependency doesn't stop at your servers. It hardens into how your team works, how you hire, and how you make decisions."
    tagline: "Infrastructure lock-in is a people problem disguised as a technology problem."

  - number: 3
    type: icon-grid
    label: "Why It Matters"
    title: "FOUR WAYS IT COMPOUNDS"
    subtitle: "Hyperscaler dependency doesn't stay in your infrastructure. It spreads."
    items:
      - icon: "chain"
        heading: "Dependency Hardens"
        body: "Starts at servers. Spreads to tooling, hiring, and ways of working. Exits become exponentially more expensive every quarter."
      - icon: "banknote"
        heading: "Runway Bleeds"
        body: "€200/mo → €2k → €8k. Each increase felt justified. None were reviewed. Your seed round is funding AWS margins."
      - icon: "clock"
        heading: "Teams Slow Down"
        body: "Engineers debug IAM policies instead of shipping product. 25-minute deploys. Every hotfix is a negotiation with the platform."
      - icon: "alert"
        heading: "Exposure Grows"
        body: "One engineer holds the mental model. Their burnout is your company's 48-hour outage waiting to happen."

  - number: 4
    type: diagnostic
    label: "The Question"
    title: "ONE QUESTION."
    prompt: '"Who owns your PagerDuty rotation for infrastructure?"'
    outcomes:
      - answer: '"We all do"'
        result: "Democratised incompetence. Alert fatigue. No ownership."
      - answer: '"The senior dev"'
        result: "Bus factor = 1. Their burnout is your company risk."
    conclusion: "Both answers mean you're one resignation away from a 48-hour outage."

  - number: 5
    type: one-thing
    label: "The Barrier"
    statement: "The hyperscaler narrative is fear disguised as best practice."
    tagline: '"Everyone uses it" is not an architecture decision. It is learned helplessness.'

  - number: 6
    type: two-col
    label: "The Barrier"
    title: "WHAT THEY SAY VS WHAT HAPPENS"
    subtitle: "How the narrative becomes your technical debt."
    col_a:
      heading: "The Narrative"
      items:
        - "Infinite scale on demand"
        - "Industry best practice"
        - "Everyone uses it"
        - "Built-in security"
        - "You need the managed services"
    col_b:
      heading: "The Reality"
      items:
        - "You pay for scale you will never need"
        - "Lock-in disguised as convention"
        - "Fear of alternatives, not evidence"
        - "Security complexity your team cannot explain"
        - "Dependencies that compound every quarter"

  - number: 7
    type: pyramid
    label: "What Changes"
    title: "THE TRANSFORMATION"
    subtitle: "Simplicity unlocks compounding advantages. Each layer enables the next."
    peak: "GROWTH"
    layers:
      - label: "Knowledge"
        description: "Simplicity spreads ownership. Every engineer can read and run the stack. The bus factor becomes the whole team."
      - label: "Features"
        description: "Budget reclaimed from cloud waste funds product development. Your roadmap grows, not your AWS bill."
      - label: "Financial"
        description: "60% cost reduction. Runway extended. Pressure lifts. You can hire, experiment, and breathe."

  - number: 8
    type: icon-grid
    label: "The Outcome"
    title: "THREE KINDS OF GROWTH"
    subtitle: "Not just cost savings — compounding competitive advantage."
    items:
      - icon: "trending-up"
        heading: "Financial Growth"
        body: "More runway means more experiments, more hires, more initiatives. The money you save compounds into decisions you could not make before."
      - icon: "clock"
        heading: "Speed Growth"
        body: "When you own your stack, you move fast without fear. Deploy on Friday. Test new ideas. Fail cheap. Iterate."
      - icon: "shield"
        heading: "Confidence Growth"
        body: "Reduced bus factor. Independent from the hyperscaler narrative. Not afraid to evaluate better tools when they emerge."
      - icon: "users"
        heading: "Knowledge Growth"
        body: "Engineering understanding spreads across the team. Your collective expertise — not vendor expertise — becomes your competitive moat."

  - number: 9
    type: proof
    label: "Proof"
    title: "PROOF"
    subtitle: "Results that speak for themselves."
    cases:
      - client: "Series A SaaS client"
        result: "€70k/year saved"
        body: "Fixed a single CloudWatch log retention policy. The kind of waste that hides in plain sight when no one owns infrastructure."
      - client: "FlagMeter (reference architecture)"
        result: "€7.59/mo for 500+ RPS"
        body: "Production-tested blueprint on Hetzner VPS + Docker Compose + Cloudflare. Full stack: monitoring, logging, load testing."

  - number: 10
    type: cta
    label: "Next Step"
    title: "START FREE."
    subtitle: "Free architecture audit. 15 minutes. I'll find €2k+/month in waste — or you delete my number."
    website: "raus.cloud"
    email: "hello@raus.cloud"
    tagline: "Right-sized infrastructure. Business-first. No lock-in. All yours after 90 days."
---
