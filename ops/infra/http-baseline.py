#!/usr/bin/env python3
"""Read-only, TLS-verified HTTP evidence. Keep manifests/results outside Git.

Manifest: [{"url": "https://asymmetri.co/", "compare_content": true}]
No authentication, cookies, response bodies, or arbitrary curl options are saved.
"""

import argparse
import hashlib
from html.parser import HTMLParser
import ipaddress
import json
import os
from pathlib import Path
import subprocess
import tempfile
from urllib.parse import urlsplit


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.hidden = 0
        self.text = []
        self.ids = []
        self.links = []
        self.canonical = []
        self.refresh = []
        self.resources = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ("script", "style"):
            self.hidden += 1
        if attrs.get("id"):
            self.ids.append(attrs["id"])
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical.append(attrs.get("href", ""))
        if tag == "meta" and attrs.get("http-equiv", "").lower() == "refresh":
            self.refresh.append(attrs.get("content", ""))
        contracts = {
            "img": ("src", "srcset", "sizes", "alt", "width", "height"),
            "source": ("src", "srcset", "sizes", "type", "media"),
            "link": ("href", "rel", "as", "type", "media", "imagesrcset", "imagesizes"),
            "script": ("src", "type", "integrity", "crossorigin"),
            "meta": ("name", "property", "http-equiv", "content", "charset"),
            "form": ("action", "method", "enctype"),
            "iframe": ("src", "title", "sandbox", "allow"),
            "video": ("src", "poster"),
        }
        if tag in contracts:
            self.resources.append([tag, {key: attrs[key] for key in contracts[tag] if key in attrs}])

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.hidden = max(0, self.hidden - 1)

    def handle_data(self, data):
        if not self.hidden:
            self.text.extend(data.split())


def digest(value):
    return hashlib.sha256(value).hexdigest()


def validate_manifest(manifest):
    if not isinstance(manifest, list) or not manifest:
        raise ValueError("manifest must be a nonempty list")
    seen = set()
    for item in manifest:
        if not isinstance(item, dict) or set(item) != {"url", "compare_content"}:
            raise ValueError("each entry needs only url and compare_content")
        url = item["url"]
        if not isinstance(url, str) or any(c.isspace() for c in url):
            raise ValueError("invalid URL")
        parts = urlsplit(url)
        if (parts.scheme not in ("http", "https") or not parts.hostname
                or parts.username or parts.password or parts.fragment or parts.query
                or parts.port not in (None, 80, 443)):
            raise ValueError("only unauthenticated HTTP(S) URLs without queries/fragments")
        if type(item["compare_content"]) is not bool or url in seen:
            raise ValueError("duplicate URL or invalid content comparison flag")
        seen.add(url)


def probe(item, address=None):
    url = item["url"]
    parts = urlsplit(url)
    result = dict(item)
    with tempfile.TemporaryDirectory(prefix="infra01-http-") as tmp:
        body, headers = Path(tmp) / "body", Path(tmp) / "headers"
        # -q ignores ~/.curlrc; --noproxy keeps the destination deterministic.
        command = ["curl", "-q", "--silent", "--show-error", "--noproxy", "*",
                   "--proto", "=http,https", "--connect-timeout", "10",
                   "--max-time", "30", "--max-filesize", "16777216",
                   "--output", str(body), "--dump-header", str(headers),
                   "--write-out", "%{http_code}\n%{remote_ip}\n%{time_total}\n%{ssl_verify_result}\n"]
        if address:
            target = f"[{address}]" if ":" in address else address
            command += ["--resolve", f"{parts.hostname}:{parts.port or (443 if parts.scheme == 'https' else 80)}:{target}"]
        response = subprocess.run(command + [url], capture_output=True, text=True, timeout=35)
        result["curl_exit"] = response.returncode
        # Error text can contain local paths; keep only exit code in the receipt.
        if response.returncode:
            return result
        status, remote, elapsed, tls = response.stdout.strip().splitlines()
        result.update(status=int(status), remote_ip=remote, seconds=float(elapsed), tls_verify=int(tls))
        content = body.read_bytes()
        result.update(bytes=len(content), sha256=digest(content))
        selected = {}
        for line in headers.read_text(errors="replace").splitlines():
            name, sep, value = line.partition(":")
            if sep and name.lower() in ("location", "content-type"):
                selected[name.lower()] = value.strip()
        result["headers"] = selected
        if "text/html" in selected.get("content-type", ""):
            page = Page()
            page.feed(content.decode("utf-8", errors="replace"))
            result["text_sha256"] = digest(" ".join(page.text).encode())
            result["ids"] = sorted(set(page.ids))
            # Link hashes preserve route/asset contracts without logging destinations.
            result["links_sha256"] = digest(json.dumps(sorted(set(page.links))).encode())
            result["canonical"] = page.canonical
            result["refresh"] = page.refresh
            result["resources_sha256"] = digest(json.dumps(page.resources, sort_keys=True).encode())
    return result


def differences(previous, current):
    before = {x["url"]: x for x in previous}
    after = {x["url"]: x for x in current}
    problems = []
    if len(before) != len(previous) or len(after) != len(current):
        problems.append("duplicate receipt URLs")
    if before.keys() != after.keys():
        problems.append("URL set changed")
    for url in before.keys() & after.keys():
        a, b = before[url], after[url]
        if a.get("curl_exit") != 0 or b.get("curl_exit") != 0:
            problems.append(f"{url}: transport/TLS failure cannot be accepted")
            continue
        keys = ["status", "headers", "canonical", "refresh", "compare_content"]
        if a["compare_content"]:
            keys += ["text_sha256", "ids", "links_sha256", "resources_sha256"] if "text_sha256" in a else ["sha256"]
        for key in keys:
            if a.get(key) != b.get(key):
                problems.append(f"{url}: {key} changed")
    return problems


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifest", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--resolve", help="verified candidate IP; retains Host/SNI and certificate validation")
    parser.add_argument("--against", type=Path, help="compare a reviewed baseline receipt")
    args = parser.parse_args()
    if args.resolve:
        ipaddress.ip_address(args.resolve)
    manifest = json.loads(args.manifest.read_text())
    validate_manifest(manifest)
    # Exclusive output prevents overwriting baseline evidence. Private by construction.
    descriptor = os.open(args.output, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(descriptor, "w") as output:
        rows = []
        for item in manifest:
            try:
                rows.append(probe(item, args.resolve))
            except (subprocess.TimeoutExpired, OSError, ValueError):
                rows.append(dict(item, curl_exit=-1))
        json.dump(rows, output, indent=2)
        output.write("\n")
    problems = [f"{x['url']}: curl exit {x['curl_exit']}" for x in rows if x["curl_exit"]]
    if args.against:
        problems += differences(json.loads(args.against.read_text()), rows)
    print(json.dumps({"requests": len(rows), "problems": problems}, indent=2))
    return int(bool(problems))


if __name__ == "__main__":
    raise SystemExit(main())
