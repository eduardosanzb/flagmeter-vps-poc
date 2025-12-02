# FlagMeter Terraform Infrastructure

Complete Terraform configuration for deploying FlagMeter on Hetzner Cloud with Docker Swarm, following the Coolify deployment guide.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Hetzner Cloud - 2x CAX11 Servers                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Private Network: 10.0.0.0/16 (free internal bandwidth)    │
│                                                              │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │ Swarm Manager    │◄───────►│ Swarm Worker     │         │
│  │ CAX11 (€3.79/mo) │ Private │ CAX11 (€3.79/mo) │         │
│  │ 10.0.0.2         │         │ 10.0.0.3         │         │
│  ├──────────────────┤         ├──────────────────┤         │
│  │ Observability:   │         │ Application:     │         │
│  │ - Prometheus     │         │ - Dashboard      │         │
│  │ - Grafana :443   │         │ - Worker         │         │
│  │ - Loki           │         │ - PostgreSQL     │         │
│  └──────────────────┘         │ - Valkey         │         │
│         ▲                      │ - Exporters      │         │
│         │ Scrapes metrics      └──────────────────┘         │
│         └──────────────────────────────────────────         │
│                                                              │
│  Total Cost: €7.58/month                                    │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

1. **Hetzner Cloud Account**
   - Sign up at https://console.hetzner.cloud
   - Create API token: Security → API Tokens → Generate
   - Permissions: Read & Write

2. **Terraform** >= 1.6.0
   ```bash
   # macOS
   brew install terraform
   
   # Linux
   wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
   unzip terraform_1.6.0_linux_amd64.zip
   sudo mv terraform /usr/local/bin/
   ```

3. **SSH Key Pair**
   ```bash
   # Generate new key pair
   ssh-keygen -t ed25519 -C "flagmeter-deploy" -f ~/.ssh/flagmeter_deploy
   ```

4. **Docker Registry** (registry.raus.cloud)
   - Registry URL and credentials

5. **Coolify Control Plane** (optional)
   - Existing Coolify instance at https://cool.eduardosanzb.dev

## Quick Start

### 1. Clone and Configure

```bash
cd infra/terraform

# Copy example secrets file
cp terraform.tfvars.example terraform.tfvars

# Edit with your actual values
vim terraform.tfvars
```

**Required values in `terraform.tfvars`:**
- `hcloud_token` - Your Hetzner API token
- `ssh_public_key_path` - Path to your SSH public key
- `docker_registry_username` - Registry username
- `docker_registry_password` - Registry password
- `postgres_password` - Strong password for PostgreSQL
- `grafana_admin_password` - Strong password for Grafana

### 2. Initialize Terraform

```bash
terraform init
```

### 3. Review Plan

```bash
terraform plan
```

This will show you:
- 2 servers (manager + worker)
- 1 private network
- 1 firewall with Docker Swarm ports
- 1 SSH key

### 4. Apply Configuration

```bash
terraform apply
```

Type `yes` to confirm. This takes ~2-3 minutes.

### 5. Save Deployment Guide

```bash
terraform output -raw next_steps > deployment-guide.txt
cat deployment-guide.txt
```

## Post-Terraform Steps

Follow the Coolify AWS guide steps 5-16:

### Step 5-6: Initialize Docker Swarm

```bash
./scripts/01-init-swarm.sh
```

This script:
- ✅ Waits for Docker installation to complete
- ✅ Initializes Swarm on manager
- ✅ Joins worker to Swarm
- ✅ Creates overlay network `flagmeter-net`
- ✅ Verifies cluster status

### Step 10-11: Add Servers to Coolify

**Manager Node:**
1. Open Coolify: https://cool.eduardosanzb.dev
2. Servers → Add New Server
3. Enter:
   - Name: `flagmeter-manager`
   - IP: *(from terraform output)*
   - User: `root`
   - SSH Key: *(your key)*
   - ☑️ **Enable "Swarm Manager" checkbox**
4. Click Validate

