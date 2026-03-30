---
title: "Infrastruktur Assessment"
description: "Kurze Umfrage für europäische Cloud- & Tech-Unternehmen — dauert 3 Minuten."
type: assessment
url: "/de/assessment/"
pocketbase_endpoint: "/pb/api/collections/assessments/records"
source: "website"
back_url: "/de/"
draft: false

questions:
  - id: q1_cloud_setup
    step: 1
    section: "Kontext"
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

  - id: q2_team_size
    step: 2
    section: "Kontext"
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

  - id: q3_pain_points
    step: 3
    section: "Pain Points"
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
        label: "Wollen AI einsetzen, aber wissen nicht wie — sicher und bezahlbar"
      - value: fragile-infra
        label: "Infrastructure ist fragil — zu viel manuelles Setup, zu wenig IaC"
      - value: no-observability
        label: "Keine echte Observability — wir finden Probleme erst, wenn User sich beschweren"
      - value: none
        label: "Nichts davon"

  - id: q4_migration
    step: 4
    section: "Pain Points"
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

  - id: q5_audit_history
    step: 5
    section: "Interesse an einem Audit"
    type: radio
    question: "Habt ihr jemals ein formales Infrastructure Audit gemacht?"
    hint: "Sovereignty, Kosten, AI-Readiness — irgendwas davon."
    required: true
    options:
      - value: yes-regularly
        label: "Ja, regelmäßig"
      - value: once-ago
        label: "Einmal, ist aber schon länger her"
      - value: no-wanted
        label: "Nein, aber wir wollten schon immer"
      - value: no-not-radar
        label: "Nein, und steht auch nicht auf dem Radar"

  - id: q6_audit_usefulness
    step: 6
    section: "Interesse an einem Audit"
    type: radio
    question: "Wenn dir jemand einen klaren Report geben würde — Sovereignty-Lücken, Kosten-Verschwendung, AI-Readiness Score, priorisierte nächste Schritte — wäre das nützlich?"
    hint: ""
    required: true
    options:
      - value: very-useful
        label: "Sehr nützlich — hätte ich gern schon gestern gehabt"
      - value: interesting
        label: "Interessant — würde ich mir anschauen"
      - value: maybe-cost
        label: "Vielleicht, kommt auf die Kosten an"
      - value: not-really
        label: "Eher nicht"

  - id: q7_audit_budget
    step: 7
    section: "Interesse an einem Audit"
    type: radio
    question: "Was würdest du für ein einmaliges Infrastructure Audit erwarten zu zahlen?"
    hint: ""
    required: true
    options:
      - value: free
        label: "Nichts — sollte kostenlos sein / ein Lead Magnet"
      - value: 500-2000
        label: "500–2.000 Euro"
      - value: 2000-5000
        label: "2.000–5.000 Euro"
      - value: 5000-plus
        label: "5.000+ Euro"
      - value: no-idea
        label: "Keine Ahnung"

  - id: q8_agent_interest
    step: 8
    section: "Interesse an Automatisierung"
    type: radio
    question: "Stell dir einen Agent oder CLI vor, der Sovereignty Compliance, Cost Drift und AI-Readiness kontinuierlich monitort — und Probleme automatisch flaggt. Wie interessant wäre das?"
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
    step: 9
    section: "Interesse an Automatisierung"
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
    step: 10
    section: "In Kontakt bleiben"
    type: lead
    question: "Können wir uns bei dir melden?"
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
