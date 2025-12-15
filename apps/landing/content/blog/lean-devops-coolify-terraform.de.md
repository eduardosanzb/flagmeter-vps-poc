---
title: "Der Lean DevOps Stack: Von Git Push zu Production in 2 Minuten"
date: 2025-12-15
description: "Wie wir eine produktionsreife Deployment-Pipeline mit Coolify, Docker Compose und Terraform aufgebaut haben – für 7,59 €/Monat statt eines DevOps-Engineers."
author: "Eduardo Sanchez"
categories: ["Case Studies", "Infrastructure Repatriation"]
tags: ["coolify", "docker-compose", "terraform", "hetzner", "devops", "ci-cd", "decloudification"]
draft: false
mermaid: true
---

## Das Versprechen: Production-Grade DevOps ohne DevOps-Team

In [Teil 1 dieser Serie](/de/blog/docker-swarm-test-11-euro-lesson/) haben wir bewiesen, dass ein einzelner 7,59 €/Monat VPS Docker Swarm um 37 % übertrifft. Aber Performance ist nur die halbe Geschichte.

**Die andere Hälfte:** Wie deployst du eigentlich Code auf diesen VPS, ohne deine Abende mit YAML-Debugging zu verbringen?

Dieser Artikel dokumentiert unser Setup: **Coolify + Docker Compose + Terraform**. Drei Tools, die uns Folgendes geben:

- **2-3 Minuten Deploys** getriggert durch `git push`
- **Preview Environments** für jeden PR (39 Sekunden zum Hochfahren)
- **Auto-HTTPS** via Let's Encrypt
- **Infrastructure-as-Code** für Disaster Recovery
- **Null DevOps-Einstellungen** nötig

Monatliche Gesamtkosten: **7,59 €** für den Application Server, plus **3,79 €** für die Coolify Control Plane.

---

## Teil 1: Das Docker Compose Fundament

### Warum Docker Compose (immer noch) gewinnt

Artikel 1 zeigte, dass Docker Swarm bei unserem Scale Komplexität ohne Nutzen hinzufügte. Docker Compose hingegen ist langweilig auf die beste Art:

- **Eine Datei** definiert deinen gesamten Stack
- **Jeder Entwickler** kennt es bereits
- **Keine Orchestrierungs-Magie** die man um 2 Uhr nachts debuggen muss
- **Localhost → Production** mit den gleichen Commands

Hier ist die tatsächliche Compose-Datei, die FlagMeter in Production betreibt:

```yaml
# coolify.yaml - Der gesamte Production Stack
services:
  dashboard:
    build:
      dockerfile: infra/docker/Dockerfile.dashboard
      context: .
    ports:
      - 3000
    environment:
      DATABASE_URL: postgresql://flagmeter:***@postgres:5432/flagmeter
      VALKEY_URL: redis://valkey:6379
      NODE_ENV: production
    depends_on:
      - postgres
      - valkey

  worker:
    build:
      dockerfile: infra/docker/Dockerfile.worker
      context: .
    environment:
      DATABASE_URL: ${DATABASE_URL}
      WORKER_CONCURRENCY: 4

  postgres:
    image: postgres:18-alpine
    command: >
      postgres
      -c synchronous_commit=off
      -c max_wal_size=3GB
      -c shared_buffers=1GB
    volumes:
      - postgres_data:/var/lib/postgresql/data

  valkey:
    image: valkey/valkey:7-alpine

  # Observability inklusive – kein Afterthought
  prometheus:
    build:
      dockerfile: infra/docker/Dockerfile.prometheus
    volumes:
      - prometheus_data:/prometheus

  grafana:
    build:
      dockerfile: infra/docker/Dockerfile.grafana
    ports:
      - 3001
```

**Was auffällt:**
- **7 Services** in einer Datei (App, Worker, Database, Cache, Monitoring)
- **Keine externen Dependencies** außer dem VPS selbst
- **Observability eingebaut** – Prometheus, Grafana, Loki für Logs
- **PostgreSQL auf Writes getuned** (`synchronous_commit=off` gibt uns 2-3× Durchsatz)

### Das simple Networking-Modell

Eines von Docker Compose's unterschätzten Features: **Networking funktioniert einfach**.

