---
title: "El Stack de DevOps Lean: de Git Push a Producción en 2 Minutos"
date: 2025-12-15
description: "Cómo construimos un pipeline de despliegue de nivel de producción con Coolify, Docker Compose y Terraform, gastando 7,59 €/mes en lugar de contratar a un ingeniero de DevOps."
author: "Eduardo Sanchez"
categories: ["Casos de Estudio", "Repatriación de Infraestructura"]
tags: ["coolify", "docker-compose", "terraform", "hetzner", "devops", "ci-cd", "decloudification"]
draft: false
mermaid: true
---

## La Promesa: DevOps de nivel de producción sin el equipo de DevOps

En la [Parte 1 de esta serie](/es/blog/docker-swarm-test-11-euro-lesson/), demostramos que un solo VPS de 7,59 €/mes supera a Docker Swarm en un 37%. Pero el rendimiento es solo la mitad de la historia.

**La otra mitad:** ¿Cómo despliegas realmente el código en ese VPS sin pasar tus noches depurando YAML?

Este artículo documenta nuestra configuración: **Coolify + Docker Compose + Terraform**. Tres herramientas que nos ofrecen:

- **Despliegues en 2-3 minutos** activados por `git push`
- **Entornos de previsualización** para cada PR (39 segundos para activarse)
- **HTTPS automático** a través de Let's Encrypt
- **Infraestructura como código** para recuperación ante desastres
- **Cero contrataciones de DevOps** requeridas

Coste mensual total: **7,59 €** para el servidor de aplicaciones, más **3,79 €** para el plano de control de Coolify.

---

## Parte 1: La base de Docker Compose

### Por qué Docker Compose (todavía) gana

El Artículo 1 mostró que Docker Swarm añadía complejidad sin beneficios a nuestra escala. Docker Compose, por otro lado, es aburrido en el mejor sentido:

- **Un solo archivo** define todo tu stack
- **Cualquier desarrollador** ya lo conoce
- **Sin magia de orquestación** que depurar a las 2 de la mañana
- **De localhost a producción** con los mismos comandos

Aquí está el archivo de compose real que ejecuta FlagMeter en producción:

```yaml
# coolify.yaml - Todo el stack de producción
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

  # Observabilidad incluida, no como algo secundario
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

**Qué es notable:**
- **7 servicios** en un solo archivo (app, worker, base de datos, caché, monitorización)
- **Sin dependencias externas** excepto el propio VPS
- **Observabilidad integrada**: Prometheus, Grafana, Loki para logs
- **PostgreSQL optimizado para escrituras** (`synchronous_commit=off` nos da 2-3 veces más rendimiento)

### El modelo de red simple

Una de las características infravaloradas de Docker Compose: **la red simplemente funciona**.

```mermaid
graph TB
    subgraph "Hetzner CAX21 (7,59 €/mes)"
        subgraph "Red Docker (bridge)"
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

Todos los servicios se comunican a través de los nombres de los contenedores (`postgres`, `valkey`, `dashboard`). Sin service mesh. Sin redes overlay. Sin configuración de DNS.

**La "mentalidad desacoplada":** Este archivo de compose tiene cero configuración específica de Coolify. Si Coolify desaparece mañana, ejecutamos `docker compose up -d` en cualquier servidor y volvemos a estar en línea.

---

## Parte 2: Coolify — El PaaS autogestionado

### ¿Qué es Coolify?

<a href="https://coolify.io" target="_blank" rel="noopener">Coolify</a> es una alternativa de código abierto y autogestionada a Vercel, Heroku y Netlify. Piénsalo como una interfaz web que envuelve Docker Compose con automatización de despliegue.

**Los números hablan:**
- **Más de 48.500 estrellas en GitHub** (no es un juguete)
- **Más de 280 servicios** disponibles con un solo clic
- **Desarrollo activo** (más de 10 commits solo en la última semana, v4.0.0-beta.454 al momento de escribir esto)
- **Gratis** (solo pagas por tu VPS)

