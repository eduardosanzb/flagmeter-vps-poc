---
title: "Infrastruktur Assessment"
description: "Scored Assessment für europäische Cloud- & Tech-Unternehmen — dauert 2 Minuten."
type: assessment
url: "/de/assessment/"
pocketbase_endpoint: "/pb/api/collections/assessments/records"
source: "website"
back_url: "/de/"
draft: false

questions:
  - id: q1_cloud_setup
    step: 1
    section: "Infrastruktur"
    type: radio
    question: "Was ist dein primäres Cloud Setup heute?"
    hint: ""
    required: true
    options:
      - value: single-hyperscaler
        label: "Ein einzelner Hyperscaler (AWS, GCP oder Azure)"
      - value: multi-cloud
        label: "Multi-Cloud (Mix aus Hyperscalern)"
      - value: european-provider
        label: "Europäischer Provider (Hetzner, OVH, Scaleway, STACKIT)"
      - value: hybrid
        label: "Hybrid (Cloud + On-Premise)"
      - value: on-premise
        label: "Hauptsächlich On-Premise"

  - id: q3_pain_points
    step: 2
    section: "Infrastruktur"
    type: checkbox
    question: "Was davon lässt dich nachts nicht schlafen?"
    hint: "Wähle alles aus, was zutrifft"
    required: true
    options:
      - value: costs
        label: "Cloud-Kosten wachsen schneller als der Umsatz"
      - value: compliance
        label: "Unsicher, ob wir wirklich DSGVO / NIS2 / AI Act compliant sind"
      - value: vendor-lock
        label: "Abhängig von einem einzelnen US-Cloud-Provider, den wir nicht einfach verlassen können"
      - value: ai-adoption
        label: "Wollen KI einsetzen, aber wissen nicht wie — sicher und bezahlbar"
      - value: fragile-infra
        label: "Infrastructure ist fragil — zu viel manuelles Setup, zu wenig IaC"
      - value: no-observability
        label: "Keine echte Observability — wir finden Probleme erst, wenn User sich beschweren"
      - value: none
        label: "Nichts davon"

  - id: q4_migration
    step: 3
    section: "Infrastruktur"
    type: radio
    question: "Wenn du in 6 Monaten von deinem Cloud-Provider weg müsstest — könntest du?"
    hint: "Diese Frage macht viele nervös. Genau darum geht's."
    required: true
    options:
      - value: yes-agnostic
        label: "Ja, wir sind provider-agnostisch by design"
      - value: painful-possible
        label: "Schmerzhaft, aber machbar"
      - value: practically-impossible
        label: "Praktisch unmöglich"
      - value: never-thought
        label: "Noch nie drüber nachgedacht"

  - id: q_cost_visibility
    step: 4
    section: "Kosten"
    type: radio
    question: "Wie gut verstehst du euer Cloud-Spending?"
    hint: ""
    required: true
    options:
      - value: clear
        label: "Wir haben klare Dashboards und wissen genau, wo das Geld hingeht"
      - value: rough-idea
        label: "Wir haben eine grobe Vorstellung, aber manche Kosten sind undurchsichtig"
      - value: surprises
        label: "Wir werden regelmäßig von Cloud-Rechnungen überrascht"
      - value: no-tracking
        label: "Wir tracken Cloud-Kosten nicht wirklich"

  - id: q2_team_size
    step: 5
    section: "Über dich"
    type: radio
    question: "Wie groß ist dein Engineering-Team?"
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
    step: 6
    section: "Über dich"
    type: radio
    question: "Stell dir einen Agent vor, der kontinuierlich Sovereignty Compliance und Cost Drift monitort — und Probleme automatisch flaggt. Wie interessant wäre das?"
    hint: ""
    required: true
    options:
      - value: try-now
        label: "Würde ich sofort ausprobieren wollen"
      - value: want-demo
        label: "Klingt vielversprechend — würde eine Demo sehen wollen"
      - value: need-trust
        label: "Interessantes Konzept, aber müsste dem erstmal vertrauen"
      - value: not-interested
        label: "Nicht interessiert"

  - id: q9_agent_priorities
    step: 7
    section: "Über dich"
    type: checkbox
    max: 2
    question: "Was wäre bei so einem Tool am wichtigsten für dich?"
    hint: "Wähle bis zu 2"
    required: true
    options:
      - value: self-hosted
        label: "Läuft auf unserer eigenen Infrastructure (self-hosted, keine Daten gehen raus)"
      - value: actionable-alerts
        label: "Actionable Alerts, nicht nur Dashboards"
      - value: auto-remediation
        label: "Automatisierte Remediation (fixt Dinge, nicht nur flaggen)"
      - value: integrations
        label: "Integriert sich in unseren bestehenden Stack (Terraform, K8s, CI/CD)"
      - value: predictable-pricing
        label: "Klare Kosten — Predictable Pricing, keine Überraschungen"

  - id: lead
    step: 8
    section: "Dein Snapshot"
    type: lead
    question: "Willst du das volle Bild? Lass deine E-Mail da und wir schicken dir den detaillierten Report."
    hint: "Alle Felder optional — selbst nur eine E-Mail hilft."
    required: false
    fields:
      - id: respondent_name
        type: text
        label: "Name"
        placeholder: "Dein Name"
      - id: respondent_email
        type: email
        label: "E-Mail"
        placeholder: "deine@email.de"
      - id: respondent_company
        type: text
        label: "Unternehmen"
        placeholder: "Firmenname"
---
