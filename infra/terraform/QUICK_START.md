# FlagMeter Terraform - Quick Start Guide

## What Was Created

Complete Terraform infrastructure for deploying FlagMeter on Hetzner Cloud with Docker Swarm, following the Coolify AWS deployment guide.

### ✅ Files Created

```
infra/terraform/
├── versions.tf                   # Terraform >=1.6.0, Hetzner provider ~>1.45
├── providers.tf                  # Hetzner Cloud provider configuration
├── variables.tf                  # All input variables (tokens, passwords, etc.)
├── network.tf                    # Private network (10.0.0.0/16) - FREE bandwidth
├── firewall.tf                   # Security rules (SSH, HTTP/HTTPS, Swarm ports)
├── ssh-keys.tf                   # SSH key management
├── servers.tf                    # 2x CAX11 servers (manager + worker)
├── outputs.tf                    # Server IPs + complete deployment guide
├── cloud-init.tftpl              # Cloud-init template (installs Docker)
├── terraform.tfvars.example      # Template for secrets
├── .gitignore                    # Ignores state files + secrets
├── README.md                     # Complete documentation
├── QUICK_START.md                # This file
│
└── scripts/
    ├── 01-init-swarm.sh          # Initialize Docker Swarm cluster
    ├── 03-configure-registry.sh  # Configure registry.raus.cloud login
    └── 04-deploy-stacks.sh       # Deploy observability + app stacks
```

## Architecture

**2x CAX11 Servers** (ARM64, 2 vCPU, 4GB RAM each)
- **Manager** (10.0.0.2): Prometheus, Grafana, Loki
- **Worker** (10.0.0.3): Dashboard, Worker, PostgreSQL, Valkey

**Cost:** €7.58/month + FREE private network bandwidth

## 5-Minute Deployment

### 1. Configure Secrets

```bash
cd infra/terraform

# Copy template
cp terraform.tfvars.example terraform.tfvars

# Edit with your values
vim terraform.tfvars
```

**Required:**
- Hetzner API token (from console.hetzner.cloud)
- SSH public key path
- Docker registry credentials
- PostgreSQL password
- Grafana admin password

### 2. Deploy Infrastructure

```bash
# Initialize
terraform init

# Review plan
terraform plan

# Apply (takes 2-3 minutes)
terraform apply
```

### 3. Initialize Swarm

```bash
./scripts/01-init-swarm.sh
```

This automatically:
- ✅ Waits for Docker installation
- ✅ Initializes Swarm on manager
- ✅ Joins worker to Swarm
- ✅ Creates overlay network

### 4. Add to Coolify (Manual)

Open https://cool.eduardosanzb.dev

**Add Manager:**
- Servers → Add New Server
- IP: *(from terraform output)*
- User: root
- ☑️ **Check "Swarm Manager"**
- Validate

**Add Worker:**
- Servers → Add New Server
- IP: *(from terraform output)*
- User: root
- ☑️ **Check "It is a swarm Worker"**
- Validate

### 5. Configure Registry

```bash
./scripts/03-configure-registry.sh
```

Logs all nodes into registry.raus.cloud.

### 6. Deploy Stacks

```bash
./scripts/04-deploy-stacks.sh
```

Deploys:
- **Observability stack:** Prometheus, Grafana, Loki
- **Application stack:** Dashboard, Worker, PostgreSQL, Valkey

### 7. Access Services

```bash
# Get IPs
terraform output

# Test
curl http://WORKER_IP:3000/api/health
```

**URLs:**
- Dashboard: `http://WORKER_IP:3000`
- Grafana: `http://MANAGER_IP:3001`
- Prometheus: `http://MANAGER_IP:9090`

## Common Commands

```bash
# View deployment guide
terraform output next_steps

# SSH to manager
ssh root@$(terraform output -raw manager_public_ip)

# List Swarm services
ssh root@$(terraform output -raw manager_public_ip) docker service ls

# View service logs
ssh root@$(terraform output -raw manager_public_ip) docker service logs -f app_dashboard

# Scale a service
ssh root@$(terraform output -raw manager_public_ip) docker service scale app_worker=3

# Destroy everything
terraform destroy
```

## Troubleshooting

### Docker not ready

```bash
# Check cloud-init progress
ssh root@$(terraform output -raw manager_public_ip) cat /var/log/cloud-init-output.log

# Check Docker status
ssh root@$(terraform output -raw manager_public_ip) systemctl status docker
```

### Swarm issues

```bash
# Reset manager
ssh root@$(terraform output -raw manager_public_ip) docker swarm leave --force

# Reset worker
ssh root@$(terraform output -raw worker_public_ip) docker swarm leave

# Re-run
./scripts/01-init-swarm.sh
```

### Registry issues

```bash
# Manual login
ssh root@$(terraform output -raw manager_public_ip) \
  docker login registry.raus.cloud -u USERNAME -p PASSWORD
```

## Next Steps

1. **Setup DNS:**
   - Point `meter.raus.cloud` → Worker IP
   - Point `grafana.raus.cloud` → Manager IP

2. **Configure SSL:**
   - Let's Encrypt via Coolify/Traefik
   - Or Cloudflare proxy

3. **Run Migrations:**
   ```bash
   ssh root@$(terraform output -raw manager_public_ip) \
     docker exec app_dashboard sh -c "cd /app/packages/db && pnpm db:push:force"
   ```

4. **Load Test:**
   - Use k6 or custom load tester
   - Document max RPS on CAX11
   - Compare performance

## Support

- **Full docs:** `README.md`
- **Deployment guide:** `terraform output next_steps`
- **Terraform state:** `terraform show`
- **Debug:** `terraform console`

---

**Ready to deploy!** Start with step 1 above. 🚀