**Worker Node:**
1. Servers → Add New Server
2. Enter:
   - Name: `flagmeter-worker`
   - IP: *(from terraform output)*
   - User: `root`
   - SSH Key: *(same key)*
   - ☑️ **Enable "It is a swarm Worker" checkbox**
3. Click Validate

### Step 12-13: Verify Setup

```bash
# Get manager IP
MANAGER_IP=$(terraform output -raw manager_public_ip)

# Check Swarm services
ssh root@$MANAGER_IP docker service ls

# Check overlay networks
ssh root@$MANAGER_IP "docker network ls | grep overlay"
```

Expected networks:
- `coolify` (overlay)
- `coolify-overlay` (overlay)
- `ingress` (overlay)

### Step 14: Configure Docker Registry

```bash
./scripts/03-configure-registry.sh
```

This logs all nodes into registry.raus.cloud.

### Step 15: Deploy FlagMeter Stacks

**Option A: Automated Script**
```bash
./scripts/04-deploy-stacks.sh
```

**Option B: Manual Deployment**
```bash
MANAGER_IP=$(terraform output -raw manager_public_ip)

# Copy stack files
scp ../../coolify.observability.swarm.yaml root@$MANAGER_IP:/root/obs.yaml
scp ../../coolify.app.swarm.yaml root@$MANAGER_IP:/root/app.yaml

# Deploy
ssh root@$MANAGER_IP "docker stack deploy -c /root/obs.yaml obs"
ssh root@$MANAGER_IP "docker stack deploy -c /root/app.yaml app"
```

**Option C: Via Coolify UI**
1. Create Project: "FlagMeter"
2. Add Resource → Docker Compose
3. Select Swarm Manager
4. Paste stack configs
5. Deploy

### Step 16: Verify Deployment

```bash
WORKER_IP=$(terraform output -raw worker_public_ip)
MANAGER_IP=$(terraform output -raw manager_public_ip)

# Health check
curl http://$WORKER_IP:3000/api/health

# Access services
echo "Dashboard:  http://$WORKER_IP:3000"
echo "Grafana:    http://$MANAGER_IP:3001"
echo "Prometheus: http://$MANAGER_IP:9090"
```

## Useful Commands

### Terraform

```bash
# View outputs
terraform output

# Show specific output
terraform output manager_public_ip

# Refresh state
terraform refresh

# Destroy infrastructure
terraform destroy
```

### Docker Swarm

```bash
MANAGER_IP=$(terraform output -raw manager_public_ip)

# List nodes
ssh root@$MANAGER_IP docker node ls

# List services
ssh root@$MANAGER_IP docker service ls

# Service logs
ssh root@$MANAGER_IP docker service logs -f app_dashboard

# Service tasks (see which node)
ssh root@$MANAGER_IP docker service ps app_dashboard

# Scale service
ssh root@$MANAGER_IP docker service scale app_worker=3

# Update service image
ssh root@$MANAGER_IP docker service update --image registry.raus.cloud/flagmeter/dashboard:v2 app_dashboard

# Remove stacks
ssh root@$MANAGER_IP docker stack rm obs app
```

### Debugging

```bash
# Check cloud-init logs
ssh root@$MANAGER_IP cat /var/log/cloud-init-output.log

# Check Docker daemon
ssh root@$MANAGER_IP systemctl status docker

# Check overlay network
ssh root@$MANAGER_IP docker network inspect flagmeter-net

# Check node resources
ssh root@$MANAGER_IP docker node inspect self --pretty
```

## Cost Breakdown

| Resource | Type | Cost |
|----------|------|------|
| Manager  | CAX11 (2 vCPU, 4GB RAM) | €3.79/mo |
| Worker   | CAX11 (2 vCPU, 4GB RAM) | €3.79/mo |
| Private Network | 10.0.0.0/16 | FREE |
| **Total** | | **€7.58/mo** |

### Scaling Options

**Upgrade to CAX21** (4 vCPU, 8GB RAM, €7.59/mo each):
```hcl
# In terraform.tfvars
manager_server_type = "cax21"
worker_server_type  = "cax21"
```

**Total with CAX21:** €15.18/month

## File Structure