### Nuestro flujo de trabajo: Git Push → Producción

Esto es lo que sucede cuando enviamos código:

```mermaid
sequenceDiagram
    participant Dev as Desarrollador
    participant GH as GitHub
    participant Cool as Coolify
    participant VPS as VPS Hetzner
    
    Dev->>GH: git push main
    GH->>Cool: Disparador Webhook
    Cool->>Cool: Obtener código
    Cool->>Cool: Construir imagen Docker (2-3 min)
    Cool->>VPS: ¿Pasa el health check?
    Cool->>VPS: Despliegue Blue-green
    Cool->>Dev: Notificación de Slack ✅
```

**Tiempos de despliegue reales** de nuestro dashboard de Coolify:
- Despliegue típico: **2-3 minutos**
- Entorno de previsualización: **39 segundos** (para la página de aterrizaje)
- Despliegues totales hasta la fecha: **147** (FlagMeter) + **71** (página de aterrizaje)

![Despliegues de Coolify que muestran 147 despliegues exitosos con tiempos de construcción de 2-3 minutos](/images/blog/coolify-deployments.png "147 despliegues, todos rastreados con enlaces a commits y referencias a PR")

### Entornos de previsualización que no te arruinan

Aquí es donde Coolify realmente brilla. Cada PR obtiene su propia URL de previsualización:

- `https://demo.raus.cloud/` → rama main
- `https://20.demo.raus.cloud/` → PR #20
- `https://21.raus.cloud/` → PR #21

![Desplegable de enlaces de Coolify que muestra las URLs de producción y de previsualización de PR](/images/blog/coolify-preview-links.png "Un clic para cambiar entre producción y cualquier previsualización de PR")

**Por qué esto importa:**

En Vercel Pro, los despliegues de previsualización empiezan en **20 $/mes por usuario**. Con 5 ingenieros, eso son 100 $/mes solo por las previsualizaciones.

Nuestro coste: **0 € extra**. El mismo VPS, los mismos recursos, previsualizaciones ilimitadas.

Usamos esto también para nuestra página de aterrizaje — cada PR de un artículo del blog obtiene una previsualización para que podamos revisar el formato, las traducciones y las capturas de pantalla antes de fusionar.

![Previsualización del PR 21 que muestra la página de aterrizaje de raus.cloud en vivo](/images/blog/coolify-preview-live.png "Previsualización del PR #21 en 21.raus.cloud — en vivo en 39 segundos")

### Las características que realmente usamos

**HTTPS automático vía Let's Encrypt:**
- Introduce el dominio → Coolify gestiona los certificados
- La renovación es automática
- Cero configuración más allá del nombre del dominio

**Interfaz de Variables de Entorno:**
- Se acabaron los archivos `.env` en los repositorios
- Los secretos se quedan en Coolify, no en el historial de git
- Diferentes valores por entorno (producción vs previsualización)

**Agregación de Logs:**
- Todos los contenedores en una sola vista
- Filtrado por servicio
- No se necesita un stack de logs separado (aunque también ejecutamos Loki)

![Vista de logs de Coolify que muestra los logs de postgres-exporter y prometheus](/images/blog/coolify-logs.png "Logs agregados de todos los servicios en un solo lugar")

**Integración con Hetzner:**
- Haz clic en "Conectar un servidor Hetzner"
- Introduce tu token de la API de Hetzner
- Coolify provisiona el VPS directamente

![Diálogo de nuevo servidor de Coolify que muestra la opción de integración con Hetzner](/images/blog/coolify-hetzner-integration.png "Aprovisionamiento de servidores Hetzner con un solo clic integrado en Coolify")

### Las dificultades honestas

No estamos aquí para venderte Coolify. Esto es lo que nos causó problemas:

**1. Coolify usa `docker compose up`, NO `docker stack deploy`**

Si quieres orquestación con Docker Swarm, Coolify no lo hará automáticamente. Tienes que:
- Conectarte por SSH al servidor
- Ejecutar `docker stack deploy` manualmente
- Usar Coolify solo para monitorización/gestión

