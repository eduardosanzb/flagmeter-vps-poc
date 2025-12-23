---
title: "Cloud-Repatriation 2025: Was die Zahlen wirklich sagen"
date: 2025-12-22
description: "70% der Unternehmen planen, Workloads zurück On-Prem zu bringen. Was Cloud-Repatriation wirklich bedeuten – und warum es auch für wachsende Teams wichtig ist."
author: "Eduardo Sanchez"
categories: ["Fallstudien"]
tags: ["cloud-kosten", "infrastruktur", "repatriierung", "vmware", "liquid-web", "a16z"]
draft: false
mermaid: true
---

# Cloud-Repatriation 2025: Was die Zahlen wirklich sagen

> **Kurz zusammengefasst:**
> - 70% der Unternehmen planen Workloads bis 2026 zurückzuholen — man ist nicht verrückt, das in Betracht zu ziehen
> - 42% der IT-Professionals haben letztes Jahr bereits von Cloud zurück zu Dedicated migriert
> - Typische Einsparungen: 30–50 % bei Infrastrukturkosten
> - Startups haben mehr Freiheit als Enterprises — keine Vendor-Politik oder Einkaufszyklen
> - Unser Test: €7,59/Monat VPS vs €10.560/Monat AWS Lambda für denselben Workload (1.400x Unterschied)
> - €5k–15k/Monat für Cloud ausgeben? [Wir helfen bei der Bewertung](/contact)

---

*Was wäre, wenn die Infrastruktur halb so viel kosten könnte — bei besserer Kontrolle?*

Die Daten zeigen bei Unternehmen verschiedener Größen einen Trend: einen leisen Wechsel weg von der Public Cloud, hin zu nachhaltigen, hybriden Architekturen.

Es geht nicht darum, AWS abzulehnen oder die Cloud für tot zu erklären. Es geht darum zu erkennen, dass sich für viele Unternehmen die Wirtschaftlichkeit geändert hat — und damit auch die Abwägungen.

## Was ist Cloud-Repatriation?

Cloud-Repatriation ist der Prozess, Workloads, Anwendungen oder Daten von Public-Cloud-Anbietern (AWS, GCP, Azure) zurück On-Premises, in Co-Location oder auf dedizierte Server zu verschieben.

Es ist kein Rückschritt in die Pre-Cloud-Ära. Moderne Repatriation bedeutet normalerweise:

