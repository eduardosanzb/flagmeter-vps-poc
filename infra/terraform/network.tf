# ============================================
# Private Network (AWS VPC equivalent)
# ============================================

resource "hcloud_network" "private" {
  name     = "${var.project_name}-private"
  ip_range = var.private_network_ip_range
  
  labels = {
    managed_by  = "terraform"
    project     = var.project_name
    environment = var.environment
  }
}

# ============================================
# Subnet (AWS Subnet equivalent)
# ============================================

resource "hcloud_network_subnet" "private_subnet" {
  network_id   = hcloud_network.private.id
  type         = "cloud"
  network_zone = "eu-central"
  ip_range     = var.private_subnet_ip_range
}

# ============================================
# Note: Future Coolify Control Plane Integration
# ============================================
# To attach existing Coolify server to this network:
#
# Option 1: Manual via Hetzner CLI
#   hcloud server attach-to-network COOLIFY_SERVER_ID \
#     --network flagmeter-private --ip 10.0.0.1
#
# Option 2: Terraform data source (uncomment when ready)
#   data "hcloud_server" "coolify" {
#     name = "coolify-control"  # Your existing Coolify server name
#   }
#
#   resource "hcloud_server_network" "coolify_network" {
#     server_id  = data.hcloud_server.coolify.id
#     network_id = hcloud_network.private.id
#     ip         = var.coolify_private_ip
#   }