Hay una <a href="https://github.com/coollabsio/coolify/discussions/1846" target="_blank" rel="noopener">discusión abierta</a> sobre un mejor soporte para Swarm, pero por ahora, Coolify destaca en **despliegues en un solo servidor**.

**2. Para despliegues en Swarm, necesitas scripts de construcción personalizados y un registro (registry)**

Los conceptos básicos están bien documentados. Pero cuando intentamos configurar despliegues en Docker Swarm, tuvimos que ser creativos. El `docker stack deploy` de Swarm no puede construir imágenes — solo puede descargarlas de registros. Así que nosotros:

1. **Autogestionamos un Registro Docker** (Coolify tiene un servicio de un solo clic para esto)
2. **Escribimos scripts de construcción personalizados** que construyen, etiquetan y envían las imágenes
3. **Sobrescribimos los comandos por defecto de Coolify** para usar `docker stack deploy`

![Servicio de un solo clic de Registro Docker de Coolify](/images/blog/coolify-docker-registry.png "Despliegue de Registro Docker con un solo clic en Coolify")

Aquí está nuestro script de construcción que Coolify ejecuta antes del despliegue:

```bash
# scripts/build-and-push-observability.sh
REGISTRY_URL="registry.raus.cloud"

# Login en nuestro registro autogestionado
echo "$REGISTRY_PASSWORD" | docker login "$REGISTRY_URL" -u "$REGISTRY_USER" --password-stdin

# Construir imágenes usando docker compose
docker compose -f coolify.observability.swarm.yaml build

# Enviar al registro para que los nodos de Swarm puedan descargarlas
docker compose -f coolify.observability.swarm.yaml push
```

Luego, en la configuración avanzada de Coolify, sobrescribimos los comandos por defecto:

![Comandos personalizados de construcción e inicio de Coolify para despliegue en Swarm](/images/blog/coolify-swarm-custom-commands.png "El comando de construcción personalizado ejecuta nuestro script, el comando de inicio personalizado ejecuta docker stack deploy")

**3. Las copias de seguridad en S3 existen pero no las hemos probado a fondo**

Coolify soporta <a href="https://coolify.io/docs/knowledge-base/s3/introduction" target="_blank" rel="noopener">copias de seguridad programadas de la base de datos a almacenamiento compatible con S3</a> (AWS S3, Cloudflare R2, etc.). La función existe, la documentación está ahí, pero no hemos probado la recuperación bajo estrés. Eso está en nuestra lista de tareas pendientes.

### Cuándo tiene sentido Coolify

**Usa Coolify cuando:**
- Despliegues en un solo servidor (nuestro caso de uso)
- Equipos pequeños (1-15 ingenieros)
- Docker Compose es tu formato de despliegue
- Quieres la experiencia de desarrollador de Vercel/Heroku sin el bloqueo

**Considera alternativas cuando:**
- Requisitos multi-región desde el primer día
- Necesitas Kubernetes (prueba <a href="https://kamal-deploy.org/" target="_blank" rel="noopener">Kamal</a> o K8s puro)
- El cumplimiento empresarial requiere herramientas específicas

---

## Parte 3: Terraform — El plan de "¿Y si todo arde?"

### ¿Por qué Terraform si Coolify puede provisionar servidores?

Pregunta justa. Coolify puede crear servidores Hetzner directamente. ¿Por qué añadir Terraform?

**Tres razones que importan a los CTOs:**

1. **Reproducibilidad**: `terraform apply` crea una infraestructura idéntica cada vez
2. **Historial de auditoría**: El historial de git muestra quién cambió qué y cuándo
3. **Recuperación ante desastres**: ¿Muere el servidor? `terraform apply` y estás de vuelta en 15 minutos

### Nuestra configuración de Terraform (50 líneas que importan)

