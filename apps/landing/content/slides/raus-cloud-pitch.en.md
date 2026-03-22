---
title: "raus.cloud Infrastructure Consulting"
description: "14-slide pitch deck — infrastructure that serves your business, not the other way around"
slides:
  - number: 1
    type: hero
    label: ""
    title: "RAUS.CLOUD — INFRASTRUCTURE CONSULTING"
    subtitle: "Infrastructure that serves your business. Not the other way around."
    bullets:
      - "60% cost cut"
      - "2-day team ownership"
      - "We fire ourselves after 90 days"
    cta: "raus.cloud --audit --free"

  - number: 2
    type: two-col
    label: Ideal Customer
    title: "IDEAL CUSTOMER"
    subtitle: "Is this you?"
    col_a:
      heading: "✓ This IS for you"
      items:
        - "5-15 engineers on your team"
        - "One dev is the 'ops person' by default"
        - "Cloud bill keeps you up at night"
        - "You've got product-market fit"
        - "Infra costs >15% of burn"
    col_b:
      heading: "✗ This is NOT for you"
      items:
        - "You need multi-region failover TODAY"
        - "You enjoy writing Terraform"
        - "You think Kubernetes is 'simple'"
        - "Pre-traction startup (use Heroku)"

  - number: 3
    type: terminal
    label: Diagnostic
    title: "One question."
    prompt: '"Who owns your PagerDuty rotation for infrastructure?"'
    outcomes:
      - answer: '"We all do"'
        result: "Democratised incompetence. Alert fatigue. No ownership."
      - answer: '"The senior dev"'
        result: "Bus factor = 1. Burnout risk = company risk."
    conclusion: "Both answers mean you're one resignation away from a 48-hour outage."

  - number: 4
    type: diagnosis
    label: The Diagnosis
    title: "THE DIAGNOSIS"
    subtitle: "You're not bad at ops. You've built a system that needs a DevOps team — without hiring one. That's the trap."
    cases:
      - answer: '"We all do"'
        tag: "Complexity > ownership capacity"
        description: "Everyone is on-call. Nobody is responsible. Alerts become noise. Incidents become sprints."
      - answer: '"The senior dev"'
        tag: "Complexity > knowledge transfer"
        description: "One person holds the mental model. Not a people problem — a system design problem."
    conclusion: "Root cause: System complexity has outpaced your team structure. The fix isn't adding headcount. It's killing the complexity."

  - number: 5
    type: layers
    label: The Problem
    title: "THE PROBLEM"
    subtitle: "That's just Layer 1. Your PagerDuty answer reveals a cascade. It doesn't just cost money — it damages your entire business."
    layers:
      - number: 1
        category: Financial
        description: "€70k-90k/yr on engineers debugging IAM instead of shipping product"
      - number: 2
        category: Customer
        description: "25-min deploys through 7 services — hotfixes wait 38 minutes live"
      - number: 3
        category: Process
        description: "One person understands the stack. If they leave: MTTR = unknown"
      - number: 4
        category: Growth
        description: "Engineers learn AWS IAM instead of your product & customer domain"

  - number: 6
    type: stat-grid
    label: Financial Damage
    title: "FINANCIAL DAMAGE"
    subtitle: "The numbers behind the pain"
    stats:
      - value: "€80k"
        label: "avg. annual cost of infra shadow ops"
      - value: "38 min"
        label: "wait time for a one-line hotfix"
      - value: "2%"
        label: "CPU utilisation on the €0.18/h fleet"
    details:
      - heading: "The Hidden DevOps Payroll"
        body: "Last week's incident: 3 working days (≈€1,200 salary) lost because a new IAM condition key silently broke a Terraform plan. The feature release slipped a full sprint."
      - heading: "The Perpetual Peak-Capacity Bill"
        body: "Your Black Friday spike lasted 3 hours. The same c5.2xlarge fleet idled the rest of the month at 2% CPU — costing €0.18/CPU-hour instead of €0.02."

  - number: 7
    type: code-block
    label: The Solution
    title: "THE SOLUTION"
    subtitle: "The Right-Sized Stack"
    tagline: "Simple when possible. Complex only when proven necessary."
    code: |
      $ cat stack.yml
      # €85-120/mo per environment
      Hetzner CPX51 VPS         €50/mo
      ├─ Docker Compose your apps
      ├─ Cloudflare Tunnel       zero-trust
      ├─ Managed Postgres        €30/mo
      ├─ S3-compat storage       €5/mo
      └─ Uptime Kuma monitoring  free
    bullets:
      - value: "60%"
        label: "infra cost reduction"
      - value: "90s"
        label: "deploy time (was 25 min)"
      - value: "1 page"
        label: "the entire runbook"
    footer: "No IAM. No YAML hell. No vendor lock-in."

  - number: 8
    type: timeline
    label: How We Do It
    title: "HOW WE DO IT"
    subtitle: "3-Week Strangler Fig Migration"
    tagline: "We don't rip-and-replace. We migrate safely, alongside production."
    weeks:
      - number: "01"
        heading: "Audit + Setup"
        items:
          - "Free architecture audit"
          - "Identify €2k+/mo waste"
          - "Terraform/VPS provisioning"
          - "Staging environment ready"
      - number: "02"
        heading: "Migrate + Pair"
        items:
          - "Migrate 1-3 services"
          - "Pair with your team"
          - "Staging fully validated"
          - "Runbook drafted"
      - number: "03"
        heading: "Cutover + Handoff"
        items:
          - "Production cutover"
          - "Team training (2 days)"
          - "Runbook delivered"
          - "90-day insurance available"
    footer: "The Runbook: one page. Deploy: git push. Debug: docker logs -f. Scale: docker-compose up --scale app=3"

  - number: 9
    type: promise
    label: The Promise
    title: "THE PROMISE"
    subtitle: "Three commitments. No asterisks."
    promises:
      - value: "60%"
        heading: "Cost cut."
        body: "Right-sized infrastructure, not peak-capacity overkill. Target: from €8-15k/mo down to €3k/mo."
      - value: "2 days"
        heading: "Your team owns it."
        body: "git push to deploy. docker logs to debug. Any engineer on your team can run it from day one."
      - value: "90 days"
        heading: "We fire ourselves."
        body: "All configs in your GitHub. After 90 days, we're just a Slack DM you hopefully never need."

  - number: 10
    type: feature-list
    label: Differentiation
    title: "DIFFERENTIATION"
    subtitle: "Why we're not another cloud consultant"
    features:
      - heading: "Business-First Architecture"
        body: "We design around your business needs, not vendor preferences. VPS for predictability, hybrid when needed, multi-cloud only when proven."
      - heading: 'The "Fire Ourselves" Promise'
        body: "Every config lives in your GitHub repo. After 90 days you never need us. No consultant says this — because it proves we're on your side."
      - heading: "Right-Sized Philosophy"
        body: "Simple when possible. Complex only when proven necessary. We'll tell you honestly if you actually need Kubernetes. (You probably don't.)"
      - heading: "Zero Vendor Lock-In"
        body: "All configs in your repo. git push to deploy. docker logs to debug. Your team can run it without us from day one."

  - number: 11
    type: pricing
    label: Engagement Model
    title: "ENGAGEMENT MODEL"
    subtitle: "Start free. Pay for outcomes. Bill for results, not hours. We cut your infra costs by €36k/year — justifies the investment."
    tiers:
      - number: "01"
        name: "Architecture Audit"
        description: "Comprehensive assessment. I'll find €2k+/mo waste or you delete my number."
        price: "Free"
        duration: "15 min call"
      - number: "02"
        name: "Pilot Migration"
        description: "Migrate 1-3 services. Prove cost cuts before any further commitment."
        price: "€3k"
        duration: "1 week"
      - number: "03"
        name: "Full Migration"
        description: "Complete cutover + team training + runbook delivery. Pricing based on scope."
        price: "Custom"
        duration: "3 weeks"
      - number: "04"
        name: "Insurance"
        description: "Emergency pager duty. After 90 days, you're completely free."
        price: "€500/mo"
        duration: "90 days opt."

  - number: 12
    type: proof
    label: Proof
    title: "PROOF"
    subtitle: "Results that speak for themselves"
    cases:
      - client: "Unity (SaaS client)"
        result: "€70k/year saved"
        body: "Fixed a single CloudWatch log retention policy. The kind of waste that hides in plain sight when no one owns infrastructure."
      - client: "FlagMeter (Reference Architecture)"
        result: "€7.59/mo for 500+ RPS"
        body: "Production-tested blueprint running on Hetzner VPS + Docker Compose + Cloudflare. Complete stack: monitoring, logging, load testing."

  - number: 13
    type: steps
    label: Pitch Toolkit
    title: "PITCH TOOLKIT"
    subtitle: "The 5-step anti-sales engineer flow"
    tagline: "You're a peer with a flashlight — not a salesperson."
    steps:
      - number: 1
        action: "ASK"
        description: '"What''s your biggest infra fire last month?" Listen. Don''t interrupt.'
      - number: 2
        action: "DIAGNOSE"
        description: '"That sounds like [X]. Usually a symptom of [Y]." Show pattern recognition.'
      - number: 3
        action: "QUESTION"
        description: '"Have you looked at the NAT Gateway line item?" Specific = credibility.'
      - number: 4
        action: "OFFER"
        description: '"I can X-Ray it for free. 15 min. Want to see?" Low pressure entry point.'
      - number: 5
        action: "EXIT"
        description: '"Cool. DM me your Calendly or I''ll DM you mine." Hand them control.'

  - number: 14
    type: cta
    label: Next Step
    title: "NEXT STEP"
    subtitle: "15-min architecture audit. Free. No pitch. I'll find €2k+/month in waste — or you delete my number."
    website: "raus.cloud"
    email: "hello@raus.cloud"
    tagline: "Right-sized infrastructure. Business-first decisions. No lock-in."
---
