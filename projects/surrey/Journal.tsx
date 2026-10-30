import { evidence, witnesses, type StoryPoint } from "./story";
import type { Point, Snapshot } from "./types";
import styles from "./surrey.module.css";
export function Journal({ state, locations, close, track }: { state: Snapshot; locations: Record<StoryPoint, Point>; close(): void; track(p: Point, name: string): void }) {
  const m = state.investigation;
  const leads = [
    { id: "scene" as const, name: "Sealed scene · review / submit theory", hint: "Look around the sealed case for a tagged parcel." },
    ...(m.stage !== "available" ? [{ id: "nina" as const, name: "Nina · first witness", hint: "West of the scene; ask about the chime." }] : []),
    ...(m.witnesses.includes("nina") ? [{ id: "idris" as const, name: "Idris · dispatch kiosk", hint: "Ask about the carts. Search around the nearby bench." }, { id: "clock" as const, name: "Jo’s meeting area · clock records", hint: "Look near the community meeting point for a maintenance log." }] : []),
    ...(m.witnesses.includes("idris") ? [{ id: "rowan" as const, name: "Rowan · the artist", hint: "Ask about the red cloth, then examine the area around the artist." }] : []),
  ];
  return <div className={styles.journal} role="dialog" aria-modal="true" aria-label="Mission journal and evidence">
    <div className={styles.journalHeading}><div><span className={styles.eyebrow}>YOUR CITY NOTEBOOK</span><h2>Cases & conversations</h2></div><button onClick={close} autoFocus aria-label="Close journal">×</button></div>
    <div className={styles.journalColumns}>
      <section><h3>01 · Welcome to Surrey</h3><p>{state.stage === "completed" ? "Closed · Alex has the backpack. Reward received." : state.stage === "available" ? "Meet Alex by the gold station marker to begin the backpack case." : state.objective}</p>
        <h3>02 · The Surrey Central Mystery</h3><p>{m.stage === "available" ? "Discover the sealed case at the purple map marker. All people and incidents in this investigation are fictional." : m.stage === "closed" ? "Closed · The cart, clock and witness accounts agree." : "The watch reads 13:13. Establish the real time, trace C17 and check the red cloth before deciding. Look for small objects on the ground; E inspects them nearby."}</p>
        {m.conclusion && <p className={styles.journalNote}>{m.conclusion}</p>}
        <h4>Leads you know</h4><p className={styles.journalNote}>Pins mark people or search areas. Hidden evidence is not exposed from the air. Return to the sealed scene to submit your theory.</p>
        {leads.map(lead => <div key={lead.id} className={styles.lead}><strong>{lead.name}</strong><p>{lead.hint}</p><button onClick={() => track(lead.id === "clock" ? [locations.clock[0] + 7, locations.clock[1] - 3] : locations[lead.id], lead.name)}>Pin this lead</button></div>)}
      </section>
      <section><h3>Evidence · {m.evidence.length} collected</h3>{m.evidence.length ? evidence.filter(e => m.evidence.includes(e.id)).map(e => <div className={styles.lead} key={e.id}><strong>{e.name}</strong><p>{e.text}</p></div>) : <p>No evidence recorded yet.</p>}
        <h3>Witness accounts</h3>{witnesses.filter(w => m.witnesses.includes(w.id)).map(w => <div className={styles.lead} key={w.id}><strong>{w.name}</strong><p>{w.text}</p></div>)}
        <h3>In your pockets</h3><ul>{state.inventory.length ? state.inventory.map(item => <li key={item}>{item}</li>) : <li>Room for a story.</li>}</ul>
        <h3>Street stories</h3><p>{state.resolved.length} different encounters resolved. Repeat encounters never pay another reward.</p>
      </section>
    </div>
  </div>;
}
