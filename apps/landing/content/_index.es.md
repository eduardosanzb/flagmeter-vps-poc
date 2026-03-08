---
title: "Infraestructura sin DevOps"

sections:
  - who_we_are
  - how_it_works
  - founder
  - sovereignty
  - principles
  - pillars
  - blog_posts
  - pricing
  - faq

hero:
  title: "Despide a tu proveedor de cloud. Salva tu runway."
  subtitle: "Equipos SaaS B2B europeos pagan €8k+/mes por infraestructura de la que no pueden escapar. Reducimos costes un 60%, movemos tus datos a jurisdicción UE, y entregamos a tu equipo un stack que poseen completamente — en 90 días."
  cta_primary: "Auditoría Gratuita"
  cta_secondary: "Cómo Funciona"

who_we_are:
  title: "Somos engineers que han estado allí"
  subtitle: "Construido en las trincheras, no en la teoría"
  items:
    - title: "Engineers First"
      description: "Hemos shippeado sistemas en producción a escala y visto cómo la vendor dependency destruye equipos. Probamos que un VPS UE de €7.59/mes maneja 500+ RPS porque la alternativa realmente funciona."
    - title: "Cloud Skeptics"
      description: "Hemos visto facturas de AWS de €8k/mes para 100 RPS. Hemos visto al único engineer que entendía CloudFormation irse. La vendor dependency es un riesgo de negocio. La tratamos como tal."
    - title: "Disappearing Act"
      description: "Después de 90 días, cada config está en tu repo, cada tool es estándar, cada decisión es tuya. Deploy, debug, scale — sin nosotros, sin AWS, sin el permiso de nadie."

how_it_works:
  title: "Tres steps hacia la independencia"
  subtitle: "De vendor dependency a full ownership en semanas, no trimestres"
  items:
    - number: "01"
      title: "Free Independence Audit (1-2 horas)"
      description: "Mapeamos tu infraestructura, vendor dependencies y gaps de data residency. Ves qué cuesta quedarte y cómo es la libertad. Sin pitch, sin obligación."
    - number: "02"
      title: "Pilot Migration (€3k, 1 semana)"
      description: "Migra 1-3 servicios a infraestructura soberana UE. Elimina tu primera vendor dependency. Demuestra el ahorro antes de comprometerte con el stack completo."
    - number: "03"
      title: "Full Migration (Precio custom)"
      description: "Independencia operativa completa. Tu equipo entrenado para deploy, debug y scale sin nosotros. Cada config en tu repo. Runbook entregado. Nos desaparecemos."

sovereignty:
  title: "Por qué la soberanía operativa importa"
  subtitle: "La vendor dependency no es solo cara. Es un riesgo de negocio."
  items:
    - title: "Protege tu Runway"
      description: "AWS triplicó los precios de egress en 2024. Incluso tras el ajuste reciente de Hetzner, pagas 10x menos que AWS equivalente. Más importante: Docker estándar significa que puedes moverte a cualquier provider en horas. Tu runway no está rehén de nadie."
      icon: "shield"
    - title: "Tus Datos. Jurisdicción UE."
      description: "Toda la infraestructura en data centers UE. GDPR-compliant by default. Sin exposición al US CLOUD Act. Los datos de tus clientes nunca cruzan una frontera sin tu decisión explícita."
      icon: "globe"
    - title: "Zero Lock-in. Sin Excepciones."
      description: "Cada config vive en tu repo de GitHub. Docker estándar + PostgreSQL + Nginx — cualquier engineer puede operarlo. Nunca estás a un cambio de precios de una crisis."
      icon: "unlock"
    - title: "Own Every Decision"
      description: "Después de 90 días: deploy con `git push`, debug con `docker logs`, scale sin llamar a nadie. Sin vendor con el que negociar. Sin permiso requerido."
      icon: "key"

principles:
  title: "Cómo trabajamos"
  subtitle: "Eficiencia by design, independencia by default"
  items:
    - title: "Business-First Architecture"
      description: "Cada decisión empieza con: ¿esto crea una dependency que no quieres? VPS para predictibilidad, hybrid cuando está probado necesario. Tu negocio drivea el stack — no los incentives del vendor."
      icon: "chart-bar"
    - title: "Sin Recurring Meetings"
      description: "Todos los updates en GitHub issues y PRs. Tu equipo shipea features, no asiste a standups."
      icon: "calendar-x"
    - title: "Async by Default"
      description: "Contexto en issues, reviews en PRs, decisiones en comments. Trabaja a través de timezones sin fricción."
      icon: "message-circle"
    - title: "We Fire Ourselves"
      description: "Cada config va a tu repo. Después de 90 días, no nos necesitas — ni a ningún vendor. Ese es el contrato."
      icon: "check-circle"

