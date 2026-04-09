---
title: "Framework de Estrategia de IA"
description: "Un framework práctico para empresas tecnológicas europeas para evaluar y construir una estrategia de IA soberana — cinco dimensiones, cuatro niveles de madurez, cero bullshit."
layout: "ai-strategy"
draft: false
heroTagline: "No adoptar IA es un riesgo. Adoptar sin estrategia es un riesgo mayor. Este es el camino intermedio."
promptCardHeading: "¿Los slides te aburren?"
promptCardBody: "Copia el prompt y pégalo en Claude, ChatGPT o lo que uses. Te guía por las cinco dimensiones, una a la vez."
companionHeading: "¿Ya conoces tu posición en infraestructura?"
companionBody: "Nuestro Infrastructure Assessment te puntúa en Sovereignty, Cost Resilience y AI-Readiness con diagnósticos específicos y accionables. Tarda 2 minutos."
companionCta: "Hacer el Assessment →"
ctaHeading: "¿Necesitas ayuda para ejecutar?"
ctaBody: "Este framework te ayuda a diagnosticar. Si quieres ayuda para construir una estrategia de IA soberana para tu empresa, hablemos."
ctaButton: "Reservar llamada gratuita de 15 min →"
slides:
  - number: 1
    type: hero
    title: "FRAMEWORK DE ESTRATEGIA DE IA"
    subtitle: "Cinco dimensiones. Cuatro niveles de madurez. Cero bullshit."
    bullets:
      - "Adoption Governance"
      - "Vendor Dependency"
      - "Data Sovereignty"
      - "Cost Visibility"
      - "Team Health"
    cta: "raus.cloud/ai-strategy"

  - number: 2
    type: one-thing
    statement: "La dependencia de vendors de IA es el nuevo vendor lock-in de cloud. Y es peor."
    tagline: "Cuando AWS sube precios, migras tu Terraform. Cuando Anthropic sube precios, no puedes migrar tus prompts — ni los modelos mentales de tu equipo. Ya no tienes engineers. Tienes operadores de Claude."

  - number: 3
    type: two-col
    label: "El Paralelo"
    title: "LA MISMA TRAMPA, OTRA CAPA"
    subtitle: "El patrón de dependencia es idéntico — pero el coste de cambiar es mayor."
    col_a:
      heading: "Cloud Era (2015-2020)"
      items:
        - '"Necesitas AWS"'
        - "Integración directa con SDK"
        - "No puedes irte sin reescribir"
        - "Jurisdicción EEUU (CLOUD Act)"
        - "Factura de €15k/mes de la que no puedes escapar"
    col_b:
      heading: "AI Era (2024-ahora)"
      items:
        - '"Necesitas OpenAI"'
        - "Integración directa con API"
        - "No puedes irte: código y cognición del equipo, ambos acoplados"
        - "Jurisdicción EEUU (CLOUD Act)"
        - "Factura de €5k/mes que se multiplicará por 3-5x"

  - number: 4
    type: custom-svg
    svg_id: "three-scales"
    label: "El Patrón"
    title: "EL MISMO PATRÓN, TRES ESCALAS"
    subtitle: "Adopción subvencionada → Dependencia → Corrección de precios. Está pasando a todos los niveles."

  - number: 5
    type: icon-grid
    label: "El Framework"
    title: "CINCO DIMENSIONES"
    subtitle: "Cada dimensión tiene cuatro niveles de madurez. ¿Dónde estás tú?"
    items:
      - icon: "users"
        heading: "Adoption Governance"
        description: "¿Quién decide qué herramientas de IA usa la empresa?"
        levels: "Ad hoc → Centralizado → Gobernado → Estratégico"
      - icon: "chain"
        heading: "Vendor Dependency"
        description: "¿Estás acoplado a un proveedor de IA igual que lo estabas a AWS?"
        levels: "Locked-in → Consciente → Multi-vendor → Portable"
      - icon: "shield"
        heading: "Data Sovereignty"
        description: "¿Qué datos fluyen por los proveedores de IA? ¿Cumples con el RGPD/EU AI Act?"
        levels: "Expuesto → Monitoreado → Controlado → Soberano"
      - icon: "banknote"
        heading: "Cost Visibility"
        description: "¿Sabes cuánto gastas en IA? ¿Estás construyendo sobre precios subvencionados?"
        levels: "Invisible → Trackeado → Optimizado → Predecible"
      - icon: "heart"
        heading: "Team Health"
        description: "¿La IA hace a tu equipo más productivo o más agotado?"
        levels: "Desbordado → Sobreviviendo → Equilibrado → Thriving"

  - number: 6
    type: custom-svg
    svg_id: "maturity-staircase-governance"
    label: "Dimensión 1"
    title: "ADOPTION GOVERNANCE"
    subtitle: "¿Quién decide qué herramientas de IA usa la empresa?"

  - number: 7
    type: custom-svg
    svg_id: "maturity-staircase-vendor"
    label: "Dimensión 2"
    title: "VENDOR DEPENDENCY"
    subtitle: "¿Estás acoplado a un proveedor de IA igual que lo estabas a AWS?"

  - number: 8
    type: custom-svg
    svg_id: "maturity-staircase-sovereignty"
    label: "Dimensión 3"
    title: "DATA SOVEREIGNTY"
    subtitle: "¿Qué datos fluyen por los proveedores de IA? ¿Cumples con el RGPD/EU AI Act?"

  - number: 9
    type: custom-svg
    svg_id: "maturity-staircase-cost"
    label: "Dimensión 4"
    title: "COST VISIBILITY"
    subtitle: "¿Sabes cuánto gastas en IA? ¿Estás construyendo sobre precios subvencionados?"

  - number: 10
    type: custom-svg
    svg_id: "maturity-staircase-health"
    label: "Dimensión 5"
    title: "TEAM HEALTH"
    subtitle: "¿La IA hace a tu equipo más productivo o más agotado?"

  - number: 11
    type: context
    label: "El Riesgo"
    title: "EL RESET ARM"
    statements:
      - "2006: AWS lanza. El cómputo es barato — subvencionado por los márgenes retail de Amazon. Todo el mundo construye sobre ello."
      - "2018: AWS Graviton aparece. Chips ARM, 40% más baratos que x86. Las empresas que más habían optimizado para Intel pagaron el mayor coste de migración."
      - "La lección: quien subvenciona tu infraestructura, controla tu coste de cambio."
      - "2024: OpenAI, Anthropic y Google están quemando miles de millones para hacer la IA barata. Te están optimizando hacia el mismo rincón."
    tagline: "La subvención siempre termina. La pregunta es cuán acoplado estás cuando ocurra."

  - number: 12
    type: custom-svg
    svg_id: "arm-reset-timeline"
    label: "El Riesgo"
    title: "EL RESET ARM ESTÁ LLEGANDO"
    subtitle: "Los precios de IA replican la crisis de hipotecas subprime de 2008. Las tarifas subvencionadas terminarán."

  - number: 13
    type: cta
    label: "Siguiente Paso"
    title: "EVALÚATE A TI MISMO."
    subtitle: "Copia el prompt. Pégalo en tu IA. Obtén tu snapshot. Gratis, sin email necesario."
    website: "raus.cloud/ai-strategy"
    email: "hello@raus.cloud"
    tagline: "Estrategia de IA del tamaño correcto. Soberana por defecto. Sin lock-in."
---
