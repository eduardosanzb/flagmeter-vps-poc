---
title: "Assessment de Infraestructura"
description: "Encuesta rápida para empresas europeas de cloud y tecnología — toma 3 minutos."
type: assessment
url: "/es/assessment/"
pocketbase_endpoint: "/pb/api/collections/assessments/records"
source: "website"
back_url: "/es/"
draft: false

questions:
  - id: q1_cloud_setup
    step: 1
    section: "Contexto"
    type: radio
    question: "¿Cuál es tu setup principal de cloud hoy?"
    hint: ""
    required: true
    options:
      - value: single-hyperscaler
        label: "Un solo hyperscaler (AWS, GCP o Azure)"
      - value: multi-cloud
        label: "Multi-cloud (mix de hyperscalers)"
      - value: european-provider
        label: "Proveedor europeo (Hetzner, OVH, Scaleway, STACKIT)"
      - value: hybrid
        label: "Híbrido (cloud + on-premise)"
      - value: on-premise
        label: "Principalmente on-premise"

  - id: q2_team_size
    step: 2
    section: "Contexto"
    type: radio
    question: "¿Qué tan grande es tu equipo de ingeniería?"
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
    question: "¿Cuáles de estos te quitan el sueño?"
    hint: "Selecciona todos los que apliquen"
    required: true
    options:
      - value: costs
        label: "Costes de cloud creciendo más rápido que los ingresos"
      - value: compliance
        label: "No estamos seguros de ser realmente GDPR / NIS2 / AI Act compliant"
      - value: vendor-lock
        label: "Dependientes de un solo proveedor cloud de EE.UU. del que no podemos salir fácilmente"
      - value: ai-adoption
        label: "Queremos adoptar AI pero no sabemos cómo hacerlo de forma segura y asequible"
      - value: fragile-infra
        label: "La infrastructure es frágil — demasiado setup manual, poco IaC"
      - value: no-observability
        label: "Sin observability real — nos enteramos de los problemas cuando los usuarios se quejan"
      - value: none
        label: "Ninguno de los anteriores"

  - id: q4_migration
    step: 4
    section: "Pain Points"
    type: radio
    question: "Si tuvieras que migrar de tu proveedor cloud principal en 6 meses, ¿podrías?"
    hint: "Esta pregunta incomoda a muchos. Ese es el punto."
    required: true
    options:
      - value: yes-agnostic
        label: "Sí, somos provider-agnostic por diseño"
      - value: painful-possible
        label: "Doloroso pero posible"
      - value: practically-impossible
        label: "Prácticamente imposible"
      - value: never-thought
        label: "Nunca lo había pensado"

  - id: q5_audit_history
    step: 5
    section: "Interés en un audit"
    type: radio
    question: "¿Alguna vez han hecho un audit formal de infrastructure?"
    hint: "Sovereignty, costes, AI-readiness — cualquiera de esos."
    required: true
    options:
      - value: yes-regularly
        label: "Sí, regularmente"
      - value: once-ago
        label: "Una vez, hace tiempo"
      - value: no-wanted
        label: "No, pero hemos querido hacerlo"
      - value: no-not-radar
        label: "No, y no está en nuestro radar"

  - id: q6_audit_usefulness
    step: 6
    section: "Interés en un audit"
    type: radio
    question: "Si alguien te diera un reporte claro — gaps de sovereignty, desperdicio de costes, score de AI-readiness, próximos pasos priorizados — ¿sería útil?"
    hint: ""
    required: true
    options:
      - value: very-useful
        label: "Muy útil — lo hubiera querido ayer"
      - value: interesting
        label: "Interesante — le echaría un vistazo"
      - value: maybe-cost
        label: "Quizás, depende del coste"
      - value: not-really
        label: "No realmente"

  - id: q7_audit_budget
    step: 7
    section: "Interés en un audit"
    type: radio
    question: "¿Cuánto esperarías pagar por un audit de infrastructure único?"
    hint: ""
    required: true
    options:
      - value: free
        label: "Nada — debería ser gratis / un lead magnet"
      - value: 500-2000
        label: "500–2.000 euros"
      - value: 2000-5000
        label: "2.000–5.000 euros"
      - value: 5000-plus
        label: "5.000+ euros"
      - value: no-idea
        label: "Ni idea"

  - id: q8_agent_interest
    step: 8
    section: "Interés en automatización"
    type: radio
    question: "Imagina un agente o CLI que monitorea continuamente sovereignty compliance, cost drift y AI-readiness — flaggeando problemas automáticamente. ¿Qué tan interesante es eso?"
    hint: ""
    required: true
    options:
      - value: try-now
        label: "Querría probarlo ahora mismo"
      - value: want-demo
        label: "Suena prometedor — querría ver un demo"
      - value: need-trust
        label: "Concepto interesante pero necesitaría confiar primero"
      - value: not-interested
        label: "No me interesa"

  - id: q9_agent_priorities
    step: 9
    section: "Interés en automatización"
    type: checkbox
    max: 2
    question: "Para una herramienta así, ¿qué sería lo más importante?"
    hint: "Elige hasta 2"
    required: true
    options:
      - value: self-hosted
        label: "Que corra en nuestra propia infrastructure (self-hosted, ningún dato sale)"
      - value: actionable-alerts
        label: "Alertas accionables, no solo dashboards"
      - value: auto-remediation
        label: "Remediación automatizada (que arregle cosas, no solo las flaggee)"
      - value: integrations
        label: "Que se integre con nuestro stack existente (Terraform, K8s, CI/CD)"
      - value: predictable-pricing
        label: "Costes claros — pricing predecible, sin sorpresas"

  - id: lead
    step: 10
    section: "Mantengamos el contacto"
    type: lead
    question: "¿Podemos contactarte?"
    hint: "Todos los campos son opcionales — incluso solo un email ayuda."
    required: false
    fields:
      - id: respondent_name
        type: text
        label: "Nombre"
        placeholder: "Tu nombre"
      - id: respondent_email
        type: email
        label: "Email"
        placeholder: "tu@email.com"
      - id: respondent_company
        type: text
        label: "Empresa"
        placeholder: "Nombre de la empresa"
---
