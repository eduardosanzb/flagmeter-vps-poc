---
title: "Infrastructure Without DevOps"

sections:
  - who_we_are
  - how_it_works
  - sovereignty
  - principles
  - pillars
  - blog_posts
  - pricing
  - faq

hero:
  title: "Fire your cloud provider. Keep your runway."
  subtitle: "European B2B SaaS teams pay €8k+/month for infrastructure they can't leave. We cut costs 60%, move your data to EU jurisdiction, and hand your team a stack they fully own — in 90 days."
  cta_primary: "Get Free Audit"
  cta_secondary: "See How It Works"

who_we_are:
  title: "We're engineers who've been there"
  subtitle: "Built in the trenches, not in theory"
  items:
    - title: "Engineers First"
      description: "We've shipped production systems at scale and watched vendor dependency destroy teams. We proved a €7.59/month EU VPS handles 500+ RPS because the alternative actually works."
    - title: "Cloud Skeptics"
      description: "We've seen €8k/month AWS bills for 100 RPS. We've seen the one engineer who understood CloudFormation quit. Vendor dependency is a business risk. We treat it like one."
    - title: "Disappearing Act"
      description: "After 90 days, every config is in your repo, every tool is standard, every decision is yours. Deploy, debug, scale — without us, without AWS, without anyone's permission."

how_it_works:
  title: "Three steps to independence"
  subtitle: "From vendor dependency to full ownership in weeks, not quarters"
  items:
    - number: "01"
      title: "Free Independence Audit (1-2 hours)"
      description: "We map your infrastructure, vendor dependencies, and data residency gaps. You see what staying costs and what freedom looks like. No pitch, no obligation."
    - number: "02"
      title: "Pilot Migration (€3k, 1 week)"
      description: "Migrate 1-3 services to sovereign EU infrastructure. Eliminate your first vendor dependency. Prove the savings before committing to the full stack."
    - number: "03"
      title: "Full Migration (Custom pricing)"
      description: "Complete operational independence. Your team trained to deploy, debug, and scale without us. Every config in your repo. Runbook delivered. We disappear."

sovereignty:
  title: "Why operational sovereignty matters"
  subtitle: "Vendor dependency isn't just expensive. It's a business risk."
  items:
    - title: "Shield Your Runway"
      description: "AWS raised egress pricing 3x in 2024. Even after Hetzner's recent adjustment, you're paying 10x less than equivalent AWS. More importantly: standard Docker means you can move to any provider in hours. Your runway isn't held hostage by anyone."
      icon: "shield"
    - title: "Your Data. EU Jurisdiction."
      description: "All infrastructure in EU data centers. GDPR-compliant by default. No US CLOUD Act exposure. Your customers' data never crosses a border without your explicit decision."
      icon: "globe"
    - title: "Zero Lock-in. No Exceptions."
      description: "Every config lives in your GitHub repo. Standard Docker + PostgreSQL + Nginx — any engineer can run it. You're never one pricing change away from a crisis."
      icon: "unlock"
    - title: "Own Every Decision"
      description: "After 90 days: deploy with `git push`, debug with `docker logs`, scale without calling anyone. No vendor to negotiate with. No permission required."
      icon: "key"

principles:
  title: "How we work"
  subtitle: "Efficiency by design, independence by default"
  items:
    - title: "Business-First Architecture"
      description: "Every decision starts with: does this create dependency you don't want? VPS for predictability, hybrid when proven necessary. Your business drives the stack — not vendor incentives."
      icon: "chart-bar"
    - title: "No Recurring Meetings"
      description: "All updates in GitHub issues and PRs. Your team ships features, not attends standups."
      icon: "calendar-x"
    - title: "Async by Default"
      description: "Context in issues, reviews in PRs, decisions in comments. Work across timezones without friction."
      icon: "message-circle"
    - title: "We Fire Ourselves"
      description: "Every config goes in your repo. After 90 days, you don't need us — or any vendor. That's the contract."
      icon: "check-circle"

