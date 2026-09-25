#!/bin/bash
# Create the separately authorized root-capable website administration login.
# Usage (as root): install-admin-access.sh PUBLIC_KEY_FILE EXPECTED_SHA256_FINGERPRINT
# This grants full root-equivalent access to the entire Ubuntu instance.
set -euo pipefail

if [[ $(id -u) != 0 || $# != 2 ]]; then
  echo 'Run as root with a public-key file and its expected SHA256 fingerprint.' >&2
  exit 1
fi
if id webadmin >/dev/null 2>&1 || [[ -e /home/webadmin || -e /etc/sudoers.d/webadmin || -L /etc/sudoers.d/webadmin ]]; then
  echo 'Refusing to overwrite an existing webadmin account, home, or sudo policy.' >&2
  exit 1
fi

visudo -c
admin_key_temp=$(mktemp /root/.webadmin-public-key-XXXXXX)
admin_policy_temp=$(mktemp /etc/sudoers.d/.webadmin-XXXXXX)
admin_policy_installed=0
admin_setup_complete=0
cleanup() {
  rm -f -- "$admin_key_temp" "$admin_policy_temp"
  if [[ $admin_policy_installed == 1 && $admin_setup_complete != 1 ]]; then
    rm -f -- /etc/sudoers.d/webadmin
    echo 'Setup failed: new administrator sudo policy revoked; inspect the account before retrying.' >&2
  fi
}
trap cleanup EXIT

install -o root -g root -m 600 -- "$1" "$admin_key_temp"
if [[ $(wc -l < "$admin_key_temp") != 1 ]]; then
  echo 'Expected exactly one public key.' >&2
  exit 1
fi
read -r admin_key_type admin_key_material admin_key_comment < "$admin_key_temp"
if [[ $admin_key_type != ssh-ed25519 ]]; then
  echo 'Expected an Ed25519 public key.' >&2
  exit 1
fi
admin_fingerprint=$(ssh-keygen -lf "$admin_key_temp" | awk '{print $2}')
if [[ $admin_fingerprint != "$2" ]]; then
  echo 'Public-key fingerprint does not match the reviewed key.' >&2
  exit 1
fi

printf '%s\n' '# Dedicated website administrator: full root access explicitly authorized by the server owner.' 'webadmin ALL=(root) NOPASSWD: ALL' > "$admin_policy_temp"
chmod 440 "$admin_policy_temp"
visudo -cf "$admin_policy_temp"

useradd -m -U -d /home/webadmin -s /bin/bash -c 'Website administration' webadmin
install -d -m 700 -o webadmin -g webadmin /home/webadmin/.ssh
printf 'restrict,pty %s %s webadmin-mac\n' "$admin_key_type" "$admin_key_material" > /home/webadmin/.ssh/authorized_keys
chown webadmin:webadmin /home/webadmin/.ssh/authorized_keys
chmod 600 /home/webadmin/.ssh/authorized_keys
install -o root -g root -m 440 "$admin_policy_temp" /etc/sudoers.d/webadmin
admin_policy_installed=1
visudo -c
admin_setup_complete=1
echo 'WEBADMIN_ACCESS_READY: full sudo available; no website or service restarted.'