```mermaid
graph TB
    subgraph "Hetzner CAX21 (7,59 €/mo)"
        subgraph "Docker Network (bridge)"
            TRAEFIK[Traefik :443/:80]
            DASH[Dashboard :3000]
            WORKER[Worker]
            PG[(PostgreSQL :5432)]
            VALKEY[(Valkey :6379)]
            PROM[Prometheus :9090]
            GRAF[Grafana :3001]
        end
    end
    
    INTERNET((Internet)) --> TRAEFIK
    TRAEFIK --> DASH
    TRAEFIK --> GRAF
    DASH --> PG
    DASH --> VALKEY
    WORKER --> PG
    WORKER --> VALKEY
    PROM --> DASH
    PROM --> WORKER
```

Alle Services kommunizieren via Container-Namen (`postgres`, `valkey`, `dashboard`). Kein Service Mesh. Keine Overlay Networks. Keine DNS-Konfiguration.

**Das "entkoppelte Mindset":** Diese Compose-Datei hat null Coolify-spezifische Konfiguration. Wenn Coolify morgen verschwindet, führen wir `docker compose up -d` auf irgendeinem Server aus und sind wieder online.

---

## Teil 2: Coolify – Die Self-Hosted PaaS

### Was ist Coolify?

<a href="https://coolify.io" target="_blank" rel="noopener">Coolify</a> ist eine Open-Source, Self-Hosted Alternative zu Vercel, Heroku und Netlify. Stell es dir als Web-UI vor, die Docker Compose mit Deployment-Automation umwickelt.

**Die Zahlen sprechen für sich:**
- **48.500+ GitHub Stars** (kein Spielzeug)
- **280+ One-Click Services** verfügbar
- **Aktive Entwicklung** (10+ Commits allein in der letzten Woche, v4.0.0-beta.454 zum Zeitpunkt des Schreibens)
- **Kostenlos** (du zahlst nur für deinen VPS)

### Unser Workflow: Git Push → Production

Das passiert, wenn wir Code pushen:

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant GH as GitHub
    participant Cool as Coolify
    participant VPS as Hetzner VPS
    
    Dev->>GH: git push main
    GH->>Cool: Webhook Trigger
    Cool->>Cool: Pull Code
    Cool->>Cool: Build Docker Image (2-3 min)
    Cool->>VPS: Health Check bestanden?
    Cool->>VPS: Blue-Green Deploy
    Cool->>Dev: Slack Notification ✅
```

**Echte Deployment-Zeiten** aus unserem Coolify Dashboard:
- Typisches Deploy: **2-3 Minuten**
- Preview Environment: **39 Sekunden** (für die Landing Page)
- Deployments bis dato: **147** (FlagMeter) + **71** (Landing Page)

![Coolify Deployments zeigen 147 erfolgreiche Deploys mit 2-3 Minuten Build-Zeiten](/images/blog/coolify-deployments.png "147 Deployments, alle mit Commit-Links und PR-Referenzen getrackt")

### Preview Environments die das Budget nicht sprengen

Hier glänzt Coolify richtig. Jeder PR bekommt seine eigene Preview-URL:

- `https://demo.raus.cloud/` → main Branch
- `https://20.demo.raus.cloud/` → PR #20
- `https://21.raus.cloud/` → PR #21

![Coolify Links Dropdown zeigt Production und PR Preview URLs](/images/blog/coolify-preview-links.png "Ein Klick um zwischen Production und jeder PR Preview zu wechseln")

**Warum das wichtig ist:**

Bei Vercel Pro starten Preview Deployments bei **$20/Monat pro User**. Mit 5 Entwicklern sind das $100/Monat nur für Previews.

Unsere Kosten: **0 € extra**. Gleicher VPS, gleiche Ressourcen, unbegrenzte Previews.

Wir nutzen das auch für unsere Landing Page – jeder Blog-Post PR bekommt eine Preview, damit wir Formatierung, Übersetzungen und Screenshots vor dem Merge checken können.

![Preview von PR 21 zeigt die live raus.cloud Landing Page](/images/blog/coolify-preview-live.png "PR #21 Preview auf 21.raus.cloud – live in 39 Sekunden")

### Die Features die wir tatsächlich nutzen

**Auto-HTTPS via Let's Encrypt:**
- Domain eingeben → Coolify kümmert sich um Zertifikate
- Renewal ist automatisch
- Null Konfiguration außer dem Domain-Namen

**Environment Variables UI:**
- Keine `.env` Files mehr in Repos
- Secrets bleiben in Coolify, nicht in der Git History
- Verschiedene Werte pro Environment (Production vs Preview)

