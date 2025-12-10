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
  subtitle: "Infrastructure migration consulting for European B2B SaaS teams. We design architectures around your business needs—not vendor lock-in. VPS, hybrid, or multi-cloud. Your team owns it completely."
  cta_primary: "Get Free Audit"
  cta_secondary: "See How It Works"
# Who We Are Section
who_we_are:
  title: "We're Engineers Who've Been There"
  subtitle: "Built in the trenches, not in theory"
  items:
    - title: "Engineers First"
      description: "We've shipped production systems at scale for real users. We test our approaches before recommending them—we built FlagMeter to prove a €7.59/month VPS handles 500+ RPS, so we know it works."
    - title: "Cloud Skeptics"
      description: "We've seen €8k/month AWS bills for 100 RPS workloads. Sometimes a €50 VPS beats a €5k Lambda setup. Infrastructure should serve your business—not own it."
    - title: "Disappearing Act"
      description: "Deploy with 'git push', debug with 'docker logs'. After 90 days, you don't need us. That's success, not failure."
# How It Works Section
how_it_works:
  title: "Three Steps to Freedom"
  subtitle: "From assessment to ownership in weeks, not quarters"
  items:
    - number: "01"
      title: "Free Architecture Audit (1-2 Hours)"
      description: "We analyze your infrastructure, architecture, and business needs. You get a detailed assessment with optimization opportunities—no pitch, no obligation."
    - number: "02"
      title: "Pilot Migration (€3k, 1 Week)"
      description: "Migrate 1-3 services based on complexity and potential savings. Prove the approach with real cost cuts before committing to the full stack."
    - number: "03"
      title: "Full Migration (Custom Pricing)"
      description: "Complete infrastructure transformation. Your team trained on deploys, debugging, and scaling. Runbook delivered. We hand over the keys."
# Operating Principles Section
principles:
  title: "How We Work"
  subtitle: "Efficiency by design, not by accident"
  items:
    - title: "Business-First Architecture"
      description: "We design infrastructure around your business needs and growth trajectory. Data-driven decisions on VPS vs hybrid vs multi-cloud—not guesswork or vendor bias."
      icon: "chart-bar"
    - title: "No Recurring Meetings"
      description: "All updates in GitHub issues and PRs. Your team stays focused on shipping features, not attending standups."
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
    - title: "Business-First Architecture"
      description: "Infrastructure designed for your growth trajectory and business model. VPS for predictability, hybrid for specific needs, multi-cloud only when proven necessary. No vendor lock-in."
    - title: "Engineer Empowerment"
      description: "Deploy with 'git push', debug with 'docker logs'—no YAML, no IAM, no 7-service pipeline. Your team owns production completely."
    - title: "Tests + Runbooks"
      description: "Every migration includes integration tests, health checks, and a single-page runbook. No tribal knowledge, no bus factor."
 
# Pricing Section
pricing:
  title: "Transparent Pricing"
  subtitle: "Bill for outcomes, not hours"
  items:
    - name: "Architecture Audit"
      price: "€0"
      description: "Comprehensive assessment session"
      features:
        - "Review infrastructure, architecture & business needs"
        - "Identify optimization opportunities"
        - "Future: Reference open-source blueprints"
        - "No obligation, no pitch"
      cta: "Book Now"
      highlighted: false
    - name: "Pilot Migration"
      price: "€3k"
      description: "1-week proof of concept"
      features:
        - "Migrate 1-3 services (complexity-based)"
        - "Demonstrate real cost savings"
        - "Operational proof before full commitment"
      cta: "Start Pilot"
      highlighted: false
    - name: "Full Migration"
      price: "custom"
      description: "End-to-end transformation"
      features:
        - "Complete infrastructure migration"
        - "Team training + runbook delivery"
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
    - question: "How does this scale?"
      answer: "Vertical scaling gets you to 50k users easily. If you hit that, we add read replicas—not before. Most 'scale' problems are premature optimization."
    - question: "What's the catch?"
      answer: "We're not a fit if you need multi-region failover today or think Kubernetes is 'simple.' This is for teams who want to ship features, not manage infrastructure."
    - question: "What if the VPS dies?"
      answer: "We run two instances with a floating IP. Cheaper than one EC2 with redundancy, and failover is automatic."
    - question: "Won't investors freak out?"
      answer: "Hetzner is a €1B EU company with better uptime than most startups' AWS setups. This isn't a Pi under your desk—it's enterprise-grade infrastructure without the complexity tax."
    - question: "What about GDPR compliance?"
      answer: "All infrastructure stays in EU data centers. Hetzner is GDPR-compliant by default. We can provide data processing agreements if needed."
    - question: "How do you provide context without meetings?"
      answer: "Short Loom video + GitHub issue link. That's it. We read your code, ask questions in comments, and ship PRs. Most 'meetings' are just status updates we can async."
    - question: "What if we need emergency support?"
      answer: "Optional €500/mo gets you on our PagerDuty rotation for 90 days. After that, you shouldn't need us—but we're a DM away if you do."
    - question: "How do you ensure financial accountability?"
      answer: "We embed FinOps practices into your workflow, ensuring alignment between engineering decisions and business outcomes."
    - question: "Do we have to use your tools?"
      answer: "No. We adapt to your workflow. The goal is to disappear into your existing process."
# Social Proof Section (optional for future)
testimonials:
  title: "What CTOs Say"
  items: []
---
