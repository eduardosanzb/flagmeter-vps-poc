# ============================================
# Swarm Manager Node
# Equivalent to AWS EC2 instance with Role=manager
# ============================================

resource "hcloud_server" "manager" {
  name        = "${var.project_name}-manager"
  server_type = var.manager_server_type
  image       = var.server_image
  location    = var.server_location
  
  ssh_keys     = [hcloud_ssh_key.deployer.id]
  firewall_ids = [hcloud_firewall.swarm.id]
  
  # Public IP automatically assigned by Hetzner
  public_net {
    ipv4_enabled = true
    ipv6_enabled = true
  }
  
  # Private network attachment
  network {
    network_id = hcloud_network.private.id
    ip         = var.manager_private_ip
  }
  
  # Cloud-init for Docker installation
  user_data = templatefile("${path.module}/cloud-init.tftpl", {
    hostname = "${var.project_name}-manager"
  })
  
  labels = {
    managed_by   = "terraform"
    project      = var.project_name
    environment  = var.environment
    role         = "swarm-manager"
    coolify_role = "manager"  # For Coolify UI identification
  }
  
  # Wait for private network to be ready
  depends_on = [
    hcloud_network_subnet.private_subnet
  ]
}

# ============================================
# Swarm Worker Node
# Equivalent to AWS EC2 instance with Role=worker
# ============================================

resource "hcloud_server" "worker" {
  name        = "${var.project_name}-worker"
  server_type = var.worker_server_type
  image       = var.server_image
  location    = var.server_location
  
  ssh_keys     = [hcloud_ssh_key.deployer.id]
  firewall_ids = [hcloud_firewall.swarm.id]
  
  public_net {
    ipv4_enabled = true
    ipv6_enabled = true
  }
  
  network {
    network_id = hcloud_network.private.id
    ip         = var.worker_private_ip
  }
  
  user_data = templatefile("${path.module}/cloud-init.tftpl", {
    hostname = "${var.project_name}-worker"
  })
  
  labels = {
    managed_by   = "terraform"
    project      = var.project_name
    environment  = var.environment
    role         = "swarm-worker"
    coolify_role = "worker"
  }
  
  depends_on = [
    hcloud_network_subnet.private_subnet
  ]
}