- **Dedizierte Server** ([Hetzner](https://www.hetzner.com/), [OVHcloud](https://www.ovhcloud.com/), [Vultr](https://www.vultr.com/)) statt EC2
- **Einfache Container-Orchestrierung** ([Docker Compose](https://docs.docker.com/compose/), [Kamal](https://kamal-deploy.org/), [Coolify](https://coolify.io/)) statt Kubernetes
- **Vorhersehbare monatliche Rechnungen** statt nutzungsbasierter Preise mit Egress-Surprises
- **Voller Root-Zugriff** statt Managed-Service-Abstraktion

Das Ziel ist nicht, alle Cloud-Dienste aufzugeben – sondern Workloads dort zu platzieren, wo sie wirtschaftlich und operativ Sinn machen. Wir nennen das **nachhaltige Infrastruktur**: ein hybrider Ansatz, der Cloud dort nutzt, wo sie Mehrwert bringt, und dedizierte Ressourcen, wo sie Geld spart.

### Was man eintauscht

Um klar zu sein: Repatriation beinhaltet Trade-offs:

| Was man aufgibt | Was man gewinnt |
|------------------|------------------|
| Automatisches Skaling (man managt Kapazität) | Vorhersehbare, feste monatliche Kosten |
| Einige Managed-Service-Komforts | Vollkontrolle über Daten und Stack |
| Vendor-provided Compliance-Zertifizierungen | Kein Vendor-Lock-in oder Egress-Surprise-Rechnungen |

Für viele Teams, besonders mit vorhersehbaren Workloads, lohnt sich der Trade-off.

## Die Daten: Was wirklich passiert

Der Repatriation-Trend ist nicht anekdotisch – er zeigt sich in Branchenumfragen, Finanzberichten und Unternehmensankündigungen.

### Enterprise-Signal: VMware Private Cloud Outlook 2025

VMware (heute Teil von Broadcom) befragte 1.800 IT-Leiter in 17 Ländern (Sept–Okt 2024):

| Erkenntnis | Ergebnis |
|------------|----------|
| Organisationen, die Workloads innerhalb 24 Monate On-Prem verschieben wollen | **70%** (~1.260 Orgs) |
| Nennen Private Cloud „kritisch“ für 2025-Strategie | **89%** (von 54% in 2022) |
| Berichten 30-45% Kosteneinsparungen nach Repatriation | **51%** |
| Erlebten Public-Cloud-Sicherheitsvorfall (letzte 12 Monate) | **74%** |

**Top-Treiber des Wechsels:**
- Sicherheit und Datensouveränität – **68%**
- Kostenplanbarkeit (keine Egresssurprises) – **61%**
- Regulatorische/Compliance-Anforderungen – **59%**

*Quelle: [VMware Private Cloud Outlook 2025](https://www.vmware.com/docs/private-cloud-outlook-2025)*

### IT-Professionals: Liquid Web Dedicated Server Studie 2025

Eine Umfrage von 1.009 IT-Profis in verschiedenen Branchen:

| Erkenntnis | Ergebnis |
|------------|----------|
| Nutzen aktuell dedizierte Server | **86%** |
| Migrierten in letzten 12 Monaten von Public Cloud zurück | **42%** |
| Nannten volle Customization als Hauptgrund fürs Dedizierte | **55%** |
| Standen unerwarteten Infrastrukturkosten gegenüber ($5k–$25k) | **47%** |
| Glauben, dass aktuelle Cloud-Ausgaben für ungenutzte Features/Leistung verschwendet werden | **32%** |
| Sehen dedizierte Server als essentiell | **53%** |
| Erwarten Wachstum der Dedizierten bis 2030 | **45%** |

Das Zitat, das hängen blieb:

> "The biggest misconception is that we don't need [dedicated servers] anymore because of cloud adoption. But dedicated servers still handle our most critical operations due to reliability, control, and predictable costs."
> — *IT professional, Liquid Web survey*

*Quelle: [Liquid Web Dedicated Server Studie 2025](https://www.liquidweb.com/white-papers/dedicated-server-study/)*

## Die a16z-Analyse: Das Cloud-Paradoxon

Andreessen Horowitz veröffentlichte 2021 eine vielzitierte Analyse, die sich als bemerkenswert genau erwies. Ihre Kern-Erkenntnis:

> „You're crazy if you don't start in the cloud; you're crazy if you stay on it."

**Übersetzung:** Die Cloud macht am Anfang Sinn für Geschwindigkeit – aber die Wirtschaftlichkeit kippt beim Skalieren. Das Problem: Dann ist man bereits eingesperrt.

Ihre Schätzung: **$100 Mrd.+ Marktkapitalisierung** verloren bei den Top 50 Public-Software-Unternehmen durch Cloud-Kosten, die die Bruttomargen auffressen.

**Das Dropbox-Beispiel:** Verbesserte Bruttomarge von **33% auf 67%** nach Infrastruktur-Optimierung (Mix aus Repatriation und internen Tools), sparte **$75M kumuliert** in den zwei Jahren vor dem IPO.

Ich sah diese Dynamik hautnah, als ich bei Unity Technologies arbeitete. In ihren öffentlichen Finanzdaten wird Cloud-Infrastruktur als „zweitgrößte Ausgabenkategorie“ gelistet. Wenn die Hosting-Rechnung in die hunderten Millionen läuft, zählt jeder Prozentpunkt Marge.

Wir empfehlen dringend die vollständige Analyse: [a16z: The Cost of Cloud, a Trillion Dollar Paradox](https://a16z.com/the-cost-of-cloud-a-trillion-dollar-paradox/)

## Das berühmte Beispiel: 37signals

DHH und das 37signals-Team (Basecamp, HEY) sind die lautstärksten Befürworter ihrer Cloud-Abkehr. Die Zahlen aus öffentlichen Berichten:

- **$3,2M/Jahr** Cloud-Ausgaben 2022 (bereits stark optimiert)
- **$10M projizierte Einsparungen** über 5 Jahre nach Migration
- **Null neue Einstellungen** für die neue Infrastruktur-Verwaltung
- Entwickelten und Open-Sourcten **[Kamal](https://kamal-deploy.org/)** für Zero-Downtime-Deploys

Ihre Meinung:

> „Die Vorteile wurden masslos übertrieben. Die Cloud ist oft genauso kompliziert wie selbst betreiben, und meist erheblich teurer."
> — DHH

*Quelle: [37signals Cloud Exit](https://basecamp.com/cloud-exit/) und [Leaving the Cloud Podcast](https://37signals.com/podcast/leaving-the-cloud/)*

## Die Lücke: Warum wachsende Teams feststecken

Hier liegt das Problem.

Die Enterprise-Daten sind überzeugend – aber als wachsendes Startup mit 10 Ingenieuren, das €70–90k/Jahr bei AWS ausgibt, baut man kein Rechenzentrum und stellt kein Platform-Team ein.

Und als Indie-Hacker mit einem $5/Monat-DigitalOcean-Droplet ist man bereits schlank.

**Die Teams, die feststecken, sind in der Mitte:**

| Attribut | Realität |
|----------|----------|
| Team-Größe | 5–15 Ingenieure |
| Cloud-Ausgaben | €70–90k/Jahr (~€6–7,5k/Monat) |
| Ops-Situation | „Ein Backend-Ingenieur ist auch der Ops-Mensch" |
| Traffic | Häufig überprovisioniert für tatsächliche Last |
| Schmerz | Zahlen Enterprise-Preise ohne Enterprise-Bedarf |

Diese Teams *wissen*, dass sie zuviel ausgeben. Es fehlt nur die Zeit, Expertise oder Zuversicht, es zu ändern.

Ein Zitat aus einem Indie-Hackers-Thread fasst es perfekt zusammen:

> „Ich bin Software-Ingenieur und kenne DevOps-Sachen nicht so gut. Ich möchte sichere, skalierbare Projekte bauen und mir nicht so viele Gedanken über Infrastruktur machen... momentan, wenn ich das manage, dauert es zu viel Zeit."

Das ist keine Wissenslücke — es ist eine Zeitlücke.

### Warum Startups mehr Freiheit haben

Etwas ist erwähnenswert: Enterprises haben oft große Verträge mit Cloud-Anbietern, getrieben von Geschäftsbeziehungen und Top-Down-Entscheidungen. Politik und Einkaufszyklen zählen mehr als reine Wirtschaftlichkeit.

Startups haben diese Einschränkungen nicht. Man kann frei erkunden, experimentieren und Infrastruktur basierend auf dem wählen, was wirklich für das Team und Budget funktioniert. Die Probleme, die man löst, und die Entscheidungen, die man trifft, sind komplett anders als bei einem 10.000-Personen-Enterprise.

Diese Freiheit ist ein Vorteil — man sollte ihn nutzen.

## Die Gelegenheit: Dieselbe Wirtschaftlichkeit, andere Ausführung

Die gute Nachricht: **Repatriation im Startup-Maßstab ist schneller, günstiger und risikoärmer als die Enterprise-Version.**

Man braucht nicht:
- Einen mehrjährigen Migrationsplan
- $500k Hardware
- Ein dediziertes Platform-Team

Man braucht:
- Einen fokussierten Audit der aktuellen Ausgaben (48–72 Stunden)
- Eine Shortlist vorhersehbarer, stabiler Workloads
- Einen Migrationspfad, der Produkt-Arbeit nicht blockiert

### Echte Beispiele

**[pirsch.io](https://pirsch.io/)** (privacy-freundliche Analytics) handhabt **150 Millionen Page Views pro Monat** auf Hetzner-Infrastruktur für **€300/Monat**. Ihr Setup: ein dedizierter Datenbank-Server (€250/Monat) plus 4 VMs und ein Load Balancer (€50/Monat). Einfach. Planbar. Schnell.

*Quelle: [pirsch.io Tech Stack](https://pirsch.io/blog/techstack/) und [2021 Recap](https://pirsch.io/blog/our-recap-of-2021/)*

**Unser eigener Test:** Wir fuhren einen Produktions-Workload auf einem einzelnen [Hetzner CAX21](https://www.hetzner.com/cloud/) (€7,59/Monat) und hielten **484 Requests pro Sekunde** mit P99-Latenz unter 200ms durch. Die äquivalenten AWS Lambda-Kosten? Geschätzt **€10.560/Monat**.

Das ist keine Rundungsdifferenz. Das ist ein **1.400-facher Unterschied**.

*Quelle: Unsere vollständige Analyse (Link folgt)*

## Was dies bedeutet

Cloud-Repatriation ist keine konträre Position – es ist eine datengesteuerte Neubewertung, wo das Infrastrukturbudget den meisten Mehrwert liefert.

Das Muster ist konsistent über Unternehmensgrößen:

1. **In der Cloud starten** – macht am Anfang Sinn. Geschwindigkeit zählt mehr als Kosten.
2. **Kosten wachsen zusammen** – mit Traffic und Komplexität wächst die Rechnung.
3. **Lock-in vertieft sich** – jeder Managed Service macht Migration schwieriger.
4. **Irgendwann kippt die Mathematik** – und Bleiben wird teurer als Gehen.

Für Enterprises kommt dieser Wendepunkt bei $500k–$3M/Jahr Cloud-Ausgaben.

Für Startups kann er viel früher kommen – besonders bei vorhersehbaren Workloads auf unplanbaren Preismodellen.

## Was wir tun

Wir dokumentieren diesen Wandel – und helfen kleinen Teams beim Umzug, wenn es Sinn macht.

Wer €5k–15k/Monat für Cloud-Infrastruktur ausgibt und sich fragt, ob es einen einfacheren Weg gibt: Wir führen fokussierte **72-Stunden-Infrastruktur-Audits** durch, um die Optionen zu kartieren. Keine Verpflichtung, nur Daten.

**→ [Infrastruktur-Audit anfragen](https://raus.cloud)**

Oder einfach mitverfolgen, wenn wir mehr veröffentlichen. Als Nächstes: Die Schritt-für-Schritt-Playbook, um von €8 auf €800/Monat auf einfacher Infrastruktur zu skalieren.

---

*Veröffentlicht 23. Dezember 2025*
