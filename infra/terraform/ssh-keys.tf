# ============================================
# SSH Key (AWS Key Pair equivalent)
# ============================================

data "hcloud_ssh_key" "deployer" {
  name = "eduardosanchez@Eduardos-MacBook-Pro.local"
}
