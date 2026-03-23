---
title: "Slide Types Demo"
description: "Internal reference — one example of every slide type"
nodeck: true
slides:
  - number: 1
    type: hero
    title: "RAUS.CLOUD"
    subtitle: "Infrastructure that serves your business. Not the other way around."
    bullets:
      - "60% cost cut"
      - "Your team owns it in 2 days"
      - "We fire ourselves after 90 days"
    cta: "raus.cloud --audit --free"

  - number: 2
    type: context
    label: "The Problem"
    title: "THE BILL DOESN'T SPIKE. IT CREEPS."
    statements:
      - "€200/mo → €2k → €8k. Each increase felt justified. None were reviewed."
      - "One engineer holds the mental model. They leave — your MTTR becomes unknown."
      - "Your team ships features around infra constraints. Not around business goals."
    tagline: "Less dependency. More runway. Same performance."

  - number: 3
    type: two-col
    title: "IS THIS FOR YOU?"
    subtitle: "Be honest with yourself."
    col_a:
      heading: "✓ This IS for you"
      items:
        - "5–15 person engineering team"
        - "Shipping speed matters"
        - "You control your own stack"
        - "Monthly infra bill feels too high"
    col_b:
      heading: "✗ This is NOT for you"
      items:
        - "Need multi-region Kubernetes"
        - "100+ engineers, dedicated SRE"
        - "SOC2 Type II required now"
        - "Enterprise compliance mandates"

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
    type: table
    label: "The Real Cost"
    title: "THE REAL COST"
    subtitle: "It doesn't just cost money. It damages your whole business."
    rows:
      - icon: "💸"
        category: "Financial"
        pain: "€80k/yr on engineers debugging IAM instead of shipping product"
      - icon: "🚀"
        category: "Speed"
        pain: "25-min deploys. Hotfixes wait 38 minutes live."
      - icon: "🧠"
        category: "Knowledge"
        pain: "One person holds the mental model. They leave: MTTR = unknown."
      - icon: "📈"
        category: "Growth"
        pain: "Engineers learn AWS IAM instead of your product domain."

  - number: 6
    type: layers
    title: "LAYERS OF DAMAGE"
    subtitle: "Each layer compounds the one above it."
    layers:
      - number: 1
        category: "Financial"
        description: "€70–90k/yr in engineering time spent on infra overhead."
      - number: 2
        category: "Speed"
        description: "Features delayed by infra complexity. Deploys take 25 minutes."
      - number: 3
        category: "Risk"
        description: "Bus factor = 1. One resignation triggers a 48-hour outage."

  - number: 7
    type: stat-grid
    title: "THE HIDDEN NUMBERS"
    subtitle: "Three metrics your CFO doesn't see yet."
    stats:
      - value: "€80k"
        label: "annual shadow ops cost"
      - value: "38 min"
        label: "avg hotfix deploy time"
      - value: "1"
        label: "engineer with full context"
    details:
      - heading: "The Hidden DevOps Payroll"
        body: "Engineers spend 30% of their time on infra, not product features."
      - heading: "The Speed Tax"
        body: "Every deploy is a 25-minute gamble. Hotfixes are worse."

  - number: 8
    type: code-block
    label: "The Solution"
    title: "THE SOLUTION"
    subtitle: "Right-sized. Simple when possible. Complex only when proven necessary."
    code: |
      $ cat stack.yml
      # ~€100/mo per environment
      Hetzner CPX51 VPS         €50/mo
      ├─ Docker Compose your apps
      ├─ Cloudflare Tunnel       free
      ├─ Managed Postgres        €30/mo
      └─ Uptime Kuma monitoring  free
    bullets:
      - value: "60%"
        label: "infra cost reduction"
      - value: "90s"
        label: "deploy time (was 25 min)"
      - value: "1 page"
        label: "the entire runbook"
    footer: "No IAM. No YAML hell. No vendor lock-in."

  - number: 9
    type: timeline
    label: "How We Do It"
    title: "HOW WE DO IT"
    subtitle: "3-week strangler fig migration. We don't rip-and-replace."
    weeks:
      - number: "01"
        heading: "Audit + Setup"
        items:
          - "Free architecture audit"
          - "Identify €2k+/mo waste"
          - "Provision staging environment"
          - "Terraform/VPS ready"
      - number: "02"
        heading: "Migrate + Pair"
        items:
          - "Migrate 1–3 services"
          - "Pair with your team"
          - "Staging fully validated"
          - "Runbook drafted"
      - number: "03"
        heading: "Cutover + Handoff"
        items:
          - "Production cutover"
          - "2-day team training"
          - "Runbook delivered"
          - "90-day support available"
    footer: "Deploy: git push. Debug: docker logs -f. Scale: docker-compose up --scale app=3"

  - number: 10
    type: promise
    label: "The Promise"
    title: "THE PROMISE"
    subtitle: "Three commitments. No asterisks."
    promises:
      - value: "60%"
        heading: "Cost cut."
        body: "Right-sized infrastructure, not peak-capacity overkill. From €8–15k/mo down to €3k/mo."
      - value: "2 days"
        heading: "Your team owns it."
        body: "git push to deploy. docker logs to debug. Any engineer can run it from day one."
      - value: "90 days"
        heading: "We fire ourselves."
        body: "All configs in your GitHub. After 90 days we're just a Slack DM you hopefully never need."

  - number: 11
    type: feature-list
    title: "WHAT YOU GET"
    subtitle: "Everything included. Nothing proprietary."
    features:
      - heading: "Business-First Architecture"
        body: "Designed around your goals, not cloud vendor defaults."
      - heading: "Zero Lock-In"
        body: "Standard tools. Every config lives in your GitHub."
      - heading: "Full Transparency"
        body: "We explain every decision. No black boxes."
      - heading: "Team Ownership"
        body: "Any engineer can deploy, debug, and scale after 2 days."

  - number: 12
    type: pricing
    title: "ENGAGEMENTS"
    subtitle: "Start free. Pay only when it works."
    tiers:
      - number: "01"
        name: "Architecture Audit"
        description: "Find €2k+/mo waste in 15 minutes."
        price: "Free"
        duration: "15 min call"
      - number: "02"
        name: "Migration Sprint"
        description: "3-week strangler fig migration."
        price: "€8k"
        duration: "3 weeks"
      - number: "03"
        name: "90-Day Guarantee"
        description: "On-call support while your team settles in."
        price: "€2k/mo"
        duration: "3 months"

  - number: 13
    type: proof
    label: "Proof"
    title: "PROOF"
    subtitle: "Results that speak for themselves."
    cases:
      - client: "Series A SaaS client"
        result: "€70k/year saved"
        body: "Fixed a single CloudWatch log retention policy. The kind of waste that hides in plain sight."
      - client: "FlagMeter (reference architecture)"
        result: "€7.59/mo for 500+ RPS"
        body: "Production-tested blueprint on Hetzner VPS + Docker Compose + Cloudflare."

  - number: 14
    type: steps
    title: "HOW TO ENGAGE"
    subtitle: "No sales process. Just a conversation."
    tagline: "You're a peer, not a prospect."
    steps:
      - number: 1
        action: "ASK"
        description: '"What was your biggest infra fire last month?"'
      - number: 2
        action: "DIAGNOSE"
        description: "I tell you if I've seen it before. (I probably have.)"
      - number: 3
        action: "AUDIT"
        description: "Free 15-min X-ray of your current setup."
      - number: 4
        action: "DECIDE"
        description: "You decide if it's worth going further."

  - number: 15
    type: conversation
    label: "How It Works"
    title: "THIS IS HOW A CONVERSATION USUALLY GOES."
    tagline: "No deck. No proposal. No pressure."
    steps:
      - number: 1
        description: "You tell me your biggest infra headache last month."
      - number: 2
        description: "I tell you if I've seen it before. (I probably have.)"
      - number: 3
        description: "I offer a free 15-min X-ray of your setup."
      - number: 4
        description: "You decide if it's worth going further."

  - number: 16
    type: cta
    label: "Next Step"
    title: "START FREE."
    subtitle: "Free architecture audit. 15 minutes. I'll find €2k+/month in waste — or you delete my number."
    website: "raus.cloud"
    email: "hello@raus.cloud"
    tagline: "Right-sized infrastructure. Business-first. No lock-in. All yours after 90 days."

  - number: 17
    type: quote
    quote: "Infrastructure that serves your business. Not the other way around."
    attribution: "Eduardo Sanchez, raus.cloud"
    context: "What every engineering team deserves."

  - number: 18
    type: one-thing
    statement: "One resignation away from a 48-hour outage."
    tagline: "That's the real bus factor."
---
