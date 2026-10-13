#!/usr/bin/python3
"""Root-only Certbot deploy hook. No private certificate/key bytes are logged."""
import argparse
import grp
import hashlib
import os
from pathlib import Path
import socket
import ssl
import subprocess
import sys
import time
import uuid

ROOT = Path('/etc/asymmetri-ingress/tls')
LINEAGE = Path('/etc/letsencrypt/live/asymmetri.co')
SERVICE = 'asymmetri-ingress.service'
VALIDATE = """
const fs=require('node:fs'),crypto=require('node:crypto');
try {
 const certBytes=fs.readFileSync(process.argv[1]),keyBytes=fs.readFileSync(process.argv[2]);
 const cert=new crypto.X509Certificate(certBytes);
 const key=crypto.createPrivateKey(keyBytes);
 require('node:tls').createSecureContext({cert:certBytes,key:keyBytes,minVersion:'TLSv1.2',maxVersion:'TLSv1.3'});
 const now=Date.now();
 if(!cert.checkHost('asymmetri.co',{subject:'never'}) || Date.parse(cert.validFrom)>now ||
   now>=Date.parse(cert.validTo) || !cert.publicKey.equals(crypto.createPublicKey(key))) process.exit(1);
 process.stdout.write(crypto.createHash('sha256').update(cert.raw).digest('hex'));
} catch {process.exit(1);}
"""


def validate(directory):
    result = subprocess.run(['/usr/bin/node', '-e', VALIDATE,
                             str(directory/'fullchain.pem'), str(directory/'privkey.pem')],
                            capture_output=True, text=True, timeout=10)
    if result.returncode or len(result.stdout) != 64:
        raise RuntimeError('Certificate identity, validity or key validation failed.')
    return result.stdout


def reload_service():
    subprocess.run(['systemctl', 'kill', '--kill-who=main', '-s', 'HUP', SERVICE],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=10)


def verify(expected):
    context = ssl.create_default_context()
    context.set_alpn_protocols(['http/1.1'])
    for _ in range(20):
        try:
            with socket.create_connection(('127.0.0.1', 3103), timeout=2) as raw:
                raw.sendall(b'PROXY TCP4 127.0.0.1 127.0.0.1 49152 443\r\n')
                with context.wrap_socket(raw, server_hostname='asymmetri.co') as tls:
                    if hashlib.sha256(tls.getpeercert(binary_form=True)).hexdigest() == expected:
                        return
        except (OSError, ssl.SSLError):
            pass
        time.sleep(0.1)
    raise RuntimeError('Live loopback TLS certificate did not match the staged certificate.')


def point_to(target):
    temporary = ROOT/('next-'+uuid.uuid4().hex)
    temporary.symlink_to(target)
    os.replace(temporary, ROOT/'current')
    descriptor = os.open(ROOT, os.O_RDONLY | os.O_DIRECTORY)
    try:
        os.fsync(descriptor)
    finally:
        os.close(descriptor)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--initialize', action='store_true', help='Install before first service startup.')
    parser.add_argument('--check', action='store_true', help='Validate the current source pair without changing it.')
    options = parser.parse_args()
    if os.geteuid() != 0:
        raise RuntimeError('Root identity required.')
    os.umask(0o027)
    if os.environ.get('RENEWED_LINEAGE') != str(LINEAGE):
        return  # Other Certbot lineages do not belong to this service.
    validate(LINEAGE)
    if options.check:
        print('Asymmetri certificate source validated.')
        return
    group = grp.getgrnam('asymmetri-ingress').gr_gid
    for directory in [ROOT, ROOT/'releases']:
        directory.mkdir(mode=0o750, parents=True, exist_ok=True)
        stat = directory.lstat()
        if directory.is_symlink() or stat.st_uid != 0 or stat.st_mode & 0o022:
            raise RuntimeError('Unsafe certificate directory ownership or permissions.')
        os.chown(directory, 0, group)
        os.chmod(directory, 0o750)
    active = subprocess.run(['systemctl', 'is-active', '--quiet', SERVICE], timeout=10).returncode == 0
    if not active and not options.initialize:
        raise RuntimeError('TLS service is inactive; renewal requires operator recovery.')
    if options.initialize and (ROOT/'current').exists():
        raise RuntimeError('Initialization cannot replace an existing certificate.')
    current = ROOT/'current'
    previous = os.readlink(current) if current.is_symlink() else None
    if current.exists() and previous is None:
        raise RuntimeError('Current certificate path is not the managed symlink.')
    staged = ROOT/'releases'/uuid.uuid4().hex
    staged.mkdir(mode=0o750);os.chown(staged, 0, group);os.chmod(staged, 0o750)
    for name in ['fullchain.pem', 'privkey.pem']:
        descriptor = os.open(staged/name, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o640)
        with os.fdopen(descriptor, 'wb') as output:
            os.fchown(output.fileno(), 0, group)
            os.fchmod(output.fileno(), 0o640)
            output.write((LINEAGE/name).read_bytes());output.flush();os.fsync(output.fileno())
    expected = validate(staged)
    for directory in [staged, ROOT/'releases']:
        descriptor = os.open(directory, os.O_RDONLY | os.O_DIRECTORY)
        try:
            os.fsync(descriptor)
        finally:
            os.close(descriptor)
    try:
        point_to(str(staged.relative_to(ROOT)))
        if active:
            reload_service();verify(expected)
    except Exception:
        if previous is not None:
            point_to(previous)
            if active:
                reload_service();verify(validate(current))
        else:
            current.unlink(missing_ok=True)
        raise
    print('Asymmetri TLS certificate installed and verified.' if active else
          'Asymmetri TLS certificate initialized; service startup remains separate.')


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print('Asymmetri TLS certificate update failed: '+type(error).__name__, file=sys.stderr)
        sys.exit(1)