**Logs Aggregation:**
- Alle Container in einer Ansicht
- Filterung nach Service
- Kein separater Logging-Stack nötig (obwohl wir auch Loki betreiben)

![Coolify Logs Ansicht zeigt postgres-exporter und prometheus Logs](/images/blog/coolify-logs.png "Aggregierte Logs von allen Services an einem Ort")

**Hetzner Integration:**
- Klick auf "Connect a Hetzner Server"
- Gib dein Hetzner API Token ein
- Coolify provisioniert VPS direkt

![Coolify New Server Dialog zeigt Hetzner Integration Option](/images/blog/coolify-hetzner-integration.png "One-Click Hetzner Server Provisioning direkt in Coolify")

### Die ehrlichen Gotchas

Wir sind nicht hier um dir Coolify zu verkaufen. Das hat uns gestolpert:

**1. Coolify nutzt `docker compose up`, NICHT `docker stack deploy`**

Wenn du Docker Swarm Orchestration willst, macht Coolify das nicht automatisch. Du musst:
- Per SSH auf den Server
- `docker stack deploy` manuell ausführen
- Coolify nur für Monitoring/Management nutzen

Es gibt eine <a href="https://github.com/coollabsio/coolify/discussions/1846" target="_blank" rel="noopener">offene Diskussion</a> über besseren Swarm Support, aber aktuell glänzt Coolify bei **Single-Server Deployments**.

**2. Für Swarm Deployments brauchst du Custom Build Scripts und eine Registry**

Die Basics sind gut dokumentiert. Aber als wir Docker Swarm Deployments aufsetzen wollten, mussten wir kreativ werden. Swarm's `docker stack deploy` kann keine Images bauen – es pullt nur von Registries. Also haben wir:

1. **Eine Docker Registry self-gehosted** (Coolify hat einen One-Click Service dafür)
2. **Custom Build Scripts geschrieben** die Images bauen, taggen und pushen
3. **Coolify's Default Commands überschrieben** um `docker stack deploy` zu nutzen

![Coolify One-Click Docker Registry Service](/images/blog/coolify-docker-registry.png "One-Click Docker Registry Deployment in Coolify")

Hier ist unser Build Script das Coolify vor dem Deployment ausführt:

```bash
# scripts/build-and-push-observability.sh
REGISTRY_URL="registry.raus.cloud"

# Login zu unserer self-hosted Registry
echo "$REGISTRY_PASSWORD" | docker login "$REGISTRY_URL" -u "$REGISTRY_USER" --password-stdin

# Images mit docker compose bauen
docker compose -f coolify.observability.swarm.yaml build

# Zur Registry pushen damit Swarm Nodes sie pullen können
docker compose -f coolify.observability.swarm.yaml push
```

Dann überschreiben wir in Coolify's Advanced Settings die Default Commands:

![Coolify Custom Build und Start Commands für Swarm Deployment](/images/blog/coolify-swarm-custom-commands.png "Custom Build Command führt unser Script aus, Custom Start Command führt docker stack deploy aus")

**3. S3 Backups existieren, aber wir haben sie noch nicht battle-tested**

Coolify unterstützt <a href="https://coolify.io/docs/knowledge-base/s3/introduction" target="_blank" rel="noopener">geplante Database Backups zu S3-kompatiblem Storage</a> (AWS S3, Cloudflare R2, etc.). Das Feature existiert, die Dokumentation ist da, aber wir haben Recovery noch nicht stress-getestet. Das steht auf unserer Todo-Liste.

### Wann Coolify Sinn macht

**Nutze Coolify wenn:**
- Single-Server Deployments (unser Use Case)
- Kleine Teams (1-15 Engineers)
- Docker Compose ist dein Deployment-Format
- Du Vercel/Heroku DX ohne Lock-in willst

**Überlege Alternativen wenn:**
- Multi-Region Requirements von Tag eins
- Du Kubernetes brauchst (probier <a href="https://kamal-deploy.org/" target="_blank" rel="noopener">Kamal</a> oder raw K8s)
- Enterprise Compliance spezifisches Tooling erfordert

---

## Teil 3: Terraform – Der "Was wenn alles abbrennt?" Plan

### Warum Terraform wenn Coolify Server provisionieren kann?

Faire Frage. Coolify kann Hetzner Server direkt erstellen. Warum Terraform dazu?

**Drei Gründe die CTOs interessieren:**

