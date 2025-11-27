---
title: "Infrastructure Without DevOps"

# Sections order (can be reordered easily!)
sections:
  - who_we_are
  - how_it_works
  - principles
  - pillars
  - pricing
  - faq
# Hero Section
hero:
  title: "Stop paying for cloud complexity. Own your infrastructure."
  subtitle: "European B2B SaaS teams spend thousands monthly on infrastructure that distracts from product. We help you migrate to a sustainable stack your engineers can manage—without hiring DevOps."
  cta_primary: "Book Initial Workshop"
  cta_secondary: "See How It Works"
# Who We Are Section
who_we_are:
  title: "We’re Engineers Who’ve Been There"
  subtitle: "Built in the trenches, not in theory"
  items:
    - title: "Engineers First"
      description: "We don’t sell tools—we fix problems. Our team has shipped production systems at scale and knows what it means to deploy fast, safely, and independently."
    - title: "Cloud Skeptics"
      description: "We believe infrastructure should serve your product—not own it. The cloud isn’t always the answer. Simpler stacks often deliver better outcomes."
    - title: "FinOps Practitioners"
      description: "We apply FinOps principles across all cloud providers: visibility, accountability, and alignment between engineering and finance. No blind spending."
    - title: "Disappearing Act"
      description: "Our goal is to help you build a self-sufficient team. Once you’re running smoothly, we’re no longer needed."
# How It Works Section
how_it_works:
  title: "Three Steps to Freedom"
  subtitle: "From assessment to ownership in weeks, not quarters"
  items:
    - number: "01"
      title: "Initial Workshop (1-2 Hours)"
      description: "We meet to understand your stack, goals, and pain points. No pitch. No obligation. Just a clear path forward."
    - number: "02"
      title: "Proof of Concept"
      description: "Migrate one service to a VPS-based architecture. You see the operational shift before committing to the full stack."
    - number: "03"
      title: "Full Migration"
      description: "Complete cutover to a sustainable stack. Your team trained. Runbook delivered. We hand over the keys."
# Operating Principles Section
principles:
  title: "How We Work"
  subtitle: "Efficiency by design, not by accident"
  items:
    - title: "FinOps-Driven Optimization"
      description: "We apply FinOps principles across all cloud providers to align spending with business outcomes. Data-driven decisions, not guesswork."
      icon: "chart-bar"
    - title: "No Recurring Meetings"
      description: "All updates in GitHub issues and PRs. Your team stays focused on shipping features."
      icon: "calendar-x"
    - title: "Async by Default"
      description: "Context in issues, reviews in PRs, decisions in comments. Work across timezones without friction."
      icon: "message-circle"
    - title: "We Fire Ourselves"
      description: "Every config goes in your repo. After 90 days, you don't need us. That's success."
      icon: "check-circle"
# Quality Pillars Section
pillars:
  title: "What You Get"
  subtitle: "Non-negotiables that define our deliverables"
  items:
    - title: "Sustainable Stack"
      description: "A resilient, low-overhead infrastructure built around VPS, Docker Compose, and strategic cloud use. Designed for autonomy, not dependency."
    - title: "Engineer Empowerment"
      description: "Your team owns production. No tribal knowledge. No YAML hell."
    - title: "Tests + Runbooks"
      description: "Every migration includes integration tests, health checks, and a single-page runbook. No tribal knowledge."
 
# Pricing Section
pricing:
  title: "Transparent Pricing"
  subtitle: "Bill for outcomes, not hours"
  items:
    - name: "Initial Workshop"
      price: "€0"
      description: "1-2 hour discovery session"
      features:
        - "Understand your current stack"
        - "Define migration goals"
        - "No obligation, no pitch"
      cta: "Book Now"
      highlighted: false
    - name: "Pilot Migration"
      price: "€3k"
      description: "1-week pilot migration"
      features:
        - "Migrate one service"
        - "Operational proof before full cutover"
        - "Case study for your board"
      cta: "Start Pilot"
      highlighted: false
    - name: "Full Migration"
      price: "custom"
      description: "End-to-end transformation"
      features:
        - "Hybrid VPS/cloud architecture"
        - "Team training + runbook"
        - "Optional post-migration support"
      cta: "Let's Talk"
      highlighted: false
# FAQ Section
faq:
  title: "Frequently Asked Questions"
  subtitle: "Handling the objections, engineer to engineer"
  items:
   - question: "Why VPS over cloud?"
      answer: "VPS offers predictable costs and simplicity. We pair it with Cloudflare for edge cases (e.g., CDN, DDoS). No lock-in, no YAML hell."
    - question: "What if the VPS dies?"
      answer: "We run two instances with a floating IP. Cheaper than one EC2 with redundancy, and failover is automatic."
    - question: "How does this scale?"
      answer: "Vertical scaling gets you to 50k users easily. If you hit that, we add read replicas—not before. Most 'scale' problems are premature optimization."
    - question: "Won’t investors freak out?"
      answer: "Hetzner is a €1B EU company with better uptime than most startups’ AWS setups. This isn’t a Pi under your desk—it’s enterprise-grade infrastructure without the complexity tax."
    - question: "What about GDPR compliance?"
      answer: "All infrastructure stays in EU data centers. Hetzner is GDPR-compliant by default. We can provide data processing agreements if needed."
    - question: "How do you provide context without meetings?"
      answer: "Short Loom video + GitHub issue link. That’s it. We read your code, ask questions in comments, and ship PRs. Most 'meetings' are just status updates we can async."
    - question: "What if we need emergency support?"
      answer: "Optional €500/mo gets you on our PagerDuty rotation for 90 days. After that, you shouldn’t need us—but we’re a DM away if you do."
    - question: "How do you ensure financial accountability?"
      answer: "We embed FinOps practices into your workflow, ensuring alignment between engineering decisions and business outcomes."
    - question: "Do we have to use your tools?"
      answer: "No. We adapt to your workflow. The goal is to disappear into your existing process."
    - question: "What’s the catch?"
      answer: "We’re not a fit if you need multi-region failover today or think Kubernetes is 'simple.' This is for teams who want to ship features, not manage infrastructure."
# Social Proof Section (optional for future)
testimonials:
  title: "What CTOs Say"
  items: []
---
