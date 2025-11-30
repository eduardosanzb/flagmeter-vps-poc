---
title: "Infrastruktur ohne DevOps"
# Reihenfolge der Abschnitte (kann leicht geändert werden!)
sections:
  - who_we_are
  - how_it_works
  - principles
  - pillars
  - pricing
  - faq
# Hero-Abschnitt
hero:
  title: "Hören Sie auf, für Cloud-Komplexität zu bezahlen. Übernehmen Sie die Kontrolle über Ihre Infrastruktur."
  subtitle: "Europäische B2B-SaaS-Teams geben monatlich Tausende Euro für Infrastruktur aus, die vom Produkt ablenkt. Wir helfen Ihnen, zu einem nachhaltigen Stack zu migrieren, den Ihr Engineering-Team selbst verwalten kann – ohne DevOps einzustellen."
  cta_primary: "Ersten Workshop buchen"
  cta_secondary: "So funktioniert’s"
# Abschnitt „Wer wir sind“
who_we_are:
  title: "Wir sind Ingenieure, die das schon durchgemacht haben"
  subtitle: "Entwickelt in der Praxis, nicht in der Theorie"
  items:
    - title: "Ingenieure zuerst"
      description: "Wir verkaufen keine Tools – wir lösen Probleme. Unser Team hat bereits produktive Systeme im großen Maßstab bereitgestellt und weiß, was es heißt, schnell, sicher und eigenständig zu deployen."
    - title: "Cloud-Skeptiker"
      description: "Wir glauben, dass Infrastruktur Ihrem Produkt dienen sollte – nicht umgekehrt. Die Cloud ist nicht immer die Lösung. Einfachere Stacks liefern oft bessere Ergebnisse."
    - title: "Verschwindender Akt"
      description: "Unser Ziel ist es, Ihnen ein selbstständiges Team aufzubauen. Sobald alles reibungslos läuft, brauchen Sie uns nicht mehr."
# Abschnitt „So funktioniert’s“
how_it_works:
  title: "Drei Schritte zur Freiheit"
  subtitle: "Von der Bewertung bis zur Eigenverantwortung – in Wochen, nicht in Quartalen"
  items:
    - number: "01"
      title: "Erster Workshop (1–2 Stunden)"
      description: "Wir lernen Ihren Stack, Ihre Ziele und Ihre Schmerzpunkte kennen. Kein Verkaufsgespräch. Keine Verpflichtung. Nur ein klarer Weg nach vorn."
    - number: "02"
      title: "Proof of Concept"
      description: "Migrieren Sie einen Service auf eine VPS-basierte Architektur. Sie sehen die operative Verbesserung, bevor Sie sich für den gesamten Stack entscheiden."
    - number: "03"
      title: "Vollständige Migration"
      description: "Kompletter Umstieg auf einen nachhaltigen Stack. Ihr Team ist geschult. Ein Runbook wird übergeben. Wir geben Ihnen die Schlüssel."
# Abschnitt „Unsere Arbeitsprinzipien“
principles:
  title: "Wie wir arbeiten"
  subtitle: "Effizienz durch Design, nicht durch Zufall"
  items:
    - title: "FinOps-getriebene Optimierung"
      description: "Wir wenden FinOps-Prinzipien bei allen Cloud-Anbietern an, um Ausgaben mit Geschäftsergebnissen in Einklang zu bringen. Entscheidungen basieren auf Daten, nicht auf Vermutungen."
      icon: "chart-bar"
    - title: "Keine regelmäßigen Meetings"
      description: "Alle Updates erfolgen über GitHub-Issues und Pull Requests. Ihr Team bleibt fokussiert auf die Entwicklung von Features."
      icon: "calendar-x"
    - title: "Asynchron als Standard"
      description: "Kontext in Issues, Reviews in Pull Requests, Entscheidungen in Kommentaren. Zusammenarbeit über Zeitzonen hinweg – ohne Reibungsverluste."
      icon: "message-circle"
    - title: "Wir feuern uns selbst"
      description: "Jede Konfiguration landet in Ihrem Repository. Nach 90 Tagen brauchen Sie uns nicht mehr. Das ist Erfolg."
      icon: "check-circle"
# Abschnitt „Qualitätsgrundsätze“
pillars:
  title: "Was Sie erhalten"
  subtitle: "Nicht verhandelbare Elemente, die unsere Leistungen definieren"
  items:
    - title: "Nachhaltiger Stack"
      description: "Eine resiliente, wartungsarme Infrastruktur auf Basis von VPS, Docker Compose und gezielter Cloud-Nutzung. Entworfen für Autonomie, nicht für Abhängigkeit."
    - title: "Stärkung Ihres Engineering-Teams"
      description: "Ihr Team übernimmt die Verantwortung für Produktion. Kein Insider-Wissen. Kein YAML-Albtraum."
    - title: "Tests + Runbooks"
      description: "Jede Migration beinhaltet Integrationstests, Health Checks und ein einseitiges Runbook. Kein Wissen bleibt im Team gefangen."