1. **Reproduzierbarkeit**: `terraform apply` erstellt jedes Mal identische Infrastruktur
2. **Audit Trail**: Git History zeigt wer was wann geändert hat
3. **Disaster Recovery**: Server stirbt? `terraform apply` und du bist in 15 Minuten zurück

### Unser Terraform Setup (50 Zeilen die zählen)

```hcl
# servers.tf - Die gesamte Server Definition
resource "hcloud_server" "flagmeter" {
  name        = "flagmeter-prod"
  server_type = "cax21"  # 4 vCPU, 8GB RAM, 7,59 €/mo
  image       = "ubuntu-24.04"
  location    = "fsn1"

  ssh_keys     = [hcloud_ssh_key.deploy.id]
  firewall_ids = [hcloud_firewall.web.id]

  # Cloud-init installiert Docker automatisch
  user_data = file("${path.module}/cloud-init.yaml")
}

resource "hcloud_firewall" "web" {
  name = "web-firewall"
  
  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "22"
    source_ips = ["0.0.0.0/0"]
  }
  
  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "80"
    source_ips = ["0.0.0.0/0"]
  }
  
  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "443"
    source_ips = ["0.0.0.0/0"]
  }
}
```

Das war's. ~50 Zeilen für einen production-ready Server mit Firewall Rules.

### Der Armageddon Test

Wir haben diesen Test tatsächlich durchgeführt. Hier ist die Recovery Timeline:

| Schritt | Zeit | Command |
|---------|------|---------|
| Server stirbt | 0:00 | (simuliert mit `terraform destroy`) |
| Neuen Server provisionieren | 2:30 | `terraform apply` |
| Docker bereit | 4:00 | (cloud-init fertig) |
| Server zu Coolify hinzufügen | 5:00 | (klick "Validate" in UI) |
| Application redeployen | 8:00 | (automatisch via Webhook) |
| **Totale Recovery** | **~10 min** | |

Vergleich das mit "ruf die eine Person an die weiß wie wir den Server aufgesetzt haben" um 2 Uhr nachts.

### Terraform + Coolify Hybrid Approach

Unser tatsächlicher Workflow:

```mermaid
graph LR
    subgraph "Infrastructure Layer"
        TF[Terraform] --> SERVER[Hetzner VPS]
        TF --> FW[Firewall Rules]
        TF --> NET[Private Network]
    end
    
    subgraph "Application Layer"
        COOL[Coolify] --> DEPLOY[Deployments]
        COOL --> CERTS[SSL Zertifikate]
        COOL --> PREVIEW[PR Previews]
    end
    
    SERVER --> COOL
```

**Terraform handhabt:** Server Provisioning, Networking, Firewall Rules
**Coolify handhabt:** Application Deployment, SSL, Previews, Monitoring

Diese Trennung bedeutet:
- Infrastructure Changes gehen durch Code Review (Terraform)
- Application Changes gehen durch normalen PR Workflow (Coolify)
- Kein Tool hat zu viel Verantwortung

### Optional: Swarm Initialization Scripts

Wenn du *wirklich* Multi-Node Deployment brauchst, haben wir Scripts dafür:

```bash
# infra/terraform/scripts/01-init-swarm.sh
# Erstellt Swarm Cluster aus Terraform-provisionierten Servern

MANAGER_IP=$(terraform output -raw manager_public_ip)
WORKER_IP=$(terraform output -raw worker_public_ip)

# Swarm auf Manager initialisieren
ssh root@$MANAGER_IP "docker swarm init --advertise-addr 10.0.0.2"

# Join Token holen und Worker hinzufügen
TOKEN=$(ssh root@$MANAGER_IP "docker swarm join-token -q worker")
ssh root@$WORKER_IP "docker swarm join --token $TOKEN 10.0.0.2:2377"
```

Aber ehrlich? **Wir nutzen Swarm nicht mehr.** Artikel 1 hat bewiesen, dass Single-Server für unseren Scale besser ist.

### Bonus: Es gibt einen Terraform Provider für Coolify

Wir haben ihn nicht genutzt, aber er existiert: der <a href="https://registry.terraform.io/providers/SierraJC/coolify/latest/docs" target="_blank" rel="noopener">Coolify Terraform Provider</a>.

Theoretisch könntest du:
- Server automatisch in Coolify via Terraform registrieren
- Projekte und Resources programmatisch erstellen
- Ein vollautomatisiertes, Zero-Click Setup haben

