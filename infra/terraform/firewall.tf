# ============================================
# Firewall Rules (AWS Security Group equivalent)
# Maps directly to Coolify guide's SG rules
# ============================================

resource "hcloud_firewall" "swarm" {
  name = "${var.project_name}-swarm-firewall"
  
  # ============================================
  # Public Access Rules
  # ============================================
  
  # SSH - Port 22 (from guide: "22/tcp (SSH) from your IP")
  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "22"
    source_ips = [
      "0.0.0.0/0",  # TODO: Restrict to your IP in production
      "::/0"
    ]
  }
  
  # HTTP - Port 80 (from guide: "80/tcp (HTTP/HTTPS) from 0.0.0.0/0")
  # Required for Let's Encrypt HTTP-01 challenge
  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "80"
    source_ips = [
      "0.0.0.0/0",
      "::/0"
    ]
  }
  
  # HTTPS - Port 443 (from guide: "443/tcp (HTTP/HTTPS) from 0.0.0.0/0")
  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "443"
    source_ips = [
      "0.0.0.0/0",
      "::/0"
    ]
  }
  
  # Coolify Dashboard - Port 8000 (from guide: "8000/tcp (Coolify dashboard)")
  # NOTE: Only needed on Coolify control plane, not Swarm nodes
  # Uncomment if you deploy Coolify on these servers
  # rule {
  #   direction = "in"
  #   protocol  = "tcp"
  #   port      = "8000"
  #   source_ips = ["YOUR_IP/32"]  # Restrict to your IP
  # }
  
  # ============================================
  # Docker Swarm Ports (from guide)
  # ============================================
  
  # Swarm Manager - Port 2377/tcp (from guide: "2377/tcp (Swarm manager)")
  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "2377"
    source_ips = [var.private_network_ip_range]
  }
  
  # Node Gossip - Port 7946/tcp (from guide: "7946/tcp (node gossip)")
  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "7946"
    source_ips = [var.private_network_ip_range]
  }
  
  # Node Gossip - Port 7946/udp (from guide: "7946/udp (node gossip)")
  rule {
    direction = "in"
    protocol  = "udp"
    port      = "7946"
    source_ips = [var.private_network_ip_range]
  }
  
  # Overlay Network - Port 4789/udp (from guide: "4789/udp (overlay network VXLAN)")
  rule {
    direction = "in"
    protocol  = "udp"
    port      = "4789"
    source_ips = [var.private_network_ip_range]
  }
  
  labels = {
    managed_by  = "terraform"
    project     = var.project_name
    environment = var.environment
  }
}
