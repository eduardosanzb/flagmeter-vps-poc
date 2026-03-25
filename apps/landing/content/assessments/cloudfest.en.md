---
title: "Cloud & AI Infrastructure Assessment"
description: "Quick survey for European cloud & tech companies — takes 3 minutes."
type: assessment
url: "/cloudfest/assessment/"
pocketbase_endpoint: "/pb/api/collections/assessments/records"
source: "cloudfest"
draft: false

questions:
  - id: q1_cloud_setup
    step: 1
    section: "Context"
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

  - id: q2_team_size
    step: 2
    section: "Context"
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

  - id: q3_pain_points
    step: 3
    section: "Pain"
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
    step: 4
    section: "Pain"
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

  - id: q5_audit_history
    step: 5
    section: "Interest in an audit"
    type: radio
    question: "Have you ever done a formal infrastructure audit?"
    hint: "Sovereignty, cost, AI-readiness — any of those."
    required: true
    options:
      - value: yes-regularly
        label: "Yes, regularly"
      - value: once-ago
        label: "Once, a while ago"
      - value: no-wanted
        label: "No, but we've wanted to"
      - value: no-not-radar
        label: "No, and it's not on our radar"

  - id: q6_audit_usefulness
    step: 6
    section: "Interest in an audit"
    type: radio
    question: "If someone gave you a clear report — sovereignty gaps, cost waste, AI-readiness score, prioritised next steps — would that be useful?"
    hint: ""
    required: true
    options:
      - value: very-useful
        label: "Very useful — I'd want that yesterday"
      - value: interesting
        label: "Interesting — I'd look at it"
      - value: maybe-cost
        label: "Maybe, depends on the cost"
      - value: not-really
        label: "Not really"

  - id: q7_audit_budget
    step: 7
    section: "Interest in an audit"
    type: radio
    question: "What would you expect to pay for a one-time infrastructure audit like that?"
    hint: ""
    required: true
    options:
      - value: free
        label: "Nothing — it should be free / a lead magnet"
      - value: 500-2000
        label: "€500–€2,000"
      - value: 2000-5000
        label: "€2,000–€5,000"
      - value: 5000-plus
        label: "€5,000+"
      - value: no-idea
        label: "No idea"

  - id: q8_agent_interest
    step: 8
    section: "Interest in automation"
    type: radio
    question: "Imagine an agent or CLI that continuously monitors sovereignty compliance, cost drift, and AI-readiness — flagging issues automatically. How interesting is that?"
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
    section: "Interest in automation"
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
    section: "Stay in touch"
    type: lead
    question: "Can we follow up with you?"
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