**Warum wir diesen Weg nicht gegangen sind:**

1. Wir haben entdeckt dass Coolify Docker Swarm sowieso nicht orchestrieren kann
2. Sobald wir Swarm aufgegeben haben (Artikel 1), war Coolify's native Docker Compose Workflow ausreichend
3. Manuelle UI Klicks um 2 Server hinzuzufügen fühlten sich akzeptabel für unseren Scale an

Aber wenn du 10+ Server managst, könnte der Terraform Provider manuelle Schritte komplett eliminieren. Es ist nur eine API – integriere es so wie es für deinen Workflow Sinn macht.

---

## Der komplette Kosten-Breakdown

| Komponente | Was es macht | Monatliche Kosten |
|------------|--------------|-------------------|
| Coolify Control Plane | Läuft auf CAX11 (2 vCPU, 4GB) | 3,79 € |
| FlagMeter Production | CAX21 (4 vCPU, 8GB) | 7,59 € |
| SSL Zertifikate | Let's Encrypt via Coolify | 0 € |
| Preview Environments | Gleiche Server, dynamisches Routing | 0 € |
| **Gesamt** | | **11,38 €/mo** |

**Was das ersetzt:**
- Vercel Pro: $20/User/Monat × 5 = $100/Monat
- AWS (Lambda + RDS + ALB): 10.560 €/Monat (aus Artikel 1)
- DevOps Engineer: 5.000-8.000 €/Monat (nicht nötig)

---

## Die Vergleichstabellen

### Deployment Platform Vergleich

| Feature | Coolify | Vercel | Railway | Render |
|---------|---------|--------|---------|--------|
| Monatliche Kosten (unser Setup) | 11,38 € | $100+ | $50-200+ | $50-150+ |
| Self-Hosted Option | ✅ | ❌ | ❌ | ❌ |
| Docker Compose nativ | ✅ | ❌ | Limited | Limited |
| Preview Environments | ✅ Unbegrenzt | ✅ (paid) | ✅ (paid) | ✅ (paid) |
| Database inklusive | ✅ | ❌ | ✅ | ✅ |
| Vendor Lock-in | Keiner | Hoch | Mittel | Mittel |
| GitHub Stars | 48.500+ | N/A | N/A | N/A |

### Self-Hosted PaaS Vergleich

| Feature | Coolify | Dokku | CapRover | Kamal |
|---------|---------|-------|----------|-------|
| GitHub Stars | **48.500** | 29.000 | 13.000 | 12.000 |
| Web UI | ✅ Modern | ❌ Nur CLI | ✅ Basic | ❌ Nur CLI |
| Docker Compose | ✅ Nativ | Buildpack | ✅ | ❌ |
| Multi-Server | ✅ | Limited | ✅ | ✅ |
| Aktive Entwicklung | Sehr aktiv | Moderat | Moderat | Aktiv |
| Am besten für | Allgemein | Heroku-Style | Allgemein | Rails Apps |

---

## Was kommt als Nächstes

Dieser Artikel behandelte die DevOps-Schicht. Zukünftige Artikel in dieser Serie:

- **Teil 3: Die 8 € bis 800 € Scaling Roadmap** — Wann und wie man vertikal skaliert bevor man distributed geht
- **PostgreSQL in Production auf VPS betreiben** — Tuning, Backups, Monitoring und Disaster Recovery

---

<div style="text-align: center; margin: 3rem 0;">
  <a href="https://cal.com/eduardosanzb/15min" target="_blank" rel="noopener" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 1rem 2.5rem; border-radius: 0.5rem; font-weight: 600; font-size: 1.125rem; text-decoration: none; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.25); transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 12px rgba(16, 185, 129, 0.35)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(16, 185, 129, 0.25)';">
    📞 Kostenloses Infrastructure Audit buchen
  </a>
  <p style="margin-top: 1rem; color: #6b7280; font-size: 0.875rem;">15-Minuten Call • Kein Sales Pitch • Ehrliche Einschätzung</p>
</div>

---

**Vorheriger Teil:** [Wir haben 11 €/Monat ausgegeben, um Docker Swarm zu testen](/de/blog/docker-swarm-test-11-euro-lesson/)

---

*Dieser Artikel ist Teil unserer Infrastructure-Repatriation-Fallstudien. Echte Tools, echte Kosten, echte Lektionen beim Aufbau nachhaltiger Alternativen zur Cloud-Komplexität.*
