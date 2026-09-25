#!/usr/bin/python3 -I
"""Install non-root application access and narrowly scoped service permissions.

Run once as root after reviewing this file. Does not restart or deploy the site.
"""
import os
from pathlib import Path
import pwd
import stat
import subprocess
import tempfile

APP_HELPER = '''#!/usr/bin/python3 -I
"""Run application commands as django-user with privilege elevation disabled."""
import os
import pwd
import sys

account = pwd.getpwnam("django-user")
if os.getuid() != account.pw_uid or os.geteuid() != account.pw_uid:
    sys.exit("Use: sudo -n -H -u django-user /usr/local/sbin/asymmetri-app COMMAND [ARGS...]")
if len(sys.argv) < 2:
    sys.exit("A command is required; for a shell, pass /bin/bash --noprofile --norc.")
os.chdir("/var/www/asymmetri")
os.umask(0o022)
environment = {
    "HOME": account.pw_dir,
    "USER": account.pw_name,
    "LOGNAME": account.pw_name,
    "PATH": "/usr/local/bin:/usr/bin:/bin",
    "LANG": "C.UTF-8",
    "NEXT_TELEMETRY_DISABLED": "1",
}
os.execve("/usr/bin/setpriv",
          ["setpriv", "--no-new-privs", "--", *sys.argv[1:]], environment)
'''

SUDOERS = '''# Managed by the reviewed Asymmetri access installer.
# Application commands run as the existing application owner, never as root.
# The root-owned helper sets no_new_privs before executing any supplied command.
webdeploy ALL=(django-user) NOPASSWD: /usr/local/sbin/asymmetri-app
# Root privileges are restricted to this one service and its bounded log view.
webdeploy ALL=(root) NOPASSWD: /usr/bin/systemctl start asymmetri.service, /usr/bin/systemctl stop asymmetri.service, /usr/bin/systemctl restart asymmetri.service, /usr/bin/journalctl --unit=asymmetri.service --lines=100 --no-pager
'''


def run(*args):
    return subprocess.check_output(args, text=True, stderr=subprocess.STDOUT)


def install():
    if os.geteuid() != 0:
        raise SystemExit("Run this installer as root in the DigitalOcean console.")
    for name in ("webdeploy", "django-user"):
        if pwd.getpwnam(name).pw_uid < 1000:
            raise SystemExit(f"Unexpected privileged account: {name}")
    properties = dict(line.split("=", 1) for line in run(
        "/usr/bin/systemctl", "show", "asymmetri.service",
        "-p", "User", "-p", "WorkingDirectory", "-p", "NoNewPrivileges"
    ).splitlines())
    expected = {"User": "django-user", "WorkingDirectory": "/var/www/asymmetri", "NoNewPrivileges": "yes"}
    if properties != expected:
        raise SystemExit(f"Unexpected service configuration; inspect before granting access: {properties}")
    if not Path("/usr/bin/setpriv").is_file():
        raise SystemExit("setpriv is required.")
    print(run("/usr/sbin/visudo", "-c"), end="")
    targets = [
        (Path("/usr/local/sbin/asymmetri-app"), APP_HELPER.encode(), 0o755),
        (Path("/etc/sudoers.d/webdeploy-asymmetri"), SUDOERS.encode(), 0o440),
    ]
    for path, content, mode in targets:
        parent = path.parent.stat()
        if path.parent.is_symlink() or parent.st_uid != 0 or parent.st_mode & 0o022:
            raise SystemExit(f"Unsafe installation directory: {path.parent}")
        if path.is_symlink():
            raise SystemExit(f"Refusing existing symlink: {path}")
        if path.exists():
            info = path.stat()
            if not stat.S_ISREG(info.st_mode) or info.st_uid != 0 or info.st_gid != 0 or stat.S_IMODE(info.st_mode) != mode or path.read_bytes() != content:
                raise SystemExit(f"Refusing to overwrite an unexpected existing file: {path}")
    created = []
    try:
        for path, content, mode in targets:
            if path.exists():
                continue
            fd, candidate = tempfile.mkstemp(prefix=".asymmetri-access-", dir=path.parent)
            try:
                with os.fdopen(fd, "wb") as stream:
                    stream.write(content)
                    stream.flush()
                    os.fsync(stream.fileno())
                    os.fchmod(stream.fileno(), mode)
                    os.fchown(stream.fileno(), 0, 0)
                if path.parent == Path("/etc/sudoers.d"):
                    print(run("/usr/sbin/visudo", "-cf", candidate), end="")
                os.replace(candidate, path)
                created.append(path)
            finally:
                if Path(candidate).exists():
                    Path(candidate).unlink()
        print(run("/usr/sbin/visudo", "-c"), end="")
    except BaseException:
        for path in reversed(created):
            path.unlink()
        raise
    print("ASYMMETRI_ACCESS_READY: no website restart or source change performed.")


if __name__ == "__main__":
    install()