```hcl
# servers.tf - La definición completa del servidor
resource "hcloud_server" "flagmeter" {
  name        = "flagmeter-prod"
  server_type = "cax21"  # 4 vCPU, 8GB RAM, 7,59 €/mes
  image       = "ubuntu-24.04"
  location    = "fsn1"

  ssh_keys     = [hcloud_ssh_key.deploy.id]
  firewall_ids = [hcloud_firewall.web.id]

  # Cloud-init instala Docker automáticamente
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

Eso es todo. Unas 50 líneas para un servidor listo para producción con reglas de firewall.

### La prueba del Armagedón

Realmente hicimos esta prueba. Aquí está la cronología de recuperación:

| Paso | Tiempo | Comando |
|------|------|---------|
| El servidor muere | 0:00 | (simulado con `terraform destroy`) |
| Provisión de nuevo servidor | 2:30 | `terraform apply` |
| Docker listo | 4:00 | (cloud-init completado) |
| Añadir servidor a Coolify | 5:00 | (clic en "Validar" en la interfaz) |
| Redesplegar aplicación | 8:00 | (automático vía webhook) |
| **Recuperación total** | **~10 min** | |

Compara eso con "llamar a la única persona que sabe cómo configuramos el servidor" a las 2 de la mañana.

### Enfoque híbrido Terraform + Coolify

Nuestro flujo de trabajo real:

```mermaid
graph LR
    subgraph "Capa de Infraestructura"
        TF[Terraform] --> SERVER[VPS Hetzner]
        TF --> FW[Reglas de Firewall]
        TF --> NET[Red Privada]
    end
    
    subgraph "Capa de Aplicación"
        COOL[Coolify] --> DEPLOY[Despliegues]
        COOL --> CERTS[Certificados SSL]
        COOL --> PREVIEW[Previsualizaciones de PR]
    end
    
    SERVER --> COOL
```

**Terraform gestiona:** Aprovisionamiento de servidores, redes, reglas de firewall.
**Coolify gestiona:** Despliegue de aplicaciones, SSL, previsualizaciones, monitorización.

Esta separación significa:
- Los cambios de infraestructura pasan por revisión de código (Terraform)
- Los cambios de aplicación pasan por el flujo normal de PR (Coolify)
- Ninguna herramienta tiene demasiada responsabilidad

### Opcional: Scripts de inicialización de Swarm

Si *realmente* necesitas despliegues multi-nodo, tenemos scripts para ello:

```bash
# infra/terraform/scripts/01-init-swarm.sh
# Crea el clúster Swarm a partir de los servidores provisionados por Terraform

MANAGER_IP=$(terraform output -raw manager_public_ip)
WORKER_IP=$(terraform output -raw worker_public_ip)

# Inicializar Swarm en el manager
ssh root@$MANAGER_IP "docker swarm init --advertise-addr 10.0.0.2"

