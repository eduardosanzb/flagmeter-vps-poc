# ============================================
# Server Information Outputs
# Equivalent to guide's Step 3: cluster-info.txt
# ============================================

output "manager_public_ip" {
  description = "Public IP of Swarm Manager"
  value       = hcloud_server.manager.ipv4_address
}

output "manager_private_ip" {
  description = "Private IP of Swarm Manager"
  value       = var.manager_private_ip
}

output "worker_public_ip" {
  description = "Public IP of Swarm Worker"
  value       = hcloud_server.worker.ipv4_address
}

output "worker_private_ip" {
  description = "Private IP of Swarm Worker"
  value       = var.worker_private_ip
}

# ============================================
# SSH Connection Strings
# ============================================

output "ssh_manager" {
  description = "SSH command for manager"
  value       = "ssh root@${hcloud_server.manager.ipv4_address}"
}

output "ssh_worker" {
  description = "SSH command for worker"
  value       = "ssh root@${hcloud_server.worker.ipv4_address}"
}

# ============================================
# Network Information
# ============================================

output "private_network_id" {
  description = "Private network ID"
  value       = hcloud_network.private.id
}

output "private_network_name" {
  description = "Private network name"
  value       = hcloud_network.private.name
}

# ============================================
# Next Steps Guide
# Maps to Coolify AWS guide Steps 5-16
# ============================================

output "next_steps" {
  description = "Complete deployment guide following Coolify AWS setup"
  value       = <<-EOT
    
    ✅ Infrastructure provisioned successfully!
    
    📋 Cluster Information (Step 3):
    ─────────────────────────────────────────────────────────────────
    Manager Public:  ${hcloud_server.manager.ipv4_address}
    Manager Private: ${var.manager_private_ip}
    Worker Public:   ${hcloud_server.worker.ipv4_address}
    Worker Private:  ${var.worker_private_ip}
    
    🚀 Deployment Steps (following AWS guide):
    ─────────────────────────────────────────────────────────────────
    
    STEP 5: Initialize Docker Swarm on Manager
    ───────────────────────────────────────────
    ssh root@${hcloud_server.manager.ipv4_address}
    docker swarm init --advertise-addr ${var.manager_private_ip}
    
    # Save the join token output!
    
    STEP 6: Join Worker to Swarm
    ─────────────────────────────
    ssh root@${hcloud_server.worker.ipv4_address}
    docker swarm join --token SWMTKN-... ${var.manager_private_ip}:2377
    
    # Verify on manager:
    ssh root@${hcloud_server.manager.ipv4_address}
    docker node ls
    
    STEP 7-9: Coolify Setup (if not already done)
    ──────────────────────────────────────────────
    Your existing Coolify control plane at: https://cool.eduardosanzb.dev
    
    STEP 10: Add Manager to Coolify Dashboard
    ──────────────────────────────────────────
    1. Open Coolify: https://cool.eduardosanzb.dev
    2. Go to: Servers → Add New Server
    3. Enter:
       - Name: flagmeter-manager
       - IP: ${hcloud_server.manager.ipv4_address}
       - User: root
       - SSH Key: (use your key from Keys & Tokens)
       - ☑️ Enable "Swarm Manager" checkbox
    4. Click Validate
    
    STEP 11: Add Worker to Coolify
    ───────────────────────────────
    1. Servers → Add New Server
    2. Enter:
       - Name: flagmeter-worker
       - IP: ${hcloud_server.worker.ipv4_address}
       - User: root
       - SSH Key: (same key)
       - ☑️ Enable "It is a swarm Worker" checkbox
    3. Click Validate
    
    STEP 12-13: Verify Traefik and Overlay Networks
    ────────────────────────────────────────────────
    # On manager:
    docker service ls
    docker network ls | grep overlay
    
    # Should see coolify, coolify-overlay, ingress networks
    
    STEP 14: Configure Docker Registry
    ───────────────────────────────────
    # On all nodes (manager + worker):
    docker login ${var.docker_registry_url}
    
    # In Coolify UI:
    - Settings → Docker Registry
    - Add: ${var.docker_registry_url}
    
    STEP 15: Deploy FlagMeter Stacks
    ─────────────────────────────────
    Option A: Manual via SSH
      ./scripts/04-deploy-stacks.sh
    
    Option B: Via Coolify UI
      - Create Project: "FlagMeter"
      - Add Resource → Docker Compose
      - Select Swarm Manager
      - Paste stack configs
      - Deploy
    
    STEP 16: Verify Deployment
    ──────────────────────────
    Dashboard: http://${hcloud_server.worker.ipv4_address}:3000/api/health
    Grafana:   http://${hcloud_server.manager.ipv4_address}:3001
    
    🔧 Useful Commands:
    ─────────────────────────────────────────────────────────────────
    # Check Swarm status
    ssh root@${hcloud_server.manager.ipv4_address} docker node ls
    
    # View running services
    ssh root@${hcloud_server.manager.ipv4_address} docker service ls
    
    # Follow service logs
    ssh root@${hcloud_server.manager.ipv4_address} docker service logs -f SERVICE_NAME
    
    # Scale a service
    ssh root@${hcloud_server.manager.ipv4_address} docker service scale SERVICE_NAME=3
    
    📚 Cost Summary:
    ─────────────────────────────────────────────────────────────────
    Manager (CAX11): €3.79/mo
    Worker (CAX11):  €3.79/mo
    Total:           €7.58/mo
    
    Network traffic within private network: FREE
    
  EOT
}
