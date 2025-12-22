---
title: "Cloud Repatriation in 2025: What the Numbers Actually Say"
date: 2025-12-22
description: "70% of enterprises plan to move workloads back on-prem. Here's what cloud repatriation actually looks like—and why it matters for growing teams."
author: "Eduardo Sanchez"
categories: ["Case Studies"]
tags: ["cloud-costs", "infrastructure", "repatriation", "vmware", "liquid-web", "a16z"]
draft: false
mermaid: true
---

# Cloud Repatriation in 2025: What the Numbers Actually Say

*What if the infrastructure you're paying for could cost you half as much—with better control?*

That's not a pitch. It's what the data is showing across companies of all sizes: a quiet but accelerating shift away from public cloud, back toward sustainable, hybrid architectures.

This isn't about hating AWS or declaring "cloud is dead." It's about recognizing that for many organizations, the economics have flipped—and the trade-offs have changed.

Let's look at what's actually happening.

## What Is Cloud Repatriation?

Cloud repatriation is the process of moving workloads, applications, or data from public cloud providers (AWS, GCP, Azure) back to on-premises infrastructure, co-location facilities, or dedicated servers.

It's not a return to the pre-cloud era. Modern repatriation usually means:

- **Dedicated servers** ([Hetzner](https://www.hetzner.com/), [OVHcloud](https://www.ovhcloud.com/), [Vultr](https://www.vultr.com/)) instead of EC2
- **Simple container orchestration** ([Docker Compose](https://docs.docker.com/compose/), [Kamal](https://kamal-deploy.org/), [Coolify](https://coolify.io/)) instead of Kubernetes
- **Predictable monthly bills** instead of usage-based pricing with egress surprises
- **Full root access** instead of managed-service abstraction layers

The goal isn't to abandon all cloud services—it's to place workloads where they make economic and operational sense. We call this **sustainable infrastructure**: a hybrid approach that uses cloud where it adds value, and dedicated resources where it saves money.

### What You're Trading

To be clear, repatriation involves trade-offs:

| What You Give Up | What You Gain |
|------------------|---------------|
| Automatic scaling (you manage capacity) | Predictable, fixed monthly costs |
| Some managed service convenience | Full control over your data and stack |
| Vendor-provided compliance certifications | No vendor lock-in or surprise egress bills |

For many teams, especially those with predictable workloads, the trade is worth it.

## The Data: What's Actually Happening

The repatriation trend isn't anecdotal—it's showing up in industry surveys, financial disclosures, and company announcements.

### Enterprise Signal: VMware Private Cloud Outlook 2025

VMware (now part of Broadcom) surveyed 1,800 senior IT leaders across 17 countries (Sept–Oct 2024):

| Finding | Result |
|---------|--------|
| Organizations planning to move workloads back on-prem within 24 months | **70%** (~1,260 orgs) |
| Call private cloud "critical" to 2025 strategy | **89%** (up from 54% in 2022) |
| Report 30-45% cost savings after repatriating | **51%** |
| Experienced public-cloud security incident (past 12 months) | **74%** |

**Top drivers for the shift:**
- Security and data sovereignty — **68%**
- Predictable costs (no egress surprises) — **61%**
- Regulatory and compliance requirements — **59%**

*Source: [VMware Private Cloud Outlook 2025](https://www.vmware.com/docs/private-cloud-outlook-2025)*

### IT Professionals: Liquid Web Dedicated Server Study 2025

A survey of 1,009 IT professionals across industries:

| Finding | Result |
|---------|--------|
| Currently using dedicated servers | **86%** |
| Migrated from public cloud back to dedicated (past 12 months) | **42%** |
| Cited full customization as top reason for dedicated over cloud | **55%** |
| Faced unexpected infrastructure costs ($5k–$25k) | **47%** |
| Believe current cloud spend is wasted on unused features/capacity | **32%** |
| View dedicated servers as essential | **53%** |
| Expect dedicated server role to grow by 2030 | **45%** |

The quote that stuck with me:

> "The biggest misconception is that we don't need [dedicated servers] anymore because of cloud adoption. But dedicated servers still handle our most critical operations due to reliability, control, and predictable costs."  
> — *IT professional, Liquid Web survey*

*Source: [Liquid Web Dedicated Server Study 2025](https://www.liquidweb.com/white-papers/dedicated-server-study/)*

## The a16z Analysis: The Cloud Paradox

Andreessen Horowitz published a widely-cited analysis in 2021 that has proven remarkably accurate. Their core insight:

> "You're crazy if you don't start in the cloud; you're crazy if you stay on it."

**Translation:** Cloud makes sense for speed at the start—but the economics flip as you scale. The problem is, by then you're locked in.

Their estimate: **$100B+ in market cap** lost across the top 50 public software companies due to cloud costs eating into gross margins.

**The Dropbox example:** Improved gross margin from **33% to 67%** after infrastructure optimization (a mix of repatriation and internal tooling), saving **$75M cumulatively** in the two years before their IPO.

I saw this dynamic firsthand when working at Unity Technologies. In their public financial results, cloud infrastructure is listed as the "second-largest expense category." When your hosting bill runs into the hundreds of millions annually, every percentage point of margin matters.

### a16z's 5 Recommendations

The article also provides a practical framework for companies evaluating their cloud spend:

1. **Make cloud spend a KPI** — Treat infrastructure as a first-class business metric, not just an engineering concern
2. **Incentivize the right behaviors** — One company used spot bonuses for engineers who reduced cloud spend → $3M savings in 6 months
3. **Optimize continuously** — Segment reduced infra costs by 30% while increasing traffic by 25%
4. **Think about repatriation up front** — Architect for portability early (one reason Kubernetes adoption grew)
5. **Incrementally repatriate** — Even aggressive companies retain 10-30% of workloads in cloud

We strongly recommend reading the full analysis: [a16z: The Cost of Cloud, a Trillion Dollar Paradox](https://a16z.com/the-cost-of-cloud-a-trillion-dollar-paradox/)

## The Famous Example: 37signals

DHH and the team at 37signals (Basecamp, HEY) are the most vocal about their cloud exit. The numbers from their public disclosures:

- **$3.2M/year** cloud spend in 2022 (already heavily optimized)
- **$10M projected savings** over 5 years after migration
- **Zero new hires** to manage the new infrastructure
- Built and open-sourced **[Kamal](https://kamal-deploy.org/)** for zero-downtime deploys

Their take:

> "The benefits have been vastly overstated. The cloud is often just as complicated as running things yourself, and it's usually ridiculously more expensive."  
> — DHH

*Source: [37signals Cloud Exit](https://basecamp.com/cloud-exit/) and [Leaving the Cloud podcast](https://37signals.com/podcast/leaving-the-cloud/)*

## The Gap: Why Growing Teams Get Stuck

Here's the problem.

The enterprise data is compelling—but if you're a growing startup with a 10-engineer team spending €70–90k/year on AWS, you're not going to spin up a data center or hire a platform team.

And if you're an indie hacker on a $5/month DigitalOcean droplet, you're already lean.

**The teams that get stuck are in the middle:**

| Attribute | Reality |
|-----------|---------|
| Team size | 5–15 engineers |
| Cloud spend | €70–90k/year (~€6–7.5k/month) |
| Ops situation | "One backend engineer is also the ops person" |
| Traffic | Often over-provisioned for actual load |
| Pain | Paying enterprise prices without enterprise needs |

These teams *know* they're overspending. They just don't have the time, expertise, or confidence to change it.

A quote from an Indie Hackers thread captures it perfectly:

> "I'm a Software Engineer and I don't know DevOps stuff that well. I'd like to build safe, scalable projects and don't worry that much about infrastructure... right now when I'm managing that, it takes too much time."

That's not a knowledge gap—it's a bandwidth gap.

## The Opportunity: Same Economics, Different Execution

The good news: **repatriation at startup scale is faster, cheaper, and lower-risk than the enterprise version.**

You don't need:
- A multi-year migration plan
- $500k in hardware
- A dedicated platform team

You need:
- A focused audit of your current spend (48–72 hours)
- A shortlist of workloads that are predictable and steady
- A migration path that doesn't block product work

### Real Examples

**[pirsch.io](https://pirsch.io/)** (privacy-friendly analytics) handles **150 million page views per month** on Hetzner infrastructure for **€300/month**. Their setup: a dedicated database server (€250/mo) plus 4 VMs and a load balancer (€50/mo). Simple. Predictable. Fast.

*Source: [pirsch.io Tech Stack](https://pirsch.io/blog/techstack/) and [2021 Recap](https://pirsch.io/blog/our-recap-of-2021/)*

**Our own test:** We ran a production workload on a single [Hetzner CAX21](https://www.hetzner.com/cloud/) (€7.59/month) and sustained **484 requests per second** with P99 latency under 200ms. The equivalent AWS Lambda cost? Estimated at **€10,560/month**.

That's not a rounding error. That's a **1,400x difference**.

*Source: Our full analysis (link to be added)*

## What This Means

Cloud repatriation isn't a contrarian stance—it's a data-driven re-evaluation of where your infrastructure budget delivers the most value.

The pattern is consistent across company sizes:

1. **Start in the cloud** — it makes sense early. Speed matters more than cost.
2. **Costs compound** — as traffic and complexity grow, so does the bill.
3. **Lock-in deepens** — every managed service you add makes migration harder.
4. **At some point, the math flips** — and staying becomes more expensive than leaving.

For enterprises, that tipping point comes at $500k–$3M/year in cloud spend.

For startups, it can come much earlier—especially if you're running predictable workloads on unpredictable pricing.

## What We're Doing

We're documenting this shift—and helping small teams make the move when it makes sense.

If you're spending €5k–15k/month on cloud infrastructure and wondering whether there's a simpler path, we're running focused **72-hour infrastructure audits** to map out your options. No commitment, just data.

**→ [Request an infrastructure audit](https://raus.cloud)**

Or follow along as we publish more. Next up: the step-by-step playbook for scaling from €8 to €800/month on simple infrastructure.

---

*Published December 23, 2025*