# Obtener token de unión y añadir worker
TOKEN=$(ssh root@$MANAGER_IP "docker swarm join-token -q worker")
ssh root@$WORKER_IP "docker swarm join --token $TOKEN 10.0.0.2:2377"
```

¿Pero honestamente? **Ya no usamos Swarm.** El Artículo 1 demostró que un solo servidor es mejor para nuestra escala.

### Bonus: Hay un proveedor de Terraform para Coolify

No lo usamos, pero existe: el <a href="https://registry.terraform.io/providers/SierraJC/coolify/latest/docs" target="_blank" rel="noopener">Coolify Terraform Provider</a>.

En teoría, podrías:
- Registrar automáticamente servidores en Coolify vía Terraform
- Crear proyectos y recursos de forma programática
- Tener una configuración totalmente automatizada con cero clics

**Por qué no seguimos este camino:**

1. Descubrimos que Coolify no puede orquestar Docker Swarm de todos modos.
2. Una vez que abandonamos Swarm (Artículo 1), el flujo de trabajo nativo de Docker Compose de Coolify fue suficiente.
3. Los clics manuales en la interfaz para añadir 2 servidores nos parecieron aceptables para nuestra escala.

Pero si gestionas más de 10 servidores, el proveedor de Terraform podría eliminar los pasos manuales por completo. Es solo una API, intégrala como tenga sentido para tu flujo de trabajo.

---

## El desglose completo de costes

| Componente | Qué hace | Coste Mensual |
|-----------|--------------|--------------|
| Plano de control de Coolify | Se ejecuta en CAX11 (2 vCPU, 4GB) | 3,79 € |
| Producción de FlagMeter | CAX21 (4 vCPU, 8GB) | 7,59 € |
| Certificados SSL | Let's Encrypt vía Coolify | 0 € |
| Entornos de previsualización | Mismos servidores, enrutamiento dinámico | 0 € |
| **Total** | | **11,38 €/mes** |

**A qué sustituye esto:**
- Vercel Pro: 20 $/usuario/mes × 5 = 100 $/mes
- AWS (Lambda + RDS + ALB): 10.560 €/mes (del Artículo 1)
- Ingeniero de DevOps: 5.000-8.000 €/mes (no necesario)

---

## Tablas comparativas

### Comparativa de plataformas de despliegue

| Característica | Coolify | Vercel | Railway | Render |
|---------|---------|--------|---------|--------|
| Coste mensual (nuestra conf) | 11,38 € | 100 $+ | 50-200 $+ | 50-150 $+ |
| Opción autogestionada | ✅ | ❌ | ❌ | ❌ |
| Nativo para Docker Compose | ✅ | ❌ | Limitado | Limitado |
| Entornos previsualización | ✅ Ilimitados | ✅ (pago) | ✅ (pago) | ✅ (pago) |
| Base de datos incluida | ✅ | ❌ | ✅ | ✅ |
| Bloqueo de proveedor | Ninguno | Alto | Medio | Medio |
| Estrellas en GitHub | 48.500+ | N/A | N/A | N/A |

### Comparativa de PaaS autogestionados

| Característica | Coolify | Dokku | CapRover | Kamal |
|---------|---------|-------|----------|-------|
| Estrellas en GitHub | **48.500** | 29.000 | 13.000 | 12.000 |
| Interfaz Web | ✅ Moderna | ❌ Solo CLI | ✅ Básica | ❌ Solo CLI |
| Docker Compose | ✅ Nativo | Buildpack | ✅ | ❌ |
| Multi-servidor | ✅ | Limitado | ✅ | ✅ |
| Desarrollo activo | Muy activo | Moderado | Moderado | Activo |
| Ideal para | Uso general | Estilo Heroku | Uso general | Apps Rails |

## Qué sigue

Este artículo cubrió la capa de DevOps. Futuros artículos de esta serie:

- **Parte 3: La hoja de ruta de escalado de 8 € a 800 €** — Cuándo y cómo escalar verticalmente antes de pasar a sistemas distribuidos.
- **Ejecutar PostgreSQL en producción en un VPS** — Ajuste, copias de seguridad, monitorización y recuperación ante desastres.

---

<div style="text-align: center; margin: 3rem 0;">
  <a href="https://cal.com/eduardosanzb/15min" target="_blank" rel="noopener" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 1rem 2.5rem; border-radius: 0.5rem; font-weight: 600; font-size: 1.125rem; text-decoration: none; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.25); transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 12px rgba(16, 185, 129, 0.35)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(16, 185, 129, 0.25)';">
    📞 Reserva tu Auditoría de Infraestructura Gratuita
  </a>
  <p style="margin-top: 1rem; color: #6b7280; font-size: 0.875rem;">Llamada de 15 minutos • Sin discurso de ventas • Evaluación honesta</p>
</div>

---

**Anterior en la serie:** [Gastamos 11 €/mes probando Docker Swarm para que tú no tengas que hacerlo](/es/blog/docker-swarm-test-11-euro-lesson/)

---

*Este artículo es parte de nuestros casos de estudio sobre repatriación de infraestructura. Herramientas reales, costes reales, lecciones reales aprendidas mientras construimos alternativas sostenibles a la complejidad de la nube.*