# Preisgestaltung
pricing:
  title: "Transparente Preise"
  subtitle: "Bezahlen Sie für Ergebnisse, nicht für Stunden"
  items:
    - name: "Erster Workshop"
      price: "€0"
      description: "1–2-stündige Kennenlernsession"
      features:
        - "Analyse Ihres aktuellen Stacks"
        - "Definition Ihrer Migrationsziele"
        - "Keine Verpflichtung, kein Verkaufsgespräch"
      cta: "Jetzt buchen"
      highlighted: false
    - name: "Pilot-Migration"
      price: "€3.000"
      description: "1-wöchige Pilotmigration"
      features:
        - "Migration eines Services"
        - "Operativer Nachweis vor vollständigem Umstieg"
        - "Fallstudie für Ihr Management"
      cta: "Pilot starten"
      highlighted: false
    - name: "Vollständige Migration"
      price: "individuell"
      description: "End-to-End-Transformation"
      features:
        - "Hybride VPS/Cloud-Architektur"
        - "Team-Schulung + Runbook"
        - "Optionaler Support nach der Migration"
      cta: "Lassen Sie uns sprechen"
      highlighted: false
# FAQ-Abschnitt
faq:
  title: "Häufig gestellte Fragen"
  subtitle: "Einwandbehandlung – Ingenieur zu Ingenieur"
  items:
    - question: "Warum VPS statt Cloud?"
      answer: "VPS bietet vorhersehbare Kosten und Einfachheit. Wir kombinieren es mit Cloudflare für Edge-Fälle (z. B. CDN, DDoS). Kein Vendor-Lock-in, kein YAML-Albtraum."
    - question: "Was passiert, wenn der VPS ausfällt?"
      answer: "Wir betreiben zwei Instanzen mit einer Floating IP. Günstiger als eine EC2-Instanz mit Redundanz – und Failover erfolgt automatisch."
    - question: "Wie skaliert das?"
      answer: "Vertikale Skalierung bringt Sie problemlos zu 50.000 Nutzern. Erst dann fügen wir Read-Replikas hinzu – nicht früher. Die meisten „Skalierungsprobleme“ sind vorzeitige Optimierung."
    - question: "Werden Investoren nicht nervös?"
      answer: "Hetzner ist ein europäisches Unternehmen mit über 1 Mrd. € Umsatz und besserer Verfügbarkeit als viele AWS-Setups junger Unternehmen. Das ist kein Raspberry Pi unter Ihrem Schreibtisch – sondern Enterprise-Infrastruktur ohne Komplexitätsaufschlag."
    - question: "Wie sieht es mit DSGVO-Konformität aus?"
      answer: "Die gesamte Infrastruktur bleibt in EU-Rechenzentren. Hetzner ist standardmäßig DSGVO-konform. Bei Bedarf stellen wir gern Auftragsverarbeitungsvereinbarungen bereit."
    - question: "Wie schafft ihr Kontext ohne Meetings?"
      answer: "Kurzes Loom-Video + Link zum GitHub-Issue. Das war’s. Wir lesen Ihren Code, stellen Fragen in Kommentaren und liefern Pull Requests. Die meisten „Meetings“ sind nur Status-Updates, die asynchron möglich sind."
    - question: "Was ist bei Notfällen?"
      answer: "Optional für €500/Monat stehen wir Ihnen 90 Tage lang über PagerDuty zur Verfügung. Danach sollten Sie uns nicht mehr brauchen – aber wir sind per DM erreichbar, falls doch."
    - question: "Wie gewährleistet ihr finanzielle Verantwortlichkeit?"
      answer: "Wir integrieren FinOps-Praktiken direkt in Ihren Workflow, sodass technische Entscheidungen stets mit Geschäftszielen abgestimmt sind."
    - question: "Müssen wir eure Tools nutzen?"
      answer: "Nein. Wir passen uns Ihrem Workflow an. Unser Ziel ist es, nahtlos in Ihre bestehenden Prozesse zu verschwinden."
    - question: "Wo ist der Haken?"
      answer: "Wir sind nicht die richtige Wahl, wenn Sie heute schon Multi-Region-Failover benötigen oder Kubernetes für „einfach“ halten. Dieses Angebot richtet sich an Teams, die Features liefern wollen – nicht Infrastruktur verwalten."
# Social-Proof-Abschnitt (optional für die Zukunft)
testimonials:
  title: "Was CTOs sagen"
  items: []
---
