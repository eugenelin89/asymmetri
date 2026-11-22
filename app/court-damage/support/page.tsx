import type { Metadata } from "next";
import { site } from "@/content/site";
export const metadata: Metadata = { title: "Court Damage Support", alternates: { canonical: "/court-damage/support" } };
export default function Support() {
  return <><h1>Game support</h1><p>Court Damage is an offline doubles pickleball game for iPhone. Hold your phone sideways and tap <strong>Let’s Play</strong>.</p>
    <h2>Play your first rally</h2><p>Use the left stick to move. Tap Soft for a short return or Hard for a deep drive. Let the serve and its return bounce. After that, volleys are legal. The first team to five wins. Tap Rematch to play again.</p>
    <h2>Use a chaos action</h2><p>Each legal return earns one droplet. With four droplets, tap Spit to place a slick across the net. Near a rival, you can Bonk or challenge them to a fight. Watch the action button for the counter window. The ball stays live.</p>
    <h2>Adjust speech</h2><p>Tap Voice to mute or restore character dialogue. Captions and paddle sounds stay on. The game remembers your voice preference.</p>
    <h2>Contact support</h2><p>Email <a href={`mailto:${site.company.contactEmail}?subject=Court%20Damage%20support`}>{site.company.contactEmail}</a>. Include your iPhone model, iOS version, game version and what happened.</p></>;
}
