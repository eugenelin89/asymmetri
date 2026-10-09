"""Contract checks for acceptance evidence, no production network requests."""
import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location("baseline", Path(__file__).with_name("http-baseline.py"))
baseline = importlib.util.module_from_spec(spec)
spec.loader.exec_module(baseline)


class EvidenceTests(unittest.TestCase):
    def row(self, **changes):
        return dict(url="https://example.com/", curl_exit=0, status=200,
                    headers={"content-type": "text/html"}, compare_content=True,
                    text_sha256="content", ids=["tutorial"], links_sha256="links", **changes)

    def test_transport_error_cannot_be_baselined(self):
        broken = {**self.row(), "curl_exit": 60}
        self.assertTrue(baseline.differences([broken], [broken]))

    def test_route_removal_and_redirect_drift_fail(self):
        row = self.row()
        self.assertTrue(baseline.differences([row], []))
        self.assertTrue(baseline.differences([row], [{**row, "headers": {"location": "/"}}]))

    def test_expected_disabled_route_is_preserved(self):
        row = {**self.row(), "status": 410}
        self.assertEqual(baseline.differences([row], [row]), [])
        self.assertTrue(baseline.differences([row], [self.row()]))

    def test_assets_anchors_and_copy_fail_on_drift(self):
        row = self.row()
        for key in ("ids", "links_sha256", "text_sha256"):
            self.assertTrue(baseline.differences([row], [{**row, key: "changed"}]))

    def test_source_build_noise_does_not_mask_content(self):
        page = baseline.Page()
        page.feed('<h1 id="intro">Motion</h1><script>random-build-id</script><a href="/privacy">Privacy</a>')
        self.assertEqual(page.text, ["Motion", "Privacy"])
        self.assertEqual(page.ids, ["intro"])
        self.assertEqual(page.links, ["/privacy"])

    def test_auth_query_and_non_http_inputs_rejected(self):
        for url in ("file:///etc/passwd", "https://u:p@example.com/", "https://example.com/?key=secret"):
            with self.assertRaises(ValueError):
                baseline.validate_manifest([dict(url=url, compare_content=True)])

    def test_resource_and_form_drift_is_detected(self):
        import json
        before, after = baseline.Page(), baseline.Page()
        before.feed('<link rel="stylesheet" href="/ok.css"><img src="/ok.png" alt="Pitch"><script src="/ok.js"></script><form action="/login" method="post"></form>')
        after.feed('<img src="/broken.png" alt="Changed"><script src="/broken.js"></script><form action="/elsewhere" method="get"></form>')
        a = self.row(resources_sha256=baseline.digest(json.dumps(before.resources).encode()))
        b = self.row(resources_sha256=baseline.digest(json.dumps(after.resources).encode()))
        self.assertTrue(baseline.differences([a], [b]))


if __name__ == "__main__":
    unittest.main()