pillars:
  title: "Qué obtienes"
  subtitle: "Non-negotiables que definen nuestros entregables"
  items:
    - title: "Arquitectura Resiliente, Soberana"
      description: "Probado a 500+ RPS en €7.59/mes. EU data residency by default. Sin vendor lock-in. Infraestructura diseñada para tu growth — no para el pricing model de un hyperscaler."
    - title: "Engineer Empowerment"
      description: "Deploy con `git push`, debug con `docker logs` — sin IAM, sin 7-service pipeline, sin tribal knowledge. Tu equipo owns production completamente."
    - title: "Tests + Runbooks"
      description: "Cada migración incluye integration tests, health checks y un one-page runbook. Sin bus factor. Sin conocimiento que se va cuando alguien se va."

blog_posts:
  title: "Historias reales de infraestructura"
  subtitle: "Sin teoría. Sin vendor pitch. Solo lo que realmente pasó cuando lo testeamos."

founder:
  title: "Conoce al Engineer"
  subtitle: "La persona detrás de raus.cloud"
  name: "Eduardo Sanchez Bautista"
  title_role: "Product Engineer"
  bio: "9+ años shippeando sistemas en producción a escala. Ex-Unity Technologies (€70k ahorro anual). Construido 100% con agentes de IA. Ayudando a equipos a crear sistemas que funcionan, crecen y perduran."
  location: "Berlín, Alemania"
  link_text: "Ver perfil completo →"
  link_url: "https://eduardosanzb.dev"

pricing:
  title: "Precios transparentes"
  subtitle: "Pagas por outcomes. Medimos el éxito por tu independencia."
  items:
    - name: "Architecture Audit"
      price: "€0"
      description: "Assessment de independencia comprehensivo"
      features:
        - "Mapea tus vendor dependencies y lock-in risks"
        - "EU data residency gap analysis"
        - "Identifica €2k+/mes en ahorros inmediatos"
        - "Sin obligación, sin pitch"
      cta: "Reservar Ahora"
      highlighted: false
    - name: "Pilot Migration"
      price: "€3k"
      description: "Proof of concept de 1 semana"
      features:
        - "Migra 1-3 servicios a infraestructura soberana UE"
        - "Elimina tu primera vendor dependency"
        - "Demuestra ahorros reales antes del commit completo"
      cta: "Iniciar Pilot"
      highlighted: false
    - name: "Full Migration"
      price: "Custom"
      description: "Independencia operativa end-to-end"
      features:
        - "Migración completa a infraestructura resiliente, soberana"
        - "Equipo entrenado en deploys, debugging y scaling"
        - "Runbook entregado. Keys handed over. We disappear."
      cta: "Hablemos"
      highlighted: false

faq:
  title: "Preguntas frecuentes"
  subtitle: "Manejando las objeciones, engineer a engineer"
  items:
    - question: "¿Por qué VPS sobre cloud?"
      answer: "VPS te da costes predecibles e independencia operativa. Lo paireamos con Cloudflare para CDN y DDoS protection. Sin lock-in, sin YAML hell, sin vendor holding tu arquitectura como rehén."
    - question: "¿Cómo escala esto?"
      answer: "Vertical scaling te lleva a 50k usuarios fácilmente. Si llegas ahí, añadimos read replicas — no antes. La mayoría de los problemas de 'scale' son premature optimization vendida por vendors que profitan de la complejidad."
    - question: "¿Dónde está el truco?"
      answer: "No somos fit si necesitas multi-region failover hoy o piensas que Kubernetes es 'simple'. Esto es para equipos que quieren shippear features, no manejar infraestructura."
    - question: "¿Qué pasa si el VPS muere?"
      answer: "Corremos dos instancias con una floating IP. Más barato que una EC2 con redundancy, y failover es automático. Tú owns ambas instancias y la failover config — sin vendor a quien llamar."
    - question: "¿No se asustarán los inversores?"
      answer: "Hetzner es una empresa UE de €1B con mejor uptime que la mayoría de los setups AWS de startups. Esto no es una Pi bajo tu escritorio — es enterprise-grade infrastructure sin el complexity tax."
    - question: "¿Qué pasa con GDPR compliance?"
      answer: "Toda la infraestructura se queda en EU data centers. Hetzner es GDPR-compliant by default — sin DPA negotiations con un US vendor. Podemos proporcionar data processing agreements si es necesario."
    - question: "¿No estamos cambiando AWS lock-in por Hetzner lock-in?"
      answer: "No. AWS lock-in significa servicios propietarios (Lambda, RDS, IAM, CloudFormation) que solo corren en AWS. Nuestro stack es Docker + PostgreSQL estándar + Nginx. Mismas tools, cualquier provider. Migras en horas."
    - question: "¿Qué si Hetzner sube precios de nuevo?"
      answer: "Docker Compose estándar + PostgreSQL significa que migras a cualquier VPS provider en horas, no semanas. Sin CloudFormation que reverse-engineer, sin IAM policies que desenredar. Ese es el punto: no estás locked in con nadie."

testimonials:
  title: "Lo que dicen los CTOs"
  items: []
---