```
infra/terraform/
├── versions.tf              # Terraform version constraints
├── providers.tf             # Hetzner provider config
├── variables.tf             # Input variables
├── network.tf               # Private network + subnet
├── firewall.tf              # Security rules (Swarm ports)
├── ssh-keys.tf              # SSH key management
├── servers.tf               # Manager + Worker servers
├── outputs.tf               # Server IPs, deployment guide
├── cloud-init.tftpl         # Docker installation template
├── terraform.tfvars.example # Secrets template
├── terraform.tfvars         # Actual secrets (gitignored)
├── .gitignore               # Ignore state + secrets
├── README.md                # This file
│
└── scripts/
    ├── 01-init-swarm.sh         # Initialize Swarm cluster
    ├── 03-configure-registry.sh # Configure Docker registry
    └── 04-deploy-stacks.sh      # Deploy application stacks
```

## Troubleshooting

### SSH Connection Issues

```bash
# Test SSH connection
ssh -v root@$(terraform output -raw manager_public_ip)

# If permission denied, check key:
ssh-add -l
ssh-add ~/.ssh/flagmeter_deploy
```

### Docker Not Ready

```bash
# Check if cloud-init finished
ssh root@$MANAGER_IP "cat /root/docker-ready.txt"

# Check Docker status
ssh root@$MANAGER_IP "systemctl status docker"

# View cloud-init logs
ssh root@$MANAGER_IP "tail -100 /var/log/cloud-init-output.log"
```

### Swarm Already Initialized

```bash
# On manager - leave and reinitialize
ssh root@$MANAGER_IP "docker swarm leave --force"
./scripts/01-init-swarm.sh

# On worker - leave and rejoin
ssh root@$WORKER_IP "docker swarm leave"
./scripts/01-init-swarm.sh
```

### Network Issues

```bash
# Check firewall
terraform state show hcloud_firewall.swarm

# Verify private network
ssh root@$MANAGER_IP "ip addr show"

# Test connectivity between nodes
WORKER_PRIVATE=$(terraform output -raw worker_private_ip)
ssh root@$MANAGER_IP "ping -c 3 $WORKER_PRIVATE"
```

### Registry Login Failed

```bash
# Manually login
MANAGER_IP=$(terraform output -raw manager_public_ip)
ssh root@$MANAGER_IP "docker login registry.raus.cloud"

# Verify credentials
ssh root@$MANAGER_IP "cat ~/.docker/config.json"
```

## Security Considerations

### SSH Access

**Production:** Restrict SSH to your IP only:

```hcl
# In firewall.tf, change SSH rule:
rule {
  direction = "in"
  protocol  = "tcp"
  port      = "22"
  source_ips = ["YOUR_IP/32"]  # Your public IP
}
```

### Secrets Management

**Current:** Local `.tfvars` file (gitignored)

**Production Options:**

1. **Terraform Cloud:**
   ```hcl
   # Add to providers.tf
   terraform {
     cloud {
       organization = "your-org"
       workspaces {
         name = "flagmeter-prod"
       }
     }
   }
   ```

2. **Environment Variables:**
   ```bash
   export TF_VAR_hcloud_token="your-token"
   export TF_VAR_postgres_password="strong-password"
   terraform apply
   ```

3. **Vault/SOPS:** Encrypt tfvars file

## Next Steps

1. **Setup Domain Names**
   - Point `meter.raus.cloud` to Worker IP
   - Point `grafana.raus.cloud` to Manager IP

2. **Configure SSL**
   - Let's Encrypt via Coolify/Traefik
   - Or use Cloudflare proxy

3. **Setup Monitoring**
   - Configure Grafana dashboards
   - Setup alerting rules in Prometheus

4. **Database Backups**
   - Configure S3-compatible backups
   - Setup automated backup schedule

5. **Load Testing**
   - Run k6 load tests
   - Document max RPS on CAX11
   - Compare CAX11 vs CAX21 performance

## Support

- **Terraform Issues:** Check `terraform.tfstate` and outputs
- **Hetzner Issues:** https://console.hetzner.cloud
- **Coolify Issues:** https://coolify.io/docs
- **FlagMeter Issues:** See main project README

## License

MIT
