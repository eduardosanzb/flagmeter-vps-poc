# ============================================
# Hetzner Cloud Configuration
# ============================================

variable "hcloud_token" {
  description = "Hetzner Cloud API token (get from console.hetzner.cloud)"
  type        = string
  sensitive   = true
}

# ============================================
# SSH Configuration
# ============================================

variable "ssh_public_key_path" {
  description = "Path to SSH public key for server access"
  type        = string
  default     = "~/.ssh/id_rsa.pub"
}

# ============================================
# Server Configuration
# ============================================

variable "server_location" {
  description = "Hetzner datacenter location"
  type        = string
  default     = "fsn1"  # Falkenstein, Germany
  # Options: fsn1 (Falkenstein), nbg1 (Nuremberg), hel1 (Helsinki)
}

variable "manager_server_type" {
  description = "Server type for Swarm manager (observability stack)"
  type        = string
  default     = "cax11"  # ARM64, 2 vCPU, 4GB RAM, €3.79/mo
}

variable "worker_server_type" {
  description = "Server type for Swarm worker (application stack)"
  type        = string
  default     = "cax11"  # ARM64, 2 vCPU, 4GB RAM, €3.79/mo
}

variable "server_image" {
  description = "OS image for servers"
  type        = string
  default     = "ubuntu-24.04"
}

# ============================================
# Network Configuration
# ============================================

variable "private_network_ip_range" {
  description = "IP range for private network (CIDR)"
  type        = string
  default     = "10.0.0.0/16"
}

variable "private_subnet_ip_range" {
  description = "IP range for private subnet (CIDR)"
  type        = string
  default     = "10.0.0.0/24"
}

variable "manager_private_ip" {
  description = "Private IP for manager node"
  type        = string
  default     = "10.0.0.2"
}

variable "worker_private_ip" {
  description = "Private IP for worker node"
  type        = string
  default     = "10.0.0.3"
}

# Reserved for future Coolify control plane integration
variable "coolify_private_ip" {
  description = "Private IP of existing Coolify control plane (for future network attachment)"
  type        = string
  default     = "10.0.0.1"
}

# ============================================
# Docker Registry Configuration
# ============================================

variable "docker_registry_url" {
  description = "Docker registry URL (step 14 from guide)"
  type        = string
  default     = "registry.raus.cloud"
}

variable "docker_registry_username" {
  description = "Docker registry username"
  type        = string
  sensitive   = true
}

variable "docker_registry_password" {
  description = "Docker registry password"
  type        = string
  sensitive   = true
}

# ============================================
# Application Secrets
# ============================================

variable "postgres_password" {
  description = "PostgreSQL password"
  type        = string
  sensitive   = true
}

variable "grafana_admin_password" {
  description = "Grafana admin password"
  type        = string
  sensitive   = true
}

# ============================================
# Project Labels
# ============================================

variable "project_name" {
  description = "Project name for resource labels"
  type        = string
  default     = "flagmeter"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}
