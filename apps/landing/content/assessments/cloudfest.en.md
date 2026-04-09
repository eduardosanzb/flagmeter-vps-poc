---
title: "Cloud & AI Infrastructure Assessment"
description: "Scored assessment for European cloud & tech companies — takes 2 minutes."
type: assessment
url: "/cloudfest/assessment/"
pocketbase_endpoint: "/pb/api/collections/assessments/records"
source: "cloudfest"
back_url: "/cloudfest/"
draft: false

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
---
