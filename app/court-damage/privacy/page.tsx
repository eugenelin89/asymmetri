import type { Metadata } from "next";
import { site } from "@/content/site";
export const metadata: Metadata = { title: "Court Damage Privacy Policy", alternates: { canonical: "/court-damage/privacy" } };
export default function Privacy() {
  return <><h1>Privacy policy</h1><p>Effective November 22, 2026</p>
    <h2>Playing Court Damage</h2><p>Matches run on your iPhone. You can play offline without an account. The game stores your voice preference on your device. Removing the app deletes this preference. Court Damage has no ads or in-app purchases.</p>
    <h2>Apple services</h2><p>Apple handles App Store downloads. Your device settings govern whether you share Apple diagnostics with developers.</p>
    <h2>Website and support</h2><p>Visiting a support page sends ordinary web requests to our host. Technical logs may include IP address, request time and requested page. If you email us, we receive your email address and anything you choose to include. We use this information to answer your request and maintain the service.</p>
    <h2>Privacy questions</h2><p>Contact <a href={`mailto:${site.company.contactEmail}?subject=Court%20Damage%20privacy`}>{site.company.contactEmail}</a> about your support correspondence, including requests to delete it.</p></>;
}
