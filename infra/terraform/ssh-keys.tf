# ============================================
# SSH Key (AWS Key Pair equivalent)
# ============================================

resource "hcloud_ssh_key" "deployer" {
  name       = "${var.project_name}-deployer"
  public_key = file(var.ssh_public_key_path)
  
  labels = {
    managed_by  = "terraform"
    project     = var.project_name
    environment = var.environment
  }
}
