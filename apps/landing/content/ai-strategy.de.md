---
title: "KI-Strategie Framework"
description: "Ein praktisches Framework für europäische Tech-Unternehmen zur Bewertung und Aufbau einer souveränen KI-Strategie — fünf Dimensionen, vier Reifegrade, null Bullshit."
layout: "ai-strategy"
draft: false
heroTagline: "KI nicht zu adopten ist ein Risiko. KI ohne Strategie zu adopten ist ein größeres Risiko. Das ist der mittlere Weg."
promptCardHeading: "Slides langweilen dich?"
promptCardBody: "Kopiere den Prompt und füge ihn in Claude, ChatGPT oder was auch immer du nutzt ein. Er führt dich durch alle fünf Dimensionen, eine nach der anderen."
companionHeading: "Kennst du deine Infrastruktur-Position schon?"
companionBody: "Unser Infrastructure Assessment bewertet dich über Sovereignty, Cost Resilience und AI-Readiness mit spezifischen, umsetzbaren Diagnosen. Dauert 2 Minuten."
companionCta: "Assessment starten →"
ctaHeading: "Brauchst du Hilfe bei der Umsetzung?"
ctaBody: "Dieses Framework hilft dir bei der Diagnose. Wenn du Hilfe beim Aufbau einer souveränen KI-Strategie für dein Unternehmen brauchst, lass uns reden."
ctaButton: "Kostenlosen 15-min Call buchen →"
slides:
  - number: 1
    type: hero
    title: "KI-STRATEGIE FRAMEWORK"
    subtitle: "Fünf Dimensionen. Vier Reifegrade. Null Bullshit."
    bullets:
      - "Adoption Governance"
      - "Vendor Dependency"
      - "Data Sovereignty"
      - "Cost Visibility"
      - "Team Health"
    cta: "raus.cloud/ai-strategy"

  - number: 2
    type: one-thing
    statement: "KI-Vendor-Abhängigkeit ist das neue Cloud-Vendor-Lock-in. Und es ist schlimmer."
    tagline: "Wenn AWS die Preise erhöht, migrierst du dein Terraform. Wenn Anthropic die Preise erhöht, kannst du deine Prompts nicht migrieren — und auch nicht das mentale Modell deines Teams. Du hast keine Engineers mehr. Du hast Claude-Operatoren."

  - number: 3
    type: two-col
    label: "Die Parallele"
    title: "GLEICHE FALLE, ANDERER LAYER"
    subtitle: "Das Dependency-Pattern ist identisch — aber die Switching-Kosten sind höher."
    col_a:
      heading: "Cloud Era (2015-2020)"
      items:
        - '"Du brauchst AWS"'
        - "Direkte SDK-Integration"
        - "Kann nicht weg ohne Rewrite"
        - "US-Jurisdiktion (CLOUD Act)"
        - "€15k/Monat Rechnung, aus der du nicht rauskommst"
    col_b:
      heading: "AI Era (2024-jetzt)"
      items:
        - '"Du brauchst OpenAI"'
        - "Direkte API-Integration"
        - "Kann nicht weg: Code und Team-Kognition sind beide coupled"
        - "US-Jurisdiktion (CLOUD Act)"
        - "€5k/Monat API-Rechnung, die sich 3-5x multiplizieren wird"

  - number: 4
    type: custom-svg
    svg_id: "three-scales"
    label: "Das Muster"
    title: "GLEICHES MUSTER, DREI EBENEN"
    subtitle: "Subventionierte Adoption → Abhängigkeit → Preiskorrektur. Das passiert auf allen Ebenen."

  - number: 5
    type: icon-grid
    label: "Das Framework"
    title: "FÜNF DIMENSIONEN"
    subtitle: "Jede Dimension hat vier Reifegrade. Wo stehst du?"
    items:
      - icon: "users"
        heading: "Adoption Governance"
        description: "Wer entscheidet, welche KI-Tools das Unternehmen einsetzt?"
        levels: "Ad hoc → Zentralisiert → Geregelt → Strategisch"
      - icon: "chain"
        heading: "Vendor Dependency"
        description: "Bist du an einen KI-Provider gekoppelt, so wie du mal an AWS gekoppelt warst?"
        levels: "Locked-in → Bewusst → Multi-vendor → Portable"
      - icon: "shield"
        heading: "Data Sovereignty"
        description: "Welche Daten fließen durch KI-Provider? Bist du DSGVO/EU AI Act-konform?"
        levels: "Exponiert → Überwacht → Kontrolliert → Souverän"
      - icon: "banknote"
        heading: "Cost Visibility"
        description: "Weißt du, was du für KI ausgibst? Baust du auf subventionierten Preisen?"
        levels: "Unsichtbar → Getrackt → Optimiert → Vorhersagbar"
      - icon: "heart"
        heading: "Team Health"
        description: "Macht KI dein Team produktiver oder erschöpfter?"
        levels: "Überfordert → Coping → Balanced → Thriving"

  - number: 6
    type: custom-svg
    svg_id: "maturity-staircase-governance"
    label: "Dimension 1"
    title: "ADOPTION GOVERNANCE"
    subtitle: "Wer entscheidet, welche KI-Tools das Unternehmen einsetzt?"

  - number: 7
    type: custom-svg
    svg_id: "maturity-staircase-vendor"
    label: "Dimension 2"
    title: "VENDOR DEPENDENCY"
    subtitle: "Bist du an einen KI-Provider gekoppelt, so wie du mal an AWS gekoppelt warst?"

  - number: 8
    type: custom-svg
    svg_id: "maturity-staircase-sovereignty"
    label: "Dimension 3"
    title: "DATA SOVEREIGNTY"
    subtitle: "Welche Daten fließen durch KI-Provider? Bist du DSGVO/EU AI Act-konform?"

  - number: 9
    type: custom-svg
    svg_id: "maturity-staircase-cost"
    label: "Dimension 4"
    title: "COST VISIBILITY"
    subtitle: "Weißt du, was du für KI ausgibst? Baust du auf subventionierten Preisen?"

  - number: 10
    type: custom-svg
    svg_id: "maturity-staircase-health"
    label: "Dimension 5"
    title: "TEAM HEALTH"
    subtitle: "Macht KI dein Team produktiver oder erschöpfter?"

  - number: 11
    type: context
    label: "Das Risiko"
    title: "DER KI-PREIS-RESET"
    statements:
      - "2006: AWS launcht. Compute ist künstlich billig — subventioniert durch Amazons Retail-Margen. Alle bauen darauf."
      - "2018: AWS erhöht die Preise. Wer am tiefsten auf AWS gekoppelt war, zahlte die höchsten Switching-Kosten. Das billige Compute war die Falle, nicht das Feature."
      - "2024: OpenAI, Anthropic und Google verbrennen Milliarden, um KI billig zu machen. Gleiches Playbook. Gleiche Falle."
      - "Die Lektion: Wer deine Infrastruktur subventioniert, besitzt deine Switching-Kosten."
    tagline: "Die Subvention endet immer. Die Frage ist, wie coupled du bist, wenn es passiert."

  - number: 12
    type: custom-svg
    svg_id: "arm-reset-timeline"
    label: "Das Risiko"
    title: "DER KI-PREIS-RESET KOMMT"
    subtitle: "AWS hat's mit Compute gemacht. KI-Firmen machen's mit Intelligence. Die Subvention endet immer."

  - number: 13
    type: cta
    label: "Nächster Schritt"
    title: "BEWERTE DICH SELBST."
    subtitle: "Kopiere den Prompt. Füge ihn in deine KI ein. Bekomme dein Snapshot. Kostenlos, keine E-Mail nötig."
    website: "raus.cloud/ai-strategy"
    email: "hello@raus.cloud"
    tagline: "Right-sized KI-Strategie. Souverän by default. Kein Lock-in."
---
