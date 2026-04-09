---
title: "Assessment de Infraestructura"
description: "Evaluación con puntuación para empresas europeas de cloud y tecnología — toma 2 minutos."
type: assessment
url: "/es/assessment/"
pocketbase_endpoint: "/pb/api/collections/assessments/records"
source: "website"
back_url: "/es/"
draft: false

questions:
  - id: q1_cloud_setup
    step: 1
    section: "Infraestructura"
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

  - id: q3_pain_points
    step: 2
    section: "Infraestructura"
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
        label: "Queremos adoptar IA pero no sabemos cómo hacerlo de forma segura y asequible"
      - value: fragile-infra
        label: "La infrastructure es frágil — demasiado setup manual, poco IaC"
      - value: no-observability
        label: "Sin observability real — nos enteramos de los problemas cuando los usuarios se quejan"
      - value: none
        label: "Ninguno de los anteriores"

  - id: q4_migration
    step: 3
    section: "Infraestructura"
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

  - id: q_cost_visibility
    step: 4
    section: "Costes"
    type: radio
    question: "¿Qué tan bien entiendes tu gasto en la nube?"
    hint: ""
    required: true
    options:
      - value: clear
        label: "Tenemos dashboards claros y sabemos exactamente a dónde va el dinero"
      - value: rough-idea
        label: "Tenemos una idea general pero algunos costes son opacos"
      - value: surprises
        label: "Nos sorprenden las facturas de la nube regularmente"
      - value: no-tracking
        label: "No realmente rastreamos los costes de la nube"

  - id: q_ai_adoption
    step: 5
    section: "IA"
    type: radio
    question: "¿Dónde está tu equipo con las herramientas de IA?"
    hint: ""
    required: true
    options:
      - value: not-using
        label: "Aún no usamos herramientas de IA"
      - value: individual
        label: "Algunos ingenieros usan herramientas de IA por su cuenta"
      - value: team-standard
        label: "Hemos estandarizado herramientas específicas en todo el equipo"
      - value: ai-first
        label: "La IA es fundamental para cómo construimos — la mayoría de ingenieros usan agentes a diario"

  - id: q_ai_coupling
    step: 6
    section: "IA"
    type: radio
    question: "¿Qué tan dependiente es tu empresa de un único proveedor de IA?"
    hint: ""
    required: true
    options:
      - value: no-dependency
        label: "No dependemos de proveedores de IA, o usamos modelos open-source / self-hosted"
      - value: moderate
        label: "Usamos un proveedor de IA pero podríamos cambiar con algo de esfuerzo"
      - value: deep
        label: "Nuestros flujos de trabajo de ingeniería dependen de un proveedor de IA específico — cambiar sería un proyecto importante"
      - value: critical
        label: "Todo nuestro producto o la productividad del equipo depende de un proveedor de IA — no podríamos operar sin ellos"

  - id: q2_team_size
    step: 7
    section: "Sobre ti"
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

  - id: q8_agent_interest
    step: 8
    section: "Sobre ti"
    type: radio
    question: "Imagina un agente que monitorea continuamente sovereignty compliance, cost drift y IA-readiness — flaggeando problemas automáticamente. ¿Qué tan interesante es eso?"
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
    section: "Sobre ti"
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
    section: "Tu instantánea"
    type: lead
    question: "¿Quieres la imagen completa? Deja tu email y te enviaremos tu informe detallado."
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
