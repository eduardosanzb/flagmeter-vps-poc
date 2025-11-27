---
title: "Infrastruktur ohne DevOps"

# Sections order (can be reordered easily!)
sections:
  - how_it_works
  - principles
  - pillars
  - pricing
  - faq

# Hero Section
hero:
  title: "Keine DevOps-Stelle nötig. Cloud-Kosten um 60% senken."
  subtitle: "Europäische B2B-SaaS-Teams geben €8k-15k/Monat für Infrastruktur-Komplexität aus. Wir migrieren Sie zu einem nachhaltigen Stack, den Ihre Entwickler in 2 Tagen beherrschen—und entlassen uns selbst nach 90 Tagen."
  cta_primary: "Kostenlose 15-Min-Prüfung"
  cta_secondary: "So funktioniert es"

# How It Works Section
how_it_works:
  title: "Drei Schritte zur Freiheit"
  subtitle: "Von der Prüfung zur Unabhängigkeit in Wochen, nicht Quartalen"
  items:
    - number: "01"
      title: "Kostenlose 15-Min-Prüfung"
      description: "Screenshare Ihrer AWS-Konsole. Wir identifizieren €2k-4k/Monat Verschwendung und liefern eine 1-seitige Kill-List. Kein Pitch, keine Verpflichtung."
    - number: "02"
      title: "€5k Pilotprojekt (1 Woche)"
      description: "Migrieren Sie einen Service. Kostenreduktion von 50% oder Geld zurück. Sie sehen den Beweis, bevor Sie sich zum vollständigen Stack verpflichten."
    - number: "03"
      title: "€15k Vollständige Migration"
      description: "3 Wochen. Komplette Umstellung auf VPS/Docker Compose. Ihr Team geschult. Runbook geliefert. Wir übergeben die Schlüssel."

# Operating Principles Section
principles:
  title: "Wie wir arbeiten"
  subtitle: "Effizienz durch Design, nicht durch Zufall"
  items:
    - title: "Keine wiederkehrenden Meetings"
      description: "Alle Updates in GitHub Issues und PRs. Ihr Team bleibt auf Features fokussiert."
      icon: "calendar-x"
    - title: "Standardmäßig asynchron"
      description: "Kontext in Issues, Reviews in PRs, Entscheidungen in Kommentaren. Arbeit über Zeitzonen ohne Reibung."
      icon: "message-circle"
    - title: "Jederzeit pausieren"
      description: "Urlaubsfreundlich. Abrechnung mit einer Nachricht stoppen. Wieder aufnehmen, wenn Sie bereit sind."
      icon: "pause-circle"
    - title: "Wir entlassen uns selbst"
      description: "Jede Konfiguration geht in Ihr Repo. Nach 90 Tagen brauchen Sie uns nicht mehr. Das ist Erfolg."
      icon: "check-circle"

# Quality Pillars Section
pillars:
  title: "Was Sie bekommen"
  subtitle: "Nicht verhandelbare Standards, die unsere Leistungen definieren"
  items:
    - title: "60% Kostengarantie"
      description: "Wir senken Ihre Infrastrukturkosten um 60-70% oder Sie zahlen die Pilotgebühr nicht. Ihre AWS-Rechnung wird zu €3k/Monat Hosting. [Siehe Hetzner CAX11 Load-Test Snapshot](https://notes.eduardosanzb.dev/s/aa17de1b-baac-4784-9142-dca089d298a5)."
    - title: "2-Tage-Ownership"
      description: "Deployment in 2 Befehlen: git push und docker-compose up. Ihr Team betreibt die Produktion ohne uns anzurufen."
    - title: "Tests + Runbooks"
      description: "Jede Migration beinhaltet Integrationstests, Health Checks und ein einseitiges Runbook. Kein Stammeswissen."

# Pricing Section
pricing:
  title: "Transparente Preise"
  subtitle: "Abrechnung nach Ergebnissen, nicht nach Stunden"
  items:
    - name: "Kostenlose Prüfung"
      price: "€0"
      description: "15-minütiger Screenshare"
      features:
        - "1-seitiger Verschwendungsbericht"
        - "€2k-4k/Monat Einsparungen identifiziert"
        - "Keine Verpflichtung, kein Pitch"
      cta: "Jetzt buchen"
      highlighted: false
    - name: "Pilotprojekt"
      price: "€5k"
      description: "1-wöchiger Proof of Concept"
      features:
        - "Einen Service migrieren"
        - "50% Kostenreduktion oder Geld zurück"
        - "Fallstudie für Ihren Vorstand"
      cta: "Pilot starten"
      highlighted: true
    - name: "Vollständige Migration"
      price: "€15k"
      description: "3-wöchige komplette Umstellung"
      features:
        - "Gesamten Stack migrieren"
        - "Team-Training + Runbook"
        - "Optional €500/Mo Notfall-Support"
      cta: "Lass uns reden"
      highlighted: false

# FAQ Section
faq:
  title: "Häufig gestellte Fragen"
  subtitle: "Einwände behandeln, Ingenieur zu Ingenieur"
  items:
    - question: "Was passiert, wenn der VPS ausfällt?"
      answer: "Wir betreiben zwei Instanzen mit einer Floating-IP. Günstiger als ein EC2 mit Redundanz, und Failover ist automatisch."
    - question: "Wie skaliert das?"
      answer: "Vertikale Skalierung bringt Sie problemlos auf 50.000 Benutzer. Wenn Sie das erreichen, fügen wir Read-Replicas hinzu—nicht vorher. Die meisten 'Skalierungs'-Probleme sind vorzeitige Optimierung."
    - question: "Werden Investoren nicht ausrasten?"
      answer: "Hetzner ist ein €1Mrd EU-Unternehmen mit besserer Uptime als die meisten Startup-AWS-Setups. Das ist kein Pi unter Ihrem Schreibtisch—es ist Enterprise-Grade-Infrastruktur ohne Komplexitätssteuer."
    - question: "Was ist mit DSGVO-Konformität?"
      answer: "Alle Infrastruktur bleibt in EU-Rechenzentren. Hetzner ist standardmäßig DSGVO-konform. Wir können bei Bedarf Datenverarbeitungsverträge bereitstellen."
    - question: "Wie stellen Sie Kontext ohne Meetings bereit?"
      answer: "Kurzes Loom-Video + GitHub Issue-Link. Das war's. Wir lesen Ihren Code, stellen Fragen in Kommentaren und versenden PRs. Die meisten 'Meetings' sind nur Status-Updates, die wir asynchron machen können."
    - question: "Was ist, wenn wir Notfall-Support brauchen?"
      answer: "Optional €500/Mo bringt Sie für 90 Tage in unsere PagerDuty-Rotation. Danach sollten Sie uns nicht mehr brauchen—aber wir sind eine DM entfernt, falls doch."
    - question: "Müssen wir Ihre Tools verwenden?"
      answer: "Nein. Wir bevorzugen GitHub für Transparenz, passen uns aber Ihrem Workflow an. Das Ziel ist, in Ihrem bestehenden Prozess zu verschwinden."
    - question: "Wo ist der Haken?"
      answer: "Wir passen nicht, wenn Sie heute Multi-Region-Failover brauchen oder Kubernetes für 'einfach' halten. Das ist für Teams, die Features versenden wollen, nicht Infrastruktur verwalten."

# Social Proof Section (optional for future)
testimonials:
  title: "Was CTOs sagen"
  items: []
---