pillars:
  title: "What you get"
  subtitle: "Non-negotiables that define our deliverables"
  items:
    - title: "Resilient, Sovereign Architecture"
      description: "Proven at 500+ RPS on €7.59/month. EU data residency by default. No vendor lock-in. Infrastructure designed for your growth — not a hyperscaler's pricing model."
    - title: "Engineer Empowerment"
      description: "Deploy with `git push`, debug with `docker logs` — no IAM, no 7-service pipeline, no tribal knowledge. Your team owns production completely."
    - title: "Tests + Runbooks"
      description: "Every migration includes integration tests, health checks, and a single-page runbook. No bus factor. No knowledge that walks out the door."

blog_posts:
  title: "Real-world infrastructure stories"
  subtitle: "No theory. No vendor pitch. Just what actually happened when we tested it."

pricing:
  title: "Transparent pricing"
  subtitle: "You pay for outcomes. We measure success by your independence."
  items:
    - name: "Architecture Audit"
      price: "€0"
      description: "Comprehensive independence assessment"
      features:
        - "Map your vendor dependencies and lock-in risks"
        - "EU data residency gap analysis"
        - "Identify €2k+/month in immediate savings"
        - "No obligation, no pitch"
      cta: "Book Now"
      highlighted: false
    - name: "Pilot Migration"
      price: "€3k"
      description: "1-week proof of concept"
      features:
        - "Migrate 1-3 services to sovereign EU infrastructure"
        - "Eliminate your first vendor dependency"
        - "Demonstrate real cost savings before full commitment"
      cta: "Start Pilot"
      highlighted: false
    - name: "Full Migration"
      price: "Custom"
      description: "End-to-end operational independence"
      features:
        - "Complete migration to resilient, sovereign infrastructure"
        - "Team trained on deploys, debugging, and scaling"
        - "Runbook delivered. Keys handed over. We disappear."
      cta: "Let's Talk"
      highlighted: false

faq:
  title: "Frequently asked questions"
  subtitle: "Handling the objections, engineer to engineer"
  items:
    - question: "Why VPS over cloud?"
      answer: "VPS gives you predictable costs and operational independence. We pair it with Cloudflare for CDN and DDoS protection. No lock-in, no YAML hell, no vendor holding your architecture hostage."
    - question: "How does this scale?"
      answer: "Vertical scaling gets you to 50k users easily. If you hit that, we add read replicas — not before. Most 'scale' problems are premature optimization sold by vendors who profit from complexity."
    - question: "What's the catch?"
      answer: "We're not a fit if you need multi-region failover today or think Kubernetes is 'simple'. This is for teams who want to ship features, not manage infrastructure."
    - question: "What if the VPS dies?"
      answer: "We run two instances with a floating IP. Cheaper than one EC2 with redundancy, and failover is automatic. You own both instances and the failover config — no vendor to call."
    - question: "Won't investors freak out?"
      answer: "Hetzner is a €1B EU company with better uptime than most startups' AWS setups. This isn't a Pi under your desk — it's enterprise-grade infrastructure without the complexity tax."
    - question: "What about GDPR compliance?"
      answer: "All infrastructure stays in EU data centers. Hetzner is GDPR-compliant by default — no DPA negotiations with a US vendor. We can provide data processing agreements if needed."
    - question: "Aren't we trading AWS lock-in for Hetzner lock-in?"
      answer: "No. AWS lock-in means proprietary services (Lambda, RDS, IAM, CloudFormation) that only run on AWS. Our stack is Docker + standard PostgreSQL + Nginx. Same tools, any provider. You migrate in hours."
    - question: "What if Hetzner raises prices again?"
      answer: "Standard Docker Compose + PostgreSQL means you migrate to any VPS provider in hours, not weeks. No CloudFormation to reverse-engineer, no IAM policies to untangle. That's the point: you're not locked in to anyone."

testimonials:
  title: "What CTOs say"
  items: []
---